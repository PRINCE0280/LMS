import { Review } from '../models/review.model.js';
import { Course } from '../models/course.model.js';
import { CourseProgress } from '../models/courseProgress.js';

// Submit a review for a course
export const submitReview = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId, rating, comment } = req.body;

    // Validate input
    if (!courseId || !rating) {
      return res.status(400).json({ message: 'Course ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user is enrolled in the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isEnrolled = course.enrolledStudents.includes(userId);
    if (!isEnrolled) {
      return res.status(403).json({ message: 'You must be enrolled in this course to leave a review' });
    }

    // Check if user has completed at least one lecture
    const progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress || !progress.lectureProgress || progress.lectureProgress.length === 0) {
      return res.status(403).json({ message: 'You must watch at least one lecture before leaving a review' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ courseId, userId });
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      return res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        review: existingReview,
      });
    }

    // Create new review
    const newReview = new Review({
      courseId,
      userId,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: newReview,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

// Get reviews for a course
export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ courseId, isApproved: true })
      .populate('userId', 'name photoUrl')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      reviews,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error('Get course reviews error:', error);
    res.status(500).json({ message: 'Failed to get reviews' });
  }
};

// Get reviews for instructor's courses
export const getInstructorReviews = async (req, res) => {
  try {
    const instructorId = req.id;

    // Get all courses by instructor
    const courses = await Course.find({ creator: instructorId }).select('_id courseTitle');

    const courseIds = courses.map(course => course._id);

    // Get all reviews for these courses
    const reviews = await Review.find({ courseId: { $in: courseIds } })
      .populate('userId', 'name photoUrl')
      .populate('courseId', 'courseTitle CourseThumbnail')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Get instructor reviews error:', error);
    res.status(500).json({ message: 'Failed to get instructor reviews' });
  }
};

// Get user's review for a course
export const getUserReview = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.params;

    const review = await Review.findOne({ courseId, userId });

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error('Get user review error:', error);
    res.status(500).json({ message: 'Failed to get user review' });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const userId = req.id;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
};
