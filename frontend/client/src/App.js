import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext'; // Import CartProvider
import Navbar from './components/Navbar';
// ... other page imports from previous state (ensure they are here)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import ProtectedRoute from './components/ProtectedRoute';
import CartPage from './pages/CartPage'; // Import CartPage
import MyProductsPage from './pages/MyProductsPage'; // Import MyProductsPage
import EditProductPage from './pages/EditProductPage'; // Import EditProductPage
import CheckoutPage from './pages/CheckoutPage'; // Import CheckoutPage


function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* Wrap with CartProvider */}
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/products/new" element={<AddProductPage />} />
                <Route path="/seller/products" element={<MyProductsPage />} />
                <Route path="/seller/products/edit/:productId" element={<EditProductPage />} />
                <Route path="/checkout" element={<CheckoutPage />} /> {/* New Checkout Route */}
                {/* <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} /> Placeholder */}
              </Route>

              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
