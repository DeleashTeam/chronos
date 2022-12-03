import apiSlice from '../../app/api/apiSlice';
import {
  getEvent, eventError, getEventId, getMessages,
} from './event.slice';

export const eventApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;

          dispatch(getEvent(data));
          dispatch(getEventId(data.event));
          dispatch(getMessages(data.event));
        } catch (error) {
          dispatch(eventError(error.error));
        }
      },
    }),
    toggleEventAdmin: builder.mutation({
      query: ({ id, login }) => ({
        url: `/events/${id}/toggleAdmin`,
        method: 'POST',
        body: { login },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(eventError(error.error));
        }
      },
    }),
    removeEventUser: builder.mutation({
      query: ({ id, login }) => ({
        url: `/events/${id}/user`,
        method: 'DELETE',
        body: { login },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(eventError(error.error));
        }
      },
    }),
    inviteEventUser: builder.mutation({
      query: ({ id, login }) => ({
        url: `/events/${id}/user`,
        method: 'POST',
        body: { login },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(eventError(error.error));
        }
      },
    }),
    updateEvent: builder.mutation({
      query: ({ body, id }) => ({
        url: `/events/${id}`,
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(eventError(error.error));
        }
      },
    }),
    removeEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(eventError(error.error));
        }
      },
    }),
    joinEvent: builder.mutation({
      query: (token) => ({
        url: `/events/join/${token}`,
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(eventError(error.error));
        }
      },
    }),
  }),
});

export const {
  useGetEventMutation,
  useRemoveEventUserMutation,
  useToggleEventAdminMutation,
  useInviteEventUserMutation,
  useUpdateEventMutation,
  useRemoveEventMutation,
  useJoinEventMutation,
} = eventApiSlice;
