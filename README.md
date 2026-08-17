# Shri Krishna Agro Services (श्री कृष्ण ॲग्रो सर्व्हिसेस)
### Digital Business Operating System & Agricultural ERP Platform
**Location**: Sinnar, District Nashik, Maharashtra, India (PIN: 422103)  
**Lead Solutions Architect**: Akash Khatale (Mo. `+91 9373873065`, Email: `akashkhatale2114@gmail.com`)  
**Verified Agronomists**: Shubham Gamane (B.Sc Agri — `8605620843`) & Jagdish Bodke (B.Sc Agri — `8888474456`)

---

## 🌾 Platform Overview

This platform is a unified, production-grade digital operating system built specifically for agricultural input retail, seeds, fertilizers, crop protection, and expert farmer advisory in the Sinnar/Nashik region.

```
Public Farmer Website & PWA
          ↓
Product Catalogue & Quotation Engine
          ↓
Next.js 15 Server Actions / API Handlers
          ↓
Prisma ORM & Immutable Audit / Stock Ledger
          ↓
PostgreSQL on Supabase
          ↓
Admin ERP & Dual AI Assistants (Farmer WhatsApp + Owner Marathi/English)
```

---

## 🚀 Key Modules & Architecture

1. **Public Bilingual Website & Mobile PWA**:
   - High-converting landing page with Marathi (`मराठी`) primary localization and English toggle.
   - Verified agronomist credentials for Shubham Gamane and Jagdish Bodke.
   - PWA manifest (`/manifest.json`) for instant mobile home-screen installation.
   - Offline-cached public catalogue and informational pages.

2. **Searchable Product Catalogue**:
   - Filter by Category (Water Soluble, Fertilizers, Fungicides, Insecticides, Seeds, Micronutrients, Tonics/PGR, Herbicides), Brand, Pack Size, and active ingredients.
   - Safe public view: displays MRP, special price, and availability status while strictly concealing internal dealer purchase margins.

3. **Agronomist Crop Advisory Library**:
   - Region-specific crop guides for Onion (कांदा), Grapes (द्राक्ष), Pomegranate (डाळिंब), and Tomato (टोमॅटो).
   - Strict safety guardrails: all crop protection and fertigation schedules reflect verified agronomist standards with zero AI hallucination.

4. **Dynamic Quotation & Tax Invoice Generator**:
   - Unique sequential serial numbering (`QTN-YYYY-XXXX` and `INV-YYYY-XXXX`).
   - High-resolution branded A4 PDF and printable HTML documents with QR code, GST breakdown, discount, terms, and signature blocks.
   - 1-Click WhatsApp share link with pre-filled order payloads.

5. **Central Inventory & Immutable Stock Ledger**:
   - Multi-unit decimal support (`Kg`, `Litre`, `Gm`, `Ml`, `Bottle`, `Bag`, `Packet`, `Box`, `Piece`).
   - Batch tracking with manufacturing and expiry dates.
   - Automated alerts for low stock (< reorder level) and expiring batches (<30, <60, <90 days).
   - All stock changes execute exclusively through immutable `StockMovement` transactions (`OPENING_STOCK`, `PURCHASE`, `SALE`, `DAMAGE`, `ADJUSTMENT`).

6. **Sales Counter (POS Billing) & Farmer Credit (Khata CRM)**:
   - Rapid billing with customer selection, instant stock validation, and cash/UPI/credit options.
   - Customer Khata ledger tracking village, crop acreage, and outstanding balances with 1-click WhatsApp payment reminders.

7. **Purchase Management & Landed Cost Engine**:
   - Inward goods receipt with supplier invoice recording, automatic batch generation, freight costing, and landed unit cost calculation.

8. **Double-Entry Expense & Net Profit Engine**:
   - Operational expense categorization (Rent, Electricity, Salary, Transport, Maintenance, Marketing).
   - Real-time arithmetic: $\text{Revenue} - \text{COGS} = \text{Gross Profit}$; $\text{Gross Profit} - \text{Expenses} = \text{Net Profit}$.

9. **WhatsApp Integration Hub & Dual AI Assistants**:
   - **Farmer WhatsApp AI Assistant**: Controlled tool runner answering price inquiries, stock availability, store location, and quotation requests.
   - **Owner Private AI Business Assistant**: Natural language voice/text queries in Marathi and English (*"आजची विक्री किती?", "कोणता माल संपत आला आहे?", "या महिन्याचा निव्वळ नफा किती?"*).
   - Built-in live WhatsApp Chat Simulator in the ERP dashboard.

10. **Security & Role-Based Access Control (RBAC)**:
    - Granular permission matrix across roles: `OWNER`, `MANAGER`, `AGRONOMIST`, `CASHIER`, `ACCOUNTANT`.
    - Protected endpoints with HTTP 401/403 boundary enforcement.
    - Immutable security audit log tracking user ID, IP address, and mutation payloads.

11. **Strict Data Separation (Demo vs. Production)**:
    - **Development/Demo Mode**: Flagged realistic Sinnar agricultural dataset (`isDemo: true`) for testing and QA.
    - **Production Mode**: 1-Click clean initialization via the Business Setup Wizard.

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v20+ / v22+
- npm or pnpm

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run automated test verification
npm run test:all

# 3. Start local development server
npm run dev

# 4. Compile production build
npm run build
npm start
```

---

## 🔒 Environment Variables (`.env`)

```ini
# Database (Supabase PostgreSQL Connection)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Security & Session
JWT_SECRET="shrikrishna_agro_sinnar_secure_jwt_secret_key_2026"

# WhatsApp Business API (Provider Agnostic)
WHATSAPP_API_TOKEN=""
WHATSAPP_PHONE_NUMBER_ID=""
WHATSAPP_BUSINESS_ACCOUNT_ID=""
WEBHOOK_SECRET=""
```

---

## 🧪 Automated Test Suite

- `npm run test:math`: Validates stock movements, quotation/invoice arithmetic, GST calculations, and COGS/Net Profit formulas.
- `npm run test:security`: Asserts role boundary denials (e.g. Cashier blocked from profit reports, Agronomist blocked from dealer purchase margins).
- `npm run test:concurrency`: Asserts atomic overselling protection and non-negative stock constraints.
