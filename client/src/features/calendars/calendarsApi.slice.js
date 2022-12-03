import apiSlice from '../../app/api/apiSlice';
import {
  getCalendars,
  calendarsError,
  getCalendar,
  createCalendar,
  deleteCalendar,
  getEvents,
  updateCalendar,
} from './calendars.slice';

export const calendarsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCalendars: builder.mutation({
      query: (params) => ({
        url: '/calendars',
        method: 'GET',
        params,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(getCalendars(data));
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    getCalendar: builder.mutation({
      query: (id) => ({
        url: `/calendars/${id}`,
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(getCalendar(data));
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    createCalendar: builder.mutation({
      query: (body) => ({
        url: '/calendars',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(createCalendar(data));
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    deleteCalendar: builder.mutation({
      query: (id) => ({
        url: `/calendars/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(deleteCalendar(arg));
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    updateCalendar: builder.mutation({
      query: ({ body, id }) => ({
        url: `/calendars/${id}`,
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(updateCalendar(data));
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    joinCalendar: builder.mutation({
      query: (token) => ({
        url: `/calendars/join/${token}`,
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    getEvents: builder.mutation({
      query: ({ id, params }) => ({
        url: `/calendars/${id}/getEvents`,
        params,
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(getEvents(data));
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    inviteUser: builder.mutation({
      query: ({ id, login }) => ({
        url: `/calendars/${id}/user`,
        method: 'POST',
        body: { login },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    createEvent: builder.mutation({
      query: ({ id, event }) => ({
        url: `/calendars/${id}/event`,
        method: 'POST',
        body: { ...event },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    toggleAdmin: builder.mutation({
      query: ({ id, login }) => ({
        url: `/calendars/${id}/toggleAdmin`,
        method: 'POST',
        body: { login },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
    removeUser: builder.mutation({
      query: ({ id, login }) => ({
        url: `/calendars/${id}/user`,
        method: 'DELETE',
        body: { login },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(calendarsError(error.error));
        }
      },
    }),
  }),
});

export const {
  useGetCalendarsMutation,
  useGetCalendarMutation,
  useCreateCalendarMutation,
  useJoinCalendarMutation,
  useGetEventsMutation,
  useDeleteCalendarMutation,
  useUpdateCalendarMutation,
  useInviteUserMutation,
  useToggleAdminMutation,
  useRemoveUserMutation,
  useCreateEventMutation,
} = calendarsApiSlice;
