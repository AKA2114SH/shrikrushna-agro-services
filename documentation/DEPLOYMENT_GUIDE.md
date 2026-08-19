# Production Deployment Guide
### Shri Krishna Agro Services — Web & Digital ERP System

---

## 1. Deployment Topology
The system supports two complementary deployment models:
1. **Full-Stack Node.js Server Mode (Authoritative Production ERP)**:
   - Hosts the full Next.js application, dynamic API endpoints, PostgreSQL database, authentication, POS sales transactions, Khata CRM, and AI assistants.
   - Deployable to any Linux VPS, Docker host, AWS EC2, DigitalOcean Droplet, Railway, or Render.
2. **Static Public Presentation Layer (GitHub Pages / CDN)**:
   - Hosts the public catalogue, company profile, and crop advisory for zero-login browsing.

---

## 2. Linux VPS Production Deployment (Ubuntu 22.04 / 24.04 LTS)

### Step 1: System Packages & Node.js Installation
```bash
# Update repositories
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql postgresql-contrib nginx git certbot python3-certbot-nginx
```

### Step 2: PostgreSQL Database Configuration
```bash
sudo -u postgres psql
```
```sql
CREATE DATABASE shrikrushna_agro_prod;
CREATE USER sk_agro_admin WITH ENCRYPTED PASSWORD 'ReplaceWithStrongPassword123!';
GRANT ALL PRIVILEGES ON DATABASE shrikrushna_agro_prod TO sk_agro_admin;
\q
```

### Step 3: Application Code & Dependencies
```bash
cd /var/www
sudo git clone https://github.com/AKA2114SH/shrikrushna-agro-services.git
cd shrikrushna-agro-services
sudo chown -R $USER:$USER .

npm ci --production=false
```

### Step 4: Environment Variables Setup
Create `/var/www/shrikrushna-agro-services/.env.production`:
```env
NODE_ENV=production
DATABASE_URL="postgresql://sk_agro_admin:ReplaceWithStrongPassword123!@localhost:5432/shrikrushna_agro_prod"
JWT_SECRET="GenerateRandomStringWithAtLeast32HexadecimalCharacters"
NEXT_PUBLIC_APP_URL="https://shrikrushnaagro.com"
WHATSAPP_API_KEY="your_meta_cloud_api_key"
WHATSAPP_WEBHOOK_SECRET="your_webhook_verification_secret"
```

### Step 5: Database Migrations & Build
```bash
npx prisma generate
npx prisma db push
npm run build
```

### Step 6: Process Management with PM2
```bash
sudo npm install -g pm2
pm2 start npm --name "sk-agro-erp" -- start
pm2 save
pm2 startup
```

### Step 7: Nginx Reverse Proxy Configuration
Create `/etc/nginx/sites-available/shrikrushnaagro`:
```nginx
server {
    server_name shrikrushnaagro.com www.shrikrushnaagro.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Enable site and acquire SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/shrikrushnaagro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d shrikrushnaagro.com -d www.shrikrushnaagro.com
```
