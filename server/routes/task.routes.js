const router = require('express').Router();
const Task = require('../models/Task.model');
const authMiddleware = require('../middleware/auth.middleware'); // <-- 1. Import the middleware

// --- Apply authMiddleware to ALL task routes ---

// GET ALL TASKS (Now only gets tasks for the logged-in user)
router.get('/', authMiddleware, async (req, res) => { // <-- 2. Middleware added
  try {
    // 3. Find tasks belonging ONLY to the logged-in user (req.user.id comes from the middleware)
    const tasks = await Task.find({ userId: req.user.id }); 
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE A TASK (Now links the task to the user)
router.post('/', authMiddleware, async (req, res) => { // <-- 2. Middleware added
  const task = new Task({
    title: req.body.title,
    priority: req.body.priority || 'medium',
    category: req.body.category || 'Other',
    dueDate: req.body.dueDate || null,
    userId: req.user.id // <-- 4. Automatically link the task to the logged-in user
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE A TASK (Now only lets the user update their *own* tasks)
router.patch('/:id', authMiddleware, async (req, res) => { // <-- 2. Middleware added
  try {
    // 5. Find the task ONLY if it matches the ID AND belongs to the user
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      // Return 404 even if the task exists but belongs to someone else
      return res.status(404).json({ message: "Task not found or you don't have permission" });
    }

    // Update fields if provided in the request body
    if (req.body.hasOwnProperty('isCompleted')) {
      task.isCompleted = req.body.isCompleted;
    } else if (req.body.title === undefined) {
      // If no specific update is provided, toggle completion status (backward compatibility)
      task.isCompleted = !task.isCompleted;
    }

    if (req.body.title !== undefined) {
      task.title = req.body.title;
    }
    if (req.body.priority !== undefined) {
      task.priority = req.body.priority;
    }
    if (req.body.category !== undefined) {
      task.category = req.body.category;
    }
    if (req.body.dueDate !== undefined) {
      task.dueDate = req.body.dueDate;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE A TASK (Now only lets the user delete their *own* tasks)
router.delete('/:id', authMiddleware, async (req, res) => { // <-- 2. Middleware added
  try {
    // 6. Find and delete the task ONLY if it matches the ID AND belongs to the user
    const result = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    
    if (!result) {
      // Return 404 if the task doesn't exist or doesn't belong to the user
      return res.status(404).json({ message: "Task not found or you don't have permission" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;