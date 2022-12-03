import apiSlice from '../../app/api/apiSlice';
import { userError, setUsers } from './user.slice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: '/users',
        method: 'PATCH',
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          dispatch(userError(error.error));
        }
      },
    }),
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: '/users/avatar',
        method: 'PATCH',
        body: avatar,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          dispatch(userError(error.error));
        }
      },
    }),
    getUsers: builder.mutation({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(setUsers(data));
        } catch (error) {
          console.log(error);
          dispatch(userError(error.error));
        }
      },
    }),
  }),
});

export const { useUpdateUserMutation, useUpdateAvatarMutation, useGetUsersMutation } = userApiSlice;
