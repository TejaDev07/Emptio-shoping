import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrderTable from '../../components/OrderTable';
import { adminApi } from '../../services/adminApi';
import { FaSearch, FaFilter, FaClock, FaCheckCircle, FaTimesCircle, FaTruck } from 'react-icons/fa';
import { showNotification } from '../../components/Notification';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderStats, setOrderStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  });

  React.useEffect(() => {
    console.log('OrderManagement component mounted');
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, searchTerm]);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      const res = await adminApi.getOrderStats();
      const data = res.data;
      // Map backend stats into the dashboard counts (best-effort)
      const stats = {
        pending: data.statusBreakdown?.find(s => s._id === 'placed')?.count || 0,
        processing: (data.statusBreakdown?.find(s => s._id === 'confirmed')?.count || 0) + (data.statusBreakdown?.find(s => s._id === 'shipped')?.count || 0),
        completed: data.statusBreakdown?.find(s => s._id === 'delivered')?.count || 0,
        cancelled: data.statusBreakdown?.find(s => s._id === 'cancelled')?.count || 0,
      };
      setOrderStats(stats);
    } catch (error) {
      console.error('Failed to fetch order stats', error);
      // Set default stats on error
      setOrderStats({
        pending: 0,
        processing: 0,
        completed: 0,
        cancelled: 0,
      });
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: currentPage,
        limit: 20,
      };

      if (statusFilter && statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await adminApi.getAllOrders(params);
      const data = res.data;

      // Backend returns { orders, totalPages, currentPage, totalOrders }
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
      showNotification('Orders loaded successfully!', 'success');
    } catch (error) {
      console.error('Error fetching orders from backend:', error);
      setError(error.response?.data?.message || 'Failed to fetch orders');
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus, note) => {
    try {
      setLoading(true);
      const res = await adminApi.updateOrderStatus(orderId, newStatus, note || 'Status updated by admin');
      // After update, refresh list
      await fetchOrders();
      await fetchOrderStats();
      showNotification(`Order ${orderId} status updated to ${newStatus}`, 'success');
      return res.data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      showNotification('Failed to update order status', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: 'bg-blue-100 text-blue-800 border-blue-200',
      confirmed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-14 w-14 border-4 border-white border-t-transparent"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage all customer orders</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <div className="mt-2">
                  <button
                    onClick={fetchOrders}
                    className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500">
                  <FaClock className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500 font-medium">Pending</p>
                <p className="text-lg font-bold text-gray-900">{orderStats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-yellow-500">
                  <FaTruck className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500 font-medium">Processing</p>
                <p className="text-lg font-bold text-gray-900">{orderStats.processing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-green-500">
                  <FaCheckCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500 font-medium">Completed</p>
                <p className="text-lg font-bold text-gray-900">{orderStats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-red-500">
                  <FaTimesCircle className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500 font-medium">Cancelled</p>
                <p className="text-lg font-bold text-gray-900">{orderStats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 mb-8 overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <FaFilter className="mr-2 text-blue-600" />
              Search & Filter
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                  Search Orders
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Order ID, customer email, or name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  id="status"
                  className="block w-full py-3 px-4 border border-gray-300 bg-white rounded-xl text-sm leading-5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchOrders}
                  className="w-full inline-flex justify-center items-center py-3 px-6 bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95"
                >
                  <FaSearch className="mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <OrderTable 
          orders={orders} 
          loading={loading} 
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white shadow-sm rounded-2xl border border-gray-100 px-6 py-4 flex items-center justify-between mt-8">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-semibold text-blue-600">{currentPage}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-sm">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-3 rounded-l-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-3 rounded-r-xl border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderManagement;