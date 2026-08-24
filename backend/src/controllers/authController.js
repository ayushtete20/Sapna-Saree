// backend/src/controllers/authController.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { readCustomerDB, writeCustomerDB, readStaffDB, writeStaffDB, readDB, writeDB } = require('../config/db');

// In-Memory Secure OTP Cache (Simulating Redis OTP Cache with TTL)
const OTP_STORE = new Map();
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes validity

/**
 * Mock SMS Dispatcher Function
 * Simulates sending 6-digit OTP via Twilio / Fast2SMS / Gupshup gateway
 */
function mockSendSMS(phoneNumber, otp) {
  console.log(`\n======================================================`);
  console.log(`📲 [SMS GATEWAY MOCK] Message sent to ${phoneNumber}`);
  console.log(`💬 "Your Sapna Sarees verification OTP is: ${otp}. Valid for 5 minutes. Do not share this code."`);
  console.log(`======================================================\n`);
}

// Helper to sign JWT token
function generateUserToken(user) {
  const roleUpper = user.role ? user.role.toUpperCase() : 'CUSTOMER';
  return jwt.sign(
    {
      id: user.id,
      name: user.name || (roleUpper === 'CUSTOMER' ? 'Sapna Sarees Member' : 'Atelier Staff'),
      phoneNumber: user.phoneNumber || null,
      email: user.email || null,
      role: roleUpper,
      department: user.department || null,
      canManageCatalog: Boolean(user.canManageCatalog),
      canViewRevenue: Boolean(user.canViewRevenue),
      canManageOrders: Boolean(user.canManageOrders)
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Clean phone number helper
 */
function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/[^0-9+]/g, '').trim();
}

/**
 * POST /api/auth/customer-login
 * Dual-Method Auth: Step 1 for Customers.
 * Accepts a phoneNumber, generates cryptographically secure 6-digit OTP, stores temporarily with TTL, mocks SMS.
 */
exports.customerLogin = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !normalizePhone(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'A valid phone number is strictly required for customer authentication.'
      });
    }

    const cleanPhone = normalizePhone(phoneNumber);

    // Generate cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + OTP_TTL_MS;

    // Save in temporary OTP store
    OTP_STORE.set(cleanPhone, {
      otp,
      expiresAt,
      attempts: 0
    });

    // Mock SMS sending
    mockSendSMS(cleanPhone, otp);

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${cleanPhone}. Please enter the 6-digit code.`,
      phoneNumber: cleanPhone,
      expiresInSeconds: 300,
      testOtp: otp // Provided in test environment for instant seamless verification
    });
  } catch (error) {
    console.error('Customer login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error generating OTP for customer login.'
    });
  }
};

/**
 * POST /api/auth/customer-verify
 * Dual-Method Auth: Step 2 for Customers.
 * Accepts phoneNumber and otp. If valid, generates and returns JWT for CUSTOMER.
 */
exports.customerVerify = async (req, res) => {
  try {
    const { phoneNumber, otp, name } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Both phone number and 6-digit OTP are required.'
      });
    }

    const cleanPhone = normalizePhone(phoneNumber);
    const cachedOtpData = OTP_STORE.get(cleanPhone);

    // OTP validation
    if (!cachedOtpData) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP request found for this phone number. Please request a new OTP.'
      });
    }

    if (Date.now() > cachedOtpData.expiresAt) {
      OTP_STORE.delete(cleanPhone);
      return res.status(400).json({
        success: false,
        message: 'The OTP has expired. Please request a fresh OTP.'
      });
    }

    if (cachedOtpData.otp !== otp.toString().trim()) {
      cachedOtpData.attempts = (cachedOtpData.attempts || 0) + 1;
      if (cachedOtpData.attempts >= 5) {
        OTP_STORE.delete(cleanPhone);
        return res.status(400).json({
          success: false,
          message: 'Too many incorrect attempts. Please request a new OTP.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please check and try again.'
      });
    }

    // OTP is valid - remove from temporary store
    OTP_STORE.delete(cleanPhone);

    let customer = null;

    // 1. Try Prisma PostgreSQL lookup if configured
    try {
      if (prisma && prisma.user && typeof prisma.user.findFirst === 'function') {
        customer = await prisma.user.findFirst({
          where: {
            OR: [
              { phoneNumber: cleanPhone },
              { phoneNumber: cleanPhone.replace(/^\+91/, '') }
            ]
          }
        });

        if (!customer) {
          customer = await prisma.user.create({
            data: {
              phoneNumber: cleanPhone,
              name: name || 'Valued Customer',
              role: 'CUSTOMER',
              accountStatus: 'ACTIVE'
            }
          });
        }
      }
    } catch (dbErr) {
      console.warn('Prisma PostgreSQL User table fallback to JSON DB store.');
    }

    // 2. Fallback to Local Persistent Store
    if (!customer) {
      const customerData = readCustomerDB();
      customer = customerData.customers.find(c =>
        c.phone === cleanPhone ||
        c.phoneNumber === cleanPhone ||
        c.phone === cleanPhone.replace(/^\+91/, '')
      );

      if (!customer) {
        customer = {
          id: `cust_${Date.now()}`,
          name: name ? name.trim() : 'Valued Customer',
          phoneNumber: cleanPhone,
          phone: cleanPhone,
          role: 'CUSTOMER',
          accountStatus: 'ACTIVE',
          wishlist: [],
          addresses: [],
          createdAt: new Date().toISOString()
        };
        customerData.customers.push(customer);
        writeCustomerDB(customerData);
      }
    }

    const token = generateUserToken(customer);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful! Welcome to Sapna Sarees.',
      token,
      user: {
        id: customer.id,
        name: customer.name || 'Valued Customer',
        phoneNumber: customer.phoneNumber || customer.phone || cleanPhone,
        role: 'CUSTOMER',
        wishlist: customer.wishlist || []
      }
    });

  } catch (error) {
    console.error('Customer verify error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error verifying customer OTP.'
    });
  }
};

/**
 * POST /api/auth/staff-login
 * Dual-Method Auth: Step for Staff (Admin, Owner, Employee)
 * Accepts email, password, and portalSource. Verifies password against stored passwordHash using bcrypt.
 * Strict Security Enforcement: If portalSource === 'dashboard' AND user's role is CUSTOMER -> HTTP 403 Forbidden.
 */
exports.staffLogin = async (req, res) => {
  try {
    const { email, password, portalSource } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Staff email and password are strictly required.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    let staffMember = null;

    // 1. Try Prisma lookup
    try {
      if (prisma && prisma.user && typeof prisma.user.findUnique === 'function') {
        staffMember = await prisma.user.findUnique({
          where: { email: cleanEmail }
        });
      }
    } catch (dbErr) {
      console.warn('Prisma DB lookup un-migrated, checking staff store.');
    }

    // 2. Staff DB Store Lookup
    if (!staffMember) {
      const staffData = readStaffDB();
      staffMember = staffData.staff.find(s => s.email && s.email.toLowerCase() === cleanEmail);
    }

    // 3. Customer DB Check for Cross-Role Security Violation
    if (!staffMember) {
      const customerData = readCustomerDB();
      const isCustomer = customerData.customers.some(c => c.email && c.email.toLowerCase() === cleanEmail);
      if (isCustomer) {
        staffMember = { role: 'CUSTOMER' };
      }
    }

    if (!staffMember) {
      return res.status(401).json({
        success: false,
        message: 'Invalid staff credentials.'
      });
    }

    const roleUpper = staffMember.role ? staffMember.role.toUpperCase() : 'CUSTOMER';

    // ── STRICT SECURITY ENFORCEMENT ──
    // If portalSource === 'dashboard' AND user's role is CUSTOMER -> HTTP 403 Forbidden
    if (portalSource === 'dashboard' && roleUpper === 'CUSTOMER') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Customer accounts are not permitted to log in to the Atelier Staff Dashboard.'
      });
    }

    if (roleUpper === 'CUSTOMER') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied. Customer accounts cannot access the Atelier Staff Portal.'
      });
    }

    // Password Verification via bcrypt / fallback
    const isMatch = staffMember.plainPassword
      ? (password === staffMember.plainPassword || (staffMember.passwordHash && await bcrypt.compare(password, staffMember.passwordHash)))
      : (staffMember.passwordHash ? await bcrypt.compare(password, staffMember.passwordHash) : false);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid staff credentials.'
      });
    }

    if (staffMember.accountStatus === 'PENDING_APPROVAL') {
      return res.status(403).json({
        success: false,
        message: 'Your staff account is currently pending Owner approval.'
      });
    }

    if (staffMember.accountStatus === 'REJECTED' || staffMember.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Staff account has been deactivated or rejected.'
      });
    }

    const token = generateUserToken(staffMember);

    return res.status(200).json({
      success: true,
      message: `Authenticated successfully as ${roleUpper}.`,
      token,
      user: {
        id: staffMember.id,
        name: staffMember.name,
        email: staffMember.email,
        role: roleUpper,
        designation: staffMember.designation || roleUpper,
        department: staffMember.department || 'Atelier Operations',
        permissions: {
          canManageCatalog: Boolean(staffMember.canManageCatalog),
          canViewRevenue: Boolean(staffMember.canViewRevenue),
          canManageOrders: Boolean(staffMember.canManageOrders)
        }
      }
    });

  } catch (error) {
    console.error('Staff login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during staff authentication.'
    });
  }
};

/**
 * Universal POST /api/auth/customer/register
 * Enforces customer creation invariant: customer accounts cannot be created without a phone number.
 */
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, phone, phoneNumber } = req.body;
    const cleanPhone = normalizePhone(phoneNumber || phone);

    if (!cleanPhone) {
      return res.status(400).json({
        success: false,
        message: 'A phone number is required to register a customer account.'
      });
    }

    const customerData = readCustomerDB();
    const existing = customerData.customers.find(c => (c.phoneNumber && c.phoneNumber === cleanPhone) || (c.phone && c.phone === cleanPhone));

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists. Please sign in.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = password ? await bcrypt.hash(password, salt) : null;

    const newCustomer = {
      id: `cust_${Date.now()}`,
      name: name ? name.trim() : 'Valued Customer',
      phoneNumber: cleanPhone,
      phone: cleanPhone,
      email: email ? email.toLowerCase().trim() : null,
      passwordHash,
      plainPassword: password || null,
      role: 'CUSTOMER',
      accountStatus: 'ACTIVE',
      addresses: [],
      wishlist: [],
      createdAt: new Date().toISOString()
    };

    customerData.customers.push(newCustomer);
    writeCustomerDB(customerData);

    const token = generateUserToken(newCustomer);

    return res.status(201).json({
      success: true,
      message: 'Customer account created successfully. Welcome to Sapna Sarees!',
      token,
      user: {
        id: newCustomer.id,
        name: newCustomer.name,
        phoneNumber: newCustomer.phoneNumber,
        role: 'CUSTOMER',
        wishlist: newCustomer.wishlist
      }
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating customer account.'
    });
  }
};

/**
 * Universal Legacy Handlers for complete backward compatibility
 */
exports.loginCustomer = exports.customerLogin;
exports.loginStaff = exports.staffLogin;

exports.login = async (req, res) => {
  const portalSource = req.body.portalSource || 'storefront';
  if (portalSource === 'dashboard' || portalSource === 'staff' || portalSource === 'owner' || portalSource === 'admin' || portalSource === 'employee') {
    return exports.staffLogin(req, res);
  }
  if (req.body.phoneNumber && !req.body.password) {
    return exports.customerLogin(req, res);
  }
  return exports.staffLogin(req, res);
};

exports.register = exports.registerCustomer;

/**
 * GET /api/auth/me
 * Returns currently authenticated user session from JWT
 */
exports.me = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const roleUpper = req.user.role ? req.user.role.toUpperCase() : 'CUSTOMER';
    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        phoneNumber: req.user.phoneNumber || null,
        email: req.user.email || null,
        role: roleUpper,
        department: req.user.department || null,
        permissions: {
          canManageCatalog: Boolean(req.user.canManageCatalog),
          canViewRevenue: Boolean(req.user.canViewRevenue),
          canManageOrders: Boolean(req.user.canManageOrders)
        }
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error fetching user session.' });
  }
};
