import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfile(user);
    }
    setIsLoading(false);
  }, [loading, user, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Unable to load profile</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl">
              <FaUser />
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold">{profile.name || 'User'}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-start">
              <FaEnvelope className="text-orange-500 mt-1 mr-3" />
              <div>
                <p className="text-gray-600 text-sm">Email</p>
                <p className="font-semibold">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaPhone className="text-orange-500 mt-1 mr-3" />
              <div>
                <p className="text-gray-600 text-sm">Phone</p>
                <p className="font-semibold">{profile.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaMapMarkerAlt className="text-orange-500 mt-1 mr-3" />
              <div>
                <p className="text-gray-600 text-sm">Address</p>
                <p className="font-semibold">{profile.address || 'Not provided'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaUser className="text-orange-500 mt-1 mr-3" />
              <div>
                <p className="text-gray-600 text-sm">Member Since</p>
                <p className="font-semibold">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/order-tracking')}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-3 transition-colors"
          >
            View My Orders
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 flex items-center justify-center transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
