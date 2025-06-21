import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDevAuth } from '../../context/DevAuthContext';

// Development login form
function DevLoginForm() {  const [formData, setFormData] = useState({
  email: 'dev@autoapplypro.tech',
  password: 'dev123'
});
const [isLoading, setIsLoading] = useState(false);
const { signIn } = useDevAuth();
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    await signIn(formData.email, formData.password);
    toast.success('Logged in successfully! (Development Mode)');
    navigate('/dashboard');
  } catch (error) {
    toast.error('Login failed');
  } finally {
    setIsLoading(false);
  }
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

return (
  <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Development Login</h1>
      <p className="text-sm text-gray-600 mt-2">
          Clerk authentication not configured. Using development mode.
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email (pre-filled for development)
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password (pre-filled for development)
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign In (Dev Mode)'}
      </button>
    </form>

    <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Development Mode:</strong> To use real authentication, configure Clerk keys in your .env file.
          </p>
        </div>
      </div>
    </div>
  </div>
);
}

export default DevLoginForm;
