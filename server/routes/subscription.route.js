import express from "express";
import {
  createSubscriptionOrder,
  verifySubscriptionPayment,
  getUserSubscriptions,
  checkSubscriptionStatus,
} from "../controllers/subscription.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router
  .route("/create-order")
  .post(isAuthenticated, createSubscriptionOrder);

router
  .route("/verify-payment")
  .post(isAuthenticated, verifySubscriptionPayment);

router
  .route("/user-subscriptions")
  .get(isAuthenticated, getUserSubscriptions);

router
  .route("/check-status/:subscriptionType")
  .get(isAuthenticated, checkSubscriptionStatus);

export default router;
