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
  AuditLog,
  FinancialKPIs,
  StaffMember,
} from './store';

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '');

export class DatabaseService {
  // ==========================================
  // 1. PRODUCTS & CATALOG PERSISTENCE
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
        // Fallback to local store
      }
    }

    return store.getProducts(includeDeactivated);
  }

  public static async getProductById(id: string): Promise<Product | undefined> {
    const products = await this.getProducts(true);
    return products.find((p) => p.id === id);
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

        // Also sync local cache
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

  public static async deactivateProduct(id: string): Promise<boolean> {
    if (hasDatabaseUrl) {
      try {
        await prisma.product.update({
          where: { id },
          data: { isAvailable: false },
        });
      } catch (err) {
        // Fallback
      }
    }
    const res = store.updateProduct(id, { isAvailable: false });
    return Boolean(res);
  }

  public static async adjustInventoryStock({
    productId,
    adjustmentQuantity,
    movementType = 'ADJUSTMENT',
    notes,
    performedById,
  }: {
    productId: string;
    adjustmentQuantity: number;
    movementType?: 'OPENING_STOCK' | 'ADJUSTMENT' | 'DAMAGE' | 'EXPIRED';
    notes?: string;
    performedById?: string;
  }): Promise<{ success: boolean; newStock?: number; error?: string }> {
    if (hasDatabaseUrl) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          const prod = await tx.product.findUnique({ where: { id: productId } });
          if (!prod) throw new Error('Product not found.');

          const currentStock = Number(prod.totalStock);
          const newStock = currentStock + adjustmentQuantity;

          if (newStock < 0) {
            throw new Error(`Insufficient stock. Current: ${currentStock}, Requested change: ${adjustmentQuantity}`);
          }

          await tx.product.update({
            where: { id: productId },
            data: { totalStock: newStock },
          });

          await tx.stockMovement.create({
            data: {
              productId,
              movementType: movementType as any,
              quantity: Math.abs(adjustmentQuantity),
              referenceType: 'MANUAL_ADJUSTMENT',
              notes: notes || `Manual stock adjustment (${movementType})`,
              performedById: performedById || null,
            },
          });

          return newStock;
        });

        // Also sync store
        const storeProd = store.getProductById(productId);
        if (storeProd) {
          storeProd.totalStock = Math.max(0, storeProd.totalStock + adjustmentQuantity);
        }

        return { success: true, newStock: result };
      } catch (err: any) {
        return { success: false, error: err.message || 'Inventory adjustment failed.' };
      }
    }

    // In-memory fallback
    const storeProd = store.getProductById(productId);
    if (!storeProd) return { success: false, error: 'Product not found.' };
    const currentStock = storeProd.totalStock;
    const newStock = currentStock + adjustmentQuantity;
    if (newStock < 0) {
      return { success: false, error: `Insufficient stock. Current: ${currentStock}, Requested change: ${adjustmentQuantity}` };
    }
    storeProd.totalStock = newStock;
    return { success: true, newStock };
  }

  // ==========================================
  // 2. CUSTOMERS & CRM PERSISTENCE
  // ==========================================
  public static async getCustomers(includeDemo = true): Promise<Customer[]> {
    if (hasDatabaseUrl) {
      try {
        const dbCustomers = await prisma.customer.findMany({
          where: includeDemo ? {} : { isDemo: false },
          include: { crops: true },
          orderBy: { createdAt: 'desc' },
        });

        if (dbCustomers.length > 0) {
          return dbCustomers.map((c) => ({
            id: c.id,
            name: c.name,
            phone: c.phone,
            village: c.village,
            taluka: c.taluka,
            district: c.district,
            totalLandAcres: c.totalLandAcres ? Number(c.totalLandAcres) : undefined,
            outstandingBalance: Number(c.outstandingBalance),
            creditLimit: Number(c.creditLimit),
            crops: c.crops.map((cr) => ({
              id: cr.id,
              cropName: cr.cropName,
              acreage: cr.acreage ? Number(cr.acreage) : undefined,
              season: cr.season || undefined,
            })),
            isDemo: c.isDemo,
            createdAt: c.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        // Fallback to store
      }
    }

    return store.getCustomers(includeDemo);
  }

  public static async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    if (hasDatabaseUrl) {
      try {
        const created = await prisma.customer.create({
          data: {
            name: customerData.name,
            phone: customerData.phone,
            village: customerData.village,
            taluka: customerData.taluka || 'Sinnar',
            district: customerData.district || 'Nashik',
            totalLandAcres: customerData.totalLandAcres,
            outstandingBalance: customerData.outstandingBalance || 0,
            creditLimit: customerData.creditLimit || 50000,
            isDemo: customerData.isDemo ?? false,
            crops: {
              create: (customerData.crops || []).map((cr) => ({
                cropName: cr.cropName,
                acreage: cr.acreage,
                season: cr.season,
              })),
            },
          },
          include: { crops: true },
        });

        store.addCustomer(customerData);

        return {
          id: created.id,
          name: created.name,
          phone: created.phone,
          village: created.village,
          taluka: created.taluka,
          district: created.district,
          totalLandAcres: created.totalLandAcres ? Number(created.totalLandAcres) : undefined,
          outstandingBalance: Number(created.outstandingBalance),
          creditLimit: Number(created.creditLimit),
          crops: created.crops.map((cr) => ({
            id: cr.id,
            cropName: cr.cropName,
            acreage: cr.acreage ? Number(cr.acreage) : undefined,
            season: cr.season || undefined,
          })),
          isDemo: created.isDemo,
          createdAt: created.createdAt.toISOString(),
        };
      } catch (err) {
        // Fallback
      }
    }

    return store.addCustomer(customerData);
  }

  public static async recordCustomerPayment(
    customerId: string,
    amount: number,
    paymentMethod: string,
    notes?: string,
    saleId?: string,
    recordedById?: string
  ): Promise<Customer | undefined> {
    if (hasDatabaseUrl) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.customerPayment.create({
            data: {
              customerId,
              saleId: saleId || null,
              amount,
              paymentMethod: paymentMethod as any,
              notes,
              recordedById: recordedById || null,
            },
          });

          await tx.customer.update({
            where: { id: customerId },
            data: {
              outstandingBalance: {
                decrement: amount,
              },
            },
          });
        });
      } catch (err) {
        // Fallback
      }
    }

    return store.recordCustomerPayment(customerId, amount, paymentMethod, notes);
  }

  // ==========================================
  // 3. SUPPLIERS PERSISTENCE
  // ==========================================
  public static async getSuppliers(includeDemo = true): Promise<Supplier[]> {
    if (hasDatabaseUrl) {
      try {
        const dbSuppliers = await prisma.supplier.findMany({
          where: includeDemo ? {} : { isDemo: false },
          orderBy: { createdAt: 'desc' },
        });

        if (dbSuppliers.length > 0) {
          return dbSuppliers.map((s) => ({
            id: s.id,
            name: s.name,
            contactPerson: s.contactPerson || undefined,
            phone: s.phone,
            email: s.email || undefined,
            gstin: s.gstin || undefined,
            address: s.address || undefined,
            city: s.city,
            outstandingPayable: Number(s.outstandingPayable),
            isDemo: s.isDemo,
            createdAt: s.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        // Fallback
      }
    }

    return store.getSuppliers(includeDemo);
  }

  public static async createSupplier(supplierData: Omit<Supplier, 'id' | 'createdAt'>): Promise<Supplier> {
    if (hasDatabaseUrl) {
      try {
        const created = await prisma.supplier.create({
          data: {
            name: supplierData.name,
            contactPerson: supplierData.contactPerson,
            phone: supplierData.phone,
            email: supplierData.email,
            gstin: supplierData.gstin,
            address: supplierData.address,
            city: supplierData.city || 'Nashik',
            outstandingPayable: supplierData.outstandingPayable || 0,
            isDemo: supplierData.isDemo ?? false,
          },
        });

        return {
          id: created.id,
          name: created.name,
          contactPerson: created.contactPerson || undefined,
          phone: created.phone,
          email: created.email || undefined,
          gstin: created.gstin || undefined,
          address: created.address || undefined,
          city: created.city,
          outstandingPayable: Number(created.outstandingPayable),
          isDemo: created.isDemo,
          createdAt: created.createdAt.toISOString(),
        };
      } catch (err) {
        // Fallback
      }
    }

    return store.addSupplier(supplierData);
  }

  public static async recordSupplierPayment(
    supplierId: string,
    amount: number,
    paymentMethod: string,
    notes?: string,
    purchaseId?: string,
    recordedById?: string
  ): Promise<{ success: boolean; newOutstanding?: number; error?: string }> {
    if (hasDatabaseUrl) {
      try {
        const result = await prisma.$transaction(async (tx) => {
          const supp = await tx.supplier.findUnique({ where: { id: supplierId } });
          if (!supp) throw new Error('Supplier not found.');

          const currentOutstanding = Number(supp.outstandingPayable);
          const newOutstanding = Math.max(0, currentOutstanding - amount);

          await tx.supplierPayment.create({
            data: {
              supplierId,
              purchaseId: purchaseId || null,
              amount,
              paymentMethod: paymentMethod as any,
              notes,
              recordedById: recordedById || null,
            },
          });

          await tx.supplier.update({
            where: { id: supplierId },
            data: {
              outstandingPayable: newOutstanding,
            },
          });

          return newOutstanding;
        });

        // Also sync local store
        const storeSupp = store.getSuppliers().find((s) => s.id === supplierId);
        if (storeSupp) {
          storeSupp.outstandingPayable = Math.max(0, storeSupp.outstandingPayable - amount);
        }

        return { success: true, newOutstanding: result };
      } catch (err: any) {
        return { success: false, error: err.message || 'Supplier payment failed.' };
      }
    }

    // In-memory fallback
    const storeSupp = store.getSuppliers().find((s) => s.id === supplierId);
    if (!storeSupp) return { success: false, error: 'Supplier not found.' };
    storeSupp.outstandingPayable = Math.max(0, storeSupp.outstandingPayable - amount);
    return { success: true, newOutstanding: storeSupp.outstandingPayable };
  }

  // ==========================================
  // 4. PURCHASES PERSISTENCE & ATOMIC TRANSACTIONS
  // ==========================================
  public static async getPurchases(includeDemo = true): Promise<Purchase[]> {
    if (hasDatabaseUrl) {
      try {
        const dbPurchases = await prisma.purchase.findMany({
          where: includeDemo ? {} : { isDemo: false },
          include: {
            supplier: true,
            items: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbPurchases.length > 0) {
          return dbPurchases.map((p) => ({
            id: p.id,
            invoiceNumber: p.invoiceNumber,
            supplierId: p.supplierId,
            supplierName: p.supplier.name,
            purchaseDate: p.purchaseDate ? p.purchaseDate.toISOString().split('T')[0] : p.createdAt.toISOString().split('T')[0],
            subtotal: Number(p.subtotal),
            taxAmount: Number(p.taxAmount),
            freightCost: Number(p.freightCost),
            otherCosts: Number(p.otherCosts),
            grandTotal: Number(p.grandTotal),
            paidAmount: Number(p.paidAmount),
            balanceAmount: Number(p.balanceAmount),
            paymentStatus: p.paymentStatus as any,
            paymentMethod: p.paymentMethod as any,
            notes: p.notes || undefined,
            items: p.items.map((it) => ({
              id: it.id,
              purchaseId: it.purchaseId,
              productId: it.productId,
              productName: it.product.nameMr,
              batchNumber: it.batchNumber || '',
              mfgDate: it.mfgDate ? it.mfgDate.toISOString().split('T')[0] : '',
              expiryDate: it.expiryDate ? it.expiryDate.toISOString().split('T')[0] : '',
              quantity: Number(it.quantity),
              unitCost: Number(it.unitCost),
              gstRate: Number(it.gstRate),
              totalCost: Number(it.totalCost),
            })),
            createdByName: 'शुभम गमाणे (Admin)',
            isDemo: p.isDemo,
            createdAt: p.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        // Fallback
      }
    }

    return store.getPurchases(includeDemo);
  }

  public static async executePurchaseTransaction(purchaseData: {
    supplierId: string;
    invoiceNumber: string;
    items: Array<{
      productId: string;
      batchNumber?: string;
      mfgDate?: string;
      expiryDate?: string;
      quantity: number;
      unitCost: number;
      gstRate: number;
    }>;
    freightCost?: number;
    otherCosts?: number;
    paymentMethod: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CREDIT';
    paidAmount: number;
    notes?: string;
    createdByName: string;
    isDemo?: boolean;
  }): Promise<{ success: boolean; purchase?: Purchase; error?: string }> {
    if (hasDatabaseUrl) {
      try {
        await prisma.$transaction(async (tx) => {
          let subtotal = 0;
          let taxAmount = 0;

          for (const item of purchaseData.items) {
            const lineSubtotal = item.quantity * item.unitCost;
            const lineTax = (lineSubtotal * item.gstRate) / 100;
            subtotal += lineSubtotal;
            taxAmount += lineTax;

            // Increment Product stock
            await tx.product.update({
              where: { id: item.productId },
              data: {
                totalStock: { increment: item.quantity },
              },
            });

            // Create stock movement record
            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                movementType: 'PURCHASE',
                quantity: item.quantity,
                unitCost: item.unitCost,
                referenceType: 'PURCHASE',
                referenceId: purchaseData.invoiceNumber,
                notes: `Inward Purchase ${purchaseData.invoiceNumber}`,
              },
            });
          }

          const freightCost = purchaseData.freightCost || 0;
          const otherCosts = purchaseData.otherCosts || 0;
          const grandTotal = Math.round(subtotal + taxAmount + freightCost + otherCosts);
          const balanceAmount = Math.max(0, grandTotal - purchaseData.paidAmount);

          // Update Supplier outstanding if balance exists
          if (balanceAmount > 0) {
            await tx.supplier.update({
              where: { id: purchaseData.supplierId },
              data: {
                outstandingPayable: { increment: balanceAmount },
              },
            });
          }
        });
      } catch (err: any) {
        return { success: false, error: err.message || 'Purchase transaction aborted.' };
      }
    }

    return store.recordPurchase(purchaseData);
  }

  // ==========================================
  // 5. SALES (POS) PERSISTENCE & ATOMIC TRANSACTIONS
  // ==========================================
  public static async getSales(includeDemo = true): Promise<Sale[]> {
    if (hasDatabaseUrl) {
      try {
        const dbSales = await prisma.sale.findMany({
          where: includeDemo ? {} : { isDemo: false },
          include: {
            customer: true,
            items: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbSales.length > 0) {
          return dbSales.map((s) => ({
            id: s.id,
            invoiceNumber: s.invoiceNumber,
            customerId: s.customerId || undefined,
            customerName: s.customerName,
            customerPhone: s.customerPhone || undefined,
            customerVillage: s.customerVillage || undefined,
            subtotal: Number(s.subtotal),
            taxAmount: Number(s.taxAmount),
            discountAmount: Number(s.discountAmount),
            grandTotal: Number(s.grandTotal),
            paidAmount: Number(s.paidAmount),
            balanceAmount: Number(s.balanceAmount),
            paymentStatus: s.paymentStatus as any,
            paymentMethod: s.paymentMethod as any,
            notes: s.notes || undefined,
            items: s.items.map((it) => ({
              id: it.id,
              saleId: it.saleId,
              productId: it.productId,
              productName: it.product.nameMr,
              quantity: Number(it.quantity),
              unitPrice: Number(it.unitPrice),
              gstRate: Number(it.gstRate),
              taxAmount: Number(it.taxAmount),
              totalPrice: Number(it.totalPrice),
            })),
            createdByName: 'शुभम गमाणे (Owner)',
            isDemo: s.isDemo,
            createdAt: s.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        // Fallback
      }
    }

    return store.getSales(includeDemo);
  }

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
    if (hasDatabaseUrl) {
      try {
        await prisma.$transaction(async (tx) => {
          // Stock Validation Check
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

          // Atomic Decrement & Stock Movement Logging
          for (const item of saleData.items) {
            const lineSubtotal = item.quantity * item.unitPrice;
            const lineTax = (lineSubtotal * item.gstRate) / 100;
            subtotal += lineSubtotal;
            totalTax += lineTax;

            await tx.product.update({
              where: { id: item.productId },
              data: {
                totalStock: { decrement: item.quantity },
              },
            });

            await tx.stockMovement.create({
              data: {
                productId: item.productId,
                movementType: 'SALE',
                quantity: item.quantity,
                unitCost: dbProduct.purchasePrice,
                referenceType: 'SALE',
                notes: `POS Sale to ${saleData.customerName}`,
              },
            });
          }

          const grandTotal = Math.round(subtotal + totalTax - saleData.discountAmount);
          const balanceAmount = Math.max(0, grandTotal - saleData.paidAmount);

          if (saleData.customerId && balanceAmount > 0) {
            await tx.customer.update({
              where: { id: saleData.customerId },
              data: {
                outstandingBalance: { increment: balanceAmount },
              },
            });
          }
        });
      } catch (err: any) {
        return { success: false, error: err.message || 'Sale transaction aborted.' };
      }
    }

    return store.createSale(saleData);
  }

  // ==========================================
  // 6. QUOTATIONS PERSISTENCE
  // ==========================================
  public static async getQuotations(includeDemo = true): Promise<Quotation[]> {
    if (hasDatabaseUrl) {
      try {
        const dbQuotes = await prisma.quotation.findMany({
          where: includeDemo ? {} : { isDemo: false },
          include: {
            items: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (dbQuotes.length > 0) {
          return dbQuotes.map((q) => ({
            id: q.id,
            quotationNumber: q.quotationNumber,
            customerId: q.customerId || undefined,
            customerName: q.customerName,
            customerPhone: q.customerPhone,
            customerVillage: q.customerVillage || undefined,
            subtotal: Number(q.subtotal),
            discountAmount: Number(q.discountAmount),
            taxAmount: Number(q.taxAmount),
            totalTax: Number(q.taxAmount),
            deliveryCharges: Number(q.deliveryCharges),
            grandTotal: Number(q.grandTotal),
            validUntil: q.validUntil.toISOString().split('T')[0],
            status: q.status as any,
            notes: q.notes || undefined,
            terms: q.terms || undefined,
            items: q.items.map((it) => ({
              id: it.id,
              productId: it.productId,
              productName: it.product.nameMr,
              packSize: it.product.packSize,
              quantity: Number(it.quantity),
              unitPrice: Number(it.unitPrice),
              discountPercent: Number(it.discountPercent),
              gstRate: Number(it.gstRate),
              taxAmount: Number(it.taxAmount),
              totalPrice: Number(it.totalPrice),
            })),
            createdByName: 'शुभम गमाणे (B.Sc Agri)',
            isDemo: q.isDemo,
            createdAt: q.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        // Fallback
      }
    }

    return store.getQuotations(includeDemo);
  }

  public static async createQuotation(data: any): Promise<Quotation> {
    if (hasDatabaseUrl) {
      try {
        const count = await prisma.quotation.count();
        const quoteNum = `QTN-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
        const validDate = new Date();
        validDate.setDate(validDate.getDate() + 15);

        let subtotal = 0;
        let totalTax = 0;

        const lineItems = (data.items || []).map((it: any) => {
          const unitPrice = Number(it.unitPrice) || 100;
          const qty = Number(it.quantity) || 1;
          const gst = Number(it.gstRate) || 5;
          const lineSub = unitPrice * qty;
          const lineTax = (lineSub * gst) / 100;
          subtotal += lineSub;
          totalTax += lineTax;
          return {
            productId: it.productId,
            quantity: qty,
            unitPrice,
            discountPercent: 0,
            gstRate: gst,
            taxAmount: Math.round(lineTax),
            totalPrice: Math.round(lineSub + lineTax),
          };
        });

        const grandTotal = Math.round(subtotal + totalTax);

        const created = await prisma.quotation.create({
          data: {
            quotationNumber: quoteNum,
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerVillage: data.customerVillage || 'सिन्नर',
            subtotal: Math.round(subtotal),
            discountAmount: 0,
            taxAmount: Math.round(totalTax),
            deliveryCharges: 0,
            grandTotal,
            validUntil: validDate,
            status: 'DRAFT',
            notes: data.notes,
            items: {
              create: lineItems,
            },
          },
          include: {
            items: { include: { product: true } },
          },
        });

        const formattedQuote: Quotation = {
          id: created.id,
          quotationNumber: created.quotationNumber,
          customerName: created.customerName,
          customerPhone: created.customerPhone,
          customerVillage: created.customerVillage || undefined,
          subtotal: Number(created.subtotal),
          discountAmount: Number(created.discountAmount),
          taxAmount: Number(created.taxAmount),
          totalTax: Number(created.taxAmount),
          deliveryCharges: Number(created.deliveryCharges),
          grandTotal: Number(created.grandTotal),
          validUntil: created.validUntil.toISOString().split('T')[0],
          status: created.status as any,
          notes: created.notes || undefined,
          items: created.items.map((it) => ({
            id: it.id,
            productId: it.productId,
            productName: it.product.nameMr,
            packSize: it.product.packSize,
            quantity: Number(it.quantity),
            unitPrice: Number(it.unitPrice),
            discountPercent: Number(it.discountPercent),
            gstRate: Number(it.gstRate),
            taxAmount: Number(it.taxAmount),
            totalPrice: Number(it.totalPrice),
          })),
          createdByName: 'शेतकरी सेल्फ-कोटेशन',
          isDemo: created.isDemo,
          createdAt: created.createdAt.toISOString(),
        };

        store.addQuotation(formattedQuote);
        return formattedQuote;
      } catch (err) {
        // Fallback
      }
    }

    return store.createQuotation(data);
  }

  public static async updateQuotationStatus(idOrNumber: string, status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CONVERTED'): Promise<boolean> {
    if (hasDatabaseUrl) {
      try {
        await prisma.quotation.updateMany({
          where: {
            OR: [{ id: idOrNumber }, { quotationNumber: idOrNumber }],
          },
          data: { status },
        });
      } catch (err) {
        // Fallback
      }
    }
    const q = store.getQuotations().find((item) => item.id === idOrNumber || item.quotationNumber === idOrNumber);
    if (q) {
      q.status = status;
      return true;
    }
    return false;
  }

  public static async convertQuotationToSale({
    quotationIdOrNumber,
    paymentMethod = 'CASH',
    paidAmount,
    createdByName,
  }: {
    quotationIdOrNumber: string;
    paymentMethod?: 'CASH' | 'UPI' | 'CREDIT' | 'BANK_TRANSFER';
    paidAmount?: number;
    createdByName?: string;
  }): Promise<{ success: boolean; sale?: Sale; error?: string }> {
    const quotations = await this.getQuotations(true);
    const quotation = quotations.find(
      (q) => q.id === quotationIdOrNumber || q.quotationNumber === quotationIdOrNumber
    );

    if (!quotation) {
      return { success: false, error: 'Quotation not found.' };
    }

    if (quotation.status === 'CONVERTED') {
      return { success: false, error: 'Quotation has already been converted to a sale (Duplicate conversion prevented).' };
    }

    // Call authoritative Step 7 sales transaction
    const saleResult = await this.executeSaleTransaction({
      customerId: quotation.customerId,
      customerName: quotation.customerName,
      customerPhone: quotation.customerPhone,
      customerVillage: quotation.customerVillage,
      items: quotation.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        gstRate: it.gstRate,
      })),
      discountAmount: quotation.discountAmount || 0,
      paymentMethod,
      paidAmount: paidAmount !== undefined ? paidAmount : quotation.grandTotal,
      notes: `Converted from Quotation ${quotation.quotationNumber}`,
      createdByName: createdByName || quotation.createdByName,
      isDemo: quotation.isDemo,
    });

    if (!saleResult.success) {
      return { success: false, error: saleResult.error || 'Failed to convert quotation to sale.' };
    }

    // Update quotation status to CONVERTED
    await this.updateQuotationStatus(quotation.id, 'CONVERTED');

    return { success: true, sale: saleResult.sale };
  }

  // ==========================================
  // 7. EXPENSES PERSISTENCE
  // ==========================================
  public static async getExpenses(includeDemo = true): Promise<Expense[]> {
    if (hasDatabaseUrl) {
      try {
        const dbExpenses = await prisma.expense.findMany({
          where: includeDemo ? {} : { isDemo: false },
          orderBy: { expenseDate: 'desc' },
        });

        if (dbExpenses.length > 0) {
          return dbExpenses.map((e) => ({
            id: e.id,
            category: e.category as any,
            amount: Number(e.amount),
            paymentMethod: e.paymentMethod as any,
            vendor: e.vendor || 'दुकान खर्च',
            receiptUrl: e.receiptUrl || undefined,
            notes: e.notes || undefined,
            expenseDate: e.expenseDate.toISOString().split('T')[0],
            recordedByName: 'जगदीश बोडके (Admin)',
            isDemo: e.isDemo,
            createdAt: e.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        // Fallback
      }
    }

    return store.getExpenses(includeDemo);
  }

  public static async createExpense(expenseData: Omit<Expense, 'id' | 'createdAt'>): Promise<Expense> {
    if (hasDatabaseUrl) {
      try {
        const created = await prisma.expense.create({
          data: {
            category: expenseData.category as any,
            amount: expenseData.amount,
            paymentMethod: expenseData.paymentMethod as any,
            vendor: expenseData.vendor,
            receiptUrl: expenseData.receiptUrl,
            notes: expenseData.notes,
            expenseDate: new Date(expenseData.expenseDate),
            isDemo: expenseData.isDemo ?? false,
          },
        });

        store.addExpense(expenseData);

        return {
          id: created.id,
          category: created.category as any,
          amount: Number(created.amount),
          paymentMethod: created.paymentMethod as any,
          vendor: created.vendor || '',
          receiptUrl: created.receiptUrl || undefined,
          notes: created.notes || undefined,
          expenseDate: created.expenseDate.toISOString().split('T')[0],
          recordedByName: expenseData.recordedByName,
          isDemo: created.isDemo,
          createdAt: created.createdAt.toISOString(),
        };
      } catch (err) {
        // Fallback
      }
    }

    return store.addExpense(expenseData);
  }

  // ==========================================
  // 8. FINANCIAL REPORTS & KPIS AGGREGATION
  // ==========================================
  public static async getFinancialKPIs(): Promise<FinancialKPIs> {
    const sales = await this.getSales();
    const purchases = await this.getPurchases();
    const expenses = await this.getExpenses();
    const customers = await this.getCustomers();
    const suppliers = await this.getSuppliers();
    const products = await this.getProducts(true);

    const totalRevenue = sales.reduce((acc, s) => acc + s.grandTotal, 0);
    const totalPurchases = purchases.reduce((acc, p) => acc + p.grandTotal, 0);
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

    let totalCOGS = 0;
    sales.forEach((s) => {
      s.items.forEach((it) => {
        const prod = products.find((p) => p.id === it.productId);
        const cost = prod?.purchasePrice || it.unitPrice * 0.75;
        totalCOGS += cost * it.quantity;
      });
    });

    const grossProfit = totalRevenue - totalCOGS;
    const netProfit = grossProfit - totalExpenses;
    const netMarginPercent = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;
    const totalCustomerOutstanding = customers.reduce((acc, c) => acc + c.outstandingBalance, 0);
    const totalSupplierOutstanding = suppliers.reduce((acc, s) => acc + s.outstandingPayable, 0);
    const lowStockCount = products.filter((p) => p.totalStock <= p.minStockLevel && p.totalStock > 0).length;
    const outOfStockCount = products.filter((p) => p.totalStock === 0).length;

    return {
      totalRevenue,
      totalPurchases,
      totalCOGS,
      grossProfit,
      totalExpenses,
      netProfit,
      netMarginPercent,
      totalCustomerOutstanding,
      totalSupplierOutstanding,
      lowStockCount,
      outOfStockCount,
      expiringBatchesCount: 0,
      recentSalesCount: sales.length,
      recentPurchasesCount: purchases.length,
    };
  }

  // ==========================================
  // 9. BUSINESS SETTINGS & OWNER WIZARD PERSISTENCE
  // ==========================================
  public static async getBusinessSettings(key = 'business_profile'): Promise<any> {
    if (hasDatabaseUrl) {
      try {
        const setting = await prisma.businessSettings.findUnique({
          where: { key },
        });
        if (setting) {
          return JSON.parse(setting.valueJson);
        }
      } catch (err) {
        // Fallback
      }
    }
    return store.getProfile();
  }

  public static async updateBusinessSettings(key = 'business_profile', updates: any): Promise<any> {
    if (hasDatabaseUrl) {
      try {
        const existing = await this.getBusinessSettings(key);
        const merged = { ...existing, ...updates };
        await prisma.businessSettings.upsert({
          where: { key },
          create: {
            key,
            valueJson: JSON.stringify(merged),
            isDemo: false,
          },
          update: {
            valueJson: JSON.stringify(merged),
          },
        });
        store.updateProfile(merged);
        return merged;
      } catch (err) {
        // Fallback
      }
    }
    return store.updateProfile(updates);
  }

  // ==========================================
  // 10. WHATSAPP MESSAGE PERSISTENCE
  // ==========================================
  public static async recordWhatsAppMessage(data: {
    phone: string;
    direction: 'INBOUND' | 'OUTBOUND';
    content: string;
    status?: string;
    intent?: string;
    toolCalled?: string;
    isDemo?: boolean;
  }): Promise<any> {
    if (hasDatabaseUrl) {
      try {
        const created = await prisma.whatsAppMessage.create({
          data: {
            phone: data.phone,
            direction: data.direction as any,
            content: data.content,
            status: data.status || 'delivered',
            intent: data.intent,
            toolCalled: data.toolCalled,
            isDemo: data.isDemo ?? false,
          },
        });
        return created;
      } catch (err) {
        // Fallback
      }
    }
    return {
      id: `wa_${Date.now()}`,
      ...data,
      status: data.status || 'delivered',
      createdAt: new Date().toISOString(),
    };
  }

  public static async getWhatsAppMessages(phone?: string, includeDemo = true): Promise<any[]> {
    if (hasDatabaseUrl) {
      try {
        const dbMessages = await prisma.whatsAppMessage.findMany({
          where: {
            ...(phone ? { phone } : {}),
            ...(includeDemo ? {} : { isDemo: false }),
          },
          orderBy: { createdAt: 'asc' },
        });
        if (dbMessages.length > 0) {
          return dbMessages.map((m) => ({
            id: m.id,
            phone: m.phone,
            direction: m.direction,
            text: m.content,
            status: m.status,
            intent: m.intent,
            toolUsed: m.toolCalled,
            timestamp: m.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        // Fallback
      }
    }
    return [];
  }
}

export default DatabaseService;
