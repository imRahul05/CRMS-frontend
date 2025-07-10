import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CandidateCard = ({ candidate, updateCandidateStatus, isAdmin, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleEdit = () => {
     const candidateId = candidate._id || candidate.id;
     console.log('Editing candidate:', candidateId);
     navigate(`/update/${candidateId}`);
  };
  
  const isUserAdmin = isAdmin || (user && user.role === 'admin');
  
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-bold text-lg">{candidate.name}</h3>
      <p className="text-gray-600">{candidate.jobTitle}</p>
      <p className="text-sm">{candidate.email}</p>
      <p className="text-sm">{candidate.phone}</p>
    <p className="text-sm">
  <a 
    href={candidate.resume} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="text-blue-600 hover:underline"
  >
    View Resume
  </a>
</p>
      <div className="flex items-center justify-between mt-4">
        <span className={`px-2 py-1 rounded-full text-xs ${
          candidate.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
          candidate.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' : 
          candidate.status === 'Hired' ? 'bg-green-100 text-green-800' :
          candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {candidate.status}
        </span>
        
        {isUserAdmin && (
          <select
            className="text-sm border rounded py-1 px-2"
            value={candidate.status}
            onChange={(e) => updateCandidateStatus(candidate._id || candidate.id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
        )}
      </div>
      
      {/* {isUserAdmin && (
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
         disabled >
            Edit
          </button>
          <button 
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
         disabled >
            Delete
          </button>
        </div>
      )} */}
      
      {!isUserAdmin && (
        <div className="mt-4 text-gray-500 text-sm italic">
          <p>Status updates are managed by administrators.</p>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
