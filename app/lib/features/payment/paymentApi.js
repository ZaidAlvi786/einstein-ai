import { apiURL } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
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
    getCustomersCards: builder.query({
      query: (data) => ({
        url: "/stripe/get-customer-stripe-cards",
        method: "GET",
        params: data,
      }),
      providesTags: ["cards-list"],
    }),
    getUserInvoiceHistory: builder.query({
      query: (data) => ({
        url: `/billing/get-user-invoice-history`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-user-invoice-history"],
    }),
    getPlatformPlans: builder.query({
      query: () => ({
        url: `/billing/get-platform-plans`,
        method: "GET",
      }),
      providesTags: ["get-platform-plans"],
    }),
    addCard: builder.mutation({
      query: ({ params, body }) => ({
        url: `/stripe/add-card`,
        method: "POST",
        params,
        body,
      }),
      providesTags: ["add-card"],
      invalidatesTags: ["cards-list"],
    }),
    getNextInvoiceDate: builder.query({
      query: (data) => ({
        url: "/billing/get-next-invoice-date",
        method: "GET",
        params: data,
      }),
      providesTags: ["get-next-invoice-date"],
    }),
    makePayment: builder.mutation({
      query: ({ params }) => ({
        url: `/stripe/make-payment`,
        method: "POST",
        params,
      }),
      providesTags: ["make-payment"],
    }),
    subscribeToPlatformPlan: builder.mutation({
      query: ({ params }) => ({
        url: `/billing/subscribe-to-platform-plan`,
        method: "POST",
        params,
      }),
      providesTags: ["subscribe-to-platform-plan"],
      invalidatesTags: [
        "get-user-invoice-history",
        "get-next-invoice-date",
        "get-user-subscribed-plan",
      ],
    }),
    attachPaymentMethodToCustomer: builder.mutation({
      query: (data) => ({
        url: `/stripe/attach-payment-method-to-customer`,
        method: "POST",
        ...data,
      }),
      providesTags: ["attach-payment-method-to-customer"],
      invalidatesTags: ["cards-list"],
    }),
    getAutoTopupStatus: builder.query({
      query: (data) => ({
        url: `/billing/get-auto-topup-status`,
        method: "GET",
      }),
      providesTags: ["get-auto-topup-status"],
      invalidatesTags: ["get-user-subscribed-plan"],
    }),
    setAutoTopupStatus: builder.mutation({
      query: (data) => ({
        url: `/billing/set-auto-topup?status=${data.status}&amount=${data.amount}`,
        method: "POST",
        ...data,
      }),
      providesTags: ["set-auto-topup"],
      invalidatesTags: ["get-auto-topup-status"],
    }),
    updateAutoTopupStatus: builder.mutation({
      query: (data) => ({
        url: `/billing/change-topup-amount?amount=${data.amount}`,
        method: "PUT",
        ...data,
      }),
      providesTags: ["change-topup-amount"],
      invalidatesTags: ["get-auto-topup-status"],
    }),
    fetchUserSingleHistoryOverview: builder.query({
      query: (data) => {
        const { start_date_time, end_date_time, page_number, page_size } = data;

        // Conditionally build params object
        const params = {
          page_number,
          page_size,
          ...(start_date_time && { start_date_time }), // Include only if start_date_time is provided
          ...(end_date_time && { end_date_time }),
        };

        return {
          url: `/billing/fetch-user-single-history-overview`,
          method: "GET",
          params,
        };
      },
      providesTags: ["fetch-user-single-history-overview"],
    }),
    getUserSubscribedPlan: builder.query({
      query: () => ({
        // url: `/billing/get-user-subscribed-plan`,
        url: `/billing/get-user-subscriptions`,
        method: "GET",
      }),
      providesTags: ["get-user-subscribed-plan"],
    }),
    cancelSubscription: builder.mutation({
      query: () => ({
        url: `/billing/cancel-subscription`,
        method: "DELETE",
      }),
      providesTags: ["cancel-subscription"],
      invalidatesTags: ["get-user-subscribed-plan"],
    }),
    deleteCustomerStripeCard: builder.mutation({
      query: (data) => ({
        url: `/stripe/delete-customer-stripe-card?card_id=${data.card_id}`,
        method: "DELETE",
      }),
      providesTags: ["delete-customer-stripe-card"],
      invalidatesTags: ["get-user-subscribed-plan"],
    }),
  }),
});

// Export the API hooks for usage in components
export const {
  useGetCustomersCardsQuery,
  useGetUserInvoiceHistoryQuery,
  useGetPlatformPlansQuery,
  useAddCardMutation,
  useGetNextInvoiceDateQuery,
  useMakePaymentMutation,
  useSubscribeToPlatformPlanMutation,
  useAttachPaymentMethodToCustomerMutation,
  useGetAutoTopupStatusQuery,
  useSetAutoTopupStatusMutation,
  useUpdateAutoTopupStatusMutation,
  useGetUserSubscribedPlanQuery,
  useFetchUserSingleHistoryOverviewQuery,
  useCancelSubscriptionMutation,
  useDeleteCustomerStripeCardMutation,
} = paymentApi;
