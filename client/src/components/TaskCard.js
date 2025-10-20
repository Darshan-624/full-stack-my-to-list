import React, { useState } from 'react';

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  isOverdue 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(task._id, editText);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(task.title);
    setIsEditing(false);
  };

  return (
    <div
      className={`
        bg-gray-800 rounded-lg shadow-lg p-4
        border-l-4 ${getPriorityColor(task.priority || 'medium')}
        ${task.isCompleted ? 'opacity-75' : ''}
        ${isOverdue && !task.isCompleted ? 'ring-2 ring-red-500' : ''}
        transition-all duration-200 hover:shadow-xl
      `}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-grow">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-grow p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                autoFocus
              />
              <button
                onClick={handleSaveEdit}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
              >
                ✓
              </button>
              <button
                onClick={handleCancelEdit}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
              >
                ✗
              </button>
            </div>
          ) : (
            <div>
              <div 
                className={`
                  text-lg cursor-pointer transition-colors
                  ${task.isCompleted ? 'line-through text-gray-500' : 'hover:text-blue-400'}
                `}
                onClick={() => onToggleComplete(task._id)}
              >
                {task.title}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'}`}>
                  {(task.priority || 'medium').toUpperCase()}
                </span>
                {task.category && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    📁 {task.category}
                  </span>
                )}
                {task.dueDate && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${isOverdue && !task.isCompleted ? 'bg-red-100 text-red-800' : 'bg-purple-100 text-purple-800'}`}>
                    📅 {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
                {isOverdue && !task.isCompleted && (
                  <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-medium animate-pulse">
                    ⚠️ OVERDUE
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => onToggleComplete(task._id)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${task.isCompleted 
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'}`}
            title={task.isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.isCompleted ? '↶' : '✓'}
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;