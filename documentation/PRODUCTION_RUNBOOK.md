# Production Operations Runbook
### Shri Krishna Agro Services — उत्पादन संचालन पुस्तिका

---

## 1. Daily Operations Checklist

### 1.1 Morning Opening Routine
1. **Verify Database Connection**: Open `/api/health` in browser — should return `{ status: 'healthy', database: 'connected' }`.
2. **Review Low-Stock Warnings**: Open ERP Dashboard to check items below `minStockLevel`.
3. **Review Expiry Alerts**: Check batches expiring within 60 days.
4. **Inspect Automated Backup**: Confirm daily `pg_dump` backup exists in `/var/backups/`.

### 1.2 Evening Closing Routine
1. **End-of-Day POS Reconciliation**: Reconcile physical cash drawer with ERP Cash Sales totals.
2. **Reconcile UPI Settlements**: Check bank statement against recorded UPI sales.
3. **Verify Khata Ledger**: Ensure all credit slips are entered under respective farmer accounts.
4. **Trigger Database Snapshot**: Confirm nightly database backup executes.

---

## 2. Server Management Commands

```bash
# Check application status
pm2 status

# View live application logs
pm2 logs sk-agro-erp

# Restart application server
pm2 restart sk-agro-erp

# Check PostgreSQL service status
sudo systemctl status postgresql

# Restart PostgreSQL service
sudo systemctl restart postgresql

# Check Nginx status
sudo systemctl status nginx
```
