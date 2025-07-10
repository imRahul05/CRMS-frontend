import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Notification from '../components/Notification';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const { login, loading, error: authError } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const registrationSuccess = localStorage.getItem('registrationSuccess');
    if (registrationSuccess) {
      toast.success(registrationSuccess);
      localStorage.removeItem('registrationSuccess');
    }

    if (authError) {
      setError(authError);
      toast.error(authError);
    }
  }, [authError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      const errorMsg = 'Please fill all required fields';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success('Login successful!');
        const user = JSON.parse(localStorage.getItem('user'));

        if (user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // 💡 Handlers for Quick Login
  const loginAsAdmin = () => {
    setFormData({ email: 'admin@gmail.com', password: 'admin@gmail.com' });
  };

  const loginAsUser = () => {
    setFormData({ email: 'newUser@gmail.com', password: 'qwerty@123' });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <Notification error={error} />

        {/* 🔘 Quick Login Buttons */}
       
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        <div className="flex justify-between mb-4">
          <button
            onClick={loginAsAdmin}
            className="bg-purple-600 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded"
          >
            Login as  Admin
          </button>
          <button
            onClick={loginAsUser}
            className="bg-green-600 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded"
          >
            Login as  User
          </button>
        </div>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?
              <Link to="/register" className="text-blue-500 hover:text-blue-700 ml-1">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
