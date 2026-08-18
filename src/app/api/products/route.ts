import { NextRequest, NextResponse } from 'next/server';
import store from '@/lib/store';
import DatabaseService from '@/lib/db-service';
import { getCurrentUser, checkPermission } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('q');
    const user = await getCurrentUser();

    let products = await DatabaseService.getProducts();

    if (category && category !== 'all') {
      products = products.filter(
        (p) => p.categoryId === category || p.categoryNameEn.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand && brand !== 'all') {
      products = products.filter(
        (p) => p.brandId === brand || p.brandName.toLowerCase() === brand.toLowerCase()
      );
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.nameMr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          (p.technicalName && p.technicalName.toLowerCase().includes(q))
      );
    }

    // Role-based field masking: If not authenticated or cannot view purchase margins, sanitize purchasePrice
    const canViewMargins = user && checkPermission(user.role, 'canViewPurchaseMargins');

    const sanitizedProducts = products.map((p) => {
      if (canViewMargins) {
        return p;
      }
      const { purchasePrice, batches, ...publicData } = p;
      return {
        ...publicData,
        // Expose only public batch info if any
        batches: (batches || []).map((b) => ({
          id: b.id,
          batchNumber: b.batchNumber,
          expiryDate: b.expiryDate,
          currentStock: b.currentStock,
        })),
      };
    });

    return NextResponse.json({
      products: sanitizedProducts,
      categories: store.getCategories(),
      brands: store.getBrands(),
      total: sanitizedProducts.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (!checkPermission(user.role, 'canManageInventory')) {
      await logAuditEvent({
        user,
        action: 'ACCESS_DENIED',
        entity: 'PRODUCT_CREATE',
        newData: { reason: 'Unauthorized role' },
      });
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions to add products' }, { status: 403 });
    }

    const body = await req.json();
    const newProduct = await DatabaseService.createProduct({
      ...body,
      isDemo: user.isDemo ?? store.isDemoActive(),
    });

    await logAuditEvent({
      user,
      action: 'CREATE',
      entity: 'PRODUCT',
      entityId: newProduct.id,
      newData: newProduct,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}
