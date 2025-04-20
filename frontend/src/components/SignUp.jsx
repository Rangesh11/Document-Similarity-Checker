import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Adding a loading state
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) { // Password validation
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        username: name,
        password,
      });

      const { token } = response.data;
      dispatch(setCredentials({ user: { name, email }, token }));

      // Handle the token (store it, redirect user, etc.)
      console.log('Signed up successfully!', token);

      // Optionally, you can redirect the user to login after successful sign-up
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false); // Stop loading after the request
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-r from-teal-500 to-blue-500">
      <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-center text-teal-600">Sign Up</h2>

          {/* Error message */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <label htmlFor="name" className="block text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              placeholder="Enter your full name"
              required
            />
          </div>
          
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
          
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          
          <p className="text-center mt-4 text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-teal-600 hover:text-teal-700">Login</a>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-teal-100 p-12 flex justify-center items-center text-center">
        <div>
          <h2 className="text-4xl font-semibold text-teal-700 mb-4">Join Us!</h2>
          <p className="text-lg text-teal-600">
            Create an account to access exclusive features, stay connected, and get the best experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;