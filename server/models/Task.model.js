const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds 'createdAt' and 'updatedAt' fields
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;