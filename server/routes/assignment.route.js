import express from 'express';
import {
  createAssignment,
  getCourseAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getMySubmission,
} from '../controllers/assignment.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

// Assignment management routes
router.post('/create', isAuthenticated, createAssignment);
router.get('/course/:courseId', isAuthenticated, getCourseAssignments);
router.get('/:assignmentId', isAuthenticated, getAssignment);
router.put('/:assignmentId', isAuthenticated, updateAssignment);
router.delete('/:assignmentId', isAuthenticated, deleteAssignment);

// Student submission routes
router.post('/:assignmentId/submit', isAuthenticated, submitAssignment);
router.get('/:assignmentId/my-submission', isAuthenticated, getMySubmission);

// Instructor grading routes
router.get('/:assignmentId/submissions', isAuthenticated, getAssignmentSubmissions);
router.put('/submission/:submissionId/grade', isAuthenticated, gradeSubmission);

export default router;
