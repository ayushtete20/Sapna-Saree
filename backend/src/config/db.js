const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');
const dbFile = path.join(dataDir, 'db.json');
const customerDbFile = path.join(dataDir, 'customers_db.json');
const staffDbFile = path.join(dataDir, 'staff_db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// ----------------------------------------------------
// Base Catalogue & Orders DB
// ----------------------------------------------------
function readDB() {
  try {
    if (!fs.existsSync(dbFile)) return { sarees: [], orders: [], weavers: [] };
    const raw = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { sarees: [], orders: [], weavers: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db.json:', err);
  }
}

// ----------------------------------------------------
// Isolated Customer Database (Storefront User Accounts)
// ----------------------------------------------------
function readCustomerDB() {
  try {
    if (!fs.existsSync(customerDbFile)) return { customers: [] };
    const raw = fs.readFileSync(customerDbFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading customers_db.json:', err);
    return { customers: [] };
  }
}

function writeCustomerDB(data) {
  try {
    fs.writeFileSync(customerDbFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing customers_db.json:', err);
  }
}

// ----------------------------------------------------
// Isolated Staff Database (Admin, Owner, Employee Accounts)
// ----------------------------------------------------
function readStaffDB() {
  try {
    if (!fs.existsSync(staffDbFile)) return { staff: [] };
    const raw = fs.readFileSync(staffDbFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading staff_db.json:', err);
    return { staff: [] };
  }
}

function writeStaffDB(data) {
  try {
    fs.writeFileSync(staffDbFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing staff_db.json:', err);
  }
}

module.exports = {
  readDB,
  writeDB,
  readCustomerDB,
  writeCustomerDB,
  readStaffDB,
  writeStaffDB
};
