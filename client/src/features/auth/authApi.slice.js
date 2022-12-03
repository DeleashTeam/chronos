import apiSlice from '../../app/api/apiSlice';
import { logOut, setCredentials, authError } from './auth.slice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          dispatch(authError(error.error));
        }
      },
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(authError(error.error));
        }
      },
    }),
    googleAuth: builder.mutation({
      query: (token) => ({
        url: '/auth/google',
        method: 'POST',
        body: { accessToken: token.access_token },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          dispatch(authError(error.error));
        }
      },
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          dispatch(authError(error.error));
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/auth/refresh',
        method: 'GET',
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch (error) {
          // dispatch(authError(error.error));
        }
      },
    }),
    requestResetPassword: builder.mutation({
      query: (email) => ({
        url: '/auth/password-reset',
        method: 'POST',
        body: { email },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(authError(error.error));
        }
      },
    }),
    resetPassword: builder.mutation({
      query: ({ passwordState, token }) => ({
        url: `/auth/password-reset/${token}`,
        method: 'POST',
        body: { ...passwordState },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(authError(error.error));
        }
      },
    }),
    requestEmailConfirmation: builder.mutation({
      query: (email) => ({
        url: '/auth/confirm-email',
        method: 'POST',
        body: { email },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          dispatch(authError(error.error));
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGoogleAuthMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useRegisterMutation,
  useRequestResetPasswordMutation,
  useResetPasswordMutation,
  useRequestEmailConfirmationMutation,
  endpoints,
} = authApiSlice;
