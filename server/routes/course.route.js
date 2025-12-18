import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourses, removeCourse, removeLecture, searchCourse, toggleCoursePublish } from '../controllers/course.controller.js';
import upload from '../utils/multer.js';
const router = express.Router();

router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/").get(isAuthenticated, getCreatorCourses);
router.route("/published-courses").get(getPublishedCourses);
router.route("/:courseId")
      .get(isAuthenticated, getCourseById)
      .put(isAuthenticated, upload.single('courseThumbnail'), editCourse)
      .patch(isAuthenticated, toggleCoursePublish)
      .delete(isAuthenticated, removeCourse);
router.route("/:courseId/lecture")
      .post(isAuthenticated, createLecture)
      .get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId")
      .post(isAuthenticated, editLecture)
      .delete(isAuthenticated, removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated, getLectureById);

export default router;