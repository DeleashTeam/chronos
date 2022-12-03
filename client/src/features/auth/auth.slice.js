/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, user: null, isAuthenticated: false },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;
      state.token = accessToken;
      state.user = user;
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
    authError: (state, { payload }) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      toast.error(payload.data?.message || payload.error, {
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    },
  },
});

export const { setCredentials, logOut, authError } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthenticatedUser = (state) => state.auth.user;
