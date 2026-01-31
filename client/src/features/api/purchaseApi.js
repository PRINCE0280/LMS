import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authApi } from "./authapi";

const COURSE_PURCHASE_API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1/purchase`;

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  tagTypes: ["Purchase"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createRazorpayOrder: builder.mutation({
      query: ({ courseId }) => ({
        url: "/razorpay/create-order",
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Purchase"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate user profile to refresh enrolled courses
          dispatch(authApi.util.invalidateTags(["User"]));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/razorpay/verify-payment",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Purchase"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate user profile to refresh enrolled courses
          dispatch(authApi.util.invalidateTags(["User"]));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getCourseDetailsWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
      providesTags: ["Purchase"],
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Purchase"],
    }),
  }),
});

export const {
  useCreateRazorpayOrderMutation,
  useVerifyPaymentMutation,
  useGetCourseDetailsWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;
