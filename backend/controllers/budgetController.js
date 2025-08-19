const Budget = require('../models/Budget');

const getBudgets = async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id });
  res.json(budgets);
};

const addBudget = async (req, res) => {
  const { category, amount, month, year } = req.body;
  if (!category || amount == null || !month || !year) return res.status(400).json({ message: 'All fields required' });

  const b = await Budget.create({ user: req.user._id, category, amount, month, year });
  res.status(201).json(b);
};

const updateBudget = async (req, res) => {
  const b = await Budget.findById(req.params.id);
  if (!b) return res.status(404).json({ message: 'Budget not found' });
  if (b.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

  const updated = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteBudget = async (req, res) => {
  const b = await Budget.findById(req.params.id);
  if (!b) return res.status(404).json({ message: 'Budget not found' });
  if (b.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

  await b.deleteOne();
  res.json({ message: 'Budget deleted' });
};

module.exports = { getBudgets, addBudget, updateBudget, deleteBudget };