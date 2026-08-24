# Sapna Sarees by Lavichitra — Atelier E-Commerce Platform

> **Where Tradition Meets Timeless Luxury.**  
> A high-end handloom saree e-commerce platform, merchant control console, and Node.js backend engine crafted for master drapes, heritage weaves, and atelier operations.

---

## 🌟 Architecture Overview

The platform is designed as an integrated full-stack monorepo featuring three dedicated sub-systems:

```
                                    ┌────────────────────────────────────────┐
                                    │         Sapna Sarees Platform          │
                                    └───────────────────┬────────────────────┘
                                                        │
                      ┌─────────────────────────────────┼────────────────────────────────┐
                      │                                 │                                │
                      ▼                                 ▼                                ▼
          ┌───────────────────────┐         ┌───────────────────────┐        ┌───────────────────────┐
          │  Customer Storefront  │         │  Atelier Staff Portal │        │   Backend API Engine  │
          │      (frontend/)      │         │     (dashboard/)      │        │      (backend/)       │
          ├───────────────────────┤         ├───────────────────────┤        ├───────────────────────┤
          │ • React 18 + Vite     │         │ • React 18 + Vite     │        │ • Node.js + Express   │
          │ • Tailwind CSS + GSAP │         │ • Role-Based Console  │        │ • Prisma ORM & Schema │
          │ • Three.js 3D Viewer  │         │ • Inventory & Revenue │        │ • JWT & Password Hash │
          │ • Cart & Auth Modals  │         │ • Order Status Flow   │        │ • Isolated Databases  │
          │ • Dynamic Collections │         │ • Direct Live Links   │        │ • Unified SPA Server  │
          └───────────────────────┘         └───────────────────────┘        └───────────────────────┘
```

---

## ✨ Features & Capabilities

### 🛍️ 1. Customer Storefront (`/`)
- **Interactive 3D Saree Drape Canvas**: Real-time Three.js renderer featuring fabric physics and color reflections.
- **Curated Collections & Filters**: Dynamic filtering by price bands, weave types (Banarasi, Kanjivaram, Chanderi, Organza), occasions, and tags.
- **Detailed Product Experience**: Deep-linking support (`#product/:id`), high-resolution zoom swatches, weave duration indicators, and silk mark badges.
- **Cart & Wishlist Engine**: Slide-over drawer with instant subtotal calculations and custom WhatsApp order integration.
- **Customer Authentication**: Client-side JWT registration and sign-in with session persistence.

### 👑 2. Atelier Merchant & Staff Console (`/dashboard/`)
- **Granular Role-Based Access Control (RBAC)**:
  - **Owner Suite**: High-level financial analytics, revenue charts, staff approvals, and weaver network registry.
  - **Admin Suite**: Product catalog management, pricing controls, order fulfillment, and employee permissions.
  - **Staff/Employee Suite**: Assigned order handling and inventory tracking based on customized permission flags.
- **Direct Storefront Product Preview**: Single-click navigation from catalog inventory directly to the live customer product drape.
- **Live Inventory Ledger**: Audited stock adjustments with change reasons and timestamps.

### ⚙️ 3. Backend API Engine (`/api/*`)
- **Modular Controller Architecture**: Decoupled routes for Auth, Sarees, Products, Orders, Revenue, and Staff.
- **Dual Database Flexibility**: Configured with Prisma PostgreSQL schema (`prisma/schema.prisma`) alongside resilient JSON-backed data layers (`backend/data/`).
- **Unified Production Serving**: Automatically serves the production build of the Customer Storefront at `/`, the Admin Portal at `/dashboard/`, and the REST endpoints at `/api/*` from a single port.

---

## 📁 Repository Structure

```
sapna-sarees-platform/
├── package.json               ← Monorepo orchestrator (builds & starts all services)
├── README.md                  ← Platform documentation
├── .gitignore                 ← Git exclusion rules
│
├── frontend/                  ← Customer Storefront (React 18 + Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx            ← Root router & store management
│       ├── components/        ← Navbar, CartDrawer, Hero3DCanvas, ProductGrid...
│       ├── pages/             ← Home, Catalog, ProductDetail
│       └── utils/             ← Config, currency formatting, demo datasets
│
├── dashboard/                 ← Merchant Control Panel (React 18 + Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx            ← Admin layout, header navigation, tab routing
│       ├── components/        ← Sidebar, ProtectedRoute, security wrappers
│       ├── pages/
│       │   ├── shared/        ← Login, Overview dashboard
│       │   ├── admin/         ← Catalog, Orders, Weaver management
│       │   └── owner/         ← Financials, Analytics, Staff, Approvals
│       └── utils/             ← Dynamic API & Storefront URL resolver
│
├── backend/                   ← Express API Engine
│   ├── package.json
│   ├── prisma/
│   │   └── schema.prisma      ← PostgreSQL schema definitions
│   ├── data/                  ← JSON fallback databases (products, staff, customers)
│   └── src/
│       ├── server.js          ← Main Express server & SPA static handler
│       ├── config/            ← DB connections & helpers
│       ├── middleware/        ← JWT verification & RBAC interceptors
│       ├── routes/            ← REST API routes
│       └── controllers/       ← Business logic handlers
│
├── css/                       ← Luxury Single-Page CSS design tokens
├── js/                        ← Vanilla luxury presentation logic
├── images/                    ← Brand logos, favicons, and sample assets
└── index.html                 ← Standalone luxury editorial landing page
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Install All Dependencies
From the repository root:
```bash
npm run install:all
```

### 3. Running Services Locally

You can launch each service in its own terminal or run the unified production server:

#### Mode A: Separate Development Servers (Hot Reloading)
```bash
# Terminal 1: Backend API (Port 8000)
npm run dev:backend

# Terminal 2: Customer Storefront (Port 3000)
npm run dev:frontend

# Terminal 3: Atelier Dashboard (Port 5000)
npm run dev:dashboard
```

#### Mode B: Unified Production Server (Single Port 8000)
```bash
# Build both frontend & dashboard bundles
npm run build

# Start the unified Node.js server
npm start
```
- **Storefront**: [http://localhost:8000/](http://localhost:8000/)
- **Dashboard**: [http://localhost:8000/dashboard/](http://localhost:8000/dashboard/)
- **API Health**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🔐 Default Demo Credentials

### Atelier Staff & Merchant Console
Access via [http://localhost:8000/dashboard/](http://localhost:8000/dashboard/) (or port `5000` in dev):

| Portal Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Owner** | `owner@sapnasarees.com` | `owner123` | Full Owner Suite, Financials, Staff Approvals |
| **Admin** | `admin@sapnasarees.com` | `admin123` | Catalog, Inventory Adjustments, Orders |
| **Employee** | `employee@sapnasarees.com` | `emp123` | Assigned Order & Shipping processing |

---

## 🌐 Production Deployment

The repository is pre-configured with dynamic URL resolution, allowing deployment to any cloud hosting platform or container environment without hardcoding URLs.

### Deployment on Antideploy / Cloud Run / PaaS
1. Ensure your environment variables are configured in the cloud console.
2. The platform's root `package.json` will automatically build the React applications and start the Express server.
3. Deploy command:
   ```bash
   npm run build && npm start
   ```

### Environment Variables Guide

| Variable | Scope | Default (Dev) | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | `8000` | Port for the Express server (injected by host) |
| `JWT_SECRET` | Backend | *(pre-configured)* | Key used to sign authentication tokens |
| `DATABASE_URL` | Backend | *(optional)* | PostgreSQL connection string for Prisma |
| `VITE_API_URL` | Frontend/Dashboard | `/api` | Base API route (defaults to `/api` in production) |
| `VITE_DASHBOARD_URL` | Frontend | `/dashboard` | Link to merchant dashboard |
| `VITE_STOREFRONT_URL` | Dashboard | `/` | Link to customer storefront |

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health and timestamp status | No |
| `GET` | `/api/products` | Retrieve all sarees in the active catalog | No |
| `GET` | `/api/sarees/:id` | Get individual saree by ID | No |
| `POST` | `/api/auth/customer/register` | Register customer account | No |
| `POST` | `/api/auth/customer/login` | Login customer account | No |
| `POST` | `/api/auth/staff/login` | Login staff / admin / owner account | No |
| `POST` | `/api/orders` | Submit new customer order | Optional |
| `GET` | `/api/orders` | Fetch orders list | Staff JWT |
| `POST` | `/api/sarees` | Create / add new saree item | Admin/Owner |
| `PUT` | `/api/sarees/:id` | Update saree details & stock | Admin/Owner |
| `DELETE` | `/api/sarees/:id` | Remove saree from catalog | Admin/Owner |
| `GET` | `/api/revenue/summary` | Retrieve sales analytics | Owner JWT |

---

## 📄 License & Attribution

Designed and developed for **Sapna Sarees by Lavichitra**.  
All rights reserved © 2026. Handcrafted with authentic heritage textiles in mind.