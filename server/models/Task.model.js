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
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    default: 'Other'
  },
  dueDate: {
    type: Date,
    default: null
  },
  userId: {
    type: String, // You can also use Schema.Types.ObjectId if you 'ref' it
    required: true
  }
}, {
  timestamps: true // Adds 'createdAt' and 'updatedAt' fields
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;