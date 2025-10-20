import React from 'react';

const Statistics = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };
  
  const overdueTasks = tasks.filter(task => !task.isCompleted && isOverdue(task.dueDate)).length;
  
  const highPriorityTasks = tasks.filter(task => !task.isCompleted && task.priority === 'high').length;
  const tasksCompletedToday = tasks.filter(task => 
    task.isCompleted && new Date(task.updatedAt || task.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`${color} p-4 rounded-lg text-center transform transition-transform hover:scale-105`}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-200">{title}</div>
      {subtitle && <div className="text-xs text-gray-300 mt-1">{subtitle}</div>}
    </div>
  );

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-center text-gray-300 mb-4">📊 Task Statistics</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon="📝"
          color="bg-gradient-to-br from-blue-600 to-blue-700"
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon="✅"
          color="bg-gradient-to-br from-green-600 to-green-700"
        />
        <StatCard
          title="Pending"
          value={pendingTasks}
          icon="⏳"
          color="bg-gradient-to-br from-orange-600 to-orange-700"
        />
        <StatCard
          title="Progress"
          value={`${completionPercentage}%`}
          icon="📈"
          color="bg-gradient-to-br from-purple-600 to-purple-700"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks}
          icon="⚠️"
          color="bg-gradient-to-br from-red-600 to-red-700"
        />
        <StatCard
          title="High Priority"
          value={highPriorityTasks}
          icon="🔥"
          color="bg-gradient-to-br from-pink-600 to-pink-700"
        />
      </div>
      
      {/* Progress Bar */}
      {totalTasks > 0 && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Overall Progress</span>
            <span>{completedTasks} of {totalTasks} tasks completed</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Quick Insights */}
      <div className="mt-4 text-center text-sm text-gray-400">
        {tasksCompletedToday > 0 && (
          <span className="text-green-400">🎉 {tasksCompletedToday} task{tasksCompletedToday !== 1 ? 's' : ''} completed today!</span>
        )}
        {overdueTasks > 0 && (
          <span className="text-red-400 ml-4">⚠️ {overdueTasks} overdue task{overdueTasks !== 1 ? 's' : ''}</span>
        )}
      </div>
    </div>
  );
};

export default Statistics;