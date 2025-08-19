const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getTransactions, addTransaction, updateTransaction, deleteTransaction, getStats } = require('../controllers/transactionController');

router.get('/', protect, getTransactions);
router.post('/', protect, addTransaction);
router.put('/:id', protect, updateTransaction);
router.delete('/:id', protect, deleteTransaction);
router.get('/stats/summary', protect, getStats);

module.exports = router;