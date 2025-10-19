const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---

// == START NEW CORS CONFIG ==
// This is a more detailed configuration
const allowedOrigins = ['https://full-stack-my-todo-list.netlify.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request's origin is in our allowed list
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET, POST, PATCH, DELETE, OPTIONS', // Explicitly allow all methods
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
};

// Handle all preflight requests
app.options('*', cors(corsOptions)); 
// Use the CORS settings for all other requests
app.use(cors(corsOptions));
// == END NEW CORS CONFIG ==


app.use(express.json()); // Allows Express to parse JSON

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

// --- API Routes ---
const taskRoutes = require('./routes/task.routes');
app.use('/api/tasks', taskRoutes);

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});