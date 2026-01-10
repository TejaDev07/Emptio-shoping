import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { showNotification } from '../../components/Notification';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      
      localStorage.setItem('adminAuthenticated', 'true');
      
      showNotification('Login successful! Welcome to Admin Panel', 'success');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
      <div
        className="absolute top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"
        style={{ animationDelay: '3s' }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-purple-600/80 rounded-2xl blur-xl opacity-80"></div>
              <div className="relative h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                <svg
                  className="h-11 w-11 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            Emptio Admin
          </h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            E-commerce Management Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.7)] border border-white/15 p-8 lg:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-5 py-4 rounded-2xl text-sm backdrop-blur-md">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-400 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="admin@emptio.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 pl-12 bg-white/10 border border-white/20 hover:border-white/40 focus:border-blue-400/60 text-white placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all duration-300 backdrop-blur-md shadow-inner"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-white">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-5 py-3 pl-12 pr-12 bg-white/10 border border-white/20 hover:border-white/40 focus:border-blue-400/60 text-white placeholder-slate-400 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition-all duration-300 backdrop-blur-md shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-blue-400 transition duration-200"
                >
                  👁
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white font-bold bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in to Dashboard'}
            </button>
          </form>

          {/* Demo */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-xs font-semibold tracking-widest text-slate-400">
              DEMO CREDENTIALS
            </span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          <div className="space-y-3 bg-white/5 rounded-2xl p-5 border border-white/10 backdrop-blur-md shadow-inner">
            <div className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-3" />
              <span className="text-white font-mono text-sm">
                admin@emptio.com
              </span>
            </div>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-400 mr-3" />
              <span className="text-white font-mono text-sm">
                Admin@123
              </span>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-500 text-xs font-medium tracking-wide">
          🔒 Secure admin access • © 2024 Emptio
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
