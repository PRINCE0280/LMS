import express from 'express';
import {
  createQuiz,
  getCourseQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  startQuizAttempt,
  submitQuiz,
  getQuizAttempts,
  getMyQuizResult,
  getCourseStudents,
  getAttemptDetail,
} from '../controllers/quiz.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Quiz management routes
router.post('/create', isAuthenticated, createQuiz);
router.get('/course/:courseId', isAuthenticated, getCourseQuizzes);
router.get('/:quizId', isAuthenticated, getQuiz);
router.put('/:quizId', isAuthenticated, updateQuiz);
router.delete('/:quizId', isAuthenticated, deleteQuiz);

// Student quiz attempt routes
router.post('/:quizId/start', isAuthenticated, startQuizAttempt);
router.post('/attempt/:attemptId/submit', isAuthenticated, submitQuiz);
router.get('/attempt/:attemptId/result', isAuthenticated, getMyQuizResult);

// Instructor routes
router.get('/:quizId/attempts', isAuthenticated, getQuizAttempts);
router.get('/attempt/:attemptId/detail', isAuthenticated, getAttemptDetail);
router.get('/course/:courseId/students', isAuthenticated, getCourseStudents);

export default router;
