import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const QUIZ_API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1/quiz`;

export const quizApi = createApi({
  reducerPath: "quizApi",
  tagTypes: ["Quiz"],
  baseQuery: fetchBaseQuery({
    baseUrl: QUIZ_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createQuiz: builder.mutation({
      query: (quizData) => ({
        url: "/create",
        method: "POST",
        body: quizData,
      }),
      invalidatesTags: ["Quiz"],
    }),
    getCourseQuizzes: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
      refetchOnMountOrArgChange: true,
    }),
    getQuiz: builder.query({
      query: (quizId) => ({
        url: `/${quizId}`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
    updateQuiz: builder.mutation({
      query: ({ quizId, ...updateData }) => ({
        url: `/${quizId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Quiz"],
    }),
    deleteQuiz: builder.mutation({
      query: (quizId) => ({
        url: `/${quizId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),
    startQuizAttempt: builder.mutation({
      query: (quizId) => ({
        url: `/${quizId}/start`,
        method: "POST",
      }),
      invalidatesTags: ["Quiz"],
    }),
    submitQuiz: builder.mutation({
      query: ({ attemptId, answers }) => ({
        url: `/attempt/${attemptId}/submit`,
        method: "POST",
        body: { answers },
      }),
      invalidatesTags: ["Quiz"],
    }),
    getMyQuizResult: builder.query({
      query: (attemptId) => ({
        url: `/attempt/${attemptId}/result`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
    getQuizAttempts: builder.query({
      query: (quizId) => ({
        url: `/${quizId}/attempts`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
    getAttemptDetail: builder.query({
      query: (attemptId) => ({
        url: `/attempt/${attemptId}/detail`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
    getCourseStudents: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/students`,
        method: "GET",
      }),
      providesTags: ["Quiz"],
    }),
  }),
});

export const {
  useCreateQuizMutation,
  useGetCourseQuizzesQuery,
  useGetQuizQuery,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useStartQuizAttemptMutation,
  useSubmitQuizMutation,
  useGetMyQuizResultQuery,
  useGetQuizAttemptsQuery,
  useGetAttemptDetailQuery,
  useGetCourseStudentsQuery,
} = quizApi;
