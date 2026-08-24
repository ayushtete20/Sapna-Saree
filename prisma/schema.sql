-- =========================================================================
-- SAPNA SAREES BY LAVICHITRA - POSTGRESQL RELATIONAL DATABASE SCHEMA & SEED
-- =========================================================================
-- This file can be imported directly into PostgreSQL, Supabase, Neon, AWS RDS,
-- or executed via psql:
-- psql -h <host> -U <user> -d <database> -f schema.sql
-- =========================================================================

-- 1. Create Enums if they do not exist
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'EMPLOYEE', 'ADMIN', 'OWNER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "AccountStatus" AS ENUM ('PENDING_APPROVAL', 'ACTIVE', 'REJECTED', 'PENDING_DELETION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROCESS', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Users Table (Staff, Admin, Owner, Customer RBAC)
CREATE TABLE IF NOT EXISTS "users" (
    "id" VARCHAR(64) PRIMARY KEY,
    "name" VARCHAR(255),
    "phoneNumber" VARCHAR(50) UNIQUE,
    "email" VARCHAR(255) UNIQUE,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "canManageCatalog" BOOLEAN NOT NULL DEFAULT FALSE,
    "canViewRevenue" BOOLEAN NOT NULL DEFAULT FALSE,
    "canManageOrders" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Products Table (Handloom Sarees Catalogue & Inventory)
CREATE TABLE IF NOT EXISTS "products" (
    "id" VARCHAR(64) PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "collection" VARCHAR(255) NOT NULL DEFAULT 'Banarasi Heritage',
    "fabric" VARCHAR(255) NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL,
    "originalPrice" DECIMAL(10, 2),
    "tag" VARCHAR(100) NOT NULL DEFAULT 'New Arrival',
    "hue" VARCHAR(50) NOT NULL DEFAULT '#6B1E2E',
    "image" TEXT,
    "origin" VARCHAR(255) NOT NULL DEFAULT 'Varanasi, Uttar Pradesh',
    "weaveTime" VARCHAR(100) NOT NULL DEFAULT '14 Days Handloom',
    "silkMark" BOOLEAN NOT NULL DEFAULT TRUE,
    "stock" INTEGER NOT NULL DEFAULT 10,
    "description" TEXT,
    "isBestseller" BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Stock Ledgers Table (Audited Inventory Adjustment Trail)
CREATE TABLE IF NOT EXISTS "stock_ledgers" (
    "id" VARCHAR(64) PRIMARY KEY,
    "productId" VARCHAR(64) NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "change" INTEGER NOT NULL,
    "reason" VARCHAR(255) NOT NULL DEFAULT 'Inventory Adjustment',
    "updatedById" VARCHAR(64) REFERENCES "users"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Orders Table (Customer Purchases)
CREATE TABLE IF NOT EXISTS "orders" (
    "id" VARCHAR(64) PRIMARY KEY,
    "userId" VARCHAR(64) NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "totalAmount" DECIMAL(10, 2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" VARCHAR(100) NOT NULL DEFAULT 'UPI / WhatsApp',
    "shippingAddress" TEXT,
    "trackingNumber" VARCHAR(100),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Order Items Table (Relational Line Items)
CREATE TABLE IF NOT EXISTS "order_items" (
    "id" VARCHAR(64) PRIMARY KEY,
    "orderId" VARCHAR(64) NOT NULL REFERENCES "orders"("id") ON DELETE CASCADE,
    "productId" VARCHAR(64) NOT NULL REFERENCES "products"("id") ON DELETE RESTRICT,
    "name" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10, 2) NOT NULL
);

-- =========================================================================
-- DEFAULT SEED DATA
-- =========================================================================

-- Insert Initial Staff / Owner / Admin Accounts (bcrypt hashed passwords)
INSERT INTO "users" ("id", "name", "email", "phoneNumber", "passwordHash", "role", "accountStatus", "canManageCatalog", "canViewRevenue", "canManageOrders")
VALUES 
  ('usr_owner_01', 'Lavichitra', 'owner@sapnasarees.com', '+919876543210', '$2a$10$wE99Y2qD0qBfM.N3K0X58uG93TzH54J9k6N1QxW7P0A2B4C6D8E0G', 'OWNER', 'ACTIVE', true, true, true),
  ('usr_admin_01', 'Atelier Admin', 'admin@sapnasarees.com', '+919876543211', '$2a$10$wE99Y2qD0qBfM.N3K0X58uG93TzH54J9k6N1QxW7P0A2B4C6D8E0G', 'ADMIN', 'ACTIVE', true, false, true),
  ('usr_emp_01', 'Master Weaver Lead', 'employee@sapnasarees.com', '+919876543212', '$2a$10$wE99Y2qD0qBfM.N3K0X58uG93TzH54J9k6N1QxW7P0A2B4C6D8E0G', 'EMPLOYEE', 'ACTIVE', true, false, true)
ON CONFLICT ("email") DO NOTHING;

-- Insert Initial Handloom Products
INSERT INTO "products" ("id", "name", "collection", "fabric", "price", "originalPrice", "tag", "hue", "image", "origin", "weaveTime", "silkMark", "stock", "description", "isBestseller")
VALUES
  ('saree_1', 'Crimson Zari Banarasi', 'Banarasi Heritage', 'Pure Katan Silk · Varanasi', 18500.00, 24000.00, 'Bestseller', '#6B1E2E', '/images/banarasi_red.png', 'Varanasi, Uttar Pradesh', '22 Days Handloom', true, 12, 'Handcrafted crimson red Katan silk Banarasi saree featuring rich gold zari Kadwa floral motifs.', true),
  ('saree_2', 'Ivory Kanjivaram Bridal', 'Pure Kanjivaram Silk', 'Kanchipuram Mulberry Silk', 32000.00, 39500.00, 'New Arrival', '#C8B89A', '/images/kanjivaram_ivory.png', 'Kanchipuram, Tamil Nadu', '30 Days Korvai Weave', true, 5, 'Heavy 3-ply mulberry silk Ivory Kanjivaram saree with temple Korvai border in real silver-gold zari.', false),
  ('saree_3', 'Royal Indigo Chanderi', 'Festive Splendour', 'Chanderi Cotton Silk · MP', 8900.00, 12000.00, 'Limited', '#1A2E5C', '/images/chanderi_indigo.png', 'Chanderi, Madhya Pradesh', '12 Days Handloom', true, 18, 'Lightweight Deep Indigo Chanderi saree with hand-woven silver zari bootis.', false),
  ('saree_4', 'Dusty Rose Tissue Silk', 'Designer Edit', 'Gilded Tissue Silk', 14200.00, 18000.00, 'Trending', '#9C5870', '/images/tissue_pink.png', 'Varanasi Atelier', '16 Days Handloom', true, 8, 'Dusty Rose Tissue Silk saree shining with metallic golden threads interwoven into the warp.', false),
  ('saree_5', 'Emerald Green Katan Silk Banarasi', 'Banarasi Heritage', '100% Pure Katan Silk · Varanasi Master Loom', 26500.00, 34000.00, 'Exclusive Atelier', '#0F5132', '/images/banarasi_red.png', 'Varanasi Atelier', '28 Days Kadwa Handloom', true, 7, 'Exquisite royal emerald green Katan silk saree handwoven with gold and silver zari floral jall.', false)
ON CONFLICT ("id") DO NOTHING;
