import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ASSIGNMENT_API = "http://localhost:5000/api/v1/assignment";

export const assignmentApi = createApi({
  reducerPath: "assignmentApi",
  tagTypes: ["Assignment"],
  baseQuery: fetchBaseQuery({
    baseUrl: ASSIGNMENT_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createAssignment: builder.mutation({
      query: (assignmentData) => ({
        url: "/create",
        method: "POST",
        body: assignmentData,
      }),
      invalidatesTags: ["Assignment"],
    }),
    getCourseAssignments: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),
    getAssignment: builder.query({
      query: (assignmentId) => ({
        url: `/${assignmentId}`,
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),
    updateAssignment: builder.mutation({
      query: ({ assignmentId, ...updateData }) => ({
        url: `/${assignmentId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["Assignment"],
    }),
    deleteAssignment: builder.mutation({
      query: (assignmentId) => ({
        url: `/${assignmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Assignment"],
    }),
    submitAssignment: builder.mutation({
      query: ({ assignmentId, submissionData }) => ({
        url: `/${assignmentId}/submit`,
        method: "POST",
        body: submissionData,
      }),
      invalidatesTags: ["Assignment"],
    }),
    getMySubmission: builder.query({
      query: (assignmentId) => ({
        url: `/${assignmentId}/my-submission`,
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),
    getAssignmentSubmissions: builder.query({
      query: (assignmentId) => ({
        url: `/${assignmentId}/submissions`,
        method: "GET",
      }),
      providesTags: ["Assignment"],
    }),
    gradeSubmission: builder.mutation({
      query: ({ submissionId, marksObtained, feedback }) => ({
        url: `/submission/${submissionId}/grade`,
        method: "PUT",
        body: { marksObtained, feedback },
      }),
      invalidatesTags: ["Assignment"],
    }),
  }),
});

export const {
  useCreateAssignmentMutation,
  useGetCourseAssignmentsQuery,
  useGetAssignmentQuery,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
  useSubmitAssignmentMutation,
  useGetMySubmissionQuery,
  useGetAssignmentSubmissionsQuery,
  useGradeSubmissionMutation,
} = assignmentApi;
