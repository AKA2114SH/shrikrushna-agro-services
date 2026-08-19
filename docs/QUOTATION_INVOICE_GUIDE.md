# Quotation & Tax Invoice PDF Engine Guide
### Shri Krishna Agro Services — कोटेशन व टॅक्स इनव्हॉइस मॅन्युअल

---

## 1. Overview
The quotation and tax invoice engine produces branded, statutory-compliant documents for agricultural inputs:
* **Unique Sequential Numbering**: `QTN-2026-XXXX` for quotations, `INV-2026-XXXX` for finalized tax sales invoices.
* **Branded Document Header**: Includes Shop Name (**श्री कृष्ण ॲग्रो सर्व्हिसेस**), Sinnar address, Maharashtra GSTIN (`27AAAFS5678K1Z5`), and 3 statutory licenses (Fertilizer, Seed, Pesticide).
* **1-Click POS Sale Conversion**: Converts accepted quotations directly into finalized sales, atomically decrementing inventory.

---

## 2. Quotation Status Lifecycle
```text
DRAFT (कच्चा मसुदा)
  ↓
SENT (शेतकऱ्याला पाठवले)
  ↓
ACCEPTED (शेतकऱ्याने मान्य केले)
  ↓
CONVERTED (POS विक्रीमध्ये रूपांतरित)
  [or REJECTED / EXPIRED]
```

---

## 3. Printable A4 Document Specifications
* Formatted strictly for standard A4 paper and thermal receipt printers via `@media print`.
* **Public vs Admin Views**: Public farmer quotation views omit confidential purchase prices, dealer costs, and supplier margins.
* **Conversion Guard**: Once converted, duplicate conversion attempts are rejected idempotently with an informative error message.
