import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaShoppingCart, FaArrowRight, FaCheckCircle, FaTruck, FaBox, FaTimes } from 'react-icons/fa';

const OrderTable = ({ orders, loading, onStatusUpdate }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
      returned: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getNextStatuses = (currentStatus) => {
    const statusFlow = {
      placed: [
        { value: 'confirmed', label: 'Confirm Order', icon: FaCheckCircle, color: 'bg-yellow-500' },
        { value: 'cancelled', label: 'Cancel Order', icon: FaTimes, color: 'bg-red-500' }
      ],
      confirmed: [
        { value: 'processing', label: 'Start Processing', icon: FaBox, color: 'bg-blue-500' },
        { value: 'cancelled', label: 'Cancel Order', icon: FaTimes, color: 'bg-red-500' }
      ],
      processing: [
        { value: 'shipped', label: 'Ship Order', icon: FaTruck, color: 'bg-purple-500' },
        { value: 'cancelled', label: 'Cancel Order', icon: FaTimes, color: 'bg-red-500' }
      ],
      shipped: [
        { value: 'out_for_delivery', label: 'Out for Delivery', icon: FaTruck, color: 'bg-orange-500' }
      ],
      out_for_delivery: [
        { value: 'delivered', label: 'Mark as Delivered', icon: FaCheckCircle, color: 'bg-green-500' }
      ],
      delivered: [],
      cancelled: [],
      returned: []
    };
    return statusFlow[currentStatus] || [];
  };

  const handleStatusClick = (order, newStatus) => {
    setSelectedOrder({ ...order, newStatus });
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedOrder || !onStatusUpdate) return;
    
    setUpdatingStatus(true);
    try {
      await onStatusUpdate(selectedOrder._id, selectedOrder.newStatus, 'Status updated by admin');
      setShowStatusModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-12 text-center">
          <FaShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">There are no orders matching your current filters.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order, index) => {
                const nextStatuses = getNextStatuses(order.status);
                return (
                  <tr key={order._id || index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        {order.orderId || order._id?.slice(-8) || `ORD${index + 1}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.user?.name || order.shippingAddress?.firstName + ' ' + order.shippingAddress?.lastName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || order.shippingAddress?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status?.replace('_', ' ').toUpperCase() || 'PLACED'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${order.totalAmount?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center px-3 py-2 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                          title="View Details"
                        >
                          <FaEye className="mr-1" />
                          View
                        </Link>
                        
                        {/* Status Update Buttons */}
                        {nextStatuses.map((status) => {
                          const Icon = status.icon;
                          return (
                            <button
                              key={status.value}
                              onClick={() => handleStatusClick(order, status.value)}
                              className={`inline-flex items-center px-3 py-2 ${status.color} text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95`}
                              title={status.label}
                            >
                              <Icon className="mr-1" />
                              {status.label.split(' ')[0]}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{orders.length}</span> order{orders.length !== 1 ? 's' : ''}
            </div>
            <div className="text-sm text-blue-600 font-semibold flex items-center">
              <span>View all</span>
              <FaArrowRight className="ml-2 h-3 w-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Confirmation Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Status Update</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to update order <span className="font-semibold">{selectedOrder._id?.slice(-8) || selectedOrder.orderId}</span> 
              from <span className="font-semibold">{selectedOrder.status?.replace('_', ' ').toUpperCase()}</span> to 
              <span className="font-semibold"> {selectedOrder.newStatus?.replace('_', ' ').toUpperCase()}</span>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={updatingStatus}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                disabled={updatingStatus}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {updatingStatus ? 'Updating...' : 'Confirm Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderTable;