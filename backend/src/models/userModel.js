// backend/src/models/userModel.js
const db = require('./db'); // This now refers to the real pg Pool connection
const bcrypt = require('bcryptjs');

const User = {
  async findByEmail(email) {
    const queryText = 'SELECT * FROM Customers WHERE email = $1';
    try {
      const { rows } = await db.query(queryText, [email]);
      return rows[0]; // Returns the user object or undefined if not found
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  async findById(id) { // Added for completeness, might be useful later
    const queryText = 'SELECT customer_id, name, email, contact_information FROM Customers WHERE customer_id = $1';
    try {
      const { rows } = await db.query(queryText, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  async create({ name, email, password, contactInformation }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText = `
      INSERT INTO Customers (name, email, password, contact_information)
      VALUES ($1, $2, $3, $4)
      RETURNING customer_id, name, email, contact_information;
    `;
    // contactInformation can be null or a string
    const values = [name, email, hashedPassword, contactInformation || null];
    try {
      const { rows } = await db.query(queryText, values);
      return rows[0]; // Returns the newly created user (without password)
    } catch (error) {
      console.error('Error creating user:', error);
      // Check for unique constraint violation (e.g., email already exists)
      if (error.code === '23505') { // PostgreSQL unique violation error code
        throw new Error('User with this email already exists.');
      }
      throw error;
    }
  },

  // Added method to find seller profile
  async findSellerProfileByCustomerId(customerId) {
    const customer = await User.findById(customerId); // Use User.findById to get customer's email
    if (!customer || !customer.email) {
      console.log(`No customer found or customer email missing for customerId: ${customerId}`);
      return null;
    }

    const queryText = 'SELECT seller_id FROM Sellers WHERE email = $1';
    try {
      console.log(`Querying Sellers table for email: ${customer.email}`);
      const { rows } = await db.query(queryText, [customer.email]);
      if (rows.length === 0) {
        console.log(`No seller profile found for email: ${customer.email}`);
      }
      return rows[0]; // returns { seller_id: X } or undefined
    } catch (error) {
      console.error(`Error finding seller by email (${customer.email}):`, error);
      throw error;
    }
  }
};

module.exports = User;
