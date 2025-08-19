const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currency: { type: String, default: process.env.DEFAULT_CURRENCY || 'PKR' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);