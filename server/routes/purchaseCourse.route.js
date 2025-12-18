import express from "express";
import {
  createRazorpayOrder,
  verifyPayment,
  getAllPurchasedCourse,
  getCourseDetailsWithPurchaseStatus,
} from "../controllers/coursePurchase.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router
  .route("/razorpay/create-order")
  .post(isAuthenticated, createRazorpayOrder);

router
  .route("/razorpay/verify-payment")
  .post(isAuthenticated, verifyPayment);

router
  .route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, getCourseDetailsWithPurchaseStatus);

router.route("/").get(isAuthenticated, getAllPurchasedCourse);

export default router;