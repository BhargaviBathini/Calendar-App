import { createSlice } from '@reduxjs/toolkit';

const goalsSlice = createSlice({
  name: 'goals',
  initialState: [],
  reducers: {
    setGoals: (state, action) => action.payload,
  },
});

export const { setGoals } = goalsSlice.actions;
export default goalsSlice.reducer;
