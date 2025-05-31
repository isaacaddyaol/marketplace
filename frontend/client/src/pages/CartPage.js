import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ensure useNavigate is imported
import { CartContext } from '../contexts/CartContext';

// Basic inline styles - can be moved to a CSS file
const pageStyle = {
  padding: '20px',
  fontFamily: 'var(--body-font)'
};

const titleStyle = {
  textAlign: 'center',
  color: 'var(--primary-color)',
  fontFamily: 'var(--header-font)',
  marginBottom: '30px'
};

const cartItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #eee',
  padding: '15px 0',
  marginBottom: '10px'
};

const itemDetailsStyle = {
  flexGrow: 1,
  marginLeft: '15px'
};

const itemImagePlaceholder = {
    width: '80px',
    height: '80px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8em',
    color: '#aaa',
    borderRadius: '4px'
};

const quantityControlsStyle = {
  display: 'flex',
  alignItems: 'center'
};

const quantityButtonStyle = {
  padding: '5px 10px',
  margin: '0 5px',
  cursor: 'pointer',
  backgroundColor: 'var(--secondary-color)',
  color: 'var(--light-text-color)',
  border: 'none',
  borderRadius: '3px'
};

const removeButtonStyle = {
    padding: '5px 10px',
    cursor: 'pointer',
    backgroundColor: '#E07A5F',
    color: 'var(--light-text-color)',
    border: 'none',
    borderRadius: '3px',
    marginLeft: '20px'
};

const cartSummaryStyle = {
  marginTop: '30px',
  padding: '20px',
  borderTop: '2px solid var(--primary-color)',
  textAlign: 'right'
};

const emptyCartStyle = {
    textAlign: 'center',
    padding: '40px 20px'
};

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getItemCount } = useContext(CartContext);
  const navigate = useNavigate(); // inside CartPage component

  if (getItemCount() === 0) {
    return (
      <div style={emptyCartStyle}>
        <h2 style={{color: 'var(--primary-color)'}}>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: 'var(--primary-color)',
            color: 'var(--light-text-color)',
            borderRadius: '5px',
            textDecoration: 'none'
        }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Your Shopping Cart</h1>
      <div>
        {cartItems.map(item => (
          <div key={item.product_id} style={cartItemStyle}>
            <div style={itemImagePlaceholder}>Image</div>
            <div style={itemDetailsStyle}>
              <h3 style={{margin: '0 0 5px 0', fontSize: '1.1em', color: 'var(--text-color)'}}>{item.name}</h3>
              <p style={{margin: '0 0 5px 0', fontSize: '0.9em'}}>Price: ${parseFloat(item.price).toFixed(2)}</p>
            </div>
            <div style={quantityControlsStyle}>
              <button style={quantityButtonStyle} onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
              <span style={{padding: '0 10px', fontSize: '1em'}}>{item.quantity}</span>
              <button style={quantityButtonStyle} onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
            </div>
            <p style={{margin: '0 20px', fontSize: '1em', minWidth: '70px', textAlign: 'right'}}>
              ${(parseFloat(item.price) * item.quantity).toFixed(2)}
            </p>
            <button style={removeButtonStyle} onClick={() => removeFromCart(item.product_id)}>Remove</button>
          </div>
        ))}
      </div>
      <div style={cartSummaryStyle}>
        <h2 style={{fontFamily: 'var(--header-font)', color: 'var(--primary-color)'}}>
          Total: ${getCartTotal()}
        </h2>
        <button
            onClick={clearCart}
            style={{...removeButtonStyle, backgroundColor: '#aaa', marginRight: '10px', marginTop: '10px'}}
        >
          Clear Cart
        </button>
        <button style={{
            padding: '12px 25px',
            backgroundColor: 'var(--primary-color)',
            color: 'var(--light-text-color)',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.1em',
            marginTop: '10px'
        }} onClick={() => navigate('/checkout') /* Updated onClick */}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
