# Backup & Disaster Recovery Guide
### Shri Krishna Agro Services — बॅकअप व डेटा पुनर्प्राप्ती मॅन्युअल

---

## 1. Production PostgreSQL Database Backup

### 1.1 Automated Daily Database Dumps (pg_dump)
Create a daily automated cron job on your production Linux server:
```bash
# Export compressed PostgreSQL database dump
pg_dump -U sk_agro_admin -h localhost -d shrikrushna_agro_prod -F c -b -v -f "/var/backups/sk_agro_$(date +%Y%m%d_%H%M%S).dump"
```

### 1.2 Automated Database Restoration
To restore a backup into a fresh or recovered database:
```bash
# Restore PostgreSQL dump
pg_restore -U sk_agro_admin -h localhost -d shrikrushna_agro_prod -v -c "/var/backups/sk_agro_20260819_120000.dump"
```

---

## 2. In-App JSON Snapshot Export & Emergency Restore
For immediate offline disaster recovery:
1. **Export Snapshot**: In the ERP Admin Settings screen, click **'बॅकअप डाऊनलोड करा (Export Snapshot)'**.
2. **Snapshot Content**: Generates an encrypted JSON payload containing products, batches, stock ledgers, customers, sales, purchases, and expenses.
3. **Emergency Restore**: Upload the JSON snapshot via the **'डेटा रिस्टोर करा (Restore Snapshot)'** modal. The system parses and restores state with verified 100% data fidelity.
