import { toast } from 'react-toastify';
import { updateCandidateStatus as apiUpdateStatus, deleteCandidate as apiDeleteCandidate } from '../api';
import axios from '../axios';

export const useAdminCandidateActions = (
  candidates,
  setCandidates,
  setFilteredCandidates,
  setLoading,
  searchTerm,
  searchCategory
) => {
  const updateCandidateStatus = async (id, newStatus) => {
    try {
      setLoading(true);
      await apiUpdateStatus(id, newStatus);
      
      const updatedCandidates = candidates.map(candidate => 
        candidate._id === id || candidate.id === id 
          ? { ...candidate, status: newStatus } 
          : candidate
      );
      
      setCandidates(updatedCandidates);
      setFilteredCandidates(updatedCandidates.filter(c => 
        !searchTerm.trim() || c[searchCategory]?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      
      toast.success(`Candidate status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update candidate status');
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term, category) => {
    if (!term.trim()) {
      setFilteredCandidates(candidates);
      return;
    }
    
    const filtered = candidates.filter(candidate => 
      candidate[category]?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCandidates(filtered);
  };

  const handleDeleteClick = (setSelectedCandidateId, setModalIsOpen) => (id) => {
    setSelectedCandidateId(id);
    setModalIsOpen(true);
  };

  const confirmDeleteCandidate = async (
    selectedCandidateId,
    setModalIsOpen,
    setSelectedCandidateId
  ) => {
    if (!selectedCandidateId) return;
    
    try {
      setLoading(true);
      await apiDeleteCandidate(selectedCandidateId);

      const updatedCandidates = candidates.filter(
        candidate => candidate._id !== selectedCandidateId && candidate.id !== selectedCandidateId
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
      setModalIsOpen(false);
      setSelectedCandidateId(null);
    }
  };

  // Bulk update functionality
  const handleBulkStatusUpdate = async (
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
  ) => {
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

  return {
    updateCandidateStatus,
    handleSearch,
    handleDeleteClick,
    confirmDeleteCandidate,
    handleBulkStatusUpdate
  };
};

// Additional admin-specific functions
export const calculateStats = (candidates) => {
  if (!candidates || candidates.length === 0) {
    return {
      total: 0,
      pending: 0,
      reviewed: 0,
      hired: 0,
      rejected: 0
    };
  }

  return candidates.reduce(
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
};