// backend/src/controllers/productController.js
const prisma = require('../config/prisma');
const { readDB, writeDB } = require('../config/db');

/**
 * GET /api/products
 * Public catalog listing - unifies with db.json sarees store
 */
exports.getProducts = async (req, res) => {
  try {
    let products = [];
    try {
      if (prisma && prisma.product && typeof prisma.product.findMany === 'function') {
        products = await prisma.product.findMany({
          orderBy: { createdAt: 'desc' }
        });
      }
    } catch (dbErr) {
      console.warn('Prisma product query fallback to db.json');
    }

    if (!products || products.length === 0) {
      const db = readDB();
      products = (db.sarees || []).map(s => ({
        id: s.id,
        name: s.name,
        collection: s.collection || 'Banarasi Heritage',
        fabric: s.fabric,
        price: s.price,
        originalPrice: s.originalPrice,
        tag: s.tag,
        hue: s.hue,
        image: s.image,
        secondaryImage: s.secondaryImage || s.image,
        origin: s.origin || 'Varanasi',
        weaveTime: s.weaveTime || '14 Days Handloom',
        silkMark: s.silkMark !== undefined ? s.silkMark : true,
        stock: s.stock !== undefined ? s.stock : 10,
        stockQuantity: s.stock !== undefined ? s.stock : 10,
        description: s.description || 'Handcrafted luxury saree.',
        isBestseller: s.tag === 'Bestseller' || Boolean(s.isBestseller),
        createdAt: s.createdAt || new Date().toISOString()
      }));
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving products.'
    });
  }
};

/**
 * GET /api/products/:id
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const saree = (db.sarees || []).find(s => String(s.id) === String(id));
    if (saree) {
      return res.status(200).json({
        success: true,
        product: saree
      });
    }
    return res.status(404).json({
      success: false,
      message: 'Product not found.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error fetching product.'
    });
  }
};

/**
 * POST /api/products
 * Protected: requires canManageCatalog flag or Admin/Owner
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, collection, fabric, price, originalPrice, tag, hue, image, secondaryImage, origin, weaveTime, stock, description, isBestseller } = req.body;

    if (!name || price === undefined || !fabric) {
      return res.status(400).json({
        success: false,
        message: 'Name, fabric, and price are required fields.'
      });
    }

    const db = readDB();
    const newProduct = {
      id: `saree_${Date.now()}`,
      name: name.trim(),
      collection: collection || 'Banarasi Heritage',
      fabric: fabric.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.25),
      tag: tag || 'New Arrival',
      hue: hue || '#6B1E2E',
      image: image || '/images/banarasi_red.png',
      secondaryImage: secondaryImage || image || '/images/kanjivaram_ivory.png',
      origin: origin || 'Varanasi, Uttar Pradesh',
      weaveTime: weaveTime || '14 Days Handloom',
      silkMark: true,
      stock: stock !== undefined ? Number(stock) : 10,
      stockQuantity: stock !== undefined ? Number(stock) : 10,
      description: description || 'Handcrafted luxury saree directly from Indian master weavers.',
      isBestseller: Boolean(isBestseller),
      createdAt: new Date().toISOString()
    };

    if (!db.sarees) db.sarees = [];
    db.sarees.push(newProduct);
    writeDB(db);

    return res.status(201).json({
      success: true,
      message: 'New saree product added to catalog successfully. Product page generated!',
      product: newProduct,
      saree: newProduct
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while adding product.'
    });
  }
};

/**
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();
    const idx = (db.sarees || []).findIndex(s => String(s.id) === String(id));

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const existing = db.sarees[idx];
    const updated = {
      ...existing,
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
      stockQuantity: req.body.stock !== undefined ? Number(req.body.stock) : existing.stock,
      updatedAt: new Date().toISOString()
    };

    db.sarees[idx] = updated;
    writeDB(db);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error updating product.'
    });
  }
};
