import React, { useState } from 'react';
import { FaBell, FaUser, FaCog, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminAuthenticated');
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-xl border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left side - Welcome Message */}
        <div className="flex items-center">
          <div className="flex flex-col">
            <h2 className="text-lg font-extrabold tracking-tight text-gray-900">
              Welcome back, {adminUser.name || 'Admin'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage your store efficiently
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-5">
          {/* Notifications */}
          <div className="relative group">
            <button className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
              <FaBell className="text-lg" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                3
              </span>
            </button>

            {/* Notification dropdown */}
            <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-sm font-extrabold text-gray-900">
                  Notifications
                </h3>
              </div>

              <div className="space-y-2 p-3 max-h-96 overflow-y-auto">
                <div className="text-xs p-3 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                  <p className="font-semibold text-blue-900">New order received</p>
                  <p className="text-blue-700 text-xs mt-1">
                    Order #12345 just came in
                  </p>
                </div>

                <div className="text-xs p-3 bg-green-50 rounded-xl border border-green-100 cursor-pointer hover:bg-green-100 transition-colors">
                  <p className="font-semibold text-green-900">Payment processed</p>
                  <p className="text-green-700 text-xs mt-1">
                    Order #12344 payment confirmed
                  </p>
                </div>

                <div className="text-xs p-3 bg-yellow-50 rounded-xl border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors">
                  <p className="font-semibold text-yellow-900">Low stock alert</p>
                  <p className="text-yellow-700 text-xs mt-1">
                    5 products running low on inventory
                  </p>
                </div>
              </div>

              <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                <a
                  href="#"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View all notifications →
                </a>
              </div>
            </div>
          </div>

          {/* Settings */}
          <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
            <FaCog className="text-lg" />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200"></div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="text-white text-xs" />
              </div>

              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-900">
                  {adminUser.name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <FaChevronDown
                className={`text-xs text-gray-600 transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <p className="text-sm font-extrabold text-gray-900">
                    {adminUser.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {adminUser.email || 'admin@emptio.com'}
                  </p>
                </div>

                <div className="py-2">
                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors">
                    <FaCog className="text-gray-400" />
                    <span>Account Settings</span>
                  </button>

                  <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors border-b border-gray-100">
                    <FaUser className="text-gray-400" />
                    <span>Profile</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors font-semibold"
                  >
                    <FaSignOutAlt className="text-red-400" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
