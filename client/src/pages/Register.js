import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setMessage('All fields are required.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.post('/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      // Store token and user info
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setMessage('Registration successful! Redirecting...');
      setTimeout(() => navigate('/'), 1500); // Redirect to todo list
    } catch (err) {
      console.error('Registration error:', err);
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">📝 Create Account</h2>
        
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-center ${
            message.includes('successful') 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              👤 Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              📧 Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="w-full p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🔒 Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min 6 characters)"
              className="w-full p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              🔒 Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-semibold text-white transform hover:scale-105 disabled:transform-none"
          >
            {isLoading ? '🔄 Creating Account...' : '✨ Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;