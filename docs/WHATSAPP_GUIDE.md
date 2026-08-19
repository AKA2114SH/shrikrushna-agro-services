# WhatsApp Hub & Messaging Integration Guide
### Shri Krishna Agro Services — व्हॉट्सॲप हब मॅन्युअल

---

## 1. WhatsApp Hub Architecture
The WhatsApp integration follows a provider-independent architecture:
* **Interface Abstraction (`IWhatsAppProvider`)**: Decouples business logic from specific delivery gateways (Meta Cloud API, Gupshup, Twilio, or Local Simulator).
* **Inbound Webhook (`/api/whatsapp/webhook`)**: Validates webhook signatures, normalizes payloads, prevents duplicate retransmissions via idempotency caching, and dispatches queries to the Farmer AI.
* **Database Logging (`WhatsAppMessage`)**: Persists every inbound and outbound message in PostgreSQL.

---

## 2. Outbound WhatsApp Workflows
1. **Quotation Sharing**: Generates branded quotation summaries with itemized lists, GST amounts, total estimates, and agronomist contact links.
2. **Tax Invoice Sharing**: Dispatches official bill links upon POS checkout completion.
3. **Khata Debt Reminders**: Dispatches gentle, customized payment reminders with current outstanding balance and shop UPI/bank details.
4. **Agronomist Consultation**: Direct 1-click chat routing with Shubham Gamane (`8605620843`) and Jagdish Bodke (`8888474456`).
