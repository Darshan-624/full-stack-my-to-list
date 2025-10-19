import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

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
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Don't add empty tasks

    try {
      const res = await createTask(input);
      setTasks([...tasks, res.data]); // Add new task to state
      setInput(''); // Clear input
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // 3. Handle Toggle Complete
  const handleToggleComplete = async (id) => {
    try {
      const res = await updateTask(id);
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

  return (
    // Main container with dark mode background
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-8">

      {/* Centered content block */}
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-blue-400 mb-8">
          My To-Do List
        </h1>

        {/* --- Task Input Form --- */}
        <form onSubmit={handleAddTask} className="flex mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-3 rounded-l-lg bg-gray-800 border-2 border-gray-700 focus:outline-none focus:border-blue-500 transition-colors text-white"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 rounded-r-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Add
          </button>
        </form>

        {/* --- Task List --- */}
        <div className="space-y-4">
          {tasks.map(task => (
            <div
              key={task._id}
              className={`
                flex flex-col sm:flex-row items-center justify-between 
                p-4 bg-gray-800 rounded-lg shadow-lg 
                border-l-4 ${task.isCompleted ? 'border-green-500' : 'border-gray-600'}
              `}
            >

              {/* Task Title */}
              <span 
                className={`
                  text-lg cursor-pointer mb-2 sm:mb-0
                  ${task.isCompleted ? 'line-through text-gray-500' : ''}
                `}
                onClick={() => handleToggleComplete(task._id)}
              >
                {task.title}
              </span>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleToggleComplete(task._id)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${task.isCompleted 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'}
                  `}
                >
                  {task.isCompleted ? 'Undo' : 'Done'}
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;