import { createSlice } from '@reduxjs/toolkit';

const eventsSlice = createSlice({
  name: 'events',
  initialState: [],
  reducers: {
    setEvents: (state, action) => action.payload,
    addEvent: (state, action) => {
      state.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.findIndex(e => e._id === action.payload._id);
      if (index !== -1) state[index] = action.payload;
    },
    deleteEvent: (state, action) => {
      return state.filter(e => e._id !== action.payload);
    },
  },
});

export const { setEvents, addEvent, updateEvent, deleteEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
