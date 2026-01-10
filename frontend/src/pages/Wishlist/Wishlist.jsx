import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { useCartWishlist } from '../../context/CartWishlistContext';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart, cart } = useCartWishlist();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const isInCart = (productId) => {
    return cart.some(item => item._id === productId);
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-600 mb-6">Add some products to your wishlist to keep track of items you like!</p>
        <Link to="/" className="bg-orange-500 text-white py-3 px-6 rounded hover:bg-orange-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map(product => {
          const discountedPrice = product.price - (product.price * (product.discount || 0) / 100);
          const inCart = isInCart(product._id);

          return (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
              {product.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                  {product.discount}% OFF
                </div>
              )}
              <Link to={`/product/${product.id}`}>
                <div className="relative overflow-hidden">
                  <img src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.jpg'} alt={product.name} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-1 hover:text-orange-600 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>{product.name}</h3>
                </Link>
                {product.brand && <p className="text-sm text-gray-600 mb-2">{product.brand}</p>}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-orange-600">${discountedPrice.toFixed(2)}</span>
                  {product.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={inCart}
                    className={`flex-1 py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
                      inCart
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    <FaShoppingCart size={14} />
                    {inCart ? 'In Cart' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded border border-red-200"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;