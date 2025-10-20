import React from 'react';

const TaskFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterCategory,
  setFilterCategory,
  categories,
  onClearFilters
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
        🔍 Search & Filters
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search tasks..."
            className="w-full p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
        >
          <option value="all">📋 All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="completed">✅ Completed</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
        >
          <option value="all">🎯 All Priorities</option>
          <option value="high">🔴 High Priority</option>
          <option value="medium">🟡 Medium Priority</option>
          <option value="low">🟢 Low Priority</option>
        </select>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
        >
          <option value="all">📁 All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>📁 {cat}</option>
          ))}
        </select>

        {/* Clear Filters Button */}
        <button
          onClick={onClearFilters}
          className="p-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 rounded-lg transition-all duration-200 font-semibold text-white transform hover:scale-105"
        >
          🧹 Clear All
        </button>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4 flex flex-wrap gap-2">
        {searchTerm && (
          <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
            Search: "{searchTerm}"
          </span>
        )}
        {filterStatus !== 'all' && (
          <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
            Status: {filterStatus}
          </span>
        )}
        {filterPriority !== 'all' && (
          <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm">
            Priority: {filterPriority}
          </span>
        )}
        {filterCategory !== 'all' && (
          <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
            Category: {filterCategory}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;