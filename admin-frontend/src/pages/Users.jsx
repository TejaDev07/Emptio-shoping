import React from 'react';
import { FaUsers, FaUserPlus, FaSearch, FaFilter } from 'react-icons/fa';

const Users = () => {
  React.useEffect(() => {
    console.log('Users component mounted');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer accounts and permissions</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <FaUserPlus className="mr-2" />
              Add User
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users yet</p>
              <p className="text-sm text-gray-500 mt-2">Add your first user to get started</p>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center">
            <FaUsers className="h-8 w-8 text-purple-600 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900">User Management Coming Soon</h3>
              <p className="text-purple-700 text-sm mt-1">This feature is under development. You'll be able to manage users, roles, and permissions here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Users;
