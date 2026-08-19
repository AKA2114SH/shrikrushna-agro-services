# Customer Khata CRM & Credit Ledger Guide
### Shri Krishna Agro Services — शेतकरी खाते व उधारी व्यवस्थापन मॅन्युअल

---

## 1. Khata Debt Ledger Architecture
The Customer Khata module provides complete financial visibility into credit extended to farmers in the Sinnar region:
* **Running Outstanding Balance (`outstandingBalance`)**: Computed perpetually from credit sales minus recorded customer repayments.
* **Acreage & Crop Mapping**: Captures farmer land holding (e.g., 5 Acres Onion, 2 Acres Grapes) to inform credit limits.

---

## 2. Khata Operations

### 2.1 Extending Credit during POS Billing
1. Select the farmer customer during checkout.
2. Under Payment Method, select **'उधारी (Credit Khata)'** or enter a partial paid amount.
3. The remaining balance automatically increments the farmer's debt ledger in PostgreSQL.

### 2.2 Recording Customer Repayments
1. Navigate to the **'शेतकरी (Customers)'** tab.
2. Select the customer to view their complete transaction history and outstanding balance.
3. Click **'जमा नोंदवा (Record Payment)'**.
4. Enter the received amount and mode (Cash / UPI / Bank Transfer).
5. The system decrements the outstanding debt balance in PostgreSQL and creates an immutable payment record.

### 2.3 Automated WhatsApp Payment Reminders
1. Click the **'WhatsApp तगादा (Remind on WhatsApp)'** button on the customer card.
2. The system pre-formats a polite, branded Marathi reminder with the exact outstanding balance, shop bank details, and owner contact numbers.
