import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:5000/api/v1/course"
export const courseApi = createApi
      ({
            reducerPath: "courseApi",
            tagTypes: ["Refetch_Creator_Course", "Refetch_Course_Lecture", "Refetch_Published_Courses"],
            baseQuery: fetchBaseQuery
                  ({
                        baseUrl: COURSE_API,
                        credentials: "include",
                  }),
            endpoints: (builder) => ({
                  createCourse: builder.mutation({
                        query: ({ courseTitle, category }) => ({
                              url: "",
                              method: "POST",
                              body: { courseTitle, category },
                        }),
                        invalidatesTags: ["Refetch_Creator_Course"],
                  }),
                  getSearchCourse: builder.query({
                        query: ({ searchQuery, categories, sortByPrice }) => {
                              // Build qiery string
                              let queryString = `/search?query=${encodeURIComponent(searchQuery)}`

                              // append cateogry 
                              if (categories && categories.length > 0) {
                                    const categoriesString = categories.map(encodeURIComponent).join(",");
                                    queryString += `&categories=${categoriesString}`;
                              }

                              // Append sortByPrice is available
                              if (sortByPrice) {
                                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
                              }

                              return {
                                    url: queryString,
                                    method: "GET",
                              }
                        }
                  }),
                  getPublishedCourses: builder.query({
                        query: () => ({
                              url: "/published-courses",
                              method: "GET",
                        }),
                        providesTags: ["Refetch_Published_Courses"],
                  }),
                  getCreatorCourses: builder.query({
                        query: () => ({
                              url: "",
                              method: "GET",
                        }),
                        providesTags: ["Refetch_Creator_Course"],
                  }),
                  editCourse: builder.mutation({
                        query: ({ formData, courseId }) => ({
                              url: `/${courseId}`,
                              method: 'PUT',
                              body: formData
                        }),
                        invalidatesTags: ["Refetch_Creator_Course"],
                  }),
                  getCourseById: builder.query({
                        query: (courseId) => ({
                              url: `/${courseId}`,
                              method: 'GET',
                        }),
                        providesTags: ["Refetch_Creator_Course"],
                  }),
                  createLecture: builder.mutation({
                        query: ({ courseId, lectureTitle }) => ({
                              url: `/${courseId}/lecture`,
                              method: 'POST',
                              body: { lectureTitle }
                        }),
                        invalidatesTags: ["Refetch_Creator_Course", "Refetch_Course_Lecture"],
                  }),
                  getCourseLecture: builder.query({
                        query: ({ courseId }) => ({
                              url: `/${courseId}/lecture`,
                              method: 'GET',
                        }),
                        providesTags: ["Refetch_Course_Lecture"],
                  }),
                  editLecture: builder.mutation({
                        query: ({ lectureTitle, lectureId, videoInfo, isPreviewFree, courseId }) => ({
                              url: `/${courseId}/lecture/${lectureId}`,
                              method: 'POST',
                              body: { lectureTitle, videoInfo, isPreviewFree }
                        }),
                        invalidatesTags: ["Refetch_Creator_Course", "Refetch_Course_Lecture"],
                  }),
                  removeLecture: builder.mutation({
                        query: ({ courseId, lectureId }) => ({
                              url: `/${courseId}/lecture/${lectureId}`,
                              method: 'DELETE',
                        }),
                        invalidatesTags: ["Refetch_Creator_Course", "Refetch_Course_Lecture"],
                  }),
                  getLectureById: builder.query({
                        query: ({ courseId, lectureId }) => ({
                              url: `/lecture/${lectureId}`,
                              method: 'GET',
                        })
                  }),
                  publishCourse: builder.mutation({
                        query: ({ courseId, query }) => ({
                              url: `/${courseId}?publish=${query}`,
                              method: 'PATCH',
                        }),
                        invalidatesTags: ["Refetch_Creator_Course", "Refetch_Published_Courses"]
                  }),
                  removeCourse: builder.mutation({
                        query: ({ courseId }) => ({
                              url: `/${courseId}`,
                              method: 'DELETE',
                        }),
                        invalidatesTags: ["Refetch_Creator_Course", "Refetch_Published_Courses"],
                  }),
            }),
      });
export const { useCreateCourseMutation,
      useGetCreatorCoursesQuery,
      useGetSearchCourseQuery,
      useGetPublishedCoursesQuery,
      useEditCourseMutation,
      useGetCourseByIdQuery,
      useCreateLectureMutation,
      useGetCourseLectureQuery,
      useEditLectureMutation,
      useRemoveLectureMutation,
      useGetLectureByIdQuery,
      usePublishCourseMutation,
      useRemoveCourseMutation,

} = courseApi;