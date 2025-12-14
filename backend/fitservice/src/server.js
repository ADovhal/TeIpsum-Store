const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const renderRoutes = require('./routes/render');

const app = express();
const PORT = process.env.SERVICE_SERVER_PORT || 8087;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/static', express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api', renderRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'fitservice' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fit Service running on port ${PORT}`);
});

