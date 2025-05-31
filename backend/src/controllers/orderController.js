// backend/src/controllers/orderController.js
const Order = require('../models/orderModel');
const Product = require('../models/productModel'); // To verify prices if needed (future enhancement)

exports.createOrder = async (req, res) => {
  const customerId = req.user.userId; // From authMiddleware
  const { items, clientOrderTotal } = req.body; // items: [{ product_id, name, quantity, price (at time of cart) }]

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart items are required.' });
  }
  if (clientOrderTotal === undefined || isNaN(parseFloat(clientOrderTotal))) {
    return res.status(400).json({ message: 'Order total is required.' });
  }

  try {
    // **Security Enhancement (Future):**
    // Fetch product prices from DB and recalculate total on backend.
    // For this iteration, we use client-provided prices and total.

    const orderTotal = parseFloat(clientOrderTotal);
    const itemsForDb = items.map(item => {
        // Basic validation for each item
        if (!item.product_id || item.quantity === undefined || item.price === undefined ||
            isNaN(parseInt(item.product_id)) || isNaN(parseInt(item.quantity)) || isNaN(parseFloat(item.price))) {
            throw new Error('Invalid item data: product_id, quantity, and price must be valid numbers for each item.');
        }
        return {
            product_id: parseInt(item.product_id),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price) // This is price per unit at time of order
        };
    });


    const newOrder = await Order.createOrderWithItems(customerId, itemsForDb, orderTotal);
    res.status(201).json({ message: 'Order created successfully!', order: newOrder });

  } catch (error) {
    console.error('Order creation controller error:', error);
    // Handle specific errors from the model or validation
    if (error.message.startsWith('Invalid item data') ||
        error.message.startsWith('One or more products in the order do not exist') ||
        error.message.startsWith('Failed to create order')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating order.' });
  }
};
