import React, { useEffect, useState } from 'react';
import CandidateCard from '../components/CandidateCard';
import SearchFilter from '../components/SearchFilter';
import { useCandidates } from '../contexts/CandidateContext';
import { useAuth } from '../contexts/AuthContext';
import Notification from '../components/Notification';

const CandidatesDashboard = () => {
  const { 
    loading, 
    candidates,
    filteredCandidates, 
    searchTerm, 
    setSearchTerm, 
    searchCategory, 
    setSearchCategory, 
    updateCandidateStatus,
    deleteCandidate,
    error,
    success
  } = useCandidates();
  const { user } = useAuth();
  const [displayCandidates, setDisplayCandidates] = useState([]);
  
  useEffect(() => {
    // If user is admin, show all candidates
    // If user is regular user, show only their candidates
    if (user) {
      if (user.role === 'admin') {
        setDisplayCandidates(filteredCandidates);
      } else {
        // In the new API integration, we're already fetching only the user's referrals
        // in CandidateContext using fetchUserReferrals(), so we don't need to filter here
        setDisplayCandidates(filteredCandidates);
      }
    }
  }, [user, filteredCandidates]);
  
  const handleDeleteCandidate = (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      deleteCandidate(id);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">
        {user?.role === 'admin' ? 'Candidate List' : 'Candidates Dashboard'}
      </h1>
      <p className="text-center text-gray-600 mb-6">
        {user?.role === 'admin' 
          ? 'Admin View - Manage all candidate referrals' 
          : 'User View - View your candidate referrals'}
      </p>
      
      <Notification error={error} success={success} />
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {user?.role === 'admin' ? 'All Candidates List' : 'Your Referrals'}
        </h2>
      
      <SearchFilter 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        searchCategory={searchCategory} 
        setSearchCategory={setSearchCategory} 
      />
      
      {/* Candidates List */}
      {loading && <p className="text-center">Loading candidates...</p>}
      
      {!loading && displayCandidates.length === 0 && (
        <p className="text-center text-gray-500">No candidates found</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayCandidates.map((candidate) => (
          <CandidateCard 
            key={candidate.id}
            candidate={candidate}
            updateCandidateStatus={updateCandidateStatus}
            isAdmin={user && user.role === 'admin'}
            onDelete={() => handleDeleteCandidate(candidate.id)}
          />
        ))}
      </div>
      </div>
    </div>
  );
};

export default CandidatesDashboard;
