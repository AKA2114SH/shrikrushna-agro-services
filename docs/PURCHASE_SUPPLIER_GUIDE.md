# Purchase Management & Supplier Ledger Guide
### Shri Krishna Agro Services — खरेदी व सप्लायर व्यवस्थापन मॅन्युअल

---

## 1. Purchase Inward Workflow
The purchasing module handles stock entry, landed cost calculation, and supplier payables:

```text
Select Supplier (e.g. Mahadhan, Bayer, Syngenta)
         ↓
Enter Inward Invoice Number
         ↓
Add Products, Quantities, Unit Costs, & Batch Expiries
         ↓
Add Freight & Transport Overhead (Landed Cost Engine)
         ↓
Atomic DB Commit: Increment Stock & Update Supplier Payable
```

---

## 2. Landed Cost Engine
True landed cost per unit includes base purchase price plus allocated freight, transport, and handling expenses:
$$\text{Landed Cost per Unit} = \text{Unit Cost} + \left(\frac{\text{Freight Cost} + \text{Other Costs}}{\text{Total Units Inward}}\right)$$

---

## 3. Supplier Payment & Disbursements
1. Open the **'सप्लायर (Suppliers)'** tab in the ERP shell.
2. Select the supplier to view historical invoices and running `outstandingPayable`.
3. Click **'पेमेंट नोंदवा (Record Payment)'**, enter the disbursed amount, payment mode (Cheque, NEFT, RTGS, UPI), and reference number.
4. The system automatically decrements the supplier payable balance and logs an audit trail.
