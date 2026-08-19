# Troubleshooting Guide
### Shri Krishna Agro Services — समस्या निवारण मार्गदर्शक

---

## 1. Common Issues & Solutions

### 1.1 "Invalid Username or Password" / Login Failure
* **Symptoms**: User cannot login; red error toast appears.
* **Cause**: Incorrect password, wrong username, or inactive account.
* **Resolution**:
  - Verify credentials with Owner Shubham Gamane (`8605620843`).
  - If 5 consecutive failed attempts occur, wait 60 seconds for the brute-force rate limiter to reset (`HTTP 429`).

### 1.2 "HTTP 403 Forbidden: Insufficient Permissions"
* **Symptoms**: Staff member tries to view Net Profit or manage Expenses and receives an error.
* **Cause**: Staff role does not possess the required permission in `ROLE_PERMISSIONS`.
* **Resolution**: Net profit is strictly restricted to `OWNER` and `ACCOUNTANT` roles. Expenses are restricted to `OWNER` and `ACCOUNTANT`. This is normal security behavior.

### 1.3 "Insufficient Stock for Product" during POS Sale
* **Symptoms**: POS transaction refuses to complete.
* **Cause**: Requested sale quantity exceeds physical inventory in PostgreSQL.
* **Resolution**: Record an Inward Purchase delivery or perform a stock adjustment before completing the sale.

### 1.4 Database Connection Refused
* **Symptoms**: Server logs report `Can't reach database server at localhost:5432`.
* **Cause**: PostgreSQL service is stopped or `DATABASE_URL` is incorrect.
* **Resolution**:
  ```bash
  sudo systemctl restart postgresql
  npx prisma db push
  ```
