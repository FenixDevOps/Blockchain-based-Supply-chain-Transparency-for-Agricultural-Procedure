const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  batchId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  cropType: { type: String, required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  origin: { type: String, required: true },
  quantityKg: { type: Number, required: true },
  temperatureC: { type: Number },
  humidityPct: { type: Number },
  isAnomalous: { type: Boolean, default: false },
  qrCodeImage: { type: String }, // Base64 string from QR generation
  blockchainTxId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlockchainTransaction' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
