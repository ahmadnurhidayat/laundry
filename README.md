# Daya Laundry

Professional laundry service management system built with Next.js 15, Cloudflare Workers, and D1 database.

## Tech Stack

- **Framework:** Next.js 15.5.19 (App Router)
- **Runtime:** Cloudflare Workers (via OpenNext)
- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM
- **UI:** React 19, Tailwind CSS, Lucide React
- **Language:** TypeScript
- **Package Manager:** pnpm 9.15.9

## Features

- **Dashboard** - Order stats, pending/active orders overview
- **Order Management** - Create orders with multiple items, customer info, estimated completion
- **Status Tracking** - PENDING → PROCESSING → FINISHED → PICKED_UP workflow
- **Payment Tracking** - UNPAID → PAID toggle
- **Public Tracking** - Customers track orders via unique token URL
- **Printable Receipt** - 80mm thermal printer-optimized invoice
- **Service Catalog** - KILOAN (per kg) and SATUAN (per item) pricing
- **PWA** - Installable on mobile devices
- **Responsive** - Mobile-first design

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- Cloudflare account with D1 enabled

### Local Development

```bash
# Install dependencies
pnpm install

# Create D1 database
wrangler d1 create laundry

# Configure environment
cp .env.example .env.local
# Fill in NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_SHOP_NAME, etc.

# Set D1 database ID in .dev.vars
echo 'D1_DATABASE_ID=your-database-id' > .dev.vars

# Run migrations
pnpm db:migrate:local

# Seed default services
pnpm db:seed

# Start dev server
pnpm dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BASE_URL` | Deployed app URL |
| `NEXT_PUBLIC_SHOP_NAME` | Shop name |
| `NEXT_PUBLIC_SHOP_PHONE` | Shop phone number |
| `NEXT_PUBLIC_SHOP_TAGLINE` | Shop tagline |
| `D1_DATABASE_ID` | Cloudflare D1 database ID |

## Deployment

### GitHub Actions (Recommended)

Push to `main` triggers automatic deployment via `.github/workflows/deploy.yaml`.

**Required GitHub Secrets:**

```bash
gh secret set CLOUDFLARE_API_TOKEN --body "your-token"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "your-account-id"
gh secret set NEXT_PUBLIC_BASE_URL --body "https://laundry.beyondyou.my.id"
gh secret set NEXT_PUBLIC_SHOP_NAME --body "DAYA LAUNDRY"
gh secret set NEXT_PUBLIC_SHOP_PHONE --body "0812-3456-7890"
gh secret set NEXT_PUBLIC_SHOP_TAGLINE --body "Laundry Professional & Terpercaya"
```

### Manual Deployment

```bash
pnpm deploy
```

## Database

SQLite via Cloudflare D1 with 4 tables:

- **customers** - Customer records (name, phone)
- **services** - Laundry services (name, type, price)
- **orders** - Orders with status, payment, tracking token
- **order_items** - Line items per order

### Migrations

```bash
# Generate migration
pnpm db:generate

# Apply to remote
pnpm db:migrate

# Apply to local
pnpm db:migrate:local
```

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm deploy` | Build and deploy to Cloudflare |
| `pnpm db:generate` | Generate Drizzle migration |
| `pnpm db:migrate` | Apply migrations to D1 |
| `pnpm db:seed` | Seed default services |

## License

MIT
