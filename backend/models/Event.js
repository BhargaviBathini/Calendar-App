const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: {
    type: String
  },
  color: { 
    type: String,
    default: '#2196F3'
  },
  start: { 
    type: Date, 
    required: true 
  },
  end: { 
    type: Date, 
    required: true 
  },
  goalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Goal',
    default: null
  },
  goal: {
    type: Object,
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt timestamp before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Event', eventSchema); 