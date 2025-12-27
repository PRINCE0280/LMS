import express from 'express';
import { getUserProfile, register, updateProfile, logout, sendRegisterOTP, verifyOTP, resendOTP, sendLoginOTP, verifyLoginOTP } from '../controllers/user.controller.js';
import { login } from '../controllers/user.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../utils/multer.js';
const router = express.Router();

router.route("/register").post(register);
router.route("/send-otp").post(sendRegisterOTP);
router.route("/send-login-otp").post(sendLoginOTP);
router.route("/verify-otp").post(verifyOTP);
router.route("/verify-login-otp").post(verifyLoginOTP);
router.route("/resend-otp").post(resendOTP);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile/update").put(isAuthenticated ,upload.single("profilePhoto"),updateProfile);
export default router;