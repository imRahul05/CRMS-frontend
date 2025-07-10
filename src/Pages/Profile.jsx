import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, loading, logout, updateProfile } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
        </div>
        
        <Notification error={error} />
        
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-8">
              <span className="text-4xl text-blue-600">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h2 className="text-sm text-gray-500 uppercase">Name</h2>
              <p className="text-xl">{user.name}</p>
            </div>
            
            <div className="border-b pb-2">
              <h2 className="text-sm text-gray-500 uppercase">Email</h2>
              <p className="text-xl">{user.email}</p>
            </div>
            
            <div className="border-b pb-2">
              <h2 className="text-sm text-gray-500 uppercase">Account Status</h2>
              <p className="text-xl">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
              </p>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
