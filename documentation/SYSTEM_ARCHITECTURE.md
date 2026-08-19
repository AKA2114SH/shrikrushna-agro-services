# System Architecture Specification
### Shri Krishna Agro Services — Web & Digital ERP System

---

## 1. Architectural Principles
1. **Separation of Concerns**: Clear boundary between public farmer-facing presentation, staff ERP business workflows, server-side authorization, and PostgreSQL data persistence.
2. **PostgreSQL as Authoritative Database**: PostgreSQL via Prisma ORM is the single source of truth for all production transactions, stock movements, invoices, customer debts, and financial reports.
3. **Frictionless Zero-Login Public Experience**: Farmers can browse 28 crop nutrition products, build quotations, view crop advisories, and contact agronomists with zero mandatory authentication.
4. **Zero Trust ERP Security**: Every administrative API endpoint authenticates incoming requests via signed HttpOnly JWT cookies and enforces strict role-based access control (RBAC).

---

## 2. Multi-Tier Architecture Diagram
```text
┌────────────────────────────────────────────────────────────────────────┐
│                         PUBLIC ACCESS TIER                             │
│  - Public Landing Page (/)               - Product Catalogue (/products)│
│  - Crop Advisory (/advisory)             - Quotation Builder (/quotation│
│  - Farmer AI Chat Assistant              - WhatsApp Direct Share        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SECURE ERP CLIENT TIER                          │
│  - Admin Login (/admin)                  - Fast POS Billing Console     │
│  - Customer Khata Ledger                 - Inventory & Batch Management │
│  - Inward Purchase Management            - Operating Expense Tracker    │
│  - Live P&L Financial Reports            - Private Owner AI Assistant   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Authenticated Cookie (JWT)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   APPLICATION SERVER & ROUTE HANDLERS                  │
│  - Next.js 14 App Router                 - Bcrypt Password Hashing     │
│  - JWT Signature & Session Validator     - Granular RBAC Middleware    │
│  - Immutable Audit Logging               - Rate Limiting & Protections │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Parameterized Invocation
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   DATABASE SERVICE PERSISTENCE LAYER                   │
│  - DatabaseService (src/lib/db-service.ts)                             │
│  - Atomic Multi-Table Transaction Management (prisma.$transaction)     │
│  - Historical Price Immutability & Landed Cost Computations            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Prisma Client
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   PERSISTENCE TIER (PostgreSQL 14+)                    │
│  - 16 Relational Models (User, Product, ProductBatch, StockMovement,   │
│    Sale, SaleItem, Purchase, PurchaseItem, Customer, Supplier, etc.)   │
│  - Foreign Key Constraints, Cascades, Composite Unique & Performance   │
│    Indexes                                                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Details

### 3.1 Public Presentation Tier
* **Technology**: Next.js 14 App Router, React 18, Tailwind CSS, Lucide React.
* **Access Model**: Public, open to all farmers without credentials.
* **Data Masking**: Confidential dealer margins, purchase prices, wholesale costs, and supplier identities are stripped on the server before responses reach the client.

### 3.2 Administrative ERP Tier
* **Role Hierarchy**:
  - `OWNER`: Full administrative, financial, governance, and AI capabilities.
  - `ACCOUNTANT`: Full financial reporting, P&L visibility, and expense management.
  - `MANAGER`: Inventory adjustments and purchase order management.
  - `CASHIER`: Fast POS sales and customer Khata payment entry.
  - `AGRONOMIST`: Crop advisory, quotation generation, and farmer guidance.

### 3.3 Security & Authorization Tier
* **Token Structure**: JSON Web Tokens (JWT) signed using HS256 algorithm with 7-day expiration.
* **Transport**: Stored exclusively in `HttpOnly`, `SameSite=Lax`, `Secure` cookies (`sk_agro_session`).
* **Audit Trail**: Every privileged mutation, login, or access denial triggers an append-only entry in `AuditLog`.

### 3.4 Persistence & Transaction Tier
* **Atomicity**: All sales and purchase transactions execute inside atomic Prisma transaction blocks (`prisma.$transaction`).
* **Stock Movement Ledger**: Every inventory change records a corresponding `StockMovement` row (`OPENING`, `PURCHASE`, `SALE`, `ADJUSTMENT_ADD`, `ADJUSTMENT_SUB`, `DAMAGE`, `EXPIRED`, `RETURN`).
