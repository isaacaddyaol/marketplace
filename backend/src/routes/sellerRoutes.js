// backend/src/routes/sellerRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); // Contains getSellerProducts
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET api/seller/products
// @desc    Get all products for the authenticated seller
// @access  Private
router.get('/products', authMiddleware, productController.getSellerProducts);

// Future seller-specific routes can go here (e.g., managing seller profile)

module.exports = router;
