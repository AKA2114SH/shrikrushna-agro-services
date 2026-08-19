# Inventory & Stock Movement Management Guide
### Shri Krishna Agro Services — साठा व बॅच व्यवस्थापन मॅन्युअल

---

## 1. Inventory Architecture
Production inventory is stored in PostgreSQL and governed by immutable stock movement ledgers:
* **Product Catalog**: 28 pre-configured agrochemical, fertilizer, and seed lines.
* **Product Batches (`ProductBatch`)**: Tracks batch numbers, manufacturing dates, expiry dates, and unit purchase costs.
* **Stock Movement Ledger (`StockMovement`)**: Append-only audit trail recording every addition, deduction, or adjustment.

---

## 2. Stock Movement Types

| Movement Type | Code | Effect on Stock | Triggering Workflow |
|---|---|---|---|
| **Opening Stock** | `OPENING` | $+$ Increment | Initial inventory baseline setup |
| **Purchase Inward** | `PURCHASE` | $+$ Increment | Inward supplier purchase order delivery |
| **Retail Sale** | `SALE` | $-$ Decrement | Completed POS customer invoice |
| **Stock Adjustment (+)** | `ADJUSTMENT_ADD` | $+$ Increment | Physical count discrepancy reconciliation |
| **Stock Adjustment (-)** | `ADJUSTMENT_SUB` | $-$ Decrement | Physical count discrepancy reconciliation |
| **Damaged Stock** | `DAMAGE` | $-$ Decrement | Broken bottles, torn bags, or warehouse leakage |
| **Expired Stock** | `EXPIRED` | $-$ Decrement | Chemical expiry write-off |
| **Customer Return** | `RETURN` | $+$ Increment | Returned unopened merchandise |

---

## 3. Expiry Date & Low-Stock Alerts
1. **Low Stock Warnings**: Products where `totalStock <= minStockLevel` are highlighted in amber/red on the ERP dashboard and listed in the Owner AI reorder alerts.
2. **Batch Expiry Monitoring**: Batches expiring within 60 days are flagged on the ERP dashboard to prioritize rotation under First-In, First-Out (FIFO) principles.
