import React, { useState } from 'react';

const TaskForm = ({ onAddTask, categories }) => {
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const taskData = {
      title: input,
      priority: priority,
      category: category || 'Other',
      dueDate: dueDate || null
    };

    await onAddTask(taskData);
    
    // Reset form
    setInput('');
    setDueDate('');
    setCategory('');
    setPriority('medium');
    setIsExpanded(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getNextWeekDate = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
        ➕ Add New Task
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* Main Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="✏️ What needs to be done?"
            className="flex-grow p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
            required
          />
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-3 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-white"
            title={isExpanded ? "Hide options" : "Show options"}
          >
            {isExpanded ? '🔼' : '🔽'}
          </button>
        </div>

        {/* Expanded Options */}
        {isExpanded && (
          <div className="space-y-4 mb-4 p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Priority Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎯 Priority Level
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'low', label: 'Low', color: 'bg-green-600', emoji: '🟢' },
                    { value: 'medium', label: 'Medium', color: 'bg-yellow-600', emoji: '🟡' },
                    { value: 'high', label: 'High', color: 'bg-red-600', emoji: '🔴' }
                  ].map(({ value, label, color, emoji }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPriority(value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        priority === value 
                          ? `${color} text-white` 
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      {emoji} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📁 Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                📅 Due Date
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setDueDate(getTodayDate())}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getTomorrowDate())}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm transition-colors"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setDueDate(getNextWeekDate())}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm transition-colors"
                >
                  Next Week
                </button>
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate('')}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm transition-colors"
                  >
                    Clear Date
                  </button>
                )}
              </div>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none focus:border-blue-500 transition-colors text-white"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-semibold text-white transform hover:scale-105 disabled:transform-none"
        >
          {input.trim() ? '✨ Add Task' : '📝 Enter a task to continue'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;