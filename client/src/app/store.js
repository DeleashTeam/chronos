import { configureStore } from '@reduxjs/toolkit';
import apiSlice from './api/apiSlice';
import authReducer from '../features/auth/auth.slice';
import userReducer from '../features/user/user.slice';
import calendarsReducer from '../features/calendars/calendars.slice';
import eventReducer from '../features/event/event.slice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    user: userReducer,
    calendars: calendarsReducer,
    event: eventReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(apiSlice.middleware),
  devTools: true,
});

export default store;
