# Sales POS Billing & Checkout Guide
### Shri Krishna Agro Services — विक्री व पॉईंट ऑफ सेल मॅन्युअल

---

## 1. POS Billing Workflow
The Sales POS engine is optimized for high-speed retail checkout during peak agricultural seasons in Sinnar:

```text
Select/Create Customer
         ↓
Scan / Search Product (Bilingual)
         ↓
Enter Quantity (Stock Validated)
         ↓
Automated GST & Discount Computation
         ↓
Choose Payment Mode (Cash, UPI, Credit Khata)
         ↓
Atomic DB Commit ($transaction)
         ↓
Generate Tax Invoice & Stock Decrement
```

---

## 2. Step-by-Step POS Billing Instructions

1. **Navigate to POS Screen**: Click on **'POS विक्री (Sales POS)'** from the ERP sidebar.
2. **Customer Selection**:
   - Search existing farmer by Name, Mobile Number, or Village.
   - Or click **'नवीन शेतकरी (New Farmer)'** to quickly register a walk-in customer.
3. **Adding Line Items**:
   - Type the product name or chemical technical name (e.g., `19:19:19`, `Nativo`, `Coragen`, `Urea`).
   - Enter the desired quantity.
   - The engine automatically checks available batch stock. If the requested quantity exceeds physical inventory, the line is flagged and overselling is strictly prevented.
4. **Discounts & Delivery**:
   - Enter any promotional discount amount.
5. **Payment Method & Split Settlement**:
   - **CASH**: Immediate cash receipt.
   - **UPI / ONLINE**: Digital payment via QR code or bank transfer.
   - **CREDIT KHATA (उधारी)**: Amount is automatically appended to the farmer's debt ledger.
   - **PARTIAL PAYMENT**: If a farmer pays ₹500 cash on a ₹1,945 bill, enter ₹500 in `Paid Amount`. The system marks the sale as `PARTIAL` and registers the remaining ₹1,445 onto the farmer's Khata balance.
6. **Finalize Invoice**:
   - Click **'बिल पूर्ण करा (Complete Sale)'**.
   - The system atomically decrements `totalStock`, logs a `SALE` entry in `StockMovement`, and displays the printable A4/thermal invoice modal.
