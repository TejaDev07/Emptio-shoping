import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCartWishlist } from '../../context/CartWishlistContext';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity } = useCartWishlist();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some products to your cart to get started!</p>
        <Link to="/" className="bg-orange-500 text-white py-3 px-6 rounded hover:bg-orange-600 transition-colors">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item, index) => (
            <div key={`item-${index}`} className="flex items-center border-b py-4">
              <img src={item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.jpg'} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-orange-600 font-bold">${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <FaMinus />
                </button>
                <span className="px-3 py-1 border rounded">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                  className="p-1 border rounded hover:bg-gray-100"
                >
                  <FaPlus />
                </button>
              </div>
              <p className="font-bold ml-4">${(item.price * item.quantity).toFixed(2)}</p>
              <button
                onClick={() => removeFromCart(item._id)}
                className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>$10.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Total:</span>
              <span>${(total + 10 + total * 0.08).toFixed(2)}</span>
            </div>
          </div>
          <Link
            to="/checkout"
            className="w-full bg-orange-500 text-white py-3 px-6 rounded hover:bg-orange-600 transition-colors block text-center mt-6"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;