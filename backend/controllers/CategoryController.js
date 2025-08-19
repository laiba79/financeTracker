const Category = require('../models/Category');

const getCategories = async (req, res) => {
  const categories = await Category.find({ $or: [{ user: req.user._id }, { user: null }] });
  res.json(categories);
};

const addCategory = async (req, res) => {
  const { name, type, color } = req.body;
  if (!name || !type) return res.status(400).json({ message: 'Name and type required' });

  const cat = await Category.create({ user: req.user._id, name, type, color });
  res.status(201).json(cat);
};

const updateCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  if (cat.user && cat.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteCategory = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  if (cat.user && cat.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

  await cat.deleteOne();
  res.json({ message: 'Category deleted' });
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };