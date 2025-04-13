import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Async thunks
export const fetchGoals = createAsyncThunk(
  'goals/fetchGoals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/goals`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createGoal = createAsyncThunk(
  'goals/createGoal',
  async (goalData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/goals`, goalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ id, goalData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/goals/${id}`, goalData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/goals/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTask = createAsyncThunk(
  'goals/addTask',
  async ({ goalId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/goals/${goalId}/tasks`, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTask = createAsyncThunk(
  'goals/updateTask',
  async ({ goalId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/goals/${goalId}/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'goals/deleteTask',
  async ({ goalId, taskId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/goals/${goalId}/tasks/${taskId}`);
      return { goalId, taskId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  goals: [],
  loading: false,
  error: null,
  selectedGoalId: null,
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setSelectedGoal: (state, action) => {
      state.selectedGoalId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch goals
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch goals';
      })
      // Create goal
      .addCase(createGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      // Update goal
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(goal => goal._id === action.payload._id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      // Delete goal
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(goal => goal._id !== action.payload);
        if (state.selectedGoalId === action.payload) {
          state.selectedGoalId = null;
        }
      })
      // Add task
      .addCase(addTask.fulfilled, (state, action) => {
        const goal = state.goals.find(g => g._id === action.payload._id);
        if (goal) {
          goal.tasks = action.payload.tasks;
        }
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const goal = state.goals.find(g => g._id === action.payload._id);
        if (goal) {
          goal.tasks = action.payload.tasks;
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        const goal = state.goals.find(g => g._id === action.payload.goalId);
        if (goal) {
          goal.tasks = goal.tasks.filter(task => task._id !== action.payload.taskId);
        }
      });
  },
});

export const { setSelectedGoal } = goalSlice.actions;

export default goalSlice.reducer; 