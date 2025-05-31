import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext'; // Import CartContext

// Styles from previous step (ensure they are complete as per prompt)
const detailPageStyle = {
  padding: '20px',
  maxWidth: '900px',
  margin: '20px auto',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const imageGalleryStyle = {
  width: '100%',
  height: '400px',
  backgroundColor: '#f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#bbb',
  marginBottom: '30px',
  borderRadius: '8px'
};

const productInfoStyle = {
  lineHeight: '1.8',
  fontFamily: 'var(--body-font)',
  padding: '0 20px 20px 20px'
};

const productNameDetailStyle = {
    fontFamily: 'var(--header-font)',
    fontSize: '2.5rem',
    color: 'var(--primary-color)',
    marginBottom: '15px'
};

const productPriceDetailStyle = {
    fontFamily: 'var(--body-font)',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'var(--secondary-color)',
    margin: '15px 0'
};

const addToCartButtonStyle = { // New style for the button
    backgroundColor: 'var(--secondary-color)',
    color: 'var(--light-text-color)',
    padding: '12px 25px',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px',
    display: 'inline-block'
};


const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { loading: authLoading } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext); // Get addToCart from context
  const [addedMessage, setAddedMessage] = useState('');


  useEffect(() => {
    const fetchProduct = async () => {
      if (authLoading) return;
      try {
        setLoading(true); setError('');
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(`Error fetching product with id ${id}:`, err);
        setError(err.response ? err.response.data.message : `Failed to fetch product.`);
      } finally { setLoading(false); }
    };
    if (id) { fetchProduct(); }
  }, [id, authLoading]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1); // Add 1 quantity of the current product
      setAddedMessage(`${product.name} added to cart!`);
      setTimeout(() => setAddedMessage(''), 2000); // Clear message after 2s
    }
  };

  if (loading || authLoading) return <div>Loading product details...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '20px' }}>Product not found.</div>;

  return (
    <div style={detailPageStyle}>
      <div style={imageGalleryStyle}>
        <span>Main Product Image Placeholder</span>
      </div>
      <div style={productInfoStyle}>
        <h2 style={productNameDetailStyle}>{product.name}</h2>
        <p style={productPriceDetailStyle}>${product.price}</p>
        <p><strong>Category:</strong> {product.category_name || product.category_id}</p>
        <p><strong>Location:</strong> {product.location || 'N/A'}</p>
        <p><strong>Description:</strong> {product.description || 'No description available.'}</p>
        {product.seller_name && <p><strong>Sold by:</strong> {product.seller_name}</p>}

        <button onClick={handleAddToCart} style={addToCartButtonStyle}>
          Add to Cart
        </button>
        {addedMessage && <p style={{color: 'green', marginTop: '10px'}}>{addedMessage}</p>}
      </div>
    </div>
  );
};
export default ProductDetailPage;
