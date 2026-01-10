import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useAuth } from '../../context/AuthContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, cart, wishlist } = useCartWishlist();
  const { isAuthenticated } = useAuth();
  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);

  const isInCart = cart.some(item => item._id === product._id);
  const isInWishlist = wishlist.some(item => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    addToWishlist(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
          {product.discount}% OFF
        </div>
      )}
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden">
          <img src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
          <button
            onClick={handleAddToWishlist}
            className={`absolute top-2 right-2 p-2 rounded-full ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:bg-red-500 hover:text-white transition-colors`}
          >
            <FaHeart size={16} />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold mb-1 hover:text-orange-600 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{product.name}</h3>
        </Link>
        {product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-orange-600">${discountedPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
              isInCart
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            <FaShoppingCart size={14} />
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;