import { apiURL } from '@/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a new API slice using RTK Query
export const workspaceApi = createApi({
  reducerPath: 'workspaceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: apiURL,
    prepareHeaders: (headers) => {
      const authData = window.localStorage.getItem("enstine_auth") ? JSON.parse(window.localStorage.getItem("enstine_auth")) : null;
      if (authData?.token && authData?.email && authData?.fullname) {
        headers.set('Authorization', `Bearer ${authData?.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllWorkspaces: builder.query({
      query: (userId) => ({
        url: `/workspace/getWorkspaceByUser/${userId}`,
        method: 'GET',
      }),
      providesTags: ['workspace-list'],
    }),
    addWorkspace: builder.mutation({
      query: (data) => ({
        url: `/workspace/add`,
        body: data,
        method: 'POST'
      }),
      providesTags: ['workspace-add'],
      invalidatesTags: ['workspace-list'],
    }),
    deleteWorkspace: builder.mutation({
      query: (workspace_id) => ({
        url: `/workspace/delete/${workspace_id}`,
        method: 'DELETE'
      }),
      providesTags: ['workspace-delete'],
      invalidatesTags: ['workspace-list'],
    }),
    fetchUserDetailsForInvite: builder.query({
      query: (search) => ({
        url: `/workspace/fetch-user-details-for-invite?query=${search}`,
        method: 'GET',
      }),
      providesTags: ['fetch-user-details-for-invite'],
    }),
    editWorkspace: builder.mutation({
      query: (data) => ({
        url: `/workspace/edit-workspace`,
        body: data,
        method: 'PUT'
      }),
      providesTags: ['workspace-edit'],
      invalidatesTags: ['workspace-list'],
    }),
    editWorkspaceUser: builder.mutation({
      query: (data) => ({
        url: `/workspace/edit-workspace-user`,
        body: data,
        method: 'PUT'
      }),
      providesTags: ['edit-workspace-user'],
      invalidatesTags: ['workspace-list'],
    }),
    addMember: builder.mutation({
      query: (data) => ({
        url: `/workspace/add-member`,
        body: data,
        method: 'PUT'
      }),
      providesTags: ['add-member'],
      invalidatesTags: ['workspace-list'],
    }),
    removeMember: builder.mutation({
      query: (data) => ({
        url: `/workspace/remove-member`,
        body: data,
        method: 'DELETE'
      }),
      providesTags: ['remove-member'],
      invalidatesTags: ['workspace-list'],
    }),
  }),
});

// Export the API hooks for usage in components
export const {
  useGetAllWorkspacesQuery,
  useAddWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useFetchUserDetailsForInviteQuery,
  useEditWorkspaceMutation,
  useEditWorkspaceUserMutation,
  useAddMemberMutation,
  useRemoveMemberMutation
} = workspaceApi;