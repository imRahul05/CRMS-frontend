import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Candidate Referral Management System</h1>
        
        <p className="text-xl mb-8 text-gray-600">
          Welcome to the Candidate Referral Management System. Use the navigation bar above to access different sections of the application.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">View Candidates</h2>
            <p className="mb-6">Browse through all referred candidates, search and filter by various criteria.</p>
            <Link 
              to="/dashboard" 
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Dashboard
            </Link>
          </div>
          
          {isAdmin ? (
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4 text-purple-600">Admin Dashboard</h2>
              <p className="mb-6">Access administrative tools and manage all candidate referrals.</p>
              <Link 
                to="/admin" 
                className="inline-block bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Admin Dashboard
              </Link>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-semibold mb-4 text-green-600">Refer a New Candidate</h2>
              <p className="mb-6">Submit a new candidate referral with all relevant information.</p>
              <Link 
                to="/referral" 
                className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Make a Referral
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
