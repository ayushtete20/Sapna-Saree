// backend/src/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Global Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Sapna Sarees PostgreSQL + Prisma RBAC Backend Engine',
    timestamp: new Date().toISOString()
  });
});

// API Routes Definition
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sarees', require('./routes/sareeRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/revenue', require('./routes/revenueRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));

// Production Static Distribution Directories
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
const dashboardDist = path.resolve(__dirname, '../../dashboard/dist');
const rootStaticDir = path.resolve(__dirname, '../../');

// Serve Dashboard Build at /dashboard
if (fs.existsSync(dashboardDist)) {
  app.use('/dashboard', express.static(dashboardDist));
  app.get(['/dashboard', '/dashboard/*'], (req, res) => {
    res.sendFile(path.join(dashboardDist, 'index.html'));
  });
}

// Serve Storefront Build at Root /
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  
  // Serve public images
  if (fs.existsSync(path.join(rootStaticDir, 'images'))) {
    app.use('/images', express.static(path.join(rootStaticDir, 'images')));
  }

  // SPA fallback for storefront (excluding /api routes)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/dashboard')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Fallback to static root HTML/CSS/JS luxury website if dist not yet built
  app.use(express.static(rootStaticDir));
}

// 404 Route Handler for API endpoints
app.use('/api/*', (req, res) => {
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
  console.log(` Storefront: http://localhost:${PORT}/`);
  console.log(` Dashboard:  http://localhost:${PORT}/dashboard/`);
  console.log(` Health:     http://localhost:${PORT}/api/health`);
  console.log(`===================================================`);
});
