import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      
      // Dispatch user info to Redux store
      dispatch(setCredentials({ 
        user: user || { email }, 
        token 
      }));

      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }

      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
      
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-600 to-indigo-700">
      {/* Left side: Form */}
      <div className="w-full md:w-1/2 p-6 flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-700">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to access your account</p>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-800">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </div>
            </form>
            
          </div>
          
          <p className="text-center mt-6 text-white">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-indigo-200 hover:text-white transition-colors duration-150 flex items-center justify-center mt-2">
              Create an account <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </p>
        </div>
      </div>


      <div className="hidden md:block w-1/2 p-12">
        <div className="h-full flex flex-col justify-center items-center text-center text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6">Document Similarity Checker</h1>
            <p className="text-xl mb-8 text-indigo-100">
              The most comprehensive tool for comparing documents and detecting similarities in text.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h3 className="text-2xl font-semibold mb-4">Why use our platform?</h3>
              <ul className="text-left space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced AI-powered document comparison</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Compare PDFs, Word documents, and text files</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Detailed similarity reports with visual analytics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure and private document processing</span>
                </li>
              </ul>
            </div>
            
            <div className="text-sm text-indigo-200">
              © 2025 Document Similarity Tool. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;