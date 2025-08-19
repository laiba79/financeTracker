const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getBudgets, addBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');

router.get('/', protect, getBudgets);
router.post('/', protect, addBudget);
router.put('/:id', protect, updateBudget);
router.delete('/:id', protect, deleteBudget);

module.exports = router;