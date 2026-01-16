import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartWishlistProvider } from './context/CartWishlistContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home/Home';
import ProductListing from './pages/ProductListing/ProductListing';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import SearchResults from './pages/SearchResults/SearchResults';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Help from './pages/Help/Help';
import Shipping from './pages/Shipping/Shipping';
import Returns from './pages/Returns/Returns';
import Wishlist from './pages/Wishlist/Wishlist';
import Privacy from './pages/Privacy/Privacy';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import OrderDetails from './pages/OrderDetails/OrderDetails';
import Profile from './pages/Profile/Profile';
import Notification from './components/Notification';
import "./App.css"

function AppContent() {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <CartWishlistProvider>
        <div>
          {!hideHeaderFooter && <Header />}
          <Notification />
          <Routes>
            <Route path={"/"} exact={true} element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/products/:category" element={<ProductListing />} />
            <Route path="/products/:category/:subcategory" element={<ProductListing />} />
            <Route path="/products/:category/:subcategory/:subsubcategory" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Order-tracking" element={<OrderTracking />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help" element={<Help />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
          {!hideHeaderFooter && <Footer />}
        </div>
      </CartWishlistProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
