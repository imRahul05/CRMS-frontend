import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const timeoutRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowDropdown(true);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 300); // 300ms delay before hiding
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md mb-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-xl font-bold mb-4 md:mb-0">
          <Link to="/" className="hover:text-blue-300 transition-colors">CRMS</Link>
        </div>

        {isAuthenticated ? (
          <div className="flex gap-4 items-center">
            {user && user.role !== 'admin' && (
              <Link
                to="/"
                className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                  location.pathname === '/' ? 'bg-gray-700' : ''
                }`}
              >
                Home
              </Link>
            )}

            {user && user.role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                    location.pathname === '/admin' ? 'bg-gray-700' : ''
                  }`}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                    location.pathname === '/admin/analytics' ? 'bg-gray-700' : ''
                  }`}
                >
                  Analytics
                </Link>
              </>
            )}

            {user?.role === 'admin' ? (
              <Link
                to="/admin/candidates"
                className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                  location.pathname === '/admin/candidates' ? 'bg-gray-700' : ''
                }`}
              >
                Candidate List
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded hover:bg-gray-700 transition-colors ${
                  location.pathname === '/dashboard' ? 'bg-gray-700' : ''
                }`}
              >
                Candidates Dashboard
              </Link>
            )}

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

            {/* 👇 Improved Hover Dropdown */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition-colors">
                <span>{user?.name || 'User'}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    showDropdown ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu with smooth transition */}
              <div className={`absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 transition-all duration-200 ${
                showDropdown 
                  ? 'opacity-100 visible transform translate-y-0' 
                  : 'opacity-0 invisible transform -translate-y-2'
              }`}>
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            {/* ☝️ Improved Hover Dropdown Ends */}
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