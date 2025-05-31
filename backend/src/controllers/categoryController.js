// backend/src/controllers/categoryController.js
const Category = require('../models/categoryModel');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching all categories:', error);
    res.status(500).json({ message: 'Server error while fetching categories.' });
  }
};
