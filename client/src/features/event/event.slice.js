/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    event: null,
    eventId: null,
    messages: [],
    socket: null,
  },
  reducers: {
    eventError: (state, { payload }) => {
      toast.error(payload.data?.message || payload.error || payload.data.error, {
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    },
    getEvent: (state, { payload }) => {
      const { event } = payload;
      state.event = event;
    },
    getMessages: (state, { payload }) => {
      const { messages } = payload;
      state.messages = messages;
    },
    getEventId: (state, { payload }) => {
      const { _id: eventId } = payload;
      state.eventId = eventId;
    },
    getSocket: (state, { payload }) => {
      const { socket } = payload;
      state.socket = socket;
    },
  },
});

export const {
  eventError, getEvent, getMessages, getEventId, getSocket,
} = eventSlice.actions;

export default eventSlice.reducer;

export const selectEvent = (state) => state.event.event;
export const selectMessages = (state) => state.event.messages;
export const selectEventId = (state) => state.event.eventId;
export const selectSocket = (state) => state.event.socket;
