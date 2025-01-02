import { apiURL } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a new API slice using RTK Query
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiURL,
    prepareHeaders: (headers) => {
      const authData = window.localStorage.getItem("enstine_auth")
        ? JSON.parse(window.localStorage.getItem("enstine_auth"))
        : null;
      if (authData?.token) {
        headers.set("Authorization", `Bearer ${authData?.token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getHistory: builder.mutation({
      query: (data) => ({
        url: "/ai/gethistory",
        method: "POST",
        body: data,
      }),
    }),
    updatePinnedChat: builder.mutation({
      query: (data) => ({
        url: "/ai/updatePinnedChat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["history-chat", "history-chat-by-workspace-id"],
    }),
    unPinnedChat: builder.mutation({
      query: (data) => ({
        url: "/ai/unPinnedChat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["history-chat", "history-chat-by-workspace-id"],
    }),
    deleteChat: builder.mutation({
      query: (data) => ({
        url: "/ai/deleteChat",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["history-chat", "history-chat-by-workspace-id"],
    }),
    getHistoryById: builder.query({
      query: (id) => ({
        url: `/ai/gethistoryByID/${id}`,
        method: "GET",
      }),
      providesTags: ["chat-list"],
    }),
    getImageDataByID: builder.query({
      query: (id) => ({
        url: `/img/getImageDataByID/${id}`,
        method: "GET",
      }),
      providesTags: ["chat-list"],
    }),
    getHistoryByWorkspaceId: builder.query({
      query: (data) => ({
        url: "/ai/get-history-by-workspace-id",
        method: "GET",
        params: data,
      }),
      providesTags: ["history-chat-by-workspace-id"],
    }),
    getArchivedChatsByWorksSpaceId: builder.query({
      query: (data) => ({
        url: "/ai/get-archived-chats-by-workspace-id",
        method: "GET",
        params: data,
      }),
      providesTags: ["archived-chat-by-workspace-id"],
    }),
    putChangeChatState: builder.mutation({
      query: (data) => ({
        url: "/ai/change-chat-state",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [
        "history-chat",
        "history-chat-by-workspace-id",
        "archived-chat-by-workspace-id",
        "chat-list",
      ],
    }),
    putUpdateChatTitle: builder.mutation({
      query: (data) => ({
        url: `/ai/update-chat-title?title=${data.title}&chat_id=${data.chat_id}`,
        method: "PUT"
      }),
      invalidatesTags: [
        "history-chat",
        "history-chat-by-workspace-id",
        "archived-chat-by-workspace-id",
        "chat-list",
      ],
    }),
    postChatMessage: builder.mutation({
      query: ({ apiName, requestData }) => ({
        url: `/ai/${apiName}`,
        method: "POST",
        body: requestData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["history-chat-by-workspace-id"],
    }),
    TransferChatToAnotherGroup: builder.mutation({
      query: (data) => ({
        url: `/group/transfer-chat-to-group`,
        method: "PUT",
        body: data,
      }),
      providesTags: ["transfer-chat-to-another-group"],
      invalidatesTags: ["history-chat-by-workspace-id"],
    }),
    // for group api
    getAllGroupByWorkspaceId: builder.query({
      query: (id) => ({
        url: `/group/get-groups-by-workspace-id/${id ?? ""}`,
        method: "GET",
      }),
      providesTags: ["group-list"],
    }),
    AddGroup: builder.mutation({
      query: (data) => ({
        url: `/group/add-group`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["group-list"],
    }),
    EditGroup: builder.mutation({
      query: ({ group_id, data }) => ({
        url: `/group/update-group?group_id=${group_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["group-list"],
    }),
    DeleteGroup: builder.mutation({
      query: (group_id) => ({
        url: `/group/delete-group/${group_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["group-list"],
    }),
    MoveGroupToAnotherWorkspace: builder.mutation({
      query: (data) => ({
        url: `/group/transfer-group-to-another-workspace`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["group-list"],
    }),
    MoveAllChatToNewGroup: builder.mutation({
      query: (data) => ({
        url: `/group/transfer-all-chats-to-new-group`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["group-list", "history-chat-by-workspace-id"],
    }),
    ReorderGroups: builder.mutation({
      query: (data) => ({
        url: `/group/reorder-groups`,
        method: "PUT",
        body: data,
      }),
      providesTags: ["reorder-groups"],
      invalidatesTags: ["group-list", "history-chat-by-workspace-id"],
    }),
    // for marketplace api
    getTrendingTools: builder.query({
      query: (data) => ({
        url: `/tool/get-trending-tools`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-trending-tools"],
    }),
    searchToolsForAllCategory: builder.query({
      query: (data) => ({
        url: `/tool/search-tools-for-all-category`,
        method: "GET",
        params: data,
      }),
      providesTags: ["search-tools-for-all-category"],
    }),
    getToolLikesCount: builder.query({
      query: (data) => ({
        url: `/tool/get-tool-likes-count`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-tool-likes-count"],
    }),
    getToolsByCategory: builder.query({
      query: (data) => ({
        url: `/tool/get-tools-by-category`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-tools-by-category"],
    }),
    getToolDetailsGuest: builder.query({
      query: (data) => ({
        url: `/tool/${
          data?.IsLoggedIn ? "get-tool-details" : "get-tool-details-guest"
        }`,
        method: "GET",
        params: { tool_id: data?.tool_id },
      }),
      providesTags: ["get-tool-details-guest"],
    }),
    subscribeTool: builder.mutation({
      query: (data) => ({
        url: `/tool/subscribe-tool`,
        method: "POST",
        params: data,
      }),
      providesTags: ["subscribe-tool"],
      invalidatesTags: ["get-subscribed-tools", "get-user-tools"],
    }),
    subscribeToolTrial: builder.mutation({
      query: (data) => ({
        url: `/tool/subscribe-tool-trial`,
        method: "POST",
        params: data,
      }),
      providesTags: ["ssubscribe-tool-trial"],
      invalidatesTags: ["get-subscribed-tools", "get-user-tools"],
    }),
    cancelToolSubscription: builder.mutation({
      query: (data) => ({
        url: `/billing/cancel-tool-subscription`,
        method: "DELETE",
        params: data,
      }),
      providesTags: ["cancel-tool-subscription"],
      invalidatesTags: [
        "get-subscribed-tools",
        "get-user-tools",
        "get-user-subscribed-plan",
      ],
    }),

    deactivateTool: builder.mutation({
      query: (data) => ({
        url: `/tool/deactivate-tool`,
        method: "DELETE",
        params: data,
      }),
      providesTags: ["deactivate-tool"],
      // invalidatesTags: ['group-list', 'history-chat-by-workspace-id'],
    }),
    reactivateTool: builder.mutation({
      query: (data) => ({
        url: `/tool/reactivate-tool`,
        method: "PATCH",
        params: data,
      }),
      providesTags: ["reactivate-tool"],
      // invalidatesTags: ['group-list', 'history-chat-by-workspace-id'],
    }),
    getSubscribedTools: builder.query({
      query: (data) => ({
        url: `/tool/get-subscribed-tools`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-subscribed-tools"],
      // invalidatesTags: ['subscribe-tool', 'cancel-tool-subscription'],
    }),
    addLikeOnTool: builder.mutation({
      query: (data) => ({
        url: `/tool/add-like-on-tool`,
        method: "POST",
        params: data,
      }),
      providesTags: ["add-like-on-tool"],
      invalidatesTags: ["get-tool-details-guest"],
    }),
    deactivateToolLike: builder.mutation({
      query: (data) => ({
        url: `/tool/deactivate-tool-like`,
        method: "DELETE",
        params: data,
      }),
      providesTags: ["deactivate-tool-like"],
      invalidatesTags: ["get-tool-details-guest"],
    }),
    getSimilarTools: builder.query({
      query: (data) => ({
        url: `/tool/get-similar-tools`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-similar-tools"],
    }),
    addCommentOnTool: builder.mutation({
      query: (data) => ({
        url: `/tool/add-comment-on-tool`,
        method: "POST",
        params: data,
      }),
      providesTags: ["add-comment-on-tool"],
      invalidatesTags: ["get-all-tool-comments"],
    }),
    getAllToolComments: builder.query({
      query: (data) => ({
        url: `/tool/get-all-tool-comments`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-all-tool-comments"],
    }),
    addToolModelGpt: builder.mutation({
      query: (data) => ({
        url: `/tool/add-tool-model-gpt`,
        method: "POST",
        body: data,
      }),
      providesTags: ["add-tool-model-gpt"],
      invalidatesTags: ['get-creators-gpts', 'get-user-tools']
    }),
    addToolPluginWidget: builder.mutation({
      query: (data) => ({
        url: `/tool/add-tool-plugin-widget`,
        method: "POST",
        body: data,
      }),
      providesTags: ["add-tool-plugin-widget"],
    }),
    getToolUniqueFilters: builder.query({
      query: (data) => ({
        url: `/tool/get-tool-unique-filters`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-tool-unique-filters"],
    }),
    getRandomImageries: builder.query({
      query: (data) => ({
        url: `/tool/get-random-imageries`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-random-imageries"],
    }),
    getRandomLogoImageries: builder.query({
      query: (data) => ({
        url: `/tool/get-random-logo-imageries`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-random-logo-imageries"],
    }),

    // for users details
    getUser: builder.query({
      query: (data) => ({
        url: `/auth/getuser`,
        method: "POST",
        body: data,
      }),
      providesTags: ["getuser"],
    }),
    // For upload User profile
    uploadImage: builder.mutation({
      query: (data) => ({
        url: `/ai/uploadImage`,
        method: "POST",
        body: data,
      }),
      providesTags: ["upload-image"],
      invalidatesTags: ["getuser"],
    }),
    // for notification api
    getUsersNotifications: builder.query({
      query: (data) => ({
        url: `/auth/get-users-notifications`,
        method: "GET",
        params: data,
      }),
      // providesTags: ["get-users-notifications"],
      invalidatesTags: [
        "get-unread-messages-count",
        "send-notification-to-owner-for-new-joining",
      ],
    }),
    markUserNotification: builder.mutation({
      query: (data) => ({
        url: `/auth/mark-notification-read-by-id`,
        method: "PUT",
        params: data,
      }),
      providesTags: ["mark-notification-read-by-id"],
      invalidatesTags: [
        "get-unread-messages-count",
        "send-notification-to-owner-for-new-joining",
      ],
    }),
    sendNotificationToOwnerForNewJoining: builder.mutation({
      query: (data) => ({
        url: `/auth/send-notification-to-owner-for-new-joining`,
        method: "POST",
        params: data,
      }),
      providesTags: ["send-notification-to-owner-for-new-joining"],
    }),
    getUnreadMessagesCount: builder.query({
      query: () => ({
        url: `/auth/get-unread-messages-count`,
        method: "GET",
      }),
      providesTags: ["get-unread-messages-count"],
      invalidatesTags: [
        "get-users-notifications",
        "send-notification-to-owner-for-new-joining",
      ],
    }),
    markAllNotificationsRead: builder.mutation({
      query: () => ({
        url: `/auth/mark-all-notifications-read`,
        method: "POST",
      }),
      providesTags: ["mark-all-notifications-read"],
      invalidatesTags: ["get-users-notifications", "get-unread-messages-count"],
    }),
    archiveAllNotifications: builder.mutation({
      query: () => ({
        url: `/auth/archive-all-notifications`,
        method: "POST",
      }),
      providesTags: ["archive-all-notifications"],
      invalidatesTags: ["get-users-notifications", "get-unread-messages-count"],
    }),
    // for users subscribe tools
    getUserTools: builder.query({
      query: (data) => ({
        url: `/tool/get-user-tools`,
        method: "GET",
        ...(data && { ...data }),
      }),
      providesTags: ["get-user-tools"],
      invalidatesTags: ["subscribe-tool", "cancel-tool-subscription"],
    }),
    generateDataTokenForTools: builder.mutation({
      query: (data) => ({
        url: `/auth/generate-data-token`,
        method: "POST",
        params: data,
      }),
      providesTags: ["generate-data-token"],
    }),
    // for share chats
    generateTokenForSharedRoom: builder.mutation({
      query: (data) => ({
        url: `/auth/generate-token-for-shared-room`,
        method: "POST",
        params: data,
      }),
      providesTags: ["generate-token-for-shared-room"],
    }),
    createRecordForSharedRoom: builder.mutation({
      query: (data) => ({
        url: `/auth/create-record-for-shared-room`,
        method: "POST",
        params: data,
      }),
      providesTags: ["create-record-for-shared-room"],
    }),
    getUsersSharedRoomHistory: builder.query({
      query: (data) => ({
        url: `/ai/get-users-shared-room-history`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-users-shared-room-history"],
    }),
    getSharedChatUsers: builder.query({
      query: (data) => ({
        url: `/auth/get-shared-chat-users`,
        method: "GET",
        ...(data && { ...data }),
      }),
      providesTags: ["get-shared-chat-users"],
    }),
    sendInviteForSharedChat: builder.mutation({
      query: (data) => ({
        url: `/auth/send-invite-for-shared-chat`,
        method: "POST",
        ...(data && { ...data }),
      }),
      providesTags: ["send-invite-for-shared-chat"],
    }),
    changeSharedChatUserRole: builder.mutation({
      query: (data) => ({
        url: `/auth/change-shared-chat-user-role`,
        method: "PUT",
        ...(data && { ...data }),
      }),
      providesTags: ["change-shared-chat-user-role"],
    }),
    acceptInvitationForSharedChat: builder.mutation({
      query: (data) => ({
        url: `/auth/accept-invitation-for-shared-chat`,
        method: "POST",
        ...(data && { ...data }),
      }),
      providesTags: ["accept-invitation-for-shared-chat"],
    }),
    declineInvitationForSharedChat: builder.mutation({
      query: (data) => ({
        url: `/auth/decline-invitation-for-shared-chat`,
        method: "POST",
        ...(data && { ...data }),
      }),
      providesTags: ["decline-invitation-for-shared-chat"],
    }),

    // Chat shared
    getSharedChatLinkAccess: builder.mutation({
      query: (data) => ({
        url: `/auth/get-shared-chat-general-access-link`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-shared-chat-general-access-link"],
    }),
    accessSharedChatWithLink: builder.mutation({
      query: (data) => ({
        url: `/auth/access-shared-chat-with-link`,
        method: "GET",
        params: data,
      }),
      providesTags: ["access-shared-chat-with-link"],
    }),
    updateUserChatStatus: builder.mutation({
      query: (data) => ({
        url: `/auth/update-user-chat-status`,
        method: "PUT",
        params: data,
      }),
      providesTags: ["update-user-chat-status"],
      invalidatesTags: ["get-users-notifications"],
    }),
    removeShareChatAccessLink: builder.mutation({
      query: (data) => ({
        url: `/auth/remove-shared-chat-general-access-link`,
        method: "DELETE",
        params: data,
      }),
      providesTags: ["remove-shared-chat-general-access-link"],
      invalidatesTags: ["get-users-notifications"],
    }),

    removeShareChatUser: builder.mutation({
      query: (data) => ({
        url: `/auth/remove-user-from-shared-chat`,
        method: "DELETE",
        params: data,
      }),
      providesTags: ["remove-user-from-shared-chat"],
      invalidatesTags: ["get-shared-chat-users"],
    }),

    // Workspace Shared
    getSharedWorkspaceLinkAccess: builder.mutation({
      query: (data) => ({
        url: `/workspace/get-workspace-general-access-link`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-workspace-general-access-link"],
    }),
    accessSharedWorkspaceWithLink: builder.mutation({
      query: (data) => ({
        url: `/workspace/access-workspace-with-link`,
        method: "GET",
        params: data,
      }),
      providesTags: ["access-workspace-with-link"],
    }),
    updateUserWorkspaceStatus: builder.mutation({
      query: (data) => ({
        url: `/workspace/update-user-workspace-status`,
        method: "PUT",
        params: data,
      }),
      providesTags: ["update-user-workspace-status"],
      invalidatesTags: ["get-users-notifications"],
    }),
    removeOldWorkspaceAccessLink: builder.mutation({
      query: (data) => ({
        url: `/workspace/remove-old-workspace-general-access-links`,
        method: "DELETE",
        params: data,
      }),
      providesTags: ["remove-old-workspace-general-access-link"],
      invalidatesTags: ["get-users-notifications"],
    }),
    postRating: builder.mutation({
      query: (data) => ({
        url: `/tool/post-rating`,
        method: "POST",
        params: data,
      }),
      providesTags: ["post-rating"],
    }),
    updateRating: builder.mutation({
      query: (data) => ({
        url: `/tool/update-rating?tool_id=${data.tool_id}&rating=${data.rating}`,
        method: "PUT",
      }),
      providesTags: ["update-rating"],
    }),
    updateTool: builder.mutation({
      query: (data) => {
        const { tool_id, ...body } = data; // Destructure to get tool_id and other data

        return {
          url: `/tool/update-tool?tool_id=${tool_id}`, // Send tool_id in the query
          method: "PUT",
          body, // Send the rest of the data (including is_active) in the body
        };
      },
      providesTags: ["update-tool"],
      invalidatesTags: ["get-tool-details-guest"],
    }),
    reportTool: builder.mutation({
      query: (data) => {
        return {
          url: `/tool/report-tool`,
          method: "POST",
          body: data, // Send data as the request payload
        };
      },
      providesTags: ["report-tool"],
    }),
    getToolLogoUrlList: builder.query({
      query: () => ({
        url: `/tool/get-tool-logo-url-list`,
        method: "GET",
      }),
      // providesTags: ["get-tool-logo-url-list"],
      // invalidatesTags: ['subscribe-tool', 'cancel-tool-subscription'],
    }),
    getCreatorsGpt: builder.query({
      query: () => ({
        url: `/tool/get-creators-gpts`,
        method: "GET",
      }),
      providesTags: ["get-creators-gpts"],
      // invalidatesTags: ['subscribe-tool', 'cancel-tool-subscription'],
    }),
    getToolsCategoryById: builder.query({
      query: (data) => ({
        url: `/tool/get-tool-category-by-id?tool_id=${data.tool_id}`,
        method: "GET",
      }),
      providesTags: ["get-tool-category-by-id"],
    }),
    addContextToGpt: builder.mutation({
      query: (data) => ({
        url: `/tool/add-context-to-gpt?tool_id=${data.tool_id}&context=${data.context}`,
        method: "PUT",
        body: data,
      }),
      providesTags: ["add-context-to-gpt"],
    }),
    searchTools: builder.query({
      query: (data) => ({
        url: `/tool/search-tools?page_number=${data.page_number}&per_page=${data.per_page}&type=${data.type}&search=${data.search}&user_id=${data.user_id}`,
        method: "GET",
      }),
      providesTags: ["search-tools"],
      // invalidatesTags: ['subscribe-tool', 'cancel-tool-subscription'],
    }),
    unsubscribeTool: builder.mutation({
      query: (data) => ({
        url: `/tool/unsubscribe-tool?subscription_id=${data.subscription_id}`,
        method: "DELETE",
      }),
      providesTags: ["unsubscribe-tool"]
    }),
    toolWebhook: builder.mutation({
      query: (data) => ({
        url: `/tool/webhook`,
        method: "POST",
        body: data,
      }),
      providesTags: ["webhook"],
    }),
    createEmptyChat: builder.mutation({
      query: (data) => ({
        url: `/ai/create-empty-chat?workspace_id=${data.workspace_id}&group_id=${data.group_id}&chat_title=${data.chat_title}`,
        method: "POST",
      }),
      providesTags: ["create-empty-chat"]
    }),
    sendInviteToNonPlatformUser: builder.mutation({
      query: (data) => ({
        url: `/auth/send-invite-to-non-platform-user`,
        method: "POST",
        params:data
      }),
      providesTags: ["send-invite-to-non-platform-user"]
    }),
    duplicateChatId: builder.mutation({
      query: (data) => ({
        url: `/ai/duplicate-chat-by-id?chat_id=${data.chat_id}`,
        method: "POST"
      
      }),
      providesTags: ["duplicate-chat-by-id"]
    }),
  }),
});

// Export the API hooks for usage in components
export const {
  useGetHistoryMutation,
  useUpdatePinnedChatMutation,
  useUnPinnedChatMutation,
  useDeleteChatMutation,
  useGetHistoryByIdQuery,
  useLazyGetHistoryByIdQuery,
  useLazyGetImageDataByIDQuery,
  useLazyGetHistoryByWorkspaceIdQuery,
  useGetHistoryByWorkspaceIdQuery,
  useGetArchivedChatsByWorksSpaceIdQuery,
  usePutChangeChatStateMutation,
  usePostChatMessageMutation,
  usePutUpdateChatTitleMutation,
  useTransferChatToAnotherGroupMutation,
  // for group api
  useGetAllGroupByWorkspaceIdQuery,
  useAddGroupMutation,
  useEditGroupMutation,
  useDeleteGroupMutation,
  useMoveGroupToAnotherWorkspaceMutation,
  useMoveAllChatToNewGroupMutation,
  useReorderGroupsMutation,
  // for marketplace api
  useGetTrendingToolsQuery,
  useSearchToolsForAllCategoryQuery,
  useGetToolLikesCountQuery,
  useGetToolsByCategoryQuery,
  useGetToolDetailsGuestQuery,
  useSubscribeToolMutation,
  useSubscribeToolTrialMutation,
  useCancelToolSubscriptionMutation,
  useDeactivateToolMutation,
  useReactivateToolMutation,
  useGetSubscribedToolsQuery,
  useAddLikeOnToolMutation,
  useDeactivateToolLikeMutation,
  useGetSimilarToolsQuery,
  useAddCommentOnToolMutation,
  useGetAllToolCommentsQuery,
  useAddToolModelGptMutation,
  useAddToolPluginWidgetMutation,
  useGetToolUniqueFiltersQuery,
  useGetRandomImageriesQuery,
  useGetRandomLogoImageriesQuery,

  // for users details
  useGetUserQuery,
  useUploadImageMutation,
  useGenerateDataTokenForToolsMutation,
  // for notification api
  useGetUsersNotificationsQuery,
  useMarkUserNotificationMutation,
  useSendNotificationToOwnerForNewJoiningMutation,
  useGetUnreadMessagesCountQuery,
  useMarkAllNotificationsReadMutation,
  useArchiveAllNotificationsMutation,
  // for users subscribe tools
  useGetUserToolsQuery,
  // for share chats
  useGenerateTokenForSharedRoomMutation,
  useCreateRecordForSharedRoomMutation,
  useGetUsersSharedRoomHistoryQuery,
  useGetSharedChatUsersQuery,
  useSendInviteForSharedChatMutation,
  useChangeSharedChatUserRoleMutation,
  useAcceptInvitationForSharedChatMutation,
  useDeclineInvitationForSharedChatMutation,
  usePostRatingMutation,
  useUpdateRatingMutation,
  useUpdateToolMutation,
  useReportToolMutation,
  useGetSharedChatLinkAccessMutation,
  useAccessSharedChatWithLinkMutation,
  useUpdateUserChatStatusMutation,
  useRemoveShareChatUserMutation,
  useRemoveShareChatAccessLinkMutation,
  useGetSharedWorkspaceLinkAccessMutation,
  useAccessSharedWorkspaceWithLinkMutation,
  useUpdateUserWorkspaceStatusMutation,
  useRemoveOldWorkspaceAccessLinkMutation,
  useGetToolLogoUrlListQuery,
  useGetCreatorsGptQuery,
  useAddContextToGptMutation,
  useGetToolsCategoryByIdQuery,
  useSearchToolsQuery,
  useUnsubscribeToolMutation,
  useToolWebhookMutation,
  useCreateEmptyChatMutation,
  useSendInviteToNonPlatformUserMutation,
  useDuplicateChatIdMutation
} = chatApi;
