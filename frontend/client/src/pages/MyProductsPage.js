import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

// Basic styling (can be expanded in CSS files)
const pageStyle = { padding: '20px', fontFamily: 'var(--body-font)' };
const titleStyle = { textAlign: 'center', color: 'var(--primary-color)', fontFamily: 'var(--header-font)', marginBottom: '30px' };
const productItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  marginBottom: '15px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
};
const productDetailsStyle = { flexGrow: 1 };
const actionsStyle = { display: 'flex', gap: '10px' };
const buttonStyle = (color = 'var(--secondary-color)') => ({
  padding: '8px 15px',
  border: 'none',
  borderRadius: '5px',
  color: 'white',
  backgroundColor: color,
  cursor: 'pointer',
  textDecoration: 'none',
  fontFamily: 'var(--body-font)'
});

const MyProductsPage = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchMyProducts = async () => {
    if (!user) {
      // This case should ideally be handled by ProtectedRoute, but as a fallback:
      setError("You must be logged in to view your products.");
      setLoading(false);
      navigate('/login?message=Please login to view your products');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login?message=Session expired. Please login again.');
        return;
      }
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5001/api/seller/products', config);
      setMyProducts(res.data);
    } catch (err) {
      console.error("Error fetching seller's products:", err.response ? err.response.data : err);
      setError(err.response && err.response.data ? err.response.data.message : 'Failed to fetch your products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) { // Only fetch once auth status is resolved
        fetchMyProducts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]); // Depend on user and authLoading

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`http://localhost:5001/api/products/${productId}`, config);
        // Refresh product list
        setMyProducts(prevProducts => prevProducts.filter(p => p.product_id !== productId));
        alert(`Product "${productName}" deleted successfully.`);
      } catch (err) {
        console.error("Error deleting product:", err.response ? err.response.data : err);
        alert(err.response && err.response.data ? err.response.data.message : 'Failed to delete product.');
      }
    }
  };

  if (loading || authLoading) {
    return <p style={pageStyle}>Loading your products...</p>;
  }

  // Error display should be before the "no products" check if error is not just for "no products"
  if (error && !(error.includes('Seller profile not found') && myProducts.length === 0) ) { // Avoid showing generic error if it's just no seller profile yet
    return <p style={{ ...pageStyle, color: 'red', textAlign: 'center' }}>Error: {error}</p>;
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>My Products</h1>
      {myProducts.length === 0 ? (
        <div style={{textAlign: 'center'}}>
            {/* If error is about seller profile, show specific message */}
            {error && error.includes('Seller profile not found') ? (
                <p>{error} You may need to complete seller registration.</p>
            ) : (
                <p>You haven't added any products yet.</p>
            )}
            <Link to="/products/new" style={buttonStyle('var(--primary-color)')}>Add Your First Product</Link>
        </div>
      ) : (
        <div>
          {myProducts.map(product => (
            <div key={product.product_id} style={productItemStyle}>
              <div style={productDetailsStyle}>
                <h3 style={{ margin: '0 0 5px 0', color: 'var(--text-color)' }}>{product.name}</h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.9em' }}>
                  Category: {product.category_name} | Price: ${parseFloat(product.price).toFixed(2)}
                </p>
                <p style={{ margin: '0', fontSize: '0.8em', color: '#666' }}>
                  Location: {product.location || 'N/A'}
                </p>
              </div>
              <div style={actionsStyle}>
                <Link to={`/seller/products/edit/${product.product_id}`} style={buttonStyle('var(--secondary-color)')}>
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.product_id, product.name)}
                  style={buttonStyle('#E07A5F')} /* Terracotta for delete */
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
