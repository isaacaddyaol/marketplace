// backend/src/models/categoryModel.js
const db = require('./db');

const Category = {
  async findAll() {
    const queryText = 'SELECT * FROM Categories ORDER BY name ASC;';
    try {
      const { rows } = await db.query(queryText);
      return rows;
    } catch (error) {
      console.error('Error finding all categories:', error);
      throw error;
    }
  }
};
module.exports = Category;
