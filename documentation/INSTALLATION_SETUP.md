# Installation & Setup Guide
### Shri Krishna Agro Services — Web & Digital ERP System

---

## 1. Prerequisites
Before setting up the project, ensure your environment meets the following specifications:
* **Node.js**: v20.10.0 or higher
* **npm**: v10.0.0 or higher
* **PostgreSQL**: v14.0 or higher (or Dockerized PostgreSQL)
* **Git**: v2.30 or higher
* **Operating System**: Linux, macOS, or Windows (WSL2 recommended)

---

## 2. Step-by-Step Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/AKA2114SH/shrikrushna-agro-services.git
cd shrikrushna-agro-services
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a local `.env` file from the provided template:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL database credentials and secrets:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shrikrushna_agro_db"
JWT_SECRET="your_long_random_jwt_secret_key_minimum_32_chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
WHATSAPP_API_KEY="mock_whatsapp_key"
WHATSAPP_WEBHOOK_SECRET="mock_webhook_secret"
```

### Step 4: Setup Database & Generate Prisma Client
Push the schema to your PostgreSQL database:
```bash
npx prisma generate
npx prisma db push
```

### Step 5: Run Automated Verification Test Suite
Ensure all 16 test suites pass (231 assertions):
```bash
npm run test:all
```

### Step 6: Start Local Development Server
```bash
npm run dev
```
* **Public Farmer Website**: [http://localhost:3000](http://localhost:3000)
* **Admin ERP Console**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 3. Available npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | Starts development server on port 3000 |
| `build` | `next build` | Compiles optimized Next.js production build |
| `export` | `cross-env GITHUB_PAGES=true NEXT_EXPORT=true next build` | Compiles static presentation bundle |
| `start` | `next start` | Runs compiled Next.js production server |
| `test:all` | `tsx scripts/test-*.ts` | Runs all 16 automated test suites |
| `db:push` | `prisma db push` | Pushes Prisma schema changes directly to DB |
