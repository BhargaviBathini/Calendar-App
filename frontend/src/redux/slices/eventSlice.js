import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/events`);
      return response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const formattedData = {
        ...eventData,
        start: new Date(eventData.start).toISOString(),
        end: new Date(eventData.end).toISOString(),
        goalId: eventData.goalId || null
      };
      const response = await axios.post(`${API_URL}/events`, formattedData);
      return {
        ...response.data,
        start: new Date(response.data.start),
        end: new Date(response.data.end)
      };
    } catch (error) {
      console.error('Error creating event:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const formattedData = {
        ...eventData,
        start: new Date(eventData.start).toISOString(),
        end: new Date(eventData.end).toISOString(),
        goalId: eventData.goalId || null
      };
      const response = await axios.put(`${API_URL}/events/${id}`, formattedData);
      return {
        ...response.data,
        start: new Date(response.data.start),
        end: new Date(response.data.end)
      };
    } catch (error) {
      console.error('Error updating event:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/events/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting event:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
  }
);

export const searchEvents = createAsyncThunk(
  'events/searchEvents',
  async ({ searchTerm, filters }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }
      const response = await axios.get(`${API_URL}/events/search?${params.toString()}`);
      return response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
    } catch (error) {
      console.error('Error searching events:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to search events');
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    loading: false,
    error: null,
    searchResults: [],
    searchLoading: false,
    searchError: null
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(event => event._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search events
      .addCase(searchEvents.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchEvents.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  }
});

export const { clearSearchResults } = eventSlice.actions;
export default eventSlice.reducer; 