import React, { useEffect, useState } from 'react';
import CandidateCard from '../../components/CandidateCard';
import SearchFilter from '../../components/SearchFilter';
import { useCandidates } from '../../contexts/CandidateContext';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../../components/Notification';
import { fetchUserReferrals } from '../../api/api';
import { toast } from 'react-toastify';

const CandidatesDashboard = () => {
  const { 
    loading: contextLoading, 
    error: contextError,
    success: contextSuccess,
    updateCandidateStatus,
    deleteCandidate,
    candidates,
    filteredCandidates,
    searchTerm,
    setSearchTerm,
    searchCategory,
    setSearchCategory
  } = useCandidates();
  
  const { user, isAuthenticated } = useAuth();
  const [displayCandidates, setDisplayCandidates] = useState([]);

  // Set display candidates when filteredCandidates changes
  useEffect(() => {
    setDisplayCandidates(filteredCandidates);
  }, [filteredCandidates]);
  
  const handleDeleteCandidate = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      deleteCandidate(id);
    }
  };
  
  // Check if the user is authenticated before rendering the dashboard
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Please Login</h1>
        <p className="text-gray-600">You need to login to view your referrals.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        My Referrals Dashboard
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Track the status of your candidate referrals
      </p>
      
      <Notification error={contextError} success={contextSuccess} />
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Your Referrals
        </h2>
      
        <SearchFilter 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          searchCategory={searchCategory} 
          setSearchCategory={setSearchCategory} 
        />
      
        {/* Candidates List */}
        {contextLoading && <p className="text-center">Loading candidates...</p>}
      
        {!contextLoading && displayCandidates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No referrals found</p>
            <p className="text-sm text-gray-400">You haven't submitted any referrals yet or they might be processing.</p>
          </div>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCandidates.map((candidate) => (
            <CandidateCard 
              key={candidate._id || candidate.id}
              candidate={candidate}
              updateCandidateStatus={updateCandidateStatus}
              isAdmin={false}
              onDelete={() => handleDeleteCandidate(candidate._id || candidate.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidatesDashboard;
