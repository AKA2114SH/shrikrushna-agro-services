# Database Schema Documentation
### Shri Krishna Agro Services — डेटाबेस स्कीमा दस्तऐवजीकरण

---

## 1. Relational Entity Overview
PostgreSQL database schema matching `prisma/schema.prisma`:

```text
User ───────────────< AuditLog
User ───────────────< Sale
User ───────────────< Purchase
Customer ───────────< Sale
Customer ───────────< CustomerCrop
Customer ───────────< CustomerPayment
Customer ───────────< Quotation
Supplier ───────────< Purchase
Supplier ───────────< SupplierPayment
Category ───────────< Product
Brand ──────────────< Product
Product ────────────< ProductBatch
Product ────────────< StockMovement
Product ────────────< SaleItem
Product ────────────< PurchaseItem
Product ────────────< QuotationItem
Sale ───────────────< SaleItem
Sale ───────────────< CustomerPayment
Purchase ───────────< PurchaseItem
Purchase ───────────< SupplierPayment
Quotation ──────────< QuotationItem
```

---

## 2. Table Index Reference

| Table Name | Primary Key | Key Indexes | Foreign Key Relations |
|---|---|---|---|
| `User` | `id` (cuid) | `username` (unique), `phone` (unique) | None |
| `Customer` | `id` (cuid) | `phone` (unique), `name`, `village` | None |
| `Supplier` | `id` (cuid) | `name`, `gstin`, `phone` | None |
| `Product` | `id` (cuid) | `nameEn`, `nameMr`, `sku` (unique), `categoryId`, `brandId` | `Category`, `Brand` |
| `ProductBatch` | `id` (cuid) | `[productId, batchNumber]` (unique), `expiryDate` | `Product` |
| `StockMovement`| `id` (cuid) | `productId`, `batchId`, `movementType`, `createdAt` | `Product`, `ProductBatch` |
| `Sale` | `id` (cuid) | `invoiceNumber` (unique), `customerId`, `createdAt`, `paymentStatus` | `Customer`, `User` |
| `SaleItem` | `id` (cuid) | `saleId`, `productId`, `batchId` | `Sale`, `Product`, `ProductBatch` |
| `Purchase` | `id` (cuid) | `invoiceNumber` (unique), `supplierId`, `createdAt` | `Supplier`, `User` |
| `PurchaseItem` | `id` (cuid) | `purchaseId`, `productId` | `Purchase`, `Product` |
| `Quotation` | `id` (cuid) | `quotationNumber` (unique), `customerId`, `createdAt` | `Customer`, `User` |
| `QuotationItem`| `id` (cuid) | `quotationId`, `productId` | `Quotation`, `Product` |
| `Expense` | `id` (cuid) | `category`, `expenseDate`, `createdAt` | None |
| `AuditLog` | `id` (cuid) | `entity`, `userId`, `createdAt` | `User` |
| `WhatsAppMessage`| `id` (cuid)| `phone`, `createdAt`, `direction` | None |
| `BusinessSettings`| `id` (cuid)| `key` (unique) | None |
