const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // null = global
  name: { type: String, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  color: { type: String }
});

module.exports = mongoose.model('Category', categorySchema);