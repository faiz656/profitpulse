# ProfitPulse — Daraz Seller Analytics

A modern SaaS dashboard for Pakistani Daraz sellers to analyze profits, track fees, and get AI-powered business insights.

---

## Features

- **CSV Upload** — Upload your Daraz order export and get instant analysis
- **Profit Dashboard** — Real profit after all fees: commission, shipping, returns, ads
- **Fee Breakdown** — See exactly how much Daraz takes from every sale
- **AI Insights** — GPT-4o powered recommendations for your specific store (with rule-based fallback)
- **Product Analysis** — Per-product revenue, profit margin, return rate, and health status
- **Return Analysis** — Identify high-return products before they damage your metrics
- **Analytics Charts** — Monthly revenue vs profit trends with Recharts
- **Dark Mode** — Full dark/light mode support

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Auth & DB | Supabase |
| Charts | Recharts |
| AI | OpenAI GPT-4o-mini |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/profitpulse
cd profitpulse
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase-schema.sql`
3. Copy your project URL and anon key

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your-key   # Optional — rule-based insights work without this
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Using the App

### Upload your Daraz CSV

1. Go to Daraz Seller Center
2. Orders → All Orders → Export
3. Upload the CSV to ProfitPulse

The app maps these column names automatically (common variations supported):
- `order_id`, `order_date`, `product_name`, `quantity`
- `selling_price`, `shipping_fee`, `daraz_commission`
- `ad_cost`, `return_status`, `category`

A sample file is included: `sample-daraz-export.csv`

---

## Deployment on Vercel

```bash
# Push to GitHub
git init && git add . && git commit -m "initial"
git remote add origin YOUR_REPO && git push -u origin main
```

1. Import repo at [vercel.com](https://vercel.com)
2. Add environment variables (same as `.env.local`)
3. Deploy

---

## Project Structure

```
profitpulse/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/page.tsx    # Main dashboard
│   ├── analytics/page.tsx    # Charts & trends
│   ├── products/page.tsx     # Product table
│   ├── returns/page.tsx      # Return analysis
│   ├── insights/page.tsx     # AI insights
│   ├── settings/page.tsx     # Account settings
│   ├── auth/login/           # Login
│   ├── auth/signup/          # Signup
│   └── api/insights/         # AI API route
├── components/
│   ├── dashboard/            # Dashboard widgets
│   ├── charts/               # Recharts wrappers
│   └── layout/               # Sidebar, nav
├── lib/
│   ├── csvParser.ts          # Daraz CSV parser + demo data
│   ├── analytics.ts          # Profit calculation engine
│   ├── aiInsights.ts         # OpenAI + rule-based insights
│   ├── supabase.ts           # Supabase client
│   └── utils.ts              # Helpers
├── types/index.ts            # TypeScript types
├── supabase-schema.sql       # DB schema (run in Supabase)
└── sample-daraz-export.csv   # Test data
```

---

## Advanced Features (Roadmap)

- [ ] PDF report export
- [ ] WhatsApp sharing
- [ ] Multi-store support
- [ ] Urdu language support
- [ ] Predictive sales forecasting
- [ ] AI chatbot for Q&A
- [ ] Inventory forecasting

---

Built for the Pakistani ecommerce market. Star ⭐ the repo if it helped!
