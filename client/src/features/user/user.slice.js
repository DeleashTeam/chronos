/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const userSlice = createSlice({
  name: 'auth',
  initialState: { users: [] },
  reducers: {
    userError: (state, { payload }) => {
      toast.error(payload.data?.message || payload.error, {
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    },
    setUsers: (state, { payload }) => {
      const { users } = payload;
      state.users = users;
    },
  },
});

export const { userError, setUsers } = userSlice.actions;

export default userSlice.reducer;
