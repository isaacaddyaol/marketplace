// backend/src/controllers/productController.js
const Product = require('../models/productModel');
const User = require('../models/userModel');

// ... existing controller methods ...
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server error while fetching product.' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, category_id, location } = req.body;

  if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
  }
  const customerId = req.user.userId;

  if (!name || !description || price === undefined || category_id === undefined) {
    return res.status(400).json({ message: 'Missing required fields: name, description, price, category_id.' });
  }

  try {
    const sellerProfile = await User.findSellerProfileByCustomerId(customerId);

    if (!sellerProfile || !sellerProfile.seller_id) {
      return res.status(403).json({ message: 'Seller profile not found for this user. Please ensure you have a seller account setup.' });
    }
    const actual_seller_id = sellerProfile.seller_id;

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category_id: parseInt(category_id),
      location: location || null,
      seller_id: parseInt(actual_seller_id)
    };

    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.message === 'Product with this name already exists.' || error.message === 'Invalid category or seller specified.') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error while creating product.' });
  }
};

exports.getSellerProducts = async (req, res) => {
  if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
  }
  const customerId = req.user.userId;

  try {
    const sellerProfile = await User.findSellerProfileByCustomerId(customerId);

    if (!sellerProfile || !sellerProfile.seller_id) {
      return res.status(403).json({ message: 'Seller profile not found for this user. Please ensure you have a seller account setup.' });
    }
    const actual_seller_id = sellerProfile.seller_id;

    const products = await Product.findBySellerId(actual_seller_id);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching seller's products:", error);
    res.status(500).json({ message: "Server error while fetching seller's products." });
  }
};

exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const productDataToUpdate = req.body;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
  }
  const customerId = req.user.userId;

  if (Object.keys(productDataToUpdate).length === 0) {
    return res.status(400).json({ message: "No data provided for update." });
  }

  try {
    const sellerProfile = await User.findSellerProfileByCustomerId(customerId);
    if (!sellerProfile || !sellerProfile.seller_id) {
      return res.status(403).json({ message: 'User does not have a seller profile.' });
    }
    const actual_seller_id = sellerProfile.seller_id;

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    if (existingProduct.seller_id !== parseInt(actual_seller_id)) {
      return res.status(403).json({ message: 'You are not authorized to update this product.' });
    }

    const updatedProduct = await Product.update(productId, productDataToUpdate);
    if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found or update failed.'});
    }

    const productWithDetails = await Product.findById(productId);
    res.status(200).json(productWithDetails);

  } catch (error) {
    if (error.message.includes('No valid fields') ||
        error.message.includes('Product name already exists') ||
        error.message.includes('Invalid category specified')) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error while updating product.' });
  }
};

// New function to delete a product
exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  if (!req.user || !req.user.userId) {
    return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
  }
  const customerId = req.user.userId;

  try {
    // 1. Verify user is a seller
    const sellerProfile = await User.findSellerProfileByCustomerId(customerId);
    if (!sellerProfile || !sellerProfile.seller_id) {
      return res.status(403).json({ message: 'User does not have a seller profile.' });
    }
    const actual_seller_id = sellerProfile.seller_id;

    // 2. Fetch the product to check existence and ownership
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // 3. Verify ownership
    if (existingProduct.seller_id !== parseInt(actual_seller_id)) {
      return res.status(403).json({ message: 'You are not authorized to delete this product.' });
    }

    // 4. Perform the deletion
    const deletedProduct = await Product.remove(productId); // Using 'remove' from model
    if (!deletedProduct) { // Should be caught by existingProduct check, but good for safety
        return res.status(404).json({ message: 'Product not found or delete failed.'}); // Or 500 if delete failed unexpectedly
    }

    res.status(200).json({ message: 'Product deleted successfully.', product: deletedProduct });

  } catch (error) {
    if (error.message === 'Product cannot be deleted because it is part of an existing order or other dependency.') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error while deleting product.' });
  }
};
