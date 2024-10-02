const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  group: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, required: true },
  has_outrights: { type: Boolean, required: true }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
  