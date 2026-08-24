const { readDB, writeDB } = require('../config/db');

// Helper to ensure legacy saree objects have audit logs and update records
function formatSaree(saree) {
  const defaultUser = {
    id: 'u-admin-1',
    name: 'Aarav Gupta (Admin)',
    email: 'admin@sapnasarees.com',
    role: 'ADMIN'
  };

  const now = saree.createdAt || new Date().toISOString();

  return {
    ...saree,
    stock: saree.stock !== undefined ? Number(saree.stock) : 10,
    image: saree.image || '/images/banarasi_red.png',
    createdBy: saree.createdBy || { ...defaultUser, timestamp: now },
    updatedBy: saree.updatedBy || { ...defaultUser, timestamp: now },
    auditLog: saree.auditLog || [
      {
        action: 'CREATED',
        updatedBy: saree.createdBy || defaultUser,
        timestamp: now,
        details: `Initial catalog entry for ${saree.name}`
      }
    ],
    inventoryLog: saree.inventoryLog || [
      {
        previousStock: 0,
        newStock: saree.stock !== undefined ? Number(saree.stock) : 10,
        change: saree.stock !== undefined ? Number(saree.stock) : 10,
        updatedBy: saree.createdBy || defaultUser,
        timestamp: now,
        reason: 'Initial Catalog Inventory'
      }
    ]
  };
}

exports.getAllSarees = (req, res) => {
  const db = readDB();
  const { collection, search } = req.query;

  let result = (db.sarees || []).map(formatSaree);

  if (collection && collection !== 'All') {
    result = result.filter(s => s.collection && s.collection.toLowerCase().includes(collection.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s => 
      (s.name && s.name.toLowerCase().includes(q)) || 
      (s.fabric && s.fabric.toLowerCase().includes(q)) ||
      (s.collection && s.collection.toLowerCase().includes(q))
    );
  }

  return res.json({ success: true, count: result.length, sarees: result });
};

exports.getSareeById = (req, res) => {
  const db = readDB();
  const saree = (db.sarees || []).find(s => String(s.id) === String(req.params.id));
  if (!saree) {
    return res.status(404).json({ success: false, message: 'Saree product not found.' });
  }
  return res.json({ success: true, saree: formatSaree(saree) });
};

exports.createSaree = (req, res) => {
  const { name, collection, fabric, price, originalPrice, tag, hue, image, origin, weaveTime, stock, description } = req.body;
  
  if (!name || price === undefined || !fabric) {
    return res.status(400).json({ success: false, message: 'Name, price, and fabric are required fields.' });
  }

  const db = readDB();
  
  // Extract user details from authenticated JWT token (verifyToken middleware)
  const currentUser = req.user ? {
    id: req.user.id || 'u-admin-1',
    name: req.user.name || (req.user.email ? req.user.email.split('@')[0] : 'Store Staff'),
    email: req.user.email || 'admin@sapnasarees.com',
    role: (req.user.role || 'ADMIN').toUpperCase()
  } : {
    id: 'u-admin-1',
    name: 'Aarav Gupta (Admin)',
    email: 'admin@sapnasarees.com',
    role: 'ADMIN'
  };

  const initialStock = stock !== undefined && stock !== '' ? Number(stock) : 10;
  const now = new Date().toISOString();

  const newSaree = {
    id: `saree_${Date.now()}`,
    name,
    collection: collection || 'Banarasi Heritage',
    fabric,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.25),
    tag: tag || 'New Arrival',
    hue: hue || '#6B1E2E',
    image: image || '/images/banarasi_red.png',
    origin: origin || 'Varanasi, Uttar Pradesh',
    weaveTime: weaveTime || '14 Days Handloom',
    silkMark: true,
    stock: initialStock,
    description: description || 'Handcrafted luxury saree.',
    createdBy: { ...currentUser, timestamp: now },
    updatedBy: { ...currentUser, timestamp: now },
    auditLog: [
      {
        action: 'CREATED',
        updatedBy: currentUser,
        timestamp: now,
        details: `Saree '${name}' added to catalog with stock ${initialStock} and price ₹${price}.`
      }
    ],
    inventoryLog: [
      {
        previousStock: 0,
        newStock: initialStock,
        change: initialStock,
        updatedBy: currentUser,
        timestamp: now,
        reason: 'Initial Catalog Setup'
      }
    ]
  };

  if (!db.sarees) db.sarees = [];
  db.sarees.push(newSaree);
  writeDB(db);

  return res.status(201).json({ 
    success: true, 
    message: 'New Saree added to catalog with picture and user tracking details.', 
    saree: newSaree 
  });
};

exports.updateSaree = (req, res) => {
  const db = readDB();
  const index = (db.sarees || []).findIndex(s => String(s.id) === String(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Saree product not found.' });
  }

  const existingSaree = formatSaree(db.sarees[index]);
  const now = new Date().toISOString();

  // Extract user details from authenticated JWT session
  const currentUser = req.user ? {
    id: req.user.id || 'u-admin-1',
    name: req.user.name || (req.user.email ? req.user.email.split('@')[0] : 'Store Staff'),
    email: req.user.email || 'admin@sapnasarees.com',
    role: (req.user.role || 'ADMIN').toUpperCase()
  } : {
    id: 'u-admin-1',
    name: 'Aarav Gupta (Admin)',
    email: 'admin@sapnasarees.com',
    role: 'ADMIN'
  };

  const updatedStock = req.body.stock !== undefined ? Number(req.body.stock) : existingSaree.stock;
  const stockChanged = updatedStock !== existingSaree.stock;

  const newInventoryLog = [...(existingSaree.inventoryLog || [])];
  if (stockChanged) {
    newInventoryLog.unshift({
      previousStock: existingSaree.stock,
      newStock: updatedStock,
      change: updatedStock - existingSaree.stock,
      updatedBy: currentUser,
      timestamp: now,
      reason: req.body.updateReason || 'Inventory Stock Adjustment'
    });
  }

  const updatedAuditLog = [...(existingSaree.auditLog || [])];
  const changesSummary = [];
  if (req.body.name && req.body.name !== existingSaree.name) changesSummary.push(`Name changed to '${req.body.name}'`);
  if (req.body.price !== undefined && Number(req.body.price) !== existingSaree.price) changesSummary.push(`Price changed to ₹${req.body.price}`);
  if (stockChanged) changesSummary.push(`Stock changed from ${existingSaree.stock} to ${updatedStock}`);
  if (req.body.image && req.body.image !== existingSaree.image) changesSummary.push('Product image updated');

  updatedAuditLog.unshift({
    action: stockChanged && changesSummary.length === 1 ? 'INVENTORY_UPDATE' : 'CATALOG_UPDATE',
    updatedBy: currentUser,
    timestamp: now,
    details: changesSummary.length > 0 ? changesSummary.join(' | ') : 'Updated saree details'
  });

  const updatedSaree = {
    ...existingSaree,
    ...req.body,
    stock: updatedStock,
    price: req.body.price !== undefined ? Number(req.body.price) : existingSaree.price,
    originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : existingSaree.originalPrice,
    image: req.body.image || existingSaree.image,
    updatedBy: { ...currentUser, timestamp: now },
    auditLog: updatedAuditLog,
    inventoryLog: newInventoryLog
  };

  db.sarees[index] = updatedSaree;
  writeDB(db);

  return res.json({ 
    success: true, 
    message: 'Saree catalog & inventory details updated successfully.', 
    saree: updatedSaree 
  });
};

exports.deleteSaree = (req, res) => {
  const db = readDB();
  const initialLength = (db.sarees || []).length;
  const filtered = (db.sarees || []).filter(s => String(s.id) !== String(req.params.id));
  
  if (filtered.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Saree product not found.' });
  }

  db.sarees = filtered;
  writeDB(db);

  return res.json({ success: true, message: 'Saree removed from catalog.' });
};
