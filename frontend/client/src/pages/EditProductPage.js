import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Re-use styles from AddProductPage or define new ones
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '600px',
  margin: '20px auto',
  padding: '20px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  backgroundColor: '#fff'
};
const inputGroupStyle = { marginBottom: '15px' };
const labelStyle = { marginBottom: '5px', fontWeight: 'bold', fontFamily: 'var(--body-font)', color: 'var(--text-color)' };


const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    location: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // For product data loading
  const [formError, setFormError] = useState(''); // Renamed from error to avoid conflict
  const [formSuccess, setFormSuccess] = useState(''); // Renamed from success

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        // setFormError('Failed to load categories for selection.'); // Minor error, form can still work
      }
    };
    fetchCategories();
  }, []);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      // Ensure user is loaded before trying to fetch product details if auth is needed for the fetch
      // For now, product details endpoint is public, so authLoading might not be strictly needed here
      // but if it were a protected seller-only fetch for their own product details, it would be.
      if (authLoading) return;

      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5001/api/products/${productId}`);
        const { name, description, price, category_id, location } = res.data;
        setProductData({ name, description, price: String(price), category_id: String(category_id), location: location || '' });
      } catch (err) {
        console.error('Failed to fetch product details:', err.response ? err.response.data : err);
        setFormError('Failed to load product details. Product may not exist or an error occurred.');
      } finally {
        setLoading(false);
      }
    };
    // Only fetch if user is resolved (or not needed for this specific fetch) and productId is present
    if (!authLoading && productId) {
        fetchProductDetails();
    }
  }, [productId, authLoading]); // Depend on authLoading to wait for user context if necessary

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!user) {
      setFormError('You must be logged in to update a product.');
      return;
    }
    if (!productData.name || !productData.description || !productData.price || !productData.category_id) {
        setFormError('Please fill in all required fields: Name, Description, Price, and Category.');
        return;
    }
    if (isNaN(parseFloat(productData.price)) || parseFloat(productData.price) <= 0) {
        setFormError('Price must be a positive number.');
        return;
    }

    const updatePayload = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        category_id: parseInt(productData.category_id),
        location: productData.location || null
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?message=Session expired. Please login again.');
        return;
      }
      const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };

      await axios.put(`http://localhost:5001/api/products/${productId}`, updatePayload, config);
      setFormSuccess('Product updated successfully!');
      setTimeout(() => navigate('/seller/products'), 1500); // Navigate back to My Products after a delay
    } catch (err) {
      console.error('Failed to update product:', err.response ? err.response.data : err);
      setFormError(err.response && err.response.data ? err.response.data.message : 'Failed to update product.');
    }
  };

  if (authLoading || loading) { // Combined loading state
    return <p>Loading product editor...</p>;
  }
  // This check might be redundant if ProtectedRoute is effective
  if (!user && !authLoading) {
     navigate('/login?message=Please login to edit products');
     return null;
  }
  // If there was an error fetching initial product data (e.g., product not found)
  if (formError && !productData.name && !loading) {
      return <p style={{color: 'red', textAlign: 'center', padding: '20px'}}>{formError}</p>
  }

  return (
    <div style={{padding: '20px'}}>
      <h2 style={{textAlign: 'center', color: 'var(--primary-color)'}}>Edit Product</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {formError && <p style={{ color: 'red', textAlign: 'center' }}>{formError}</p>}
        {formSuccess && <p style={{ color: 'green', textAlign: 'center' }}>{formSuccess}</p>}

        <div style={inputGroupStyle}>
          <label htmlFor="name" style={labelStyle}>Product Name:</label>
          <input type="text" id="name" name="name" value={productData.name} onChange={handleChange} required />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="description" style={labelStyle}>Description:</label>
          <textarea id="description" name="description" value={productData.description} onChange={handleChange} required rows="4" style={{width: 'calc(100% - 22px)', padding: '10px', fontFamily: 'var(--body-font)'}}></textarea>
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="price" style={labelStyle}>Price ($):</label>
          <input type="number" id="price" name="price" value={productData.price} onChange={handleChange} required step="0.01" min="0.01" />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="category_id" style={labelStyle}>Category:</label>
          <select id="category_id" name="category_id" value={productData.category_id} onChange={handleChange} required style={{width: '100%', padding: '10px', fontFamily: 'var(--body-font)'}}>
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="location" style={labelStyle}>Location (Optional):</label>
          <input type="text" id="location" name="location" value={productData.location} onChange={handleChange} />
        </div>
        <button type="submit" style={{marginTop: '10px'}}>Update Product</button>
        <button type="button" onClick={() => navigate('/seller/products')} style={{marginTop: '10px', backgroundColor: '#aaa'}}>Cancel</button>
      </form>
    </div>
  );
};
export default EditProductPage;
