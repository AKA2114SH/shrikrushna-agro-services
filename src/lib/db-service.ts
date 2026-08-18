// Enterprise PostgreSQL Database Service & Prisma Repository Layer
// Bridges persistent PostgreSQL operations with fallback in-memory cache
import prisma from './prisma';
import store, {
  Product,
  Sale,
  Purchase,
  Customer,
  Supplier,
  Expense,
  Quotation,
  Category,
  Brand,
} from './store';

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');

export class DatabaseService {
  // ==========================================
  // 1. PRODUCTS & CATALOG
  // ==========================================
  public static async getProducts(includeDeactivated = false): Promise<Product[]> {
    if (hasDatabaseUrl) {
      try {
        const dbProducts = await prisma.product.findMany({
          where: includeDeactivated ? {} : { isAvailable: true },
          include: {
            category: true,
            brand: true,
            batches: true,
          },
          orderBy: { createdAt: 'asc' },
        });

        if (dbProducts.length > 0) {
          return dbProducts.map((p) => ({
            id: p.id,
            nameEn: p.nameEn,
            nameMr: p.nameMr,
            brandId: p.brandId || '',
            brandName: p.brand?.name || 'Standard',
            categoryId: p.categoryId,
            categoryNameEn: p.category?.nameEn || 'General',
            categoryNameMr: p.category?.nameMr || 'कृषी निविष्ठा',
            sku: p.sku,
            hsnCode: p.hsnCode || '',
            unit: p.unit,
            packSize: p.packSize,
            mrp: Number(p.mrp),
            sellingPrice: Number(p.sellingPrice),
            purchasePrice: Number(p.purchasePrice),
            gstRate: Number(p.gstRate),
            totalStock: Number(p.totalStock),
            minStockLevel: Number(p.minStockLevel),
            isAvailable: p.isAvailable,
            imageUrl: p.imageUrl || `/shrikrushna-agro-services/products/${p.id}.svg`,
            technicalName: p.technicalName || undefined,
            targetCrops: p.targetCrops || undefined,
            dosageGuide: p.dosageGuide || undefined,
            descriptionEn: p.descriptionEn || undefined,
            descriptionMr: p.descriptionMr || undefined,
            batches: p.batches.map((b) => ({
              id: b.id,
              productId: b.productId,
              batchNumber: b.batchNumber,
              mfgDate: b.mfgDate ? b.mfgDate.toISOString().split('T')[0] : '',
              expiryDate: b.expiryDate ? b.expiryDate.toISOString().split('T')[0] : '',
              purchaseCost: Number(b.purchaseCost),
              currentStock: Number(b.currentStock),
              isDemo: b.isDemo,
            })),
            isDemo: p.isDemo,
            createdAt: p.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        // Fallback to store
      }
    }

    return store.getProducts(true);
  }

  public static async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    if (hasDatabaseUrl) {
      try {
        const created = await prisma.product.create({
          data: {
            nameEn: productData.nameEn,
            nameMr: productData.nameMr,
            categoryId: productData.categoryId,
            brandId: productData.brandId || null,
            sku: productData.sku || `SKU-${Date.now()}`,
            hsnCode: productData.hsnCode || null,
            unit: productData.unit || 'Packet',
            packSize: productData.packSize || '1 Kg',
            mrp: productData.mrp,
            sellingPrice: productData.sellingPrice,
            purchasePrice: productData.purchasePrice,
            gstRate: productData.gstRate || 0,
            totalStock: productData.totalStock || 0,
            minStockLevel: productData.minStockLevel || 5,
            isAvailable: productData.isAvailable ?? true,
            imageUrl: productData.imageUrl || null,
            technicalName: productData.technicalName || null,
            targetCrops: productData.targetCrops || null,
            dosageGuide: productData.dosageGuide || null,
            descriptionEn: productData.descriptionEn || null,
            descriptionMr: productData.descriptionMr || null,
            isDemo: productData.isDemo ?? false,
          },
          include: { category: true, brand: true, batches: true },
        });

        // Also sync store cache
        store.addProduct(productData);

        return {
          id: created.id,
          nameEn: created.nameEn,
          nameMr: created.nameMr,
          brandId: created.brandId || '',
          brandName: created.brand?.name || productData.brandName,
          categoryId: created.categoryId,
          categoryNameEn: created.category?.nameEn || productData.categoryNameEn,
          categoryNameMr: created.category?.nameMr || productData.categoryNameMr,
          sku: created.sku,
          hsnCode: created.hsnCode || '',
          unit: created.unit,
          packSize: created.packSize,
          mrp: Number(created.mrp),
          sellingPrice: Number(created.sellingPrice),
          purchasePrice: Number(created.purchasePrice),
          gstRate: Number(created.gstRate),
          totalStock: Number(created.totalStock),
          minStockLevel: Number(created.minStockLevel),
          isAvailable: created.isAvailable,
          imageUrl: created.imageUrl || undefined,
          technicalName: created.technicalName || undefined,
          targetCrops: created.targetCrops || undefined,
          dosageGuide: created.dosageGuide || undefined,
          descriptionEn: created.descriptionEn || undefined,
          descriptionMr: created.descriptionMr || undefined,
          isDemo: created.isDemo,
          createdAt: created.createdAt.toISOString(),
        };
      } catch (err) {
        // Fallback to store
      }
    }

    return store.addProduct(productData);
  }

  public static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (hasDatabaseUrl) {
      try {
        await prisma.product.update({
          where: { id },
          data: {
            ...(updates.nameEn && { nameEn: updates.nameEn }),
            ...(updates.nameMr && { nameMr: updates.nameMr }),
            ...(updates.sellingPrice !== undefined && { sellingPrice: updates.sellingPrice }),
            ...(updates.purchasePrice !== undefined && { purchasePrice: updates.purchasePrice }),
            ...(updates.mrp !== undefined && { mrp: updates.mrp }),
            ...(updates.totalStock !== undefined && { totalStock: updates.totalStock }),
            ...(updates.minStockLevel !== undefined && { minStockLevel: updates.minStockLevel }),
            ...(updates.isAvailable !== undefined && { isAvailable: updates.isAvailable }),
            ...(updates.packSize && { packSize: updates.packSize }),
            ...(updates.unit && { unit: updates.unit }),
            ...(updates.technicalName && { technicalName: updates.technicalName }),
            ...(updates.dosageGuide && { dosageGuide: updates.dosageGuide }),
            ...(updates.targetCrops && { targetCrops: updates.targetCrops }),
          },
        });
      } catch (err) {
        // Fallback
      }
    }

    return store.updateProduct(id, updates);
  }

  // ==========================================
  // 2. ATOMIC POS SALES TRANSACTION
  // ==========================================
  public static async executeSaleTransaction(saleData: {
    customerId?: string;
    customerName: string;
    customerPhone?: string;
    customerVillage?: string;
    items: Array<{
      productId: string;
      batchId?: string;
      quantity: number;
      unitPrice: number;
      gstRate: number;
    }>;
    discountAmount: number;
    paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT';
    paidAmount: number;
    notes?: string;
    createdByName: string;
    isDemo?: boolean;
  }): Promise<{ success: boolean; sale?: Sale; error?: string }> {
    // 1. In server PostgreSQL mode with Prisma transactions
    if (hasDatabaseUrl) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          // A. Stock Validation Check inside transaction
          for (const item of saleData.items) {
            const dbProduct = await tx.product.findUnique({
              where: { id: item.productId },
            });
            if (!dbProduct) throw new Error(`Product ${item.productId} not found.`);
            if (Number(dbProduct.totalStock) < item.quantity) {
              throw new Error(`Insufficient stock for ${dbProduct.nameMr}. Available: ${dbProduct.totalStock}, Requested: ${item.quantity}`);
            }
          }

          let subtotal = 0;
          let totalTax = 0;

          // B. Compute Totals & Atomic Decrements
          for (const item of saleData.items) {
            const lineSubtotal = item.quantity * item.unitPrice;
            const lineTax = (lineSubtotal * item.gstRate) / 100;
            subtotal += lineSubtotal;
            totalTax += lineTax;

            // Atomic Decrement
            await tx.product.update({
              where: { id: item.productId },
              data: {
                totalStock: {
                  decrement: item.quantity,
                },
              },
            });
          }

          const grandTotal = Math.round(subtotal + totalTax - saleData.discountAmount);
          const balanceAmount = Math.max(0, grandTotal - saleData.paidAmount);
          const paymentStatus = balanceAmount === 0 ? 'PAID' : saleData.paidAmount > 0 ? 'PARTIAL' : 'UNPAID';
          const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

          // C. If customer khata balance needs updating
          if (saleData.customerId && balanceAmount > 0) {
            await tx.customer.update({
              where: { id: saleData.customerId },
              data: {
                outstandingBalance: {
                  increment: balanceAmount,
                },
              },
            });
          }

          return {
            subtotal,
            totalTax,
            grandTotal,
            balanceAmount,
            paymentStatus,
            invoiceNumber,
          };
        });

        // Sync with local memory cache
        const localSaleResult = store.createSale(saleData);
        return localSaleResult;
      } catch (err: any) {
        return { success: false, error: err.message || 'Transaction aborted.' };
      }
    }

    // 2. Default In-Memory Transaction Engine
    return store.createSale(saleData);
  }
}

export default DatabaseService;
