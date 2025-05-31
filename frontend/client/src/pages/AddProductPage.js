import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

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

const inputGroupStyle = {
  marginBottom: '15px'
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: 'bold',
  fontFamily: 'var(--body-font)',
  color: 'var(--text-color)'
};

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/categories');
        setCategories(res.data);
        // if (res.data.length > 0) {
        //   setCategoryId(res.data[0].category_id); // Optionally pre-select first category
        // }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories for selection.');
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user) {
      setError('You must be logged in to add a product.');
      return;
    }
    if (!name || !description || !price || !categoryId) {
        setError('Please fill in all required fields: Name, Description, Price, and Category.');
        return;
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        setError('Price must be a positive number.');
        return;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category_id: parseInt(categoryId),
      location: location || null
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        navigate('/login');
        return;
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      const res = await axios.post('http://localhost:5001/api/products', productData, config);
      setSuccess(`Product "${res.data.name}" added successfully!`);
      // Clear form
      setName(''); setDescription(''); setPrice(''); setCategoryId(''); setLocation('');
      // Optionally navigate or give time to read success message
      // setTimeout(() => navigate('/products'), 2000);
    } catch (err) {
      console.error('Failed to add product:', err.response ? err.response.data : err);
      setError(err.response && err.response.data && err.response.data.message
               ? err.response.data.message
               : 'Failed to add product. Please try again.');
    }
  };

  if (authLoading) {
    return <p>Loading user information...</p>;
  }
  // Redirect if not logged in (though ProtectedRoute should also handle this)
  // This immediate client-side redirect can be helpful but ProtectedRoute is more robust
  if (!user && !authLoading) {
     navigate('/login?message=Please login to add a product');
     return null;
  }


  return (
    <div style={{padding: '20px'}}>
      <h2 style={{textAlign: 'center', color: 'var(--primary-color)'}}>Add New Product</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

        <div style={inputGroupStyle}>
          <label htmlFor="name" style={labelStyle}>Product Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="description" style={labelStyle}>Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" style={{width: 'calc(100% - 22px)', padding: '10px', fontFamily: 'var(--body-font)'}}></textarea>
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="price" style={labelStyle}>Price ($):</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" min="0.01" />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="category" style={labelStyle}>Category:</label>
          <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required style={{width: '100%', padding: '10px', fontFamily: 'var(--body-font)'}}>
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="location" style={labelStyle}>Location (Optional):</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <button type="submit" style={{marginTop: '10px'}}>Add Product</button>
      </form>
    </div>
  );
};
export default AddProductPage;
