import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/adminApi';
import { 
  FaShoppingCart, FaUsers, FaDollarSign, FaClipboardList, 
  FaArrowUp, FaArrowDown, FaSync, FaChartLine, FaBox
} from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  console.log('AdminDashboard component rendered');

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await adminApi.getOrderStats();
        const data = res.data;
        setStats({
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          pendingOrders: data.statusBreakdown?.find(s => s._id === 'placed')?.count || 0,
          completedOrders: data.statusBreakdown?.find(s => s._id === 'delivered')?.count || 0,
        });
      } catch (error) {
        console.error('Failed to load stats, using defaults', error);
      }
    };

    const loadRecentOrders = async () => {
      try {
        const res = await adminApi.getAllOrders({ page: 1, limit: 5 });
        setRecentOrders(res.data.orders || []);
      } catch (error) {
        console.error('Failed to load recent orders', error);
      }
    };

    loadStats();
    loadRecentOrders();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500">
                  <FaShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <div className="flex items-center mt-1">
                  <FaArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">12% from last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-500">
                  <FaDollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <FaArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">8% from last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-yellow-500">
                  <FaClipboardList className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                <div className="flex items-center mt-1">
                  <FaArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  <span className="text-xs text-red-600">3% from last month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-500">
                  <FaBox className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
                <div className="flex items-center mt-1">
                  <FaArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">15% from last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => {
                console.log('View Orders button clicked');
                navigate('/orders');
              }}
              className="flex items-center justify-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FaShoppingCart className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-blue-900 font-medium">View Orders</span>
            </button>
            <button 
              onClick={() => {
                console.log('Manage Products button clicked');
                navigate('/products');
              }}
              className="flex items-center justify-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FaBox className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-900 font-medium">Manage Products</span>
            </button>
            <button 
              onClick={() => {
                console.log('View Users button clicked');
                navigate('/users');
              }}
              className="flex items-center justify-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FaUsers className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-purple-900 font-medium">View Users</span>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium text-gray-900">
                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                          </div>
                          <div className="text-gray-500">
                            {order.shippingAddress?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'placed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/orders')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Orders →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;