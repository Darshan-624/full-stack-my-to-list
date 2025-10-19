const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- Middleware ---

// == START NEW CORS CONFIG ==
// This explicitly allows your Netlify site to make requests
const corsOptions = {
  origin: 'https://full-stack-my-todo-list.netlify.app',
  optionsSuccessStatus: 200
};
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