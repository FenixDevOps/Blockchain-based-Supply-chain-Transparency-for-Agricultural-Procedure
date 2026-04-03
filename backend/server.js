const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
connectDB();

const app = express();

// PERMISSIVE CORS for production debugging
app.use(cors()); 

app.use(express.json());

// API Routes
app.use('/api', productRoutes);

// Simple test endpoint to verify server is ALIVE without DB
app.get('/api/test', (req, res) => res.json({ message: "Backend is UP!" }));

// Serve scan.html for QR code mobile scanning
app.use(express.static(path.join(__dirname, '../templates')));

// Health check — useful for Render uptime monitoring
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ AgriChain API is live!`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
});
