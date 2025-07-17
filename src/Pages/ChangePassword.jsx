import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Notification from '../components/Notification';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { changePassword } = useAuth();

  // Get token from URL query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.newPassword || !formData.confirmNewPassword) {
      const errorMsg = 'Please fill all required fields';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      const errorMsg = 'New passwords do not match';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (formData.newPassword.length < 6) {
      const errorMsg = 'New password must be at least 6 characters long';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    if (!token) {
      const errorMsg = 'Invalid password reset link';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
     
    setLoading(true);
    try {
      const result = await changePassword(formData.newPassword, token);

      if (result.success) {
        const successMsg = 'Password changed successfully!';
        setSuccess(successMsg);
        toast.success(successMsg);
        
        // Clear form
        setFormData({
          newPassword: '',
          confirmNewPassword: ''
        });
        
        // Redirect to login after successful change
        toast.info('Redirecting to login page...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to change password';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
  const handleCancel = () => {
    navigate(-1); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Change Password</h1>
        
      

        <Notification error={error} success={success} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmNewPassword">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-1"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex-1"
            >
              Cancel
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              <Link to="/dashboard" className="text-blue-500 hover:text-blue-700">
                Back to Dashboard
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;