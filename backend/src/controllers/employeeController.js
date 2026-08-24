// backend/src/controllers/employeeController.js
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { readStaffDB, writeStaffDB } = require('../config/db');

/**
 * GET /api/employees
 * Protected: Admin/Owner
 * Returns all staff accounts & pending requests.
 */
exports.getEmployees = async (req, res) => {
  try {
    const staffDb = readStaffDB();
    const staff = staffDb.staff || [];

    return res.status(200).json({
      success: true,
      count: staff.length,
      staff,
      employees: staff
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving staff accounts.'
    });
  }
};

/**
 * POST /api/employees
 * Admin requests staff creation -> PENDING_APPROVAL
 * Owner direct creation -> ACTIVE
 */
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, canManageCatalog, canViewRevenue, canManageOrders, role, department, designation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required to create a staff account.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const isOwnerAction = req.user && req.user.role && req.user.role.toUpperCase() === 'OWNER';
    const status = isOwnerAction ? 'ACTIVE' : 'PENDING_APPROVAL';

    const staffDb = readStaffDB();
    const existing = (staffDb.staff || []).find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Staff account with this email already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const assignedRole = (role && role.toUpperCase() === 'ADMIN') ? 'ADMIN' : 'EMPLOYEE';

    const newStaff = {
      id: `staff_${assignedRole.toLowerCase()}_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      plainPassword: password,
      role: assignedRole,
      department: department || (assignedRole === 'ADMIN' ? 'Atelier Operations' : 'Inventory & Catalog'),
      designation: designation || (assignedRole === 'ADMIN' ? 'Atelier Admin' : 'Catalog Specialist'),
      accountStatus: status,
      canManageCatalog: canManageCatalog !== undefined ? Boolean(canManageCatalog) : true,
      canViewRevenue: Boolean(canViewRevenue),
      canManageOrders: canManageOrders !== undefined ? Boolean(canManageOrders) : true,
      createdAt: new Date().toISOString()
    };

    staffDb.staff.push(newStaff);
    writeStaffDB(staffDb);

    const message = isOwnerAction 
      ? 'Staff account created and activated.' 
      : 'Staff account request submitted successfully! Pending Owner approval.';

    return res.status(201).json({
      success: true,
      message,
      employee: newStaff,
      staff: newStaff
    });

  } catch (error) {
    console.error('Error creating employee:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while creating staff account.'
    });
  }
};

/**
 * DELETE /api/employees/:id
 * Admin deletion request -> sets PENDING_DELETION
 * Owner deletion -> immediate removal
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const isOwnerAction = req.user && req.user.role && req.user.role.toUpperCase() === 'OWNER';
    const staffDb = readStaffDB();

    const idx = (staffDb.staff || []).findIndex(e => e.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Staff account not found.' });
    }

    if (isOwnerAction) {
      staffDb.staff.splice(idx, 1);
      writeStaffDB(staffDb);
      return res.status(200).json({ success: true, message: 'Staff account deleted cleanly.' });
    } else {
      staffDb.staff[idx].accountStatus = 'PENDING_DELETION';
      writeStaffDB(staffDb);
      return res.status(200).json({ success: true, message: 'Staff account deletion request submitted for Owner approval.' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error processing deletion request.' });
  }
};

/**
 * POST /api/employees/:id/approve
 * Protected: Owner Only
 */
exports.approveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const staffDb = readStaffDB();

    const idx = (staffDb.staff || []).findIndex(e => e.id === id);
    if (idx !== -1) {
      if (staffDb.staff[idx].accountStatus === 'PENDING_DELETION') {
        staffDb.staff.splice(idx, 1);
        writeStaffDB(staffDb);
        return res.status(200).json({ success: true, message: 'Deletion request approved. Account deleted.' });
      } else {
        staffDb.staff[idx].accountStatus = 'ACTIVE';
        writeStaffDB(staffDb);
        return res.status(200).json({ success: true, message: 'Account request approved and activated!', staff: staffDb.staff[idx] });
      }
    }

    return res.status(404).json({ success: false, message: 'Account request not found.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error approving request.' });
  }
};

/**
 * POST /api/employees/:id/reject
 * Protected: Owner Only
 */
exports.rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const staffDb = readStaffDB();

    const idx = (staffDb.staff || []).findIndex(e => e.id === id);
    if (idx !== -1) {
      staffDb.staff[idx].accountStatus = 'REJECTED';
      writeStaffDB(staffDb);
      return res.status(200).json({ success: true, message: 'Account request rejected.', staff: staffDb.staff[idx] });
    }

    return res.status(404).json({ success: false, message: 'Account request not found.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error rejecting request.' });
  }
};

/**
 * PUT /api/employees/:id/permissions
 */
exports.updatePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { canManageCatalog, canViewRevenue, canManageOrders } = req.body;
    const staffDb = readStaffDB();

    const index = (staffDb.staff || []).findIndex(e => e.id === id);
    if (index !== -1) {
      staffDb.staff[index] = {
        ...staffDb.staff[index],
        ...(canManageCatalog !== undefined && { canManageCatalog: Boolean(canManageCatalog) }),
        ...(canViewRevenue !== undefined && { canViewRevenue: Boolean(canViewRevenue) }),
        ...(canManageOrders !== undefined && { canManageOrders: Boolean(canManageOrders) })
      };
      writeStaffDB(staffDb);

      return res.status(200).json({
        success: true,
        message: 'Staff permission flags updated successfully.',
        employee: staffDb.staff[index]
      });
    }

    return res.status(404).json({ success: false, message: 'Staff member not found.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error updating permissions.' });
  }
};
