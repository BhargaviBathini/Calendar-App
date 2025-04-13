import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  goals: [],
  selectedGoalId: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setGoals: (state, action) => {
      state.goals = action.payload;
    },
    setSelectedGoal: (state, action) => {
      state.selectedGoalId = action.payload;
    },
    addGoal: (state, action) => {
      state.goals.push(action.payload);
    },
    updateGoal: (state, action) => {
      const index = state.goals.findIndex(goal => goal.id === action.payload.id);
      if (index !== -1) {
        state.goals[index] = action.payload;
      }
    },
    deleteGoal: (state, action) => {
      state.goals = state.goals.filter(goal => goal.id !== action.payload);
    },
    addTask: (state, action) => {
      const { goalId, task } = action.payload;
      const goalIndex = state.goals.findIndex(goal => goal.id === goalId);
      if (goalIndex !== -1) {
        state.goals[goalIndex].tasks.push(task);
      }
    },
    updateTask: (state, action) => {
      const { goalId, taskId, updates } = action.payload;
      const goalIndex = state.goals.findIndex(goal => goal.id === goalId);
      if (goalIndex !== -1) {
        const taskIndex = state.goals[goalIndex].tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          state.goals[goalIndex].tasks[taskIndex] = {
            ...state.goals[goalIndex].tasks[taskIndex],
            ...updates
          };
        }
      }
    },
    deleteTask: (state, action) => {
      const { goalId, taskId } = action.payload;
      const goalIndex = state.goals.findIndex(goal => goal.id === goalId);
      if (goalIndex !== -1) {
        state.goals[goalIndex].tasks = state.goals[goalIndex].tasks.filter(task => task.id !== taskId);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setGoals,
  setSelectedGoal,
  addGoal,
  updateGoal,
  deleteGoal,
  addTask,
  updateTask,
  deleteTask,
  setLoading,
  setError,
} = taskSlice.actions;

export default taskSlice.reducer; 