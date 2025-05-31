import React from 'react';
import { Link } from 'react-router-dom';

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  margin: '10px', // Adjusted margin
  width: '280px', // Slightly wider
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Softer shadow
  backgroundColor: '#fff', // White card background
  textAlign: 'left', // Align text to left
  transition: 'transform 0.2s ease-in-out'
};

// Add a hover effect (can also be done with CSS classes)
// const cardHoverStyle = {
//   transform: 'translateY(-5px)'
// };


const imageStyle = {
  width: '100%',
  height: '200px', // Increased height
  backgroundColor: '#f0f0f0', // Lighter placeholder
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#bbb',
  marginBottom: '15px',
  borderRadius: '4px'
};

const productNameStyle = {
    fontFamily: 'var(--header-font)',
    fontSize: '1.25rem',
    color: 'var(--primary-color)',
    margin: '0 0 8px 0'
};

const productInfoStyle = {
    fontFamily: 'var(--body-font)',
    fontSize: '0.9rem',
    color: 'var(--text-color)',
    marginBottom: '4px'
};

const productPriceStyle = {
    fontFamily: 'var(--body-font)',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'var(--secondary-color)', // Sage green for price
    margin: '8px 0'
};


const ProductCard = ({ product }) => {
  if (!product) return null;
  // const [hover, setHover] = useState(false);

  return (
    <div
      style={cardStyle}
      // onMouseEnter={() => setHover(true)}
      // onMouseLeave={() => setHover(false)}
    >
      <Link to={`/products/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={imageStyle}>
          <span>Image Placeholder</span>
        </div>
        <h3 style={productNameStyle}>{product.name}</h3>
        <p style={productInfoStyle}>Category: {product.category_name || product.category_id}</p>
        <p style={productPriceStyle}>${product.price}</p>
        {product.seller_name && <p style={productInfoStyle}><small>Sold by: {product.seller_name}</small></p>}
      </Link>
    </div>
  );
};

export default ProductCard;
