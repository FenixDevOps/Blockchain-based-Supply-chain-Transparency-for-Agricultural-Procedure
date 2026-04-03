const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
connectDB();

const app = express();

// CORS — allow all origins (safe for a public read-only API)
app.use(cors());
app.use(express.json());

// Health / test endpoints (registered BEFORE the router)
app.get('/api/test', (req, res) => res.json({ message: 'Backend is UP!', timestamp: new Date().toISOString() }));
app.get('/health',   (_, res) => res.json({ status: 'ok',  timestamp: new Date().toISOString() }));

// API Routes
app.use('/api', productRoutes);

// Serve scan.html for QR code mobile scanning
app.use(express.static(path.join(__dirname, '../templates')));

// 404 fallback for unknown API routes
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ AgriChain API is live!`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
});
