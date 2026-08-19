# API Reference Documentation
### Shri Krishna Agro Services — एपीआय संदर्भ दस्तऐवजीकरण

---

## 1. Authentication APIs

### `POST /api/auth/login`
* **Auth**: Public
* **Request**: `{ "username": "shubham_owner", "password": "password123" }`
* **Response**: `{ "success": true, "user": { "id": "...", "name": "Shubham Gamane", "role": "OWNER" } }`
* **Cookie Set**: `sk_agro_session` (`HttpOnly`, `SameSite=Lax`, `Path=/`)

### `POST /api/auth/logout`
* **Auth**: Authenticated
* **Effect**: Clears session cookie and logs audit event.

### `GET /api/auth/me`
* **Auth**: Authenticated
* **Response**: Returns current authenticated user profile and permissions.

---

## 2. Inventory & Product APIs

### `GET /api/products`
* **Auth**: Public
* **Behavior**: Returns product catalog with retail selling prices. Confidential dealer purchase costs are masked for unauthenticated requests.

### `POST /api/products`
* **Auth**: Authenticated (`canManageInventory`)
* **Request**: Product creation or stock adjustment payload.

---

## 3. Sales POS APIs

### `GET /api/sales`
* **Auth**: Authenticated (`canCreateSales` or `OWNER`)
* **Response**: `{ "sales": [...] }`

### `POST /api/sales`
* **Auth**: Authenticated (`canCreateSales`)
* **Request**: Line items, payment method, customer ID, discount amount.
* **Effect**: Decrements inventory stock atomically, creates `Sale` and `SaleItem` rows, updates Customer Khata if credit.

---

## 4. Customer Khata CRM APIs

### `GET /api/customers`
* **Auth**: Authenticated (`canManageKhata` or `OWNER`)
* **Response**: List of farmer profiles and running debt balances.

### `POST /api/customers`
* **Auth**: Authenticated (`canManageKhata`)
* **Behavior**: Creates new farmer profile or records debt repayment.

---

## 5. Purchases & Suppliers APIs

### `GET /api/purchases` / `POST /api/purchases`
* **Auth**: Authenticated (`canManagePurchases`)
* **Behavior**: Logs inward purchase orders and computes landed cost.

---

## 6. Financial Reports & KPIs

### `GET /api/reports/kpis`
* **Auth**: Authenticated (`canViewProfit` — `OWNER`, `ACCOUNTANT` only)
* **Response**: Real-time Revenue, COGS, Gross Profit, Expenses, Net Profit, Trade Debtors, Trade Creditors.

---

## 7. WhatsApp & AI APIs

### `POST /api/whatsapp/webhook`
* **Auth**: Webhook Signature Verified
* **Behavior**: Ingests WhatsApp messages, deduplicates via idempotency cache, dispatches to Farmer AI.

### `POST /api/ai/farmer`
* **Auth**: Public
* **Behavior**: Controlled product search and agronomist consultation.

### `POST /api/ai/owner`
* **Auth**: Authenticated (`canAccessOwnerAI` — `OWNER` only)
* **Behavior**: Real-time read-only ERP business intelligence query engine.
