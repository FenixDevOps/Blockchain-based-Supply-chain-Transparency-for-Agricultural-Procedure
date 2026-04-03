const mongoose = require('mongoose');

const shipmentSchema = mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  status: { type: String, enum: ['In Transit', 'Delivered', 'Flagged'], default: 'In Transit' },
  blockchainTxId: { type: mongoose.Schema.Types.ObjectId, ref: 'BlockchainTransaction' }
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);
