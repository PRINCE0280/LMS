import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const REVIEW_API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1/review`;

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  tagTypes: ["Reviews"],
  baseQuery: fetchBaseQuery({
    baseUrl: REVIEW_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    submitReview: builder.mutation({
      query: (reviewData) => ({
        url: "/submit",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Reviews"],
    }),
    getCourseReviews: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Reviews"],
    }),
    getInstructorReviews: builder.query({
      query: () => ({
        url: "/instructor",
        method: "GET",
      }),
      providesTags: ["Reviews"],
    }),
    getUserReview: builder.query({
      query: (courseId) => ({
        url: `/user/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useSubmitReviewMutation,
  useGetCourseReviewsQuery,
  useGetInstructorReviewsQuery,
  useGetUserReviewQuery,
  useDeleteReviewMutation,
} = reviewApi;
