const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api', productRoutes);

// Optional: Serve static frontend files if combining
app.use(express.static(path.join(__dirname, '../templates')));
app.use('/static', express.static(path.join(__dirname, '../static')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
