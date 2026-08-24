// backend/src/scripts/seed.js
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { readDB, readStaffDB } = require('../config/db');

async function main() {
  console.log('🔄 Initializing Sapna Sarees Database Seeder via Prisma...');

  // 1. Seed Products
  const dbData = readDB();
  const sareesToSeed = dbData.sarees && dbData.sarees.length > 0 ? dbData.sarees : [
    {
      id: 'saree_1',
      name: 'Crimson Zari Banarasi',
      collection: 'Banarasi Heritage',
      fabric: 'Pure Katan Silk · Varanasi',
      price: 18500,
      originalPrice: 24000,
      tag: 'Bestseller',
      hue: '#6B1E2E',
      image: '/images/banarasi_red.png',
      origin: 'Varanasi, Uttar Pradesh',
      weaveTime: '22 Days Handloom',
      silkMark: true,
      stock: 12,
      description: 'Handcrafted crimson red Katan silk Banarasi saree featuring rich gold zari Kadwa floral motifs.',
      isBestseller: true
    },
    {
      id: 'saree_2',
      name: 'Ivory Kanjivaram Bridal',
      collection: 'Pure Kanjivaram Silk',
      fabric: 'Kanchipuram Mulberry Silk',
      price: 32000,
      originalPrice: 39500,
      tag: 'New Arrival',
      hue: '#C8B89A',
      image: '/images/kanjivaram_ivory.png',
      origin: 'Kanchipuram, Tamil Nadu',
      weaveTime: '30 Days Korvai Weave',
      silkMark: true,
      stock: 5,
      description: 'Heavy 3-ply mulberry silk Ivory Kanjivaram saree with temple Korvai border in real silver-gold zari.',
      isBestseller: false
    },
    {
      id: 'saree_3',
      name: 'Royal Indigo Chanderi',
      collection: 'Festive Splendour',
      fabric: 'Chanderi Cotton Silk · MP',
      price: 8900,
      originalPrice: 12000,
      tag: 'Limited',
      hue: '#1A2E5C',
      image: '/images/chanderi_indigo.png',
      origin: 'Chanderi, Madhya Pradesh',
      weaveTime: '12 Days Handloom',
      silkMark: true,
      stock: 18,
      description: 'Lightweight Deep Indigo Chanderi saree with hand-woven silver zari bootis.',
      isBestseller: false
    }
  ];

  console.log(`📦 Seeding ${sareesToSeed.length} Products...`);
  for (const saree of sareesToSeed) {
    await prisma.product.upsert({
      where: { id: String(saree.id) },
      update: {
        name: saree.name,
        collection: saree.collection || 'Banarasi Heritage',
        fabric: saree.fabric || 'Silk',
        price: Number(saree.price),
        originalPrice: saree.originalPrice ? Number(saree.originalPrice) : null,
        tag: saree.tag || 'New Arrival',
        hue: saree.hue || '#6B1E2E',
        image: saree.image || '/images/banarasi_red.png',
        origin: saree.origin || 'Varanasi',
        weaveTime: saree.weaveTime || '14 Days Handloom',
        silkMark: saree.silkMark !== undefined ? saree.silkMark : true,
        stock: saree.stock !== undefined ? Number(saree.stock) : 10,
        description: saree.description || 'Luxury Handloom Saree',
        isBestseller: Boolean(saree.isBestseller || saree.tag === 'Bestseller')
      },
      create: {
        id: String(saree.id),
        name: saree.name,
        collection: saree.collection || 'Banarasi Heritage',
        fabric: saree.fabric || 'Silk',
        price: Number(saree.price),
        originalPrice: saree.originalPrice ? Number(saree.originalPrice) : null,
        tag: saree.tag || 'New Arrival',
        hue: saree.hue || '#6B1E2E',
        image: saree.image || '/images/banarasi_red.png',
        origin: saree.origin || 'Varanasi',
        weaveTime: saree.weaveTime || '14 Days Handloom',
        silkMark: saree.silkMark !== undefined ? saree.silkMark : true,
        stock: saree.stock !== undefined ? Number(saree.stock) : 10,
        description: saree.description || 'Luxury Handloom Saree',
        isBestseller: Boolean(saree.isBestseller || saree.tag === 'Bestseller')
      }
    });
  }

  // 2. Seed Staff / Admin / Owner Accounts
  const staffData = readStaffDB();
  const staffList = staffData.staff && staffData.staff.length > 0 ? staffData.staff : [
    {
      id: 'usr_owner_01',
      name: 'Lavichitra',
      email: 'owner@sapnasarees.com',
      phoneNumber: '+919876543210',
      password: 'owner123',
      role: 'OWNER',
      accountStatus: 'ACTIVE',
      canManageCatalog: true,
      canViewRevenue: true,
      canManageOrders: true
    },
    {
      id: 'usr_admin_01',
      name: 'Atelier Admin',
      email: 'admin@sapnasarees.com',
      phoneNumber: '+919876543211',
      password: 'admin123',
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
      canManageCatalog: true,
      canViewRevenue: false,
      canManageOrders: true
    },
    {
      id: 'usr_emp_01',
      name: 'Master Weaver Lead',
      email: 'employee@sapnasarees.com',
      phoneNumber: '+919876543212',
      password: 'emp123',
      role: 'EMPLOYEE',
      accountStatus: 'ACTIVE',
      canManageCatalog: true,
      canViewRevenue: false,
      canManageOrders: true
    }
  ];

  console.log(`👥 Seeding ${staffList.length} Staff/Owner/Admin Accounts...`);
  for (const s of staffList) {
    const passwordHash = s.passwordHash || await bcrypt.hash(s.password || 'admin123', 10);
    await prisma.user.upsert({
      where: { email: s.email },
      update: {
        name: s.name,
        role: s.role.toUpperCase(),
        accountStatus: s.accountStatus || 'ACTIVE',
        canManageCatalog: Boolean(s.canManageCatalog),
        canViewRevenue: Boolean(s.canViewRevenue),
        canManageOrders: Boolean(s.canManageOrders)
      },
      create: {
        id: s.id || undefined,
        name: s.name,
        email: s.email,
        phoneNumber: s.phoneNumber || undefined,
        passwordHash,
        role: s.role.toUpperCase(),
        accountStatus: s.accountStatus || 'ACTIVE',
        canManageCatalog: Boolean(s.canManageCatalog),
        canViewRevenue: Boolean(s.canViewRevenue),
        canManageOrders: Boolean(s.canManageOrders)
      }
    });
  }

  console.log('✅ Database Seeding Successfully Completed!');
}

main()
  .catch(e => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
