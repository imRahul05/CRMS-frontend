import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import { useCandidates } from '../contexts/CandidateContext';

const UpdateCandidate = () => {
  const { candidates, updateCandidate, loading, error, success, clearMessages } = useCandidates();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jobTitle: '',
    status: '',
    resume: null
  });

  useEffect(() => {
    const candidateId = parseInt(id);
    const candidateToUpdate = candidates.find(c => c.id === candidateId);
    
    if (candidateToUpdate) {
      setFormData({
        name: candidateToUpdate.name,
        email: candidateToUpdate.email,
        phone: candidateToUpdate.phone,
        jobTitle: candidateToUpdate.jobTitle,
        status: candidateToUpdate.status,
        resume: candidateToUpdate.resume
      });
    } else {
      setError('Candidate not found');
    }
  }, [id, candidates]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') {
      alert('Please upload only PDF files');
      e.target.value = null;
      return;
    }
    setFormData({
      ...formData,
      resume: file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    
    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.jobTitle) {
        throw new Error('Please fill all required fields');
      }
      
      const updatedCandidate = {
        id: parseInt(id),
        ...formData,
        resume: formData.resume instanceof File ? URL.createObjectURL(formData.resume) : formData.resume
      };
      
      // Call the updateCandidate function from props
      await updateCandidate(updatedCandidate);
      
      setSuccess('Candidate updated successfully!');
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating candidate:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Update Candidate</h1>
      
      <Notification error={error} success={success} />
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Candidate Name*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                name="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
                Job Title*
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="jobTitle"
                name="jobTitle"
                type="text"
                placeholder="Job Title"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                Status*
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resume">
                Resume (PDF only)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="resume"
                name="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {formData.resume && !formData.resume instanceof File && (
                <p className="text-sm text-gray-600 mt-1">Current file: Resume on file</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCandidate;
