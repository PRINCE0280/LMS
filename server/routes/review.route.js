import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import {
  submitReview,
  getCourseReviews,
  getInstructorReviews,
  getUserReview,
  deleteReview,
} from '../controllers/review.controller.js';

const router = express.Router();

router.post('/submit', isAuthenticated, submitReview);
router.get('/course/:courseId', getCourseReviews);
router.get('/instructor', isAuthenticated, getInstructorReviews);
router.get('/user/:courseId', isAuthenticated, getUserReview);
router.delete('/:reviewId', isAuthenticated, deleteReview);

export default router;
