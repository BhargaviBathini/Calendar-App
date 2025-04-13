const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

// Get all goals
router.get('/', goalController.getGoals);

// Create a new goal
router.post('/', goalController.createGoal);

// Update a goal
router.put('/:id', goalController.updateGoal);

// Delete a goal
router.delete('/:id', goalController.deleteGoal);

// Add a task to a goal
router.post('/:id/tasks', goalController.addTask);

// Update a task in a goal
router.put('/:goalId/tasks/:taskId', goalController.updateTask);

// Delete a task from a goal
router.delete('/:goalId/tasks/:taskId', goalController.deleteTask);

module.exports = router; 