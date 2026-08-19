# PostgreSQL Database & Persistence Guide
### Shri Krishna Agro Services — Web & Digital ERP System

---

## 1. Database Overview
* **Database Engine**: PostgreSQL 14+
* **Object-Relational Mapping (ORM)**: Prisma Client 5.22
* **Schema Location**: `prisma/schema.prisma`
* **Total Relational Models**: 16 authoritative models

---

## 2. Core Relational Models

### 2.1 User & Identity (`User`)
* Tracks system users and roles: `OWNER`, `MANAGER`, `ACCOUNTANT`, `CASHIER`, `AGRONOMIST`.
* Passwords stored strictly as 10-round Bcrypt hashes.

### 2.2 Product Catalog (`Product`, `Category`, `Brand`)
* Stores bilingual product details (`nameMr`, `nameEn`, `technicalName`, `targetCrops`, `dosageGuide`).
* Maintains retail `sellingPrice`, `mrp`, confidential `purchasePrice`, `totalStock`, and `minStockLevel`.

### 2.3 Batch Management (`ProductBatch`)
* Tracks individual manufactured batches with `batchNumber`, `mfgDate`, `expiryDate`, `purchaseCost`, and `currentStock`.
* Enforces composite unique constraint `@@unique([productId, batchNumber])`.

### 2.4 Stock Movement Ledger (`StockMovement`)
* Append-only immutable ledger recording all inventory adjustments.
* Movement types: `OPENING`, `PURCHASE`, `SALE`, `ADJUSTMENT_ADD`, `ADJUSTMENT_SUB`, `DAMAGE`, `EXPIRED`, `RETURN`.
* Captures unit cost at the time of movement for perpetual COGS reconciliation.

### 2.5 Sales POS & Items (`Sale`, `SaleItem`, `CustomerPayment`)
* Stores unique sequential invoices (`invoiceNumber`), `subtotal`, `discountAmount`, `taxAmount`, `grandTotal`, `paidAmount`, `balanceAmount`, `paymentStatus`, and `paymentMethod`.
* `SaleItem` records historical unit price, GST rate, and total price.

### 2.6 Purchases & Inward (`Purchase`, `PurchaseItem`, `SupplierPayment`)
* Records inward stock invoices, `subtotal`, `taxAmount`, `freightCost`, `otherCosts`, `grandTotal`, `paidAmount`, and `balanceAmount`.
* Calculates true landed cost per unit.

### 2.7 Customer CRM & Khata (`Customer`, `CustomerCrop`)
* Tracks farmer profiles, acreage, primary crops, phone, village, credit limits, and running `outstandingBalance`.

### 2.8 Supplier Ledger (`Supplier`)
* Tracks agrochemical manufacturers and distributors, GSTIN, payment terms, and running `outstandingPayable`.

### 2.9 Quotations (`Quotation`, `QuotationItem`)
* Stores official price quotations (`quotationNumber`), valid until dates, item lines, and status (`DRAFT`, `SENT`, `ACCEPTED`, `REJECTED`, `EXPIRED`, `CONVERTED`).

### 2.10 Operating Expenses (`Expense`)
* Tracks business overhead: `RENT`, `ELECTRICITY`, `SALARY`, `TRANSPORT`, `MARKETING`, `MAINTENANCE`, `OFFICE`, `INTERNET`, `OTHER`.

### 2.11 Audit Trail & WhatsApp Logs (`AuditLog`, `WhatsAppMessage`, `BusinessSettings`, `CropAdvisory`)
* Immutable security event logs and bidirectional WhatsApp conversation logs.

---

## 3. Database Maintenance Commands

```bash
# Push schema updates to database
npx prisma db push

# Generate updated Prisma Client TypeScript bindings
npx prisma generate

# Open Prisma Studio web GUI for database inspection
npx prisma studio
```
