import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice'; // adjust path if needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token } = response.data;
      dispatch(setCredentials({ user: { email }, token }));

      // Store the token in localStorage (or sessionStorage depending on your preference)
      localStorage.setItem('token', token);

      // Redirect to the dashboard or another page
      window.location.href = '/dashboard'; // Adjust the URL as needed
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-r from-blue-500 to-teal-500">
      {/* Left side: Form */}
      <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-indigo-600">Login</h2>
          
          <div>
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>
          
          {/* Display error if any */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Login
          </button>
          
          <p className="text-center mt-4 text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="/signup" className="text-indigo-600 hover:text-indigo-700">Sign Up</a>
          </p>
        </form>
      </div>

      {/* Right side: Info section */}
      <div className="hidden md:block w-1/2 bg-indigo-100 p-12 flex justify-center items-center text-center">
        <div>
          <h2 className="text-4xl font-semibold text-indigo-700 mb-4">Welcome Back!</h2>
          <p className="text-lg text-indigo-600">
            Access your account to check new features, updates, and much more. Let's get you signed in!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;