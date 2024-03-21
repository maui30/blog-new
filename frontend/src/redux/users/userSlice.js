import { createSlice } from "@reduxjs/toolkit";
import { isThisQuarter } from "date-fns";

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
    deleteStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = null;
      state.error = null;
    },
    deleteFail: (state, action) => {
      state.loading = null;
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
  deleteStart,
  deleteSuccess,
  deleteFail,
} = userSlice.actions;

export default userSlice.reducer;
