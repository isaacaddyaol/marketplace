// backend/src/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', categoryController.getAllCategories);

module.exports = router;
