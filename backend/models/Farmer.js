const mongoose = require('mongoose');

const farmerSchema = mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  certifications: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Farmer', farmerSchema);
