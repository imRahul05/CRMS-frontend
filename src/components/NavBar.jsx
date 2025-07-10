import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md mb-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-4 md:mb-0">
          <Link to="/" className="hover:text-blue-300 transition-colors">CRMS</Link>
        </div>
        {isAuthenticated ? (
          <div className="flex gap-4 items-center">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                location.pathname === '/' ? 'bg-gray-700' : ''
              }`}
            >
              Home
            </Link>
            {user && user.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                  location.pathname === '/admin' ? 'bg-gray-700' : ''
                }`}
              >
                Admin Dashboard
              </Link>
            )}
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                location.pathname === '/dashboard' ? 'bg-gray-700' : ''
              }`}
            >
              {user && user.role === 'admin' ? 'Candidate List' : 'Candidates Dashboard'}
            </Link>
            {user && user.role !== 'admin' && (
              <Link 
                to="/referral" 
                className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                  location.pathname === '/referral' ? 'bg-gray-700' : ''
                }`}
              >
                Referral Form
              </Link>
            )}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition-colors">
                <span>{user?.name || 'User'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                <div className="py-1">
                  <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link 
              to="/login" 
              className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                location.pathname === '/login' ? 'bg-gray-700' : ''
              }`}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                location.pathname === '/register' ? 'bg-gray-700' : ''
              }`}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
