# Expense Tracking & Profit Financial Engine Guide
### Shri Krishna Agro Services — खर्च व नफा-तोटा हिशोब मॅन्युअल

---

## 1. Financial Engine Principles
The financial engine computes true profitability by reconciling actual PostgreSQL sales, inventory purchase costs, and operational overheads:

```text
SALES LEDGER (एकूण विक्री महसूल)
         ↓
LESS: COGS (खरेदी किंमत)
         ↓
EQUALS: GROSS PROFIT (ढोबळ नफा)
         ↓
LESS: OPERATING EXPENSES (दुकान खर्च)
         ↓
EQUALS: NET PROFIT (निव्वळ नफा)
```

---

## 2. Operating Expense Categories
* **RENT (दुकान व गोडाऊन भाडे)**
* **ELECTRICITY (वीजबिल - MSEDCL Sinnar)**
* **SALARY (कर्मचारी पगार)**
* **TRANSPORT (वाहतूक व हमाली)**
* **MARKETING (जाहिरात व शेतकरी मेळावे)**
* **MAINTENANCE (दुकान देखभाल व दुरुस्ती)**
* **OFFICE (स्टेशनरी व चहापान)**
* **INTERNET (इंटरनेट व सॉफ्टवेअर)**
* **OTHER (इतर किरकोळ खर्च)**

---

## 3. Financial KPI Formulations
* $\text{Total Revenue} = \sum \text{Sale.grandTotal}$
* $\text{Total COGS} = \sum (\text{SaleItem.quantity} \times \text{Product.purchasePrice})$
* $\text{Gross Profit} = \text{Total Revenue} - \text{Total COGS}$
* $\text{Total Expenses} = \sum \text{Expense.amount}$
* $\text{Net Profit} = \text{Gross Profit} - \text{Total Expenses}$
* $\text{Net Margin \%} = \left(\frac{\text{Net Profit}}{\text{Total Revenue}}\right) \times 100$
