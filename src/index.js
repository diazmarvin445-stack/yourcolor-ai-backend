const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const generateRoutes = require('./routes/generate');
const quotaRoutes = require('./routes/quota');
const webhookRoutes = require('./routes/webhook');
const errorHandler = require('./middleware/errorHandler');
const { initDatabase } = require('./services/usageQuota');

const app = express();

// Inicializar base de datos
initDatabase();

// Logging
app.use(morgan('combined'));

// CORS
app.use(cors({
  origin: config.allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Body parser
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    success: false,
    error: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.'
  }
});
app.use('/api/', limiter);

// Timeout para requests largos (DALL-E puede tardar)
app.use((req, res, next) => {
  req.setTimeout(30000);
  res.setTimeout(30000);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', generateRoutes);
app.use('/api', quotaRoutes);

// Webhook con raw body para verificacion HMAC
app.use('/api/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  // Guardar raw body para verificacion de firma
  req.rawBody = req.body.toString('utf8');
  req.body = JSON.parse(req.rawBody);
  next();
}, webhookRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
