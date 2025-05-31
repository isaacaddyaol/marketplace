import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
// Placeholder for the next step (Place Order Logic)
// import { placeOrder } from '../services/orderService'; // Assuming orderService will be created

// Re-use or adapt styles from CartPage or define new ones
const pageStyle = { padding: '20px', fontFamily: 'var(--body-font)', maxWidth: '800px', margin: '0 auto' };
const titleStyle = { textAlign: 'center', color: 'var(--primary-color)', fontFamily: 'var(--header-font)', marginBottom: '30px' };
const sectionTitleStyle = { fontFamily: 'var(--header-font)', color: 'var(--text-color)', marginTop: '30px', marginBottom: '15px', borderBottom: '2px solid var(--secondary-color)', paddingBottom: '5px' };
const summaryItemStyle = { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' };
const totalStyle = { fontWeight: 'bold', fontSize: '1.2em', marginTop: '10px' };
const customerInfoStyle = { backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px' };
const placeOrderButtonStyle = {
    display: 'block',
    width: '100%',
    padding: '15px',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--light-text-color)',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.2em',
    textAlign: 'center',
    marginTop: '30px',
    fontFamily: 'var(--body-font)'
};


const CheckoutPage = () => {
  const { cartItems, getCartTotal, getItemCount, clearCart } = useContext(CartContext);
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  // const [shippingAddress, setShippingAddress] = useState(''); // Example for future use
  // const [processingOrder, setProcessingOrder] = useState(false);
  // const [orderError, setOrderError] = useState('');

  if (authLoading) {
    return <p>Loading user details...</p>;
  }

  if (!user && !authLoading) { // Ensure authLoading is false before redirecting
    // This should ideally be caught by ProtectedRoute, but as a safeguard
    navigate('/login?message=Please login to proceed to checkout.');
    return null;
  }

  if (getItemCount() === 0 && !authLoading) { // Ensure authLoading is false
    return (
      <div style={{...pageStyle, textAlign: 'center'}}>
        <h2 style={{color: 'var(--primary-color)'}}>Your Cart is Empty</h2>
        <p>You need items in your cart to checkout.</p>
        <Link to="/products" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: 'var(--primary-color)',
            color: 'var(--light-text-color)',
            borderRadius: '5px',
            textDecoration: 'none'
        }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Placeholder for handlePlaceOrder - will be implemented in the next step
  const handlePlaceOrder = async () => {
    alert("Place Order button clicked! Next step will handle order submission.");
    // Example of what will come in next step:
    // setProcessingOrder(true);
    // setOrderError('');
    // try {
    //   const orderData = {
    //     items: cartItems.map(item => ({ product_id: item.product_id, quantity: item.quantity, price: item.price })),
    //     clientOrderTotal: getCartTotal(),
    //     // shippingAddress: shippingAddress // if collected
    //   };
    //   const result = await placeOrder(orderData); // This function will call the backend
    //   clearCart();
    //   navigate(`/order-confirmation/${result.order.order_id}`);
    // } catch (err) {
    //   setOrderError(err.message || "Failed to place order.");
    // } finally {
    //   setProcessingOrder(false);
    // }
  };


  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>Checkout</h1>

      <h2 style={sectionTitleStyle}>Review Your Order</h2>
      {cartItems.map(item => (
        <div key={item.product_id} style={summaryItemStyle}>
          <span>{item.name} (x{item.quantity})</span>
          <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div style={{...summaryItemStyle, ...totalStyle, borderTop: '2px solid var(--text-color)', marginTop: '10px' }}>
        <span>Total:</span>
        <span>${getCartTotal()}</span>
      </div>

      {/* Display user information only if user is loaded and exists */}
      {user && (
          <>
            <h2 style={sectionTitleStyle}>Customer Information</h2>
            <div style={customerInfoStyle}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Contact Info:</strong> {user.contact_information || 'Not provided'}</p>
                <p style={{fontSize: '0.9em', color: '#555', marginTop: '15px'}}>
                    (Shipping details and further contact information would be collected here in a full checkout process.)
                </p>
            </div>
          </>
      )}

      {/* Placeholder for Payment Section - to be added in PayPal step */}
      <h2 style={sectionTitleStyle}>Payment Method</h2>
      <div style={{backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
        <p>Payment will be handled by PayPal in the next step.</p>
        {/* PayPal button will go here */}
      </div>

      {/* {orderError && <p style={{color: 'red', textAlign: 'center', margin: '15px 0'}}>{orderError}</p>} */}

      <button
        onClick={handlePlaceOrder}
        style={placeOrderButtonStyle}
        // disabled={processingOrder || getItemCount() === 0}
      >
        {/* {processingOrder ? 'Processing...' : 'Place Order (Placeholder)'} */}
        Place Order (Placeholder - Next Step)
      </button>
    </div>
  );
};

export default CheckoutPage;
