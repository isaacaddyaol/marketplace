// backend/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private (requires authentication)
router.post('/', authMiddleware, orderController.createOrder);

// Future order-related routes (e.g., get user's orders) will go here

module.exports = router;
