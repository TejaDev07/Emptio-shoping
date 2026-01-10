import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
import OrderManagement from '../pages/OrderManagement/OrderManagement';
import OrderDetails from '../pages/OrderDetails/OrderDetails';
import Products from '../pages/Products/index';
import AddProduct from '../pages/Products/AddProduct';
import EditProduct from '../pages/Products/EditProduct';
import Users from '../pages/Users';
import Payments from '../pages/Payments';

// Admin Components
import Sidebar from '../components/Sidebar';
import AdminNavbar from '../components/AdminNavbar';

const AdminRoutes = () => {
  const { user, loading } = useAuth();

  React.useEffect(() => {
    console.log('AdminRoutes - user:', user);
    console.log('AdminRoutes - loading:', loading);
    console.log('AdminRoutes - localStorage adminAuthenticated:', localStorage.getItem('adminAuthenticated'));
  }, [user, loading]);

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('AdminRoutes - showing loading');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check for admin authentication (both AuthContext and localStorage for compatibility)
  const isAuthenticated = user || localStorage.getItem('adminAuthenticated') === 'true';
  console.log('AdminRoutes - isAuthenticated:', isAuthenticated);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('AdminRoutes - redirecting to login');
    return <Navigate to="/" replace />;
  }

  console.log('AdminRoutes - rendering admin layout');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Fixed positioning handled in Sidebar component */}
      <Sidebar />

      {/* Main Content with dynamic margin for sidebar */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Top Navbar - Sticky */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/users" element={<Users />} />
              <Route path="/payments" element={<Payments />} />
              {/* Redirect / to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminRoutes;

