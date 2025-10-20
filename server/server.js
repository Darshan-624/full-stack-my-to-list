const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// --- Authentication related imports ---
// We don't directly use User model or bcrypt/jwt here,
// but ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  process.exit(1); // Exit the application if the secret is missing
}

const app = express();

// --- Middleware ---

// CORS Configuration (Updated to include local development ports)
const allowedOrigins = [
  'https://full-stack-my-todo-list.netlify.app',
  'http://localhost:3000', // for local development
  'http://localhost:3001', // for local development on alternate port
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET, POST, PATCH, DELETE', // Updated based on our fix
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(express.json()); // Allows Express to parse JSON

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });

// --- API Routes ---
// Import Route handlers
const taskRoutes = require('./routes/task.routes');
const authRoutes = require('./routes/auth.routes'); // <-- Import Auth Routes

// Import Auth Middleware
const authMiddleware = require('./middleware/auth.middleware'); // <-- Import Auth Middleware

// Public informational endpoints (No auth needed)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    cors: 'enabled' 
  });
});
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Todo API Server with Auth', 
    endpoints: {
      health: '/health',
      auth: '/api/auth', // <-- Added Auth endpoint info
      tasks: '/api/tasks' // <-- Protected endpoint
    }
  });
});

// Authentication Routes (Public)
app.use('/api/auth', authRoutes); // <-- Use Auth Routes for /register and /login

// Task Routes (Protected by Auth Middleware)
// Any request to /api/tasks/* MUST now pass the authMiddleware check first
app.use('/api/tasks', authMiddleware, taskRoutes); // <-- Added Auth Middleware HERE

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});