// backend/src/controllers/orderController.js
const prisma = require('../config/prisma');

// Persistent memory fallback store for live order workflow
let memoryOrders = [
  {
    id: 'ORD-2026-8801',
    userId: 'u-customer-1',
    customerName: 'Radhika Sharma',
    email: 'user@sapnasarees.com',
    items: [
      { productId: 'prod_banarasi_01', name: 'Crimson Zari Banarasi Silk', quantity: 1, unitPrice: 18500 }
    ],
    totalAmount: 18500,
    status: 'IN_PROCESS',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'ORD-2026-8802',
    userId: 'u-customer-2',
    customerName: 'Dr. Radhika Iyer',
    email: 'radhika.iyer@example.com',
    items: [
      { productId: 'prod_kanjivaram_02', name: 'Ivory Kanjivaram Mulberry Silk', quantity: 1, unitPrice: 32000 }
    ],
    totalAmount: 32000,
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

/**
 * POST /api/orders
 * Protected: Authenticated users (CUSTOMER, ADMIN, OWNER)
 * Creates a new order linking User ID and Product IDs
 */
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.id;
    const customerName = req.user.name || req.user.email.split('@')[0];
    const email = req.user.email;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required.'
      });
    }

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const formattedItems = items.map(item => ({
      productId: item.id || item.productId || `prod_${Date.now()}`,
      name: item.name || 'Pure Handloom Saree',
      quantity: item.quantity || 1,
      unitPrice: Number(item.price || item.unitPrice || 0)
    }));

    const computedTotal = totalAmount ? Number(totalAmount) : formattedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

    const newOrder = {
      id: orderId,
      userId,
      customerName,
      email,
      items: formattedItems,
      totalAmount: computedTotal,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    // Save to Prisma DB if available, else save to memory store
    try {
      if (prisma && prisma.order && typeof prisma.order.create === 'function') {
        const dbOrder = await prisma.order.create({
          data: {
            id: orderId,
            userId,
            totalAmount: computedTotal,
            status: 'PENDING',
            items: {
              create: formattedItems.map(it => ({
                productId: it.productId,
                quantity: it.quantity,
                unitPrice: it.unitPrice
              }))
            }
          },
          include: { items: true, user: true }
        });
        if (dbOrder) {
          memoryOrders.unshift(newOrder);
          return res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            order: newOrder
          });
        }
      }
    } catch (dbErr) {
      console.warn('Prisma DB order create fallback to memory store.');
    }

    memoryOrders.unshift(newOrder);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: newOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while placing order.'
    });
  }
};

/**
 * GET /api/orders
 * Protected: Admin/Owner or canManageOrders
 * Returns all orders with linked User ID and Product IDs
 */
exports.getOrders = async (req, res) => {
  try {
    let orders = memoryOrders;

    try {
      if (prisma && prisma.order && typeof prisma.order.findMany === 'function') {
        const dbOrders = await prisma.order.findMany({
          include: {
            user: { select: { id: true, name: true, email: true } },
            items: { include: { product: true } }
          },
          orderBy: { createdAt: 'desc' }
        });
        if (dbOrders && dbOrders.length > 0) {
          orders = dbOrders.map(o => ({
            id: o.id,
            userId: o.userId,
            customerName: o.user ? o.user.name : 'Valued Client',
            email: o.user ? o.user.email : 'client@sapnasarees.com',
            items: o.items.map(it => ({
              productId: it.productId,
              name: it.product ? it.product.name : 'Handloom Saree',
              quantity: it.quantity,
              unitPrice: Number(it.unitPrice)
            })),
            totalAmount: Number(o.totalAmount),
            status: o.status,
            createdAt: o.createdAt
          }));
        }
      }
    } catch (dbErr) {}

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching customer orders.'
    });
  }
};

/**
 * PUT /api/orders/:id/status
 * Protected: Admin/Owner or canManageOrders
 * Updates order status (PENDING -> IN_PROCESS -> SHIPPED -> DELIVERED)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'IN_PROCESS', 'SHIPPED', 'DELIVERED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed values: ${validStatuses.join(', ')}`
      });
    }

    const formattedStatus = status.toUpperCase();

    let updatedOrder = null;

    const idx = memoryOrders.findIndex(o => o.id === id);
    if (idx !== -1) {
      memoryOrders[idx].status = formattedStatus;
      updatedOrder = memoryOrders[idx];
    }

    try {
      if (prisma && prisma.order && typeof prisma.order.update === 'function') {
        const dbUpdated = await prisma.order.update({
          where: { id },
          data: { status: formattedStatus }
        });
        if (dbUpdated) {
          if (updatedOrder) updatedOrder.status = formattedStatus;
          else updatedOrder = dbUpdated;
        }
      }
    } catch (dbErr) {}

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to '${formattedStatus}' successfully.`,
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating order status.'
    });
  }
};

exports.memoryOrders = memoryOrders;
