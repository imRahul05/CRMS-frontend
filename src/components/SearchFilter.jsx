import React from 'react';

const SearchFilter = ({ searchTerm, setSearchTerm, searchCategory, setSearchCategory }) => {
  return (
    <div className="flex flex-col md:flex-row mb-6 gap-4">
      <div className="relative w-full md:w-2/3">
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-full md:w-1/3">
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="jobTitle">Search by Job Title</option>
          <option value="status">Search by Status</option>
          <option value="name">Search by Name</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
