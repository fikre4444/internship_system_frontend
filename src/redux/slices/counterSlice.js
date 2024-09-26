import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: "idle",
  value: 0
};

export const counterSlice = createSlice({
  name: "counter",
  initialState: initialState,
  reducers : {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    makeActiveAndIncrementByAmount: (state, action) => {
      const { amount, statusChange } = action.payload;
      state.value += amount;
      state.status = statusChange;
    }
  }
});

export const {increment, decrement, incrementByAmount, makeActiveAndIncrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;