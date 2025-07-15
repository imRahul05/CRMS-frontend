import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CandidateCard from '../../components/CandidateCard';
import SearchFilter from '../../components/SearchFilter';
import Pagination from '../../components/Pagination';
import Notification from '../../components/Notification';
import { fetchAdminReferrals } from '../../api/api';
import { toast } from 'react-toastify';
import DeleteCandidateModal from '../../components/DeleteCandidateModal';
import { useAdminCandidateActions } from '../../api/admin/CandidateUpdation';
import axios from '../../api/axios';


const CandidateList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('name');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCandidates, setSelectedCandidates] = useState(new Set());
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const itemsPerPage = 6;

  const {
    updateCandidateStatus,
    handleSearch,
    handleDeleteClick: createHandleDeleteClick,
    confirmDeleteCandidate: createConfirmDeleteCandidate
  } = useAdminCandidateActions(
    candidates,
    setCandidates,
    setFilteredCandidates,
    setLoading,
    searchTerm,
    searchCategory
  );

  useEffect(() => {
    const fetchCandidates = async () => {
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

    fetchCandidates();
  }, []);

  const handleSearchWrapper = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
    handleSearch(term, category);
  };

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

  const handleBulkStatusUpdate = async () => {
    if (selectedCandidates.size === 0 || !bulkUpdateStatus) {
      toast.warning('Please select candidates and a status to update');
      return;
    }

    try {
      setLoading(true);
      const updates = Array.from(selectedCandidates).map(referralId => ({
        referralId,
        status: bulkUpdateStatus
      }));

      await axios.put('/api/user/admin/referrals/bulk-status-update', {
        updates
      });

      // Update local state
      const updatedCandidates = candidates.map(candidate => {
        if (selectedCandidates.has(candidate._id || candidate.id)) {
          return { ...candidate, status: bulkUpdateStatus };
        }
        return candidate;
      });

      setCandidates(updatedCandidates);
      setFilteredCandidates(updatedCandidates.filter(c =>
        !searchTerm.trim() || c[searchCategory]?.toLowerCase().includes(searchTerm.toLowerCase())
      ));

      // Reset selection
      setSelectedCandidates(new Set());
      setBulkUpdateStatus('');
      
      toast.success('Bulk status update successful');
    } catch (err) {
      toast.error('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const getCurrentPageItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  };

  const renderCandidatesList = (candidates) => (
    <div className="space-y-4">
      {candidates.map(candidate => (
        <div
          key={candidate._id || candidate.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              className="w-4 h-4 mr-2 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              onChange={(e) => handleSelectCandidate(candidate._id || candidate.id, e.target.checked)}
              checked={selectedCandidates.has(candidate._id || candidate.id)}
            />
          </div>
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{candidate.name}</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-gray-600">Email: {candidate.email}</p>
                  <p className="text-gray-600">Phone: {candidate.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Job Title: {candidate.jobTitle}</p>
                  <p className="text-gray-600">
                    Status:
                    <span className={`ml-2 px-2 py-1 rounded text-sm ${
                      candidate.status === 'Hired' ? 'bg-green-100 text-green-800' :
                      candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      candidate.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {candidate.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <select
                className="bg-white border rounded px-2 py-1 text-sm"
                value={candidate.status}
                onChange={(e) => updateCandidateStatus(candidate._id || candidate.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={() => handleDeleteClickWrapper(candidate._id || candidate.id)}
                className="text-white bg-red-500 hover:bg-red-600 text-sm px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCandidatesGrid = (candidates) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {candidates.map(candidate => (
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Candidate Referrals</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              List
            </button>
          </div>
          <Link
            to="/admin"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {selectedCandidates.size > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
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

      <div className="mb-6">
        <SearchFilter
          searchTerm={searchTerm}
          searchCategory={searchCategory}
          setSearchTerm={(term) => handleSearchWrapper(term, searchCategory)}
          setSearchCategory={(category) => handleSearchWrapper(searchTerm, category)}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        {filteredCandidates && filteredCandidates.length > 0 ? (
          <>
            {viewMode === 'grid'
              ? renderCandidatesGrid(getCurrentPageItems(filteredCandidates))
              : renderCandidatesList(getCurrentPageItems(filteredCandidates))
            }
            {filteredCandidates.length > itemsPerPage && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No candidates found.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteCandidateModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onConfirm={confirmDeleteCandidateWrapper}
        loading={loading}
      />
    </div>
  );
};

export default CandidateList;
