import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", import.meta.env.VITE_API_URL);

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const { orderId } = useParams();

  // Guest tracking state
  const [guestEmail, setGuestEmail] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);

  useEffect(() => {
    console.log('OrderTracking: useEffect triggered', { loading, user: user ? 'logged in' : 'not logged in' });
    if (loading) {
      console.log('OrderTracking: Still loading auth...');
      return;
    }

    if (isAuthenticated()) {
      console.log('OrderTracking: User authenticated, fetching orders');
      fetchOrders();
    } else {
      console.log('OrderTracking: User not authenticated, showing guest form');
      setIsLoading(false);
      setShowGuestForm(true);
    }
  }, [loading, user]);

  const fetchGuestOrders = async (email) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/orders/guest?email=${encodeURIComponent(email)}&t=${Date.now()}`);

      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
        setShowGuestForm(false);
      } else {
        setError('No orders found with this email address');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    if (guestEmail.trim()) {
      fetchGuestOrders(guestEmail.trim());
    }
  };
  // Fetch orders for authenticated users
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      console.log('OrderTracking: Token from localStorage:', token ? 'present' : 'missing');
      if (!token) {
        setError('Please log in to view your orders');
        setIsLoading(false);
        return;
      }

      let url = `${API_URL}/api/orders?t=${Date.now()}`;
      if (orderId) {
        url = `${API_URL}/api/orders/${orderId}?t=${Date.now()}`;
      }
      console.log('OrderTracking: Fetching from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('OrderTracking: Response status:', response.status);

      if (response.ok) {
        const ordersData = await response.json();
        console.log('OrderTracking: Orders received:', Array.isArray(ordersData) ? ordersData.length : 1);
        setOrders(Array.isArray(ordersData) ? ordersData : [ordersData]);
      } else {
        const errorData = await response.json();
        console.log('OrderTracking: Error response:', errorData);
        setError('Failed to load orders');
      }
    } catch (err) {
      console.log('OrderTracking: Network error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'placed':
        return <FaBox className="text-yellow-500" />;
      case 'confirmed':
        return <FaCheckCircle className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-orange-500" />;
      case 'out_for_delivery':
        return <FaTruck className="text-purple-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusSteps = () => {
    return [
      { status: 'placed', label: 'Order Placed', icon: FaBox },
      { status: 'confirmed', label: 'Order Confirmed', icon: FaCheckCircle },
      { status: 'shipped', label: 'Shipped', icon: FaTruck },
      { status: 'out_for_delivery', label: 'Out for Delivery', icon: FaTruck },
      { status: 'delivered', label: 'Delivered', icon: FaCheckCircle },
    ];
  };

  const isStepCompleted = (stepStatus, currentStatus) => {
    const statusOrder = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
    const stepIndex = statusOrder.indexOf(stepStatus);
    const currentIndex = statusOrder.indexOf(currentStatus);
    return currentIndex >= stepIndex;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'shipped':
        return 'text-orange-600 bg-orange-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';

    }
  };

  if (showGuestForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-4 text-center">
              Enter the email address you used when placing your order
            </p>
            <form onSubmit={handleGuestSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Track Order
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Tracking</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                  <p className="text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              {/* Individual Order Items */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold">Order Items</h4>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-4 mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium">{item.name}</h5>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Individual Item Status Timeline */}
                    <div className="ml-20">
                      <h6 className="text-sm font-medium mb-2">Item Status</h6>
                      <div className="space-y-2">
                        {getStatusSteps().map((step, index) => {
                          const Icon = step.icon;
                          const completed = isStepCompleted(step.status, order.status);
                          return (
                            <div key={step.status} className="flex items-center">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                              }`}>
                                <Icon className="w-3 h-3" />
                              </div>
                              <div className="ml-2">
                                <p className={`text-sm ${completed ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                  {step.label}
                                </p>
                                {completed && order.statusHistory?.find(h => h.status === step.status) && (
                                  <p className="text-xs text-gray-500">
                                    {new Date(order.statusHistory.find(h => h.status === step.status).timestamp).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-600">Total Order Amount</p>
                  <p className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200"
                >
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;