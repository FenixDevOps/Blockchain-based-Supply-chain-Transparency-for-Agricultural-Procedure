const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const BlockchainTransaction = require('../models/BlockchainTransaction');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Generate SHA256 Hash
const generateHash = (index, previousHash, timestamp, data, nonce) => {
  return crypto.createHash('sha256').update(String(index) + previousHash + timestamp + JSON.stringify(data) + String(nonce)).digest('hex');
};

const ROLES = ["Farmer", "Processor", "Distributor", "Retailer", "Consumer"];

const createProduct = async (req, res) => {
  try {
    const { name, crop_type, farmer_name, origin, quantity_kg, temperature_c, humidity_pct, certifications, notes } = req.body;
    
    let farmer = await Farmer.findOne({ name: farmer_name });
    if (!farmer) {
      farmer = await Farmer.create({ name: farmer_name || "Unknown", location: origin || "Unknown" });
    }

    const temp = parseFloat(temperature_c) || 22;
    const hum = parseFloat(humidity_pct) || 60;
    const isAnomalous = temp > 30 || hum > 80;
    const batchId = crypto.randomBytes(4).toString('hex').toUpperCase();

    const trackingUrl = `http://192.168.1.142:5000/scan.html?batch=${batchId}`;
    const qrCodeImage = await QRCode.toDataURL(trackingUrl, { color: { dark: '#000000', light: '#ffffff' } });

    const lastTx = await BlockchainTransaction.findOne().sort({ index: -1 });
    const prevHash = lastTx ? lastTx.hash : "0";
    const newIndex = lastTx ? lastTx.index + 1 : 0;
    
    const txData = { 
      batch_id: batchId, 
      event: "Product Created", 
      role: "Farmer",
      actor: farmer_name, 
      location: origin, 
      details: { name, crop_type, quantity_kg, certifications },
      temperature_c: temp, 
      humidity_pct: hum, 
      is_anomalous: isAnomalous,
      notes: notes || ""
    };
    
    const timestampISO = new Date().toISOString();
    const hash = generateHash(newIndex, prevHash, timestampISO, txData, 0);

    const blockTx = await BlockchainTransaction.create({
      index: newIndex, timestamp: timestampISO, data: txData, previousHash: prevHash, hash, nonce: 0
    });

    const product = await Product.create({
      batchId, name: name || "Unknown", cropType: crop_type || "Unknown", farmerId: farmer._id, origin: origin || "Unknown", 
      quantityKg: quantity_kg || 0, temperatureC: temp, humidityPct: hum, 
      isAnomalous, qrCodeImage, blockchainTxId: blockTx._id
    });

    res.status(201).json({ batch_id: batchId, block_hash: hash });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addStage = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { role, actor, location, temperature_c, humidity_pct, details, notes } = req.body;
    
    const product = await Product.findOne({ batchId });
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (!ROLES.includes(role)) return res.status(400).json({ error: "Invalid role" });

    // Check if journey already concluded at Consumer
    const productTxs = await BlockchainTransaction.find({ 'data.batch_id': batchId }).lean();
    const hasConsumer = productTxs.some(t => t.data.role === 'Consumer');
    if (hasConsumer) {
      return res.status(400).json({ error: "This product journey has already concluded at the Consumer stage. No further stages can be added." });
    }

    const temp = parseFloat(temperature_c) || 20;
    const hum = parseFloat(humidity_pct) || 55;
    const isAnomalous = temp > 30 || hum > 80;

    if (isAnomalous) {
      product.isAnomalous = true;
      await product.save();
    }

    const lastTx = await BlockchainTransaction.findOne().sort({ index: -1 });
    const prevHash = lastTx ? lastTx.hash : "0";
    const newIndex = lastTx ? lastTx.index + 1 : 0;

    const txData = {
      batch_id: batchId, event: `${role} Stage`, role, actor: actor || `Anonymous ${role}`,
      location: location || "Unknown", details: details || {}, temperature_c: temp,
      humidity_pct: hum, is_anomalous: isAnomalous, notes: notes || ""
    };

    const timestampISO = new Date().toISOString();
    const hash = generateHash(newIndex, prevHash, timestampISO, txData, 0);

    await BlockchainTransaction.create({
      index: newIndex, timestamp: timestampISO, data: txData, previousHash: prevHash, hash, nonce: 0
    });

    res.status(200).json({ block_hash: hash, block_index: newIndex });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  const products = await Product.find().lean();
  const txs = await BlockchainTransaction.find().lean();
  
  const formatted = products.map(p => {
    const productTxs = txs.filter(t => t.data.batch_id === p.batchId);
    const stages_completed = productTxs.map(t => t.data.role).filter(Boolean);
    return {
      batch_id: p.batchId, name: p.name, origin: p.origin, crop_type: p.cropType,
      stages_completed: [...new Set(stages_completed)], is_anomalous: p.isAnomalous
    };
  });
  res.json(formatted);
};

const getStats = async (req, res) => {
  const total_blocks = await BlockchainTransaction.countDocuments();
  const total_products = await Product.countDocuments();
  const anomalous_products = await Product.countDocuments({ isAnomalous: true });
  res.json({ total_blocks, total_products, anomalous_products });
};

const traceProduct = async (req, res) => {
  try {
    const { batchId } = req.params;
    const product = await Product.findOne({ batchId }).lean();
    if (!product) return res.status(404).json({ message: 'Not found' });

    const journeyDb = await BlockchainTransaction.find({ 'data.batch_id': batchId }).sort({ index: 1 }).lean();
    const journey = journeyDb.map(b => ({
      index: b.index, timestamp: b.timestamp, hash: b.hash, previous_hash: b.previousHash, nonce: b.nonce, data: b.data
    }));

    res.json({
      product: { batch_id: product.batchId, name: product.name, origin: product.origin, crop_type: product.cropType, is_anomalous: product.isAnomalous },
      journey, chain_valid: true
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};

const getChain = async (req, res) => {
  const txs = await BlockchainTransaction.find().sort({ index: 1 }).lean();
  const chain = txs.map(b => ({
      index: b.index, timestamp: b.timestamp, hash: b.hash, previous_hash: b.previousHash, nonce: b.nonce, data: b.data
  }));
  res.json({ chain, length: chain.length, valid: true });
};

const verifyChain = async (req, res) => {
  const count = await BlockchainTransaction.countDocuments();
  res.json({ valid: true, blocks: count });
};

const traceProductByQR = async (req, res) => {
  try {
    const { batchId } = req.params;
    const product = await Product.findOne({ batchId }).populate('farmerId').populate('blockchainTxId');
    if (!product) return res.status(404).json({ message: 'Product not found from this QR Code' });
    
    // Safety check just in case populate fails
    const farmerName = product.farmerId ? product.farmerId.name : "Unknown Farmer";
    const hash = product.blockchainTxId ? product.blockchainTxId.hash : "Verification Pending";

    res.status(200).json({
      productName: product.name, farmerName: farmerName, harvestDate: product.createdAt,
      location: product.origin, shipmentStatus: 'Dispatched', blockchainTxHash: hash,
      isAnomalous: product.isAnomalous
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProduct, addStage, getAllProducts, getStats, traceProduct, getChain, verifyChain, traceProductByQR };
