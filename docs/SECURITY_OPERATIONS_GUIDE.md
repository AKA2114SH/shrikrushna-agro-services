# Security Operations & DevSecOps Guide
### Shri Krishna Agro Services — सुरक्षा व DevSecOps मॅन्युअल

---

## 1. Security Architecture Summary
* **Authentication**: Bcrypt password hashing (Cost factor 10) + Signed HS256 JWT sessions.
* **Cookie Security**: `HttpOnly`, `SameSite=Lax`, `Secure` flags on session cookies prevent client-side script theft (XSS mitigation).
* **RBAC Enforcement**: Server-side permissions validated on every API request. Frontend navigation hiding is reinforced by mandatory backend route barriers.
* **SQL Injection Immunity**: 100% of database interactions execute through Prisma ORM parameterized queries.
* **Append-Only Audit Logging**: All security events (logins, logouts, access denials, setting modifications) are recorded in `AuditLog`.

---

## 2. Security Incident Response Protocol

```text
1. DETECT       → Identify unusual audit log anomalies or failed login spikes.
2. CONTAIN      → Rotate JWT_SECRET to immediately terminate all active sessions.
3. ISOLATE      → Restrict administrative database access to local loopback (127.0.0.1).
4. REMEDIATE    → Reset compromised staff passwords using the Owner account.
5. RESTORE      → Verify database integrity using pg_dump backups.
6. DOCUMENT     → Record root-cause analysis in operational incident logs.
```
