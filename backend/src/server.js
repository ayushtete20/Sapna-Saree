// backend/src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Global Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes Definition
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sarees', require('./routes/sareeRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/revenue', require('./routes/revenueRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Sapna Sarees PostgreSQL + Prisma RBAC Backend Engine',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found.' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.'
  });
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(` Sapna Sarees Backend Engine running on port ${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});
