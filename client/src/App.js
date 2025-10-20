import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TodoList from './pages/TodoList'; // Your old App.js code

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <div>
      {/* --- Main Navigation --- */}
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-400">My To-Do App</Link>
          <div>
            {!token ? (
              <>
                <Link to="/login" className="mr-4">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <>
                <span className="mr-4">Welcome, {user.username}!</span>
                <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- App Routes --- */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* --- Protected Route --- */}
        <Route 
          path="/" 
          element={
            token ? <TodoList /> : <Navigate to="/login" />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;