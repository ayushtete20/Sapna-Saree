const { readDB, writeDB, readStaffDB, writeStaffDB, readCustomerDB } = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getFinancials = (req, res) => {
  const db = readDB();
  const orders = db.orders || [];

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const costOfGoods = Math.round(totalRevenue * 0.45); // 45% production cost
  const grossProfit = totalRevenue - costOfGoods;
  const netMargin = '55%';

  return res.json({
    success: true,
    financials: {
      totalRevenue,
      costOfGoods,
      grossProfit,
      netMargin,
      monthlyProjections: [
        { month: 'May 2026', revenue: 1450000, profit: 797500 },
        { month: 'Jun 2026', revenue: 1820000, profit: 1001000 },
        { month: 'Jul 2026', revenue: 2450000, profit: 1347500 },
        { month: 'Aug 2026 (Est)', revenue: 3100000, profit: 1705000 }
      ]
    }
  });
};

exports.getAnalytics = (req, res) => {
  const db = readDB();
  const customerDb = readCustomerDB();
  return res.json({
    success: true,
    analytics: {
      totalOrders: (db.orders || []).length,
      totalCustomers: (customerDb.customers || []).length,
      totalSareesCount: (db.sarees || []).length,
      topCategories: [
        { name: 'Banarasi Heritage', percentage: 42 },
        { name: 'Pure Kanjivaram Silk', percentage: 31 },
        { name: 'Tissue & Designer Edit', percentage: 16 },
        { name: 'Chanderi & Daily Luxe', percentage: 11 }
      ]
    }
  });
};

exports.getStaff = (req, res) => {
  const staffDb = readStaffDB();
  const staff = staffDb.staff || [];
  return res.json({ success: true, count: staff.length, staff });
};

exports.addStaff = async (req, res) => {
  const { name, email, password, role, designation, department } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password required.' });
  }

  const rawRole = (role || 'employee').toUpperCase();
  const staffRole = rawRole === 'OWNER' ? 'OWNER' : rawRole === 'ADMIN' ? 'ADMIN' : 'EMPLOYEE';
  const staffDb = readStaffDB();

  const existing = (staffDb.staff || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Staff member email already exists.' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newStaff = {
    id: `staff_${staffRole.toLowerCase()}_${Date.now()}`,
    name: name.trim(),
    designation: designation || (staffRole === 'OWNER' ? 'Founder & Director' : staffRole === 'ADMIN' ? 'Atelier Administrator' : 'Atelier Staff'),
    department: department || (staffRole === 'OWNER' ? 'Executive Leadership' : staffRole === 'ADMIN' ? 'Operations' : 'Inventory & Fulfillment'),
    email: email.toLowerCase().trim(),
    passwordHash,
    plainPassword: password,
    role: staffRole,
    accountStatus: 'ACTIVE',
    canManageCatalog: true,
    canViewRevenue: staffRole === 'OWNER' || staffRole === 'ADMIN',
    canManageOrders: true,
    createdAt: new Date().toISOString()
  };

  staffDb.staff.push(newStaff);
  writeStaffDB(staffDb);

  return res.status(201).json({ success: true, message: `Staff member added as ${staffRole}.`, staff: newStaff });
};

exports.deleteStaff = (req, res) => {
  const staffDb = readStaffDB();
  const staffId = req.params.id;

  // Prevent owner from deleting themselves
  if (staffId === req.user.id) {
    return res.status(400).json({ success: false, message: 'Owner cannot delete their own account.' });
  }

  const initialLength = (staffDb.staff || []).length;
  staffDb.staff = (staffDb.staff || []).filter(u => u.id !== staffId);

  if (staffDb.staff.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Staff member not found.' });
  }

  writeStaffDB(staffDb);
  return res.json({ success: true, message: 'Staff account removed.' });
};
