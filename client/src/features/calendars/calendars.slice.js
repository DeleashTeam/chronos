/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const calendarsSlice = createSlice({
  name: 'calendars',
  initialState: { calendars: [], calendar: null, upcomingEvents: [] },
  reducers: {
    calendarsError: (state, { payload }) => {
      toast.error(payload.data?.message || payload.error || payload.data.error, {
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    },
    getCalendars: (state, { payload }) => {
      const { calendars } = payload;
      state.calendars = calendars;
    },
    createCalendar: (state, { payload }) => {
      const { calendar } = payload;
      state.calendars.push(calendar);
    },
    getCalendar: (state, { payload }) => {
      const { calendar } = payload;
      state.calendar = calendar;
    },
    getEvents: (state, { payload }) => {
      const { events } = payload;
      state.upcomingEvents = events;
    },
    deleteCalendar: (state, { payload }) => {
      state.calendars.filter((calendar) => calendar._id !== payload);
      state.calendar = state.calendar._id === payload ? state.calendars[0] : state.calendar;
    },
    updateCalendar: (state, { payload }) => {
      console.log(payload);
      state.calendars[state.calendars.findIndex((el) => el._id === payload._id)] = payload;
    },
  },
});

export const {
  calendarsError,
  getCalendars,
  getCalendar,
  createCalendar,
  getEvents,
  updateCalendar,
  deleteCalendar,
} = calendarsSlice.actions;

export default calendarsSlice.reducer;

export const selectCalendars = (state) => state.calendars.calendars;
export const selectCalendar = (state) => state.calendars.calendar;
