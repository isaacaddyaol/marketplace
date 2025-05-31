// backend/src/models/productModel.js
const db = require('./db');

const Product = {
  // ... existing findAll, findById, create, findBySellerId, update methods ...
  async findAll() {
    const queryText = `
      SELECT
        p.product_id, p.name, p.description, p.price, p.location,
        p.category_id, c.name AS category_name,
        p.seller_id, s.name AS seller_name
      FROM Products p
      JOIN Categories c ON p.category_id = c.category_id
      JOIN Sellers s ON p.seller_id = s.seller_id;
    `;
    try {
      const { rows } = await db.query(queryText);
      return rows;
    } catch (error) {
      console.error('Error finding all products:', error);
      throw error;
    }
  },

  async findById(id) {
    const queryText = `
      SELECT
        p.product_id, p.name, p.description, p.price, p.location,
        p.category_id, c.name AS category_name,
        p.seller_id, s.name AS seller_name, s.email AS seller_email, s.contact_information AS seller_contact
      FROM Products p
      JOIN Categories c ON p.category_id = c.category_id
      JOIN Sellers s ON p.seller_id = s.seller_id
      WHERE p.product_id = $1;
    `;
    try {
      const { rows } = await db.query(queryText, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding product by ID:', error);
      throw error;
    }
  },

  async create({ name, description, price, category_id, location, seller_id }) {
    const queryText = `
      INSERT INTO Products (name, description, price, category_id, location, seller_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [name, description, parseFloat(price), parseInt(category_id), location, parseInt(seller_id)];
    try {
      const { rows } = await db.query(queryText, values);
      return rows[0];
    } catch (error) {
      console.error('Error creating product:', error);
      if (error.code === '23505') {
        throw new Error('Product with this name already exists.');
      }
      if (error.code === '23503') {
        console.error(`Foreign key violation: code=${error.code}, constraint=${error.constraint}, detail=${error.detail}`);
        throw new Error('Invalid category or seller specified.');
      }
      throw error;
    }
  },

  async findBySellerId(seller_id) {
    const queryText = `
      SELECT
        p.product_id, p.name, p.description, p.price, p.location,
        p.category_id, c.name AS category_name,
        p.seller_id, s.name AS seller_name
      FROM Products p
      JOIN Categories c ON p.category_id = c.category_id
      JOIN Sellers s ON p.seller_id = s.seller_id
      WHERE p.seller_id = $1
      ORDER BY p.name ASC;
    `;
    try {
      const { rows } = await db.query(queryText, [seller_id]);
      return rows;
    } catch (error) {
      console.error('Error finding products by seller ID:', error);
      throw error;
    }
  },

  async update(productId, productData) {
    const { name, description, price, category_id, location } = productData;
    const fieldsToUpdate = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      fieldsToUpdate.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      fieldsToUpdate.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (price !== undefined) {
      fieldsToUpdate.push(`price = $${paramIndex++}`);
      values.push(parseFloat(price));
    }
    if (category_id !== undefined) {
      fieldsToUpdate.push(`category_id = $${paramIndex++}`);
      values.push(parseInt(category_id));
    }
    if (location !== undefined) {
      fieldsToUpdate.push(`location = $${paramIndex++}`);
      values.push(location);
    }

    if (fieldsToUpdate.length === 0) {
      throw new Error("No valid fields provided for update.");
    }

    values.push(parseInt(productId));

    const queryText = `
      UPDATE Products
      SET ${fieldsToUpdate.join(', ')}
      WHERE product_id = $${paramIndex}
      RETURNING *;
    `;

    try {
      const { rows } = await db.query(queryText, values);
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    } catch (error) {
      console.error('Error updating product:', error);
      if (error.code === '23505') {
        throw new Error('Product name already exists or another unique constraint violated.');
      }
      if (error.code === '23503') {
        console.error(`Foreign key violation: code=${error.code}, constraint=${error.constraint}, detail=${error.detail}`);
        throw new Error('Invalid category specified for update.');
      }
      throw error;
    }
  },

  // New method
  async remove(productId) { // Renamed to 'remove' to avoid JS reserved keyword 'delete'
    const queryText = `
      DELETE FROM Products
      WHERE product_id = $1
      RETURNING *; // Returns the deleted product, or empty if not found
    `;
    try {
      const { rows } = await db.query(queryText, [productId]);
      if (rows.length === 0) {
        return null; // Product not found
      }
      return rows[0]; // Returns the details of the deleted product
    } catch (error) {
      console.error('Error deleting product from database:', error);
      // Check for foreign key constraint violation (e.g., product is in an order)
      if (error.code === '23503') { // PostgreSQL foreign key violation error code
        throw new Error('Product cannot be deleted because it is part of an existing order or other dependency.');
      }
      throw error;
    }
  }
};
module.exports = Product;
