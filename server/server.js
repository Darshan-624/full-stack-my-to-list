const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---

// == START NEW CORS CONFIG ==
const allowedOrigins = ['https://full-stack-my-todo-list.netlify.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the request's origin is in our allowed list OR if it's not a browser (e.g., Postman)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET, POST, PATCH, DELETE', // Specify allowed methods
  optionsSuccessStatus: 204 // Use 204 "No Content" for preflight
};

// Use the CORS settings for all requests. This will handle preflight requests.
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