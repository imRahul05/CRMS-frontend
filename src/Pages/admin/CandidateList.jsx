import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CandidateCard from '../../components/CandidateCard';
import SearchFilter from '../../components/SearchFilter';
import Pagination from '../../components/Pagination';
import Notification from '../../components/Notification';
import { fetchAdminReferrals, updateCandidateStatus as apiUpdateStatus, deleteCandidate as apiDeleteCandidate } from '../../api/api';
import { toast } from 'react-toastify';

const CandidateList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('name');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const itemsPerPage = 6;

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

  const handleSearch = (term, category) => {
    setSearchTerm(term);
    setSearchCategory(category);
    setCurrentPage(1);
    
    if (!term.trim()) {
      setFilteredCandidates(candidates);
      return;
    }
    
    const filtered = candidates.filter(candidate => 
      candidate[category]?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCandidates(filtered);
  };

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

  const handleDeleteCandidate = async (id) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        setLoading(true);
        await apiDeleteCandidate(id);
        
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

  // Calculate total pages
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  // Get current page items
  const getCurrentPageItems = (items) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Candidate Referrals</h1>
        <Link 
          to="/admin" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Dashboard
        </Link>
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
        {filteredCandidates && filteredCandidates.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCurrentPageItems(filteredCandidates).map(candidate => (
                <CandidateCard 
                  key={candidate._id || candidate.id} 
                  candidate={candidate}
                  isAdmin={true}
                  updateCandidateStatus={updateCandidateStatus}
                  onDelete={() => handleDeleteCandidate(candidate._id || candidate.id)}
                />
              ))}
            </div>
            {filteredCandidates.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <p className="text-gray-500">No candidates found.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateList;
