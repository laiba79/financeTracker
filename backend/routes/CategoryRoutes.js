const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/', protect, getCategories);
router.post('/', protect, addCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;