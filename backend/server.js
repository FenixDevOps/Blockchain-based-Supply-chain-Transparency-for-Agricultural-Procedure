const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
connectDB();

const app = express();

// CORS — allow local dev + Vercel production
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    /\.vercel\.app$/,           // any Vercel preview URL
    process.env.FRONTEND_URL,   // set in Render dashboard
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json());

// API Routes
app.use('/api', productRoutes);

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
