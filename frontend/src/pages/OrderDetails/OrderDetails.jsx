import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBox, FaTruck, FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaCreditCard, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.VITE_API_URL;

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [loading, user, navigate, id]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/orders/${id}?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else if (response.status === 404) {
        setError('Order not found');
      } else {
        setError('Failed to load order details');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: FaBox, color: 'text-yellow-500' },
      { key: 'confirmed', label: 'Order Confirmed', icon: FaCheckCircle, color: 'text-blue-500' },
      { key: 'processing', label: 'Processing', icon: FaBox, color: 'text-blue-500' },
      { key: 'shipped', label: 'Shipped', icon: FaTruck, color: 'text-orange-500' },
      { key: 'out_for_delivery', label: 'Out for Delivery', icon: FaTruck, color: 'text-orange-500' },
      { key: 'delivered', label: 'Delivered', icon: FaCheckCircle, color: 'text-green-500' },
    ];

    const currentStepIndex = steps.findIndex(step => step.key === status);
    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentStepIndex,
      isCurrent: index === currentStepIndex,
    }));
  };

  const getEstimatedDelivery = (status, orderDate) => {
    const orderDateObj = new Date(orderDate);

    switch (status) {
      case 'pending':
        return 'Expected delivery in 5-7 business days';
      case 'confirmed':
        return 'Expected delivery in 4-6 business days';
      case 'processing':
        return 'Expected delivery in 3-5 business days';
      case 'shipped':
        const shippedDate = new Date(orderDateObj);
        shippedDate.setDate(shippedDate.getDate() + 3);
        return `Expected delivery by ${shippedDate.toLocaleDateString()}`;
      case 'out_for_delivery':
        return 'Expected delivery today';
      case 'delivered':
        return `Delivered on ${order.actualDelivery ? new Date(order.actualDelivery).toLocaleDateString() : new Date(orderDate).toLocaleDateString()}`;
      case 'cancelled':
        return 'Order was cancelled';
      case 'returned':
        return 'Order was returned';
      default:
        return 'Delivery date not available';
    }
  };

  const handleCancelOrder = async () => {
    if (!actionReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/orders/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: actionReason }),
      });

      if (response.ok) {
        await fetchOrderDetails();
        setShowCancelModal(false);
        setActionReason('');
        alert('Order cancelled successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to cancel order');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestReturn = async () => {
    if (!actionReason.trim()) {
      alert('Please provide a reason for return');
      return;
    }

    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/orders/${id}/return`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: actionReason }),
      });

      if (response.ok) {
        await fetchOrderDetails();
        setShowReturnModal(false);
        setActionReason('');
        alert('Return request submitted successfully');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit return request');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
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
            onClick={fetchOrderDetails}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/Order-tracking')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <button
            onClick={() => navigate('/Order-tracking')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/Order-tracking')}
          className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
        >
          ← Back to Orders
        </button>
        <h1 className="text-3xl font-bold">Order Details</h1>
        <p className="text-gray-600">Order #{order.orderId}</p>
      </div>

      {/* Order Status Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Status</h2>
        <div className="flex items-center justify-between mb-4 overflow-x-auto pb-4">
          {statusSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.key} className="flex flex-col items-center flex-1 min-w-max px-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                  step.isCompleted ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <IconComponent className={`text-xl ${step.isCompleted ? step.color : 'text-gray-400'}`} />
                </div>
                <p className={`text-sm text-center ${step.isCompleted ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {step.label}
                </p>
                {step.isCurrent && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-center">
          <p className="text-gray-600">{getEstimatedDelivery(order.status, order.createdAt)}</p>
        </div>
      </div>

      {/* Tracking Information */}
      {order.trackingNumber && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Tracking Information</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-600">Tracking Number:</p>
              <p className="text-lg font-semibold text-gray-900">{order.trackingNumber}</p>
            </div>
            {order.estimatedDelivery && (
              <div className="flex-1">
                <p className="text-gray-600">Estimated Delivery:</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-xl font-bold text-orange-600">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-gray-600" />
              Shipping Address
            </h2>
            <div className="space-y-1">
              <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
              <p className="text-gray-600">{order.shippingAddress.email}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-gray-600" />
              Payment Information
            </h2>
            <div className="space-y-2">
              <p><span className="font-medium">Card:</span> {order.paymentInfo.cardNumber}</p>
              <p><span className="font-medium">Expiry:</span> {order.paymentInfo.expiryDate}</p>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-gray-600" />
              Order Information
            </h2>
            <div className="space-y-2">
              <p><span className="font-medium">Order ID:</span> {order.orderId}</p>
              <p><span className="font-medium">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><span className="font-medium">Status:</span> <span className="capitalize">{order.status.replace('_', ' ')}</span></p>
              {order.trackingNumber && (
                <p><span className="font-medium">Tracking Number:</span> {order.trackingNumber}</p>
              )}
              {order.estimatedDelivery && (
                <p><span className="font-medium">Estimated Delivery:</span> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
              )}
              {order.actualDelivery && (
                <p><span className="font-medium">Actual Delivery:</span> {new Date(order.actualDelivery).toLocaleDateString()}</p>
              )}
              <p><span className="font-medium">Payment Method:</span> <span className="capitalize">{order.paymentMethod ? order.paymentMethod.replace('_', ' ') : 'N/A'}</span></p>
              {order.orderNotes && (
                <p><span className="font-medium">Notes:</span> {order.orderNotes}</p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              {order.status === 'pending' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors"
                >
                  Cancel Order
                </button>
              )}
              {order.status === 'delivered' && !['returned', 'cancelled'].includes(order.status) && (
                <button
                  onClick={() => setShowReturnModal(true)}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors"
                >
                  Request Return
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for cancellation:</p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows="3"
              placeholder="Reason for cancellation..."
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Request Return</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for return:</p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows="3"
              placeholder="Reason for return..."
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleRequestReturn}
                className="flex-1 bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Request Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
