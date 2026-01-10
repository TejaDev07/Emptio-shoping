import React from 'react';
import { useCartWishlist } from '../../context/CartWishlistContext';

const Notification = () => {
  const { notification } = useCartWishlist();

  if (!notification) return null;

  const { message, type } = notification;

  const bgColor = type === 'success' ? 'bg-green-500' :
                  type === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500';

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md text-white shadow-lg transition-all duration-300 ${bgColor}`}>
      {message}
    </div>
  );
};

export default Notification;