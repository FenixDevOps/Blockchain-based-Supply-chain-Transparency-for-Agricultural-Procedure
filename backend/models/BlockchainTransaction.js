const mongoose = require('mongoose');

const blockchainTxSchema = mongoose.Schema({
  index: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  data: { type: Object, required: true },
  previousHash: { type: String, required: true },
  hash: { type: String, required: true },
  nonce: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BlockchainTransaction', blockchainTxSchema);
