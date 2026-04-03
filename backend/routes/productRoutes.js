const express = require('express');
const router = express.Router();
const { createProduct, addStage, getAllProducts, getStats, traceProduct, getChain, verifyChain, traceProductByQR } = require('../controllers/productController');

// Product Data
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.post('/products/:batchId/stage', addStage);
router.get('/products/:batchId/trace', traceProduct);

// Chain Data & Dashboard
router.get('/stats', getStats);
router.get('/chain', getChain);
router.get('/verify', verifyChain);

// QR Tracking Data - Point to full trace for rich mobile UI
router.get('/trace/:batchId', traceProduct);

module.exports = router;
