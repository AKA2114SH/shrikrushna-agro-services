# श्री कृष्ण ॲग्रो सर्व्हिसेस (Shri Krishna Agro Services)
### Complete Web & Digital ERP Business Management System

---

## 🌾 Business & Project Overview
**Shri Krishna Agro Services** is a full-stack, enterprise-grade Digital Business Management System and Farmer Web Platform tailored specifically for agrochemical and fertilizer retail enterprises in Sinnar, Nashik (Maharashtra).

* **Entity Name**: Shri Krishna Agro Services (श्री कृष्ण ॲग्रो सर्व्हिसेस)
* **Authorized Business Proprietors**:
  - **Shubham Gamane** (B.Sc Agri) — `+91 8605620843`
  - **Jagdish Bodke** (B.Sc Agri) — `+91 8888474456`
* **Address**: Main Market, Sinnar - Shirdi Highway, Sinnar, Nashik, Maharashtra - 422103
* **Statutory Licenses**:
  - **Fertilizer License**: `FL/NSK/SINNAR/2024/089`
  - **Seed License**: `SL/NSK/SINNAR/2024/112`
  - **Insecticide/Pesticide License**: `PL/NSK/SINNAR/2024/450`
  - **Maharashtra GSTIN**: `27AAAFS5678K1Z5`

---

## 🛠️ Technology Stack
* **Framework**: Next.js 14 (App Router) + React 18
* **Language**: TypeScript 5.7+
* **Database & ORM**: PostgreSQL + Prisma ORM 5.22
* **Styling**: Tailwind CSS + Custom Vanilla CSS Design System
* **Security & Auth**: Bcrypt.js, Signed HS256 JWT sessions via `jose`, HttpOnly secure cookies
* **Icons & UI**: Lucide React
* **Runtime**: Node.js 20+

---

## 🏛️ System Architecture
```text
Public Farmer Client                     Staff & Owner ERP Client
       │                                            │
       ▼                                            ▼
Public Next.js Pages                     Admin Next.js ERP Shell
(/, /products, /quotation, /advisory)    (/admin - POS, Khata, Inventory, P&L)
       │                                            │
       └──────────────────┬─────────────────────────┘
                          ▼
            Next.js API & Route Handlers
           (/api/auth, /api/sales, /api/products...)
                          │
                          ▼
             Authentication & RBAC Matrix
           (OWNER, MANAGER, ACCOUNTANT, CASHIER, AGRONOMIST)
                          │
                          ▼
                  DatabaseService
                          │
                          ▼
                 Prisma ORM Client
                          │
                          ▼
                 PostgreSQL Database
```

---

## 📦 Core Business Modules
1. **Public Website & Farmer PWA**: 100% friction-free zero-login access for farmers to explore 28 authentic Sinnar crop nutrition/protection products, calculate GST quotations, and read verified Marathi crop advisories.
2. **Sales POS & Touch Billing**: Rapid touch billing, itemized GST calculation (0%, 5%, 12%, 18%), split payment handling (Cash, UPI, Khata credit), atomic stock decrement, and printable tax invoices.
3. **Customer Khata CRM**: Farmer debt ledger tracking credit disbursements, repayments, remaining balances, and WhatsApp payment reminders.
4. **Inventory & Immutable Stock Movement**: Real-time batch management, expiry date monitoring, low stock warnings, and immutable audit logs of all stock additions, sales, adjustments, and write-offs.
5. **Purchases & Supplier Payables**: Inward stock management, landed cost computation, supplier credit ledger, and payment tracking.
6. **Quotations & Tax Invoice PDF Engine**: Sequential QTN numbers, branded A4 print modals, and 1-click conversion to finalized POS sales.
7. **Expenses & P&L Financial Engine**: Real-time business intelligence ($\text{Revenue} - \text{COGS} - \text{Expenses} = \text{Net Profit}$).
8. **WhatsApp Hub & Dual AI Assistants**:
   - **Farmer AI**: Public, controlled agronomist assistant grounded in authentic Sinnar inventory.
   - **Owner AI**: Private, authenticated read-only business intelligence assistant.

---

## 🚀 Quick Start & Development Setup

### 1. Prerequisites
* Node.js v20.x or higher
* PostgreSQL v14+ (or local database instance)
* npm v10+

### 2. Installation
```bash
git clone https://github.com/AKA2114SH/shrikrushna-agro-services.git
cd shrikrushna-agro-services
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and configure your credentials:
```bash
cp .env.example .env
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 5. Running the Application Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public website, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the ERP management console.

---

## 🧪 Comprehensive Test Suite (16 Test Suites, 231 Assertions)
Run the entire automated quality and security verification suite:
```bash
npm run test:all
```

Individual test suites:
* `npm run test:math` — Math & Accounting Formulations
* `npm run test:security` — Security & RBAC Enforcement
* `npm run test:concurrency` — Concurrency & Overselling Prevention
* `npm run test:auth` — Bcrypt Hashing & JWT Session Lifecycle
* `npm run test:ai` — AI Grounding & Adversarial Defense
* `npm run test:restore` — Disaster Recovery & Backup Integrity
* `npm run test:inventory` — Products & Inventory Engine
* `npm run test:pos-khata` — POS Billing & Customer Khata
* `npm run test:quotation` — Quotation & Invoice Engine
* `npm run test:financial` — Expenses & Profit Calculations
* `npm run test:whatsapp-ai` — WhatsApp Hub & Dual AI Assistants
* `npm run test:audit` — Final Production Quality & Security Audit

---

## 📚 Complete Documentation Index
Detailed documentation guides are available in the [documentation/](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/) directory:
* [System Architecture](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/SYSTEM_ARCHITECTURE.md)
* [Installation & Setup](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/INSTALLATION_SETUP.md)
* [Deployment Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/DEPLOYMENT_GUIDE.md)
* [Environment Configuration](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/ENVIRONMENT_CONFIGURATION.md)
* [Database Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/DATABASE_GUIDE.md)
* [Owner User Manual](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/OWNER_USER_MANUAL.md)
* [Staff User Manual](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/STAFF_USER_MANUAL.md)
* [Farmer Public Usage Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/FARMER_PUBLIC_USAGE_GUIDE.md)
* [Sales POS Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/SALES_POS_GUIDE.md)
* [Inventory Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/INVENTORY_GUIDE.md)
* [Purchase & Supplier Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/PURCHASE_SUPPLIER_GUIDE.md)
* [Customer Khata CRM Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/CUSTOMER_KHATA_GUIDE.md)
* [Quotation & Invoice Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/QUOTATION_INVOICE_GUIDE.md)
* [Expense & Financial Report Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/EXPENSE_REPORT_GUIDE.md)
* [WhatsApp Hub Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/WHATSAPP_GUIDE.md)
* [Dual AI Assistant Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/AI_ASSISTANT_GUIDE.md)
* [Backup & Disaster Recovery Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/BACKUP_RESTORE_GUIDE.md)
* [Security Operations Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/SECURITY_OPERATIONS_GUIDE.md)
* [Troubleshooting Guide](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/TROUBLESHOOTING_GUIDE.md)
* [API Reference Documentation](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/API_DOCUMENTATION.md)
* [Database Schema Documentation](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/DATABASE_SCHEMA_DOCUMENTATION.md)
* [Production Runbook](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/PRODUCTION_RUNBOOK.md)
* [Client Handover Document](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/CLIENT_HANDOVER.md)
* [Changelog](file:///home/dj-akash/Desktop/Shrikrushna-agro-services/documentation/CHANGELOG.md)

---

## 📄 License
Proprietary software developed exclusively for **Shri Krishna Agro Services, Sinnar, Nashik**. All rights reserved.
