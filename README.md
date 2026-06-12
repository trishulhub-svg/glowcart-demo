# GlowCart — Cosmetic Demo Site

A professional, animated, industry-grade cosmetic e-commerce demo site with **4 user roles** and full demo login system.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-New_York-black)

---

## Features

### 4 User Roles with Demo Login
| Role | Access |
|------|--------|
| 🛡️ **Admin** | Dashboard analytics, product/order/user management, charts |
| 💼 **Employee** | Order processing, inventory management, low stock alerts |
| 🚚 **Delivery Person** | Active deliveries, shipment tracking, delivery history |
| 🛍️ **Customer** | Product browsing, cart, checkout, order tracking |

### Customer Flow
- Hero banner with curated categories
- 12 cosmetic products with ratings, pricing, discount badges
- Shopping cart with quantity controls and free shipping threshold
- Checkout with 4 payment methods (Card/UPI/Net Banking/COD)
- Order history with color-coded status badges
- Real-time shipment tracking with 5-step visual timeline

### Admin Dashboard
- Revenue, orders, customers, products stats with growth %
- Monthly revenue bar chart & category pie chart
- Product management table with stock indicators
- Order management with inline status updates
- User management with role badges

### Employee Portal
- Order processing queue with status updates
- Inventory management with low stock alerts
- Quick action buttons and activity feed

### Delivery Portal
- Active delivery cards with real-time status updates
- 4-step delivery progress tracking
- Delivery history with date filters
- Profile with performance stats

### Legal & Compliance
- Professional Terms & Conditions page
- Privacy Policy with data protection sections
- Terms acceptance required at checkout

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm/bun package manager

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/glowcart-demo.git
cd glowcart-demo

# Install dependencies
npm install
# or
bun install

# Set up database
npx prisma db push
# or
bun run db:push

# Start development server
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) and select a demo role to explore.

---

## Demo Login

No real credentials needed! Simply click any role card on the login page:

| Role | What You'll See |
|------|----------------|
| **Admin** | Full dashboard with analytics & management |
| **Employee** | Order processing & inventory |
| **Delivery Person** | Active deliveries & tracking |
| **Customer** | Shop, cart, checkout & order tracking |

---

## Deployment on Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"New Project"** → Import this repository
4. Framework preset: **Next.js** (auto-detected)
5. Click **"Deploy"**
6. Your site will be live in ~2 minutes!

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with GlowCart branding
│   ├── page.tsx            # Main router with role-based views
│   └── globals.css         # Tailwind + custom theme
├── components/
│   ├── cosmetics/
│   │   ├── login-page.tsx      # Animated split-screen login
│   │   ├── customer-view.tsx   # 8 sub-views (shop, cart, checkout, etc.)
│   │   ├── admin-view.tsx      # 5 sub-views (dashboard, products, etc.)
│   │   ├── employee-view.tsx   # 3 sub-views (dashboard, orders, inventory)
│   │   └── delivery-view.tsx   # 4 sub-views (dashboard, active, history, profile)
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── store.ts            # Zustand state management
│   ├── mock-data.ts        # Products, orders, shipments, users
│   ├── db.ts               # Prisma client
│   └── utils.ts            # Utility functions
└── prisma/
    └── schema.prisma       # Database schema
```

---

## License

This is a demo project. No real data is collected or stored.

---

Built with ❤️ by **TrishulHub**
