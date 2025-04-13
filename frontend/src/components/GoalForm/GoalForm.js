import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addGoal, addTask, updateGoal, deleteGoal } from '../../redux/slices/taskSlice';
import './GoalForm.css';

const GoalForm = () => {
  const dispatch = useDispatch();
  const goals = useSelector((state) => state.tasks.goals);
  const [goalName, setGoalName] = useState('');
  const [goalColor, setGoalColor] = useState('#4CAF50');
  const [taskName, setTaskName] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (goalName.trim()) {
      const newGoal = {
        id: Date.now().toString(),
        name: goalName.trim(),
        color: goalColor,
        tasks: []
      };
      dispatch(addGoal(newGoal));
      setGoalName('');
      setGoalColor('#4CAF50');
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskName.trim() && selectedGoalId) {
      const selectedGoal = goals.find(goal => goal.id === selectedGoalId);
      if (selectedGoal) {
        const newTask = {
          id: Date.now().toString(),
          name: taskName.trim(),
          color: selectedGoal.color
        };
        dispatch(addTask({ goalId: selectedGoalId, task: newTask }));
        setTaskName('');
      }
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalName(goal.name);
    setGoalColor(goal.color);
  };

  const handleUpdateGoal = (e) => {
    e.preventDefault();
    if (goalName.trim() && editingGoal) {
      const updatedGoal = {
        ...editingGoal,
        name: goalName.trim(),
        color: goalColor
      };
      dispatch(updateGoal(updatedGoal));
      setEditingGoal(null);
      setGoalName('');
      setGoalColor('#4CAF50');
    }
  };

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal? All tasks in this goal will also be deleted.')) {
      dispatch(deleteGoal(goalId));
      if (editingGoal && editingGoal.id === goalId) {
        setEditingGoal(null);
        setGoalName('');
        setGoalColor('#4CAF50');
      }
      if (selectedGoalId === goalId) {
        setSelectedGoalId('');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setGoalName('');
    setGoalColor('#4CAF50');
  };

  return (
    <div className="goal-form">
      <div className="form-section">
        <h3>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</h3>
        <form onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}>
          <div className="form-group">
            <input
              type="text"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="Enter goal name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="color"
              value={goalColor}
              onChange={(e) => setGoalColor(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="btn-primary">
              {editingGoal ? 'Update Goal' : 'Add Goal'}
            </button>
            {editingGoal && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="form-section">
        <h3>Add Task to Goal</h3>
        <form onSubmit={handleAddTask}>
          <div className="form-group">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>
          <div className="form-group">
            <select
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              required
            >
              <option value="">Select a goal</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary">Add Task</button>
        </form>
      </div>

      <div className="form-section">
        <h3>Manage Goals</h3>
        <div className="goals-list">
          {goals.map((goal) => (
            <div key={goal.id} className="goal-item">
              <div
                className="goal-color"
                style={{ backgroundColor: goal.color }}
              />
              <span className="goal-name">{goal.name}</span>
              <div className="goal-actions">
                <button
                  className="btn-icon"
                  onClick={() => handleEditGoal(goal)}
                  title="Edit goal"
                >
                  ✎
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDeleteGoal(goal.id)}
                  title="Delete goal"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
          {goals.length === 0 && (
            <div className="empty-state">
              <p>No goals added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalForm; 