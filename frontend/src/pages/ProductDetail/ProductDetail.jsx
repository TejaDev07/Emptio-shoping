import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCartWishlist } from '../../context/CartWishlistContext';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, cart, wishlist } = useCartWishlist();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Frontend: Fetching product with ID:', id);
      const response = await fetch(`${API_URL}/api/products/${id}`);
     console.log("API URL =", import.meta.env.VITE_API_URL);
      if (response.ok) {
        const productData = await response.json();
        console.log('✅ Frontend: Product fetched successfully:', productData._id);
        setProduct(productData);
      } else if (response.status === 404) {
        console.log('❌ Frontend: Product not found (404)');
        setError('Product not available');
      } else {
        console.log('❌ Frontend: Failed to load product, status:', response.status);
        setError('Failed to load product');
      }
    } catch (err) {
      console.log('💥 Frontend: Network error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (product) {
      addToCart(product);
    }
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (product) {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{error}</h1>
          <p className="text-gray-600 mb-8">The product you're looking for is not available.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
  const isInCart = cart.some(item => item._id === product._id);
  const isInWishlist = wishlist.some(item => item._id === product._id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'} alt={product.name} className="w-full h-96 object-cover rounded-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.brand && <p className="text-lg text-gray-600 mb-4">{product.brand}</p>}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="ml-2 text-lg text-gray-600">({product.rating})</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-orange-600">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-lg text-gray-500 line-through">${product.price}</span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Specifications</h3>
            <ul className="space-y-1">
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <li key={key} className="flex justify-between">
                  <span className="font-medium">{key}:</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`flex-1 bg-orange-500 text-white py-3 px-6 rounded hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 ${
                isInCart ? 'bg-green-500 cursor-not-allowed' : ''
              }`}
            >
              <FaShoppingCart />
              {isInCart ? 'In Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={handleAddToWishlist}
              className={`p-3 border rounded hover:bg-gray-100 ${
                isInWishlist ? 'bg-red-500 text-white' : ''
              }`}
            >
              <FaHeart />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        <div className="space-y-4">
          {product.reviews && product.reviews.map((review, index) => (
            <div key={index} className="border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{review.user}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;