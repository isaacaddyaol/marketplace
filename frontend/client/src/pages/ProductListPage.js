import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { AuthContext } from '../contexts/AuthContext';

const pageTitleStyle = {
    textAlign: 'center',
    margin: '20px 0',
    fontFamily: 'var(--header-font)',
    color: 'var(--primary-color)'
};

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px', // Consistent gap
  padding: '0px' // Container will provide padding
};

const ProductListPage = () => {
  // ... (keep existing state and effect logic)
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      if (authLoading) return;
      try {
        setLoading(true);
        setError('');
        const res = await axios.get('http://localhost:5001/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.response ? err.response.data.message : 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [authLoading]);


  if (loading || authLoading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (products.length === 0) return <div style={{ textAlign: 'center', padding: '20px' }}>No products found.</div>;

  return (
    <div>
      <h2 style={pageTitleStyle}>Our Products</h2>
      <div style={gridStyle}>
        {products.map(product => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default ProductListPage;
