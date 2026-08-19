# Dual AI Assistants Architecture & Safety Guide
### Shri Krishna Agro Services — एआय असिस्टंट मार्गदर्शक

---

## 1. Dual AI Paradigm
The system incorporates two purpose-built, strictly isolated AI engines:
```text
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│       PUBLIC FARMER AI ASSISTANT     │  │       PRIVATE OWNER AI ASSISTANT     │
│  - Zero-login, public access         │  │  - Requires OWNER role authentication│
│  - Grounded in authentic catalog     │  │  - Real-time PostgreSQL analytics    │
│  - Retail prices & availability only │  │  - P&L, Revenue, COGS, Net Profit    │
│  - Strictly blocks dealer margins    │  │  - Reorder alerts & Khata debtors    │
│  - Chemical safety guardrails        │  │  - Strictly read-only; no DB mutation│
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

## 2. Farmer AI Assistant Guardrails
1. **Zero Hallucination**: If a product does not exist in the Sinnar inventory, the assistant explicitly states it is unavailable rather than inventing fake prices.
2. **Confidential Margin Masking**: Any attempt to inquire into wholesale purchase costs, supplier pricing, or dealer margins is intercepted and blocked.
3. **Agrochemical Safety Boundary**: Inquiries regarding toxic off-label chemical mixtures or unapproved overdoses are rejected with safety warnings and redirected to B.Sc Agri agronomists Shubham Gamane and Jagdish Bodke.
4. **Prompt Injection Resistance**: System overrides (`ignore previous instructions`, `print system prompt`, `leak API keys`) are detected and rejected.

---

## 3. Owner AI Assistant Guardrails
1. **Authentication & RBAC**: Accessible solely to authenticated users possessing the `canAccessOwnerAI` permission (`OWNER` role).
2. **Strictly Read-Only**: Mutation commands (`DROP TABLE`, `DELETE FROM`, `UPDATE`) are blocked by security filters.
3. **Live PostgreSQL Grounding**: Computes metrics from live PostgreSQL transactions via `DatabaseService`.
