import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaBox,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaLightbulb,
  FaCreditCard
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

    const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: FaTachometerAlt,
      description: 'Overview & Analytics'
    },
    {
      path: '/orders',
      label: 'Orders',
      icon: FaShoppingCart,
      description: 'Manage orders'
    },
    {
      path: '/products',
      label: 'Products',
      icon: FaBox,
      description: 'Product catalog'
    },
    {
      path: '/users',
      label: 'Users',
      icon: FaUsers,
      description: 'Customer management'
    },
    {
      path: '/payments',
      label: 'payments',
      icon: FaCreditCard,
      description: 'Manage payments'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-xl border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300 shadow-xl fixed left-0 top-0 z-50`}
      >
        {/* Logo / Brand */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <FaLightbulb className="text-white text-lg" />
            </div>

            {isOpen && (
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-gray-900">
                  Emptio
                </h1>
                <p className="text-xs text-blue-600 font-semibold">
                  Admin Panel
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                title={!isOpen ? item.label : ''}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                {/* Icon */}
                <Icon
                  className={`text-lg flex-shrink-0 transition-colors duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-blue-500'
                  }`}
                />

                {/* Text */}
                {isOpen && (
                  <>
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-tight">
                        {item.label}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          isActive ? 'text-white/70' : 'text-gray-500'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* Active dot */}
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            title={!isOpen ? 'Logout' : ''}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-xl transition-all duration-200 group font-semibold hover:bg-red-500 hover:text-white"
          >
            <FaSignOutAlt className="text-lg text-gray-400 group-hover:text-white flex-shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Button */}
        {isOpen && (
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-xs font-semibold"
            >
              <FaTimes className="mr-2" />
              Collapse
            </button>
          </div>
        )}
      </div>

      {/* Layout Spacer */}
      <div
        className={`${
          isOpen ? 'ml-64' : 'ml-20'
        } transition-all duration-300`}
      ></div>

      {/* Floating Expand Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-3 top-24 p-2.5 bg-white text-gray-700 rounded-xl shadow-xl hover:bg-gray-100 transition-all duration-200 z-40"
          title="Expand Sidebar"
        >
          <FaBars />
        </button>
      )}
    </>
  );
};

export default Sidebar;
