import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext'; // Import CartContext

// Styles from previous step (ensure they are complete)
const navStyle = {
  backgroundColor: 'var(--primary-color)',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'var(--light-text-color)'
};

const navLinkStyle = {
  color: 'var(--light-text-color)',
  marginRight: '1.5rem',
  textDecoration: 'none',
  fontFamily: 'var(--body-font)',
  fontWeight: '500'
};

const navButton = {
    backgroundColor: 'var(--secondary-color)',
    color: 'var(--light-text-color)',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: 'var(--body-font)',
};

const cartLinkStyle = { // Style for cart link
    ...navLinkStyle, // Inherit base link style
    // Add specific styles if needed, e.g., for an icon
};


const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getItemCount } = useContext(CartContext); // Get getItemCount
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={navStyle}>
      <div>
        <Link to="/" style={navLinkStyle}>Home</Link>
        <Link to="/products" style={navLinkStyle}>Products</Link>
        {user && (
          <>
            <Link to="/products/new" style={navLinkStyle}>Add Product</Link>
            <Link to="/seller/products" style={navLinkStyle}>My Products</Link> {/* New Link */}
          </>
        )}
      </div>
      <div style={{display: 'flex', alignItems: 'center'}}> {/* Ensure items align well */}
        <Link to="/cart" style={cartLinkStyle}> {/* Link to cart page */}
          Cart {itemCount > 0 && `(${itemCount})`}
        </Link>
        {user ? (
          <>
            <span style={{ marginLeft: '1.5rem', marginRight: '1rem', fontFamily: 'var(--body-font)' }}>
              Welcome, {user.name}!
            </span>
            <button onClick={handleLogout} style={navButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{...navLinkStyle, marginLeft: '1.5rem'}}>Login</Link>
            <Link to="/register" style={navLinkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
