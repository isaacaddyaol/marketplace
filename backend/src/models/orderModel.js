// backend/src/models/orderModel.js
const db = require('./db'); // Your pg Pool connection

const Order = {
  // Method to create an order and its items in a transaction
  async createOrderWithItems(customerId, items, orderTotal) {
    const client = await db.getPool().connect(); // Get a client from the pool for transaction

    try {
      await client.query('BEGIN'); // Start transaction

      // 1. Insert into Orders table
      const orderQueryText = `
        INSERT INTO Orders (customer_id, order_total, payment_method)
        VALUES ($1, $2, $3)
        RETURNING order_id, order_date;
        -- Sticking to current schema: order_id, customer_id, order_date, order_total, payment_method
        -- payment_method has DEFAULT 'PayPal'
      `;
      const orderValues = [customerId, orderTotal, 'PayPal']; // Explicitly using 'PayPal' or could be passed
      const orderResult = await client.query(orderQueryText, orderValues);
      const newOrder = orderResult.rows[0];
      const { order_id, order_date } = newOrder;


      // 2. Insert into Order_Items table for each item
      const orderItemQueryText = `
        INSERT INTO Order_Items (order_id, product_id, quantity, order_price)
        VALUES ($1, $2, $3, $4);
      `;
      for (const item of items) {
        // IMPORTANT: item.price should be the price of the product AT THE TIME OF ORDER
        if (!item.product_id || item.quantity === undefined || item.price === undefined) {
            throw new Error('Invalid item data: product_id, quantity, and price are required for each item.');
        }
        const itemValues = [order_id, item.product_id, item.quantity, item.price];
        await client.query(orderItemQueryText, itemValues);
      }

      await client.query('COMMIT'); // Commit transaction

      return {
        order_id,
        customer_id: customerId,
        order_date,
        order_total: orderTotal,
        items_count: items.length,
      };

    } catch (error) {
      await client.query('ROLLBACK'); // Rollback transaction on error
      console.error('Error creating order with items:', error);
      if (error.message.startsWith('Invalid item data')) throw error; // Propagate validation error
      // Check for FK violations specifically, e.g., if a product_id doesn't exist
      // The constraint name might vary, check your DB schema for exact name if issues arise.
      if (error.code === '23503' && error.constraint && (error.constraint.includes('order_items_product_id_fkey') || error.constraint.includes('Products_pkey'))) {
        // Extracting product ID from detail might be too complex/unreliable. Generic message is safer.
        throw new Error(`One or more products in the order do not exist or are invalid.`);
      }
      throw new Error('Failed to create order in database.'); // Generic error for other DB issues
    } finally {
      client.release(); // Release client back to the pool
    }
  }
  // Future methods: findUserOrders, findOrderById etc.
};

module.exports = Order;
