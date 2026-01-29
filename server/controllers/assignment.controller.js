import { Assignment, AssignmentSubmission } from '../models/assignment.model.js';
import { Course } from '../models/course.model.js';
import User from '../models/user.model.js';

// Create Assignment
export const createAssignment = async (req, res) => {
  try {
    const instructorId = req.id;
    const { title, description, courseId, dueDate, totalMarks, attachments, selectedUsers, selectedCourses } = req.body;

    // Verify instructor owns the course
    const course = await Course.findOne({ _id: courseId, creator: instructorId });
    if (!course) {
      return res.status(403).json({ message: 'You are not authorized to create assignments for this course' });
    }

    const assignment = new Assignment({
      title,
      description,
      courseId,
      instructorId,
      dueDate,
      totalMarks,
      attachments: attachments || [],
      selectedUsers: selectedUsers || [],
      selectedCourses: selectedCourses || [],
    });

    await assignment.save();

    res.status(201).json({
      success: true,
      assignment,
      message: 'Assignment created successfully',
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Failed to create assignment' });
  }
};

// Get All Assignments for a Course
export const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is instructor or enrolled student
    const user = await User.findById(userId);
    const isInstructor = course.creator.toString() === userId;
    const isEnrolled = course.enrolledStudents.includes(userId);

    if (!isInstructor && !isEnrolled) {
      return res.status(403).json({ message: 'You are not authorized to view assignments for this course' });
    }

    // Instructors see all, students only see published
    const query = { courseId };
    if (!isInstructor) {
      query.isPublished = true;
    }

    let assignments = await Assignment.find(query)
      .populate('instructorId', 'name email')
      .sort({ createdAt: -1 });

    // Filter assignments based on selectedUsers and selectedCourses for students
    if (!isInstructor) {
      assignments = assignments.filter(assignment => {
        // If no users selected, show to all enrolled students
        if (assignment.selectedUsers.length === 0 && assignment.selectedCourses.length === 0) {
          return true;
        }
        // Check if user is in selectedUsers
        if (assignment.selectedUsers.length > 0 && assignment.selectedUsers.some(id => id.toString() === userId)) {
          return true;
        }
        // Check if course is in selectedCourses
        if (assignment.selectedCourses.length > 0 && assignment.selectedCourses.some(id => id.toString() === courseId)) {
          return true;
        }
        return false;
      });
    }

    res.status(200).json({
      success: true,
      assignments,
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Failed to get assignments' });
  }
};

// Get Single Assignment
export const getAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId)
      .populate('instructorId', 'name email')
      .populate('courseId', 'courseTitle');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Failed to get assignment' });
  }
};

// Update Assignment
export const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const instructorId = req.id;
    const updateData = req.body;

    const assignment = await Assignment.findOne({ _id: assignmentId, instructorId });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or you are not authorized' });
    }

    Object.assign(assignment, updateData);
    await assignment.save();

    res.status(200).json({
      success: true,
      assignment,
      message: 'Assignment updated successfully',
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Failed to update assignment' });
  }
};

// Delete Assignment
export const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const instructorId = req.id;

    const assignment = await Assignment.findOneAndDelete({ _id: assignmentId, instructorId });
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or you are not authorized' });
    }

    // Also delete all submissions
    await AssignmentSubmission.deleteMany({ assignmentId });

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Failed to delete assignment' });
  }
};

// Submit Assignment (Student)
export const submitAssignment = async (req, res) => {
  try {
    const studentId = req.id;
    const { assignmentId } = req.params;
    const { submissionText, attachments } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check if already submitted
    const existingSubmission = await AssignmentSubmission.findOne({ assignmentId, studentId });
    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this assignment' });
    }

    // Check if past due date
    const isLate = new Date() > new Date(assignment.dueDate);

    const submission = new AssignmentSubmission({
      assignmentId,
      studentId,
      submissionText,
      attachments: attachments || [],
      status: isLate ? 'late' : 'submitted',
    });

    await submission.save();

    res.status(201).json({
      success: true,
      submission,
      message: 'Assignment submitted successfully',
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ message: 'Failed to submit assignment' });
  }
};

// Get Assignment Submissions (Instructor)
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const instructorId = req.id;

    const assignment = await Assignment.findOne({ _id: assignmentId, instructorId });
    if (!assignment) {
      return res.status(403).json({ message: 'You are not authorized to view submissions' });
    }

    const submissions = await AssignmentSubmission.find({ assignmentId })
      .populate('studentId', 'name email photoUrl')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ message: 'Failed to get submissions' });
  }
};

// Grade Assignment Submission (Instructor)
export const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marksObtained, feedback } = req.body;

    const submission = await AssignmentSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.marksObtained = marksObtained;
    submission.feedback = feedback;
    submission.status = 'graded';
    await submission.save();

    res.status(200).json({
      success: true,
      submission,
      message: 'Assignment graded successfully',
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ message: 'Failed to grade submission' });
  }
};

// Get Student's Submission
export const getMySubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.id;

    const submission = await AssignmentSubmission.findOne({ assignmentId, studentId })
      .populate('assignmentId');

    res.status(200).json({
      success: true,
      submission,
    });
  } catch (error) {
    console.error('Get my submission error:', error);
    res.status(500).json({ message: 'Failed to get submission' });
  }
};
