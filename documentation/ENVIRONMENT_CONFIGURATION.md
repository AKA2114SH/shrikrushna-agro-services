# Environment Configuration Specification
### Shri Krishna Agro Services — Web & Digital ERP System

---

## 1. Environment Variable Reference Matrix

| Variable Name | Purpose | Required | Example Placeholder | Scope |
|---|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@localhost:5432/dbname` | Server-only |
| `JWT_SECRET` | Secret key for signing HS256 session tokens | Yes | `super_secret_jwt_key_min_32_characters` | Server-only |
| `NODE_ENV` | Environment identifier (`development` or `production`) | Yes | `production` | Universal |
| `NEXT_PUBLIC_APP_URL` | Base public URL of the web platform | Yes | `https://shrikrushnaagro.com` | Client & Server |
| `WHATSAPP_API_KEY` | WhatsApp Cloud API token / provider key | Optional | `EAA...your_whatsapp_token_placeholder` | Server-only |
| `WHATSAPP_WEBHOOK_SECRET` | Inbound WhatsApp webhook verification token | Optional | `sk_agro_webhook_token_secret_123` | Server-only |
| `AI_API_KEY` | AI LLM provider API key | Optional | `sk-ai-provider-api-key-placeholder` | Server-only |
| `GITHUB_PAGES` | Flag for compiling static GitHub Pages export | Optional | `true` | Build-only |
| `NEXT_EXPORT` | Next.js static HTML export mode flag | Optional | `true` | Build-only |

---

## 2. Security Rules for Environment Variables
1. **Never Commit Secrets**: Real production passwords, API keys, and connection strings must never be committed to Git.
2. **Client vs Server Prefix**: Only variables prefixed with `NEXT_PUBLIC_` are bundled into client-side JavaScript. All database credentials and JWT secrets must remain strictly un-prefixed.
3. **Secret Rotation**: Rotate `JWT_SECRET` whenever an administrative credential compromise is suspected. Rotating `JWT_SECRET` will immediately invalidate all active sessions across all devices.
