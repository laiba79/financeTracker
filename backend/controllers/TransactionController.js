const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
  res.json(transactions);
};

const addTransaction = async (req, res) => {
  const { type, category, amount, date, paymentMethod, description } = req.body;
  if (!type || !category || amount == null) return res.status(400).json({ message: 'Type, category and amount required' });

  const tx = await Transaction.create({
    user: req.user._id,
    type,
    category,
    amount,
    date,
    paymentMethod,
    description
  });
  res.status(201).json(tx);
};

const updateTransaction = async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  if (tx.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

  const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

const deleteTransaction = async (req, res) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) return res.status(404).json({ message: 'Transaction not found' });
  if (tx.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

  await tx.deleteOne();
  res.json({ message: 'Transaction removed' });
};

// simple summary
const getStats = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id });
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  res.json({ totalIncome, totalExpense, balance: totalIncome - totalExpense });
};

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction, getStats };