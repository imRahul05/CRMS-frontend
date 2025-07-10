import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CandidateCard from '../../components/CandidateCard';
import SearchFilter from '../../components/SearchFilter';
import Notification from '../../components/Notification';
import { useCandidates } from '../../contexts/CandidateContext';
import { fetchAdminReferrals, updateCandidateStatus as apiUpdateStatus, deleteCandidate as apiDeleteCandidate } from '../../api/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success } = useCandidates();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    hired: 0,
    rejected: 0
  });

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Fetch referrals from API
  useEffect(() => {
    const getReferrals = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminReferrals();
        setCandidates(data);
        setFilteredCandidates(data);
      } catch (err) {
        setError('Failed to fetch referrals');
        toast.error('Failed to fetch referrals');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      getReferrals();
    }
  }, [user]);

  // Calculate stats whenever candidates change
  useEffect(() => {
    if (candidates && candidates.length > 0) {
      const stats = candidates.reduce(
        (acc, candidate) => {
          acc.total++;
          if (candidate.status === 'Pending') acc.pending++;
          else if (candidate.status === 'Reviewed') acc.reviewed++;
          else if (candidate.status === 'Hired') acc.hired++;
          else if (candidate.status === 'Rejected') acc.rejected++;
          return acc;
        },
        { total: 0, pending: 0, reviewed: 0, hired: 0, rejected: 0 }
      );
      
      setStats(stats);
    }
  }, [candidates]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('jobTitle');

  // Handle search function
  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
    
    if (!term.trim()) {
      setFilteredCandidates(candidates);
      return;
    }
    
    const filtered = candidates.filter(candidate => 
      candidate[category]?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCandidates(filtered);
  };

  // Function to update candidate status
  const updateCandidateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      await apiUpdateStatus(id, newStatus);
      
      // Update the local state
      const updatedCandidates = candidates.map(candidate => 
        candidate._id === id || candidate.id === id 
          ? { ...candidate, status: newStatus } 
          : candidate
      );
      
      setCandidates(updatedCandidates);
      setFilteredCandidates(updatedCandidates.filter(c => 
        c[searchCategory]?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
      toast.success(`Candidate status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update candidate status');
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle candidate deletion
  const handleDeleteCandidate = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        setLoading(true);
        await apiDeleteCandidate(id);
        
        // Update the local state
        const updatedCandidates = candidates.filter(
          candidate => candidate._id !== id && candidate.id !== id
        );
        
        setCandidates(updatedCandidates);
        setFilteredCandidates(updatedCandidates.filter(c => 
          !searchTerm.trim() || c[searchCategory]?.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        
        toast.success('Candidate deleted successfully');
      } catch (err) {
        toast.error('Failed to delete candidate');
        console.error('Error deleting candidate:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">Manage all candidate referrals and user accounts</p>
        
        <Notification error={error} success={success} />
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-xl text-blue-600">{stats.total}</h2>
            <p className="text-gray-600">Total Candidates</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-xl text-yellow-600">{stats.pending}</h2>
            <p className="text-gray-600">Pending</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-xl text-blue-600">{stats.reviewed}</h2>
            <p className="text-gray-600">Reviewed</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-xl text-green-600">{stats.hired}</h2>
            <p className="text-gray-600">Hired</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-xl text-red-600">{stats.rejected}</h2>
            <p className="text-gray-600">Rejected</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <SearchFilter 
          searchTerm={searchTerm}
          searchCategory={searchCategory} 
          setSearchTerm={(term) => handleSearch(term, searchCategory)}
          setSearchCategory={(category) => handleSearch(searchTerm, category)} 
        />
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Candidate Referrals</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {filteredCandidates && filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCandidates.map(candidate => (
              <CandidateCard 
                key={candidate._id || candidate.id} 
                candidate={candidate}
                isAdmin={true}
                updateCandidateStatus={updateCandidateStatus}
                onDelete={() => handleDeleteCandidate(candidate._id || candidate.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No candidates found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
