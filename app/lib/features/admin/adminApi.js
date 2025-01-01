import { apiURL } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const AdminApi = createApi({
  reducerPath: "AdminApi",
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
    fetchToolPerformanceRecords: builder.query({
      query: (data) => ({
        url: `/tool-admin/fetch-tool-performance-records`,
        method: "GET",
        params: data,
      }),
      providesTags: ["fetch-tool-performance-records"],
    }),
    getToolEarningAndAnalytics: builder.query({
      query: (data) => ({
        url: `/tool-admin/get-tool-earnings-and-analytics`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-tool-earnings-and-analytics"],
    }),
    getToolsPerformanceDetailsList: builder.query({
      query: (data) => ({
        url: `/tool-admin/get-tools-performance-details-list`,
        method: "GET",
        params: data,
      }),
      providesTags: ["get-tools-performance-details-list"],
    }),
  }),
});

// Export the API hooks for usage in components
export const {
  //   getUserSubscribedPlan,
  //   cancelSubscription,
  useFetchToolPerformanceRecordsQuery,
  useGetToolEarningAndAnalyticsQuery,
  useGetToolsPerformanceDetailsListQuery,
} = AdminApi;
