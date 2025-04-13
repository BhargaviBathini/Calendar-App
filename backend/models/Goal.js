const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
  color: { 
    type: String,
    required: true
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

const goalSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  color: { 
    type: String, 
    required: true 
  },
  tasks: [taskSchema],
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
goalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.tasks && this.tasks.length > 0) {
    this.tasks.forEach(task => {
      task.updatedAt = Date.now();
    });
  }
  next();
});

module.exports = mongoose.model('Goal', goalSchema); 