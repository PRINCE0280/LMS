import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authApi } from "./authapi";

const SUBSCRIPTION_API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/v1/subscription`;

export const subscriptionApi = createApi({
  reducerPath: "subscriptionApi",
  tagTypes: ["Subscription"],
  baseQuery: fetchBaseQuery({
    baseUrl: SUBSCRIPTION_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createSubscriptionOrder: builder.mutation({
      query: ({ subscriptionType, amount }) => ({
        url: "/create-order",
        method: "POST",
        body: { subscriptionType, amount },
      }),
      invalidatesTags: ["Subscription"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApi.util.invalidateTags(["User"]));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    verifySubscriptionPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/verify-payment",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Subscription"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(authApi.util.invalidateTags(["User"]));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getUserSubscriptions: builder.query({
      query: () => ({
        url: "/user-subscriptions",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
    checkSubscriptionStatus: builder.query({
      query: (subscriptionType) => ({
        url: `/check-status/${subscriptionType}`,
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),
  }),
});

export const {
  useCreateSubscriptionOrderMutation,
  useVerifySubscriptionPaymentMutation,
  useGetUserSubscriptionsQuery,
  useCheckSubscriptionStatusQuery,
} = subscriptionApi;
