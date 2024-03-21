import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.currentUser = null;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInSuccess,
  signInStart,
  signInFail,
  signOutSuccess,
  updateStart,
  updateSuccess,
  updateFail,
} = userSlice.actions;

export default userSlice.reducer;
