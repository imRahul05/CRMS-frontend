import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const CandidateContext = createContext();

export const useCandidates = () => {
  return useContext(CandidateContext);
};

export const CandidateProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('jobTitle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    // Only fetch candidates if there's a user token in localStorage
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token && user) {
      fetchCandidates(user);
    }
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [searchTerm, candidates, searchCategory]);

  const fetchCandidates = async (user) => {
    if (!user) return; // Don't fetch if no user
    
    setLoading(true);
    try {
      const { fetchAdminReferrals, fetchUserReferrals } = await import('../api/api');
      
      let data = [];
      
      if (user.role === 'admin') {
        data = await fetchAdminReferrals();
      } else {
        data = await fetchUserReferrals();
      }
      
      setCandidates(data);
      setFilteredCandidates(data);
    } catch (err) {
      setError('Failed to fetch candidates');
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    if (!searchTerm.trim()) {
      setFilteredCandidates(candidates);
      return;
    }
    
    const filtered = candidates.filter(candidate => {
      // Check if the property exists before trying to search in it
      if (candidate[searchCategory] && typeof candidate[searchCategory] === 'string') {
        return candidate[searchCategory].toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
    
    setFilteredCandidates(filtered);
  };

  const addCandidate = (candidateData) => {
    setLoading(true);
    try {
      const newCandidate = {
        id: candidates.length + 1,
        ...candidateData,
        status: 'Pending'
      };
      
      setCandidates([...candidates, newCandidate]);
      setSuccess('Candidate referred successfully!');
      return newCandidate;
    } catch (err) {
      setError('Failed to add candidate');
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const updateCandidate = (updatedCandidate) => {
    setLoading(true);
    try {
      const updatedCandidates = candidates.map(candidate => 
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate
      );
      
      setCandidates(updatedCandidates);
      setSuccess('Candidate updated successfully!');
      return updatedCandidate;
    } catch (err) {
      setError('Failed to update candidate');
      throw err;
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };  const updateCandidateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      // Import the API function
      const { updateCandidateStatus: apiUpdateStatus } = await import('../api/api');
      
      // Call API to update status
      await apiUpdateStatus(id, newStatus);
      
      // Update local state
      const updatedCandidates = candidates.map(candidate =>
        (candidate._id === id || candidate.id === id) ? { ...candidate, status: newStatus } : candidate
      );
      
      setCandidates(updatedCandidates);
      setSuccess(`Candidate status updated to ${newStatus}`);
    } catch (err) {
      setError('Failed to update candidate status');
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const getCandidateById = (id) => {
    // Handle both MongoDB _id and regular id
    return candidates.find(candidate => 
      (candidate._id && candidate._id === id) || 
      (candidate.id && (candidate.id === id || candidate.id === parseInt(id)))
    );
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const deleteCandidate = async (id) => {
    setLoading(true);
    try {
      // Import the API function
      const { deleteCandidate: apiDeleteCandidate } = await import('../api/api');
      
      // Call API to delete candidate
      await apiDeleteCandidate(id);
      
      // Update local state
      const updatedCandidates = candidates.filter(candidate => 
        candidate._id !== id && candidate.id !== id
      );
      
      setCandidates(updatedCandidates);
      setSuccess('Candidate deleted successfully!');
    } catch (err) {
      setError('Failed to delete candidate');
      console.error('Error deleting candidate:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Expose a method to manually refresh candidates if needed
  const refreshCandidates = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      await fetchCandidates(user);
    }
  };

  const value = {
    candidates,
    filteredCandidates,
    searchTerm,
    setSearchTerm,
    searchCategory,
    setSearchCategory,
    loading,
    error,
    success,
    addCandidate,
    updateCandidate,
    updateCandidateStatus,
    deleteCandidate,
    getCandidateById,
    clearMessages,
    refreshCandidates
  };

  return (
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
};
