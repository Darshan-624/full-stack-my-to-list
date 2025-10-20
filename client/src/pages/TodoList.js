import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import Statistics from '../components/Statistics';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import TaskCard from '../components/TaskCard';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Predefined categories
  const categories = ['Personal', 'Work', 'Shopping', 'Health', 'Study', 'Other'];

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  // 1. Fetch tasks when the app loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  // 2. Handle Add Task
  const handleAddTask = async (taskData) => {
    try {
      const res = await createTask(taskData);
      setTasks([...tasks, res.data]); // Add new task to state
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // 3. Handle Toggle Complete
  const handleToggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const res = await updateTask(id, { isCompleted: !task.isCompleted });
      // Update the task in the state
      setTasks(tasks.map(task => 
        task._id === id ? res.data : task
      ));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // 4. Handle Delete Task
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      // Filter out the deleted task from state
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // 5. Handle Edit Task
  const handleEditTask = async (id, newTitle) => {
    if (!newTitle.trim()) return;
    
    try {
      const res = await updateTask(id, { title: newTitle });
      setTasks(tasks.map(task => 
        task._id === id ? res.data : task
      ));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterCategory('all');
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'completed' && task.isCompleted) ||
      (filterStatus === 'pending' && !task.isCompleted);
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter(task => !task.isCompleted && isOverdue(task.dueDate)).length;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-blue-400 mb-8">
          🚀 Enhanced To-Do List
        </h1>

        {/* Statistics Dashboard */}
        <Statistics tasks={tasks} />

        {/* Task Input Form */}
        <TaskForm onAddTask={handleAddTask} categories={categories} />

        {/* Search and Filters */}
        <TaskFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          categories={categories}
          onClearFilters={clearFilters}
        />

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">📝</div>
              <div className="text-xl mb-2">
                {tasks.length === 0 ? 'No tasks yet!' : 'No tasks match your filters.'}
              </div>
              <div className="text-sm">
                {tasks.length === 0 
                  ? 'Add your first task to get started.' 
                  : 'Try adjusting your search or filters.'}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-300">
                  📋 Tasks ({filteredTasks.length})
                </h2>
                {filteredTasks.length !== tasks.length && (
                  <span className="text-sm text-gray-400">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                  </span>
                )}
              </div>
              {filteredTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  isOverdue={isOverdue(task.dueDate)}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;