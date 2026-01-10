import React, { useState, useEffect } from 'react';

// Simple notification component for admin
const Notification = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Listen for custom notification events
    const handleNotification = (event) => {
      setNotification(event.detail);
      // Auto-hide after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    };

    window.addEventListener('admin-notification', handleNotification);

    return () => {
      window.removeEventListener('admin-notification', handleNotification);
    };
  }, []);

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

// Helper function to show notifications
export const showNotification = (message, type = 'info') => {
  const event = new CustomEvent('admin-notification', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
};

export default Notification;