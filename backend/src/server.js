const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Mandatory Environment Variable Security Check
if (!process.env.JWT_SECRET) {
  console.error('[FATAL SECURITY ERROR] Missing JWT_SECRET environment variable! Stopping server boot.');
  process.exit(1);
}

const apiRoutes = require('./routes');
const { globalErrorHandler, NotFoundError } = require('./middlewares/error.middleware');
const { getPool } = require('./config/db.config');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration - Fixed SEC-005
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((o) => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser clients (Postman, curl, server-to-server) or matched origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Domain '${origin}' không có quyền truy cập API (CORS Violation).`));
    }
  },
  credentials: true,
}));

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10),
  message: { success: false, message: 'Thao tác quá nhanh, vui lòng thử lại sau ít phút.' },
});
app.use('/api/', limiter);

// Strict Rate Limiter for Login (SEC-007)
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Max 5 login attempts per minute per IP
  message: { success: false, message: 'Thử đăng nhập quá nhiều lần. Vui lòng đợi 1 phút trước khi thử lại.' },
});
app.use('/api/v1/auth/login', loginLimiter);

// Body Parsers
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Serve static images (Uploads & Cake directory)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.join(__dirname, '../../Cake')));

// API Routes
app.use('/api/v1', apiRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    message: 'Cake Ordering API Gateway running smoothly with SQL Server Stored Procedures!',
  });
});

// 404 Route Catch-all
app.use((req, res, next) => {
  next(new NotFoundError(`Đường dẫn '${req.originalUrl}' không tồn tại trên hệ thống API.`));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`[Node.js API Server] Running on http://localhost:${PORT}`);
  console.log(`[Health Check] http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
  
  try {
    await getPool();
  } catch (err) {
    console.warn('[SQL Server Warning] Could not connect on boot. Ensure SQL Server is running on port 1433.');
  }
});

module.exports = app;
