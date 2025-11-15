const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [5, 'Description must be at least 5 characters long'],
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  project: {
    type: String,
    trim: true,
    default: 'General',
  },
  stepsToReproduce: {
    type: [String],
    default: [''],
  },
  environment: {
    os: { type: String, default: '' },
    browser: { type: String, default: '' },
    version: { type: String, default: '' },
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bug', bugSchema);
