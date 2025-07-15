import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import CandidateCard from '../../components/CandidateCard';
import SearchFilter from '../../components/SearchFilter';
import Notification from '../../components/Notification';
import { useCandidates } from '../../contexts/CandidateContext';
import { fetchAdminReferrals } from '../../api/api';
import { toast } from 'react-toastify';
import DeleteCandidateModal from '../../components/DeleteCandidateModal';
import { useAdminCandidateActions, calculateStats } from '../../api/admin/CandidateUpdation';
import axios from '../../api/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success } = useCandidates();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    hired: 0,
    rejected: 0
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('name');

  const {
    updateCandidateStatus,
    handleSearch,
    handleDeleteClick: createHandleDeleteClick,
    confirmDeleteCandidate: createConfirmDeleteCandidate,
    handleBulkStatusUpdate: bulkStatusUpdate
  } = useAdminCandidateActions(
    candidates,
    setCandidates,
    setFilteredCandidates,
    setLoading,
    searchTerm,
    searchCategory
  );

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    }
  }, [user, navigate]);

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

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      setStats(calculateStats(candidates));
    }
  }, [candidates]);

  const handleSearchWrapper = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
    handleSearch(term, category);
  };

  // Use the curried functions
  const handleDeleteClickWrapper = createHandleDeleteClick(setSelectedCandidateId, setModalIsOpen);
  const confirmDeleteCandidateWrapper = () => 
    createConfirmDeleteCandidate(selectedCandidateId, setModalIsOpen, setSelectedCandidateId);

  const handleSelectCandidate = (id, isSelected) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleBulkStatusUpdate = () => bulkStatusUpdate(
    selectedCandidates,
    bulkUpdateStatus,
    candidates,
    setCandidates,
    setFilteredCandidates,
    setLoading,
    searchTerm,
    searchCategory,
    setSelectedCandidates,
    setBulkUpdateStatus
  );

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
          setSearchTerm={(term) => handleSearchWrapper(term, searchCategory)}
          setSearchCategory={(category) => handleSearchWrapper(searchTerm, category)} 
        />
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Referrals</h2>
          {filteredCandidates.length > 3 && (
            <Link 
              to="/admin/candidates"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View All Referrals
            </Link>
          )}
        </div>
        
        {selectedCandidates.size > 0 && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{selectedCandidates.size} candidates selected</span>
              <select
                className="border rounded px-2 py-1"
                value={bulkUpdateStatus}
                onChange={(e) => setBulkUpdateStatus(e.target.value)}
              >
                <option value="">Select status...</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={handleBulkStatusUpdate}
                disabled={!bulkUpdateStatus}
                className={`px-4 py-1 rounded ${
                  bulkUpdateStatus 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Update Status
              </button>
            </div>
            <button
              onClick={() => setSelectedCandidates(new Set())}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </button>
          </div>
        )}
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {filteredCandidates && filteredCandidates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredCandidates.slice(0, 3).map(candidate => (
              <CandidateCard 
                key={candidate._id || candidate.id} 
                candidate={candidate}
                isAdmin={true}
                updateCandidateStatus={updateCandidateStatus}
                onDelete={() => handleDeleteClickWrapper(candidate._id || candidate.id)}
                onSelect={handleSelectCandidate}
                isSelected={selectedCandidates.has(candidate._id || candidate.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No candidates found.</p>
        )}
      </div>

      <DeleteCandidateModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onConfirm={confirmDeleteCandidateWrapper}
        loading={loading}
      />
    </div>
  );
};

export default AdminDashboard;
