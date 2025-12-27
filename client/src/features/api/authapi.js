import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "@/features/authSlice";

const USER_API = "http://localhost:5000/api/v1/user/";

export const authApi = createApi({
      reducerPath: "authApi",
      tagTypes: ["User"],
      baseQuery: fetchBaseQuery({
            baseUrl: USER_API,
            credentials: "include",
      }),
      endpoints: (builder) => ({
            sendRegisterOTP: builder.mutation({
                  query: (inputData) => ({
                        url: "send-otp",
                        method: "POST",
                        body: inputData,
                  })
            }),
            sendLoginOTP: builder.mutation({
                  query: (inputData) => ({
                        url: "send-login-otp",
                        method: "POST",
                        body: inputData,
                  }),
                  async onQueryStarted(_, { queryFulfilled, dispatch }) {
                        try {
                              const result = await queryFulfilled;
                              // If user object is returned, it means instructor logged in directly
                              if (result.data.user) {
                                    dispatch(userLoggedIn({ user: result.data.user }));
                              }
                        }
                        catch (error) {
                              console.log(error);
                        }
                  },
            }),
            verifyOTP: builder.mutation({
                  query: (inputData) => ({
                        url: "verify-otp",
                        method: "POST",
                        body: inputData,
                  }),
                  async onQueryStarted(_, { queryFulfilled, dispatch }) {
                        try {
                              const result = await queryFulfilled;
                              dispatch(userLoggedIn({ user: result.data.user }));
                        }
                        catch (error) {
                              console.log(error);
                        }
                  },
            }),
            verifyLoginOTP: builder.mutation({
                  query: (inputData) => ({
                        url: "verify-login-otp",
                        method: "POST",
                        body: inputData,
                  }),
                  async onQueryStarted(_, { queryFulfilled, dispatch }) {
                        try {
                              const result = await queryFulfilled;
                              dispatch(userLoggedIn({ user: result.data.user }));
                        }
                        catch (error) {
                              console.log(error);
                        }
                  },
            }),
            resendOTP: builder.mutation({
                  query: (inputData) => ({
                        url: "resend-otp",
                        method: "POST",
                        body: inputData,
                  })
            }),
            registerUser: builder.mutation({
                  query: (inputData) => ({
                        url: "register",
                        method: "POST",
                        body: inputData,
                  })
            }),
            loginUser: builder.mutation({
                  query: (inputData) => ({
                        url: "login",
                        method: "POST",
                        body: inputData,
                  }),
                  async onQueryStarted(_, { queryFulfilled, dispatch }) {
                        try {
                              const result = await queryFulfilled;
                              dispatch(userLoggedIn({ user: result.data.user }));
                        }
                        catch (error) {
                              console.log(error);

                        }
                  },
            }),
              logoutUser: builder.mutation({
                  query: () => ({
                        url: "logout",
                        method: "GET",
                  }),
                  async onQueryStarted(_, { queryFulfilled, dispatch }) {
                        try {
                              await queryFulfilled;
                              dispatch(userLoggedOut());
                        }
                        catch (error) {
                              console.log(error);
                        }
                  },
            }),
             loadUser : builder.query({
                  query: () => ({
                        url: "profile",
                        method: "GET"
                  }),
                  providesTags: ["User"],
                  async onQueryStarted(_, { queryFulfilled, dispatch }) {
                        try {
                              const result = await queryFulfilled;
                              dispatch(userLoggedIn({ user: result.data.user }));
                        }
                        catch (error) {
                              console.log(error);
                        }
                  },
            }),
            updateUser: builder.mutation({
                  query: (formData) => ({
                        url: "profile/update",
                        method: "PUT",
                        body: formData,
                        credentials: "include"
                  }),
                  invalidatesTags: ["User"],
            }),
      }),
});

export const { 
      useRegisterUserMutation, 
      useLoginUserMutation, 
      useLoadUserQuery, 
      useUpdateUserMutation, 
      useLogoutUserMutation,
      useSendRegisterOTPMutation,
      useSendLoginOTPMutation,
      useVerifyOTPMutation,
      useVerifyLoginOTPMutation,
      useResendOTPMutation
} = authApi;