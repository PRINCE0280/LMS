import { Quiz, QuizAttempt } from '../models/quiz.model.js';
import { Course } from '../models/course.model.js';
import User from '../models/user.model.js';

// Create Quiz
export const createQuiz = async (req, res) => {
  try {
    const instructorId = req.id;
    const { title, description, courseId, duration, totalMarks, passingMarks, questions, allowMultipleAttempts } = req.body;

    // Verify instructor owns the course
    const course = await Course.findOne({ _id: courseId, creator: instructorId });
    if (!course) {
      return res.status(403).json({ message: 'You are not authorized to create quizzes for this course' });
    }

    const quiz = new Quiz({
      title,
      description,
      courseId,
      instructorId,
      duration,
      totalMarks,
      passingMarks,
      questions,
      allowMultipleAttempts,
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      quiz,
      message: 'Quiz created successfully',
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ message: 'Failed to create quiz' });
  }
};

// Get All Quizzes for a Course
export const getCourseQuizzes = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const isInstructor = course.creator.toString() === userId;
    const isEnrolled = course.enrolledStudents.includes(userId);

    if (!isInstructor && !isEnrolled) {
      return res.status(403).json({ message: 'You are not authorized to view quizzes for this course' });
    }

    const query = { courseId };
    if (!isInstructor) {
      query.isPublished = true;
    }

    const quizzes = await Quiz.find(query)
      .populate('instructorId', 'name email')
      .sort({ createdAt: -1 });

    // For students, get their attempts
    if (!isInstructor) {
      const quizzesWithAttempts = await Promise.all(
        quizzes.map(async (quiz) => {
          const attempts = await QuizAttempt.find({
            quizId: quiz._id,
            studentId: userId,
            status: 'submitted',
          }).sort({ createdAt: -1 });

          return {
            ...quiz.toObject(),
            attempts,
            attemptCount: attempts.length,
            bestScore: attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : null,
          };
        })
      );
      return res.status(200).json({ success: true, quizzes: quizzesWithAttempts });
    }

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Failed to get quizzes' });
  }
};

// Get Single Quiz
export const getQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.id;

    const quiz = await Quiz.findById(quizId)
      .populate('instructorId', 'name email')
      .populate('courseId', 'courseTitle');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const course = await Course.findById(quiz.courseId);
    const isInstructor = course.creator.toString() === userId;

    // For students, don't send correct answers
    if (!isInstructor) {
      const quizData = quiz.toObject();
      quizData.questions = quizData.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
        marks: q.marks,
      }));
      return res.status(200).json({ success: true, quiz: quizData });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({ message: 'Failed to get quiz' });
  }
};

// Update Quiz
export const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const instructorId = req.id;
    const updateData = req.body;

    const quiz = await Quiz.findOne({ _id: quizId, instructorId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or you are not authorized' });
    }

    Object.assign(quiz, updateData);
    await quiz.save();

    res.status(200).json({
      success: true,
      quiz,
      message: 'Quiz updated successfully',
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ message: 'Failed to update quiz' });
  }
};

// Delete Quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const instructorId = req.id;

    const quiz = await Quiz.findOneAndDelete({ _id: quizId, instructorId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or you are not authorized' });
    }

    // Also delete all attempts
    await QuizAttempt.deleteMany({ quizId });

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully',
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Failed to delete quiz' });
  }
};

// Start Quiz Attempt (Student)
export const startQuizAttempt = async (req, res) => {
  try {
    const studentId = req.id;
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!quiz.isPublished) {
      return res.status(400).json({ message: 'Quiz is not published yet' });
    }

    // Check if multiple attempts allowed
    if (!quiz.allowMultipleAttempts) {
      const existingAttempt = await QuizAttempt.findOne({
        quizId,
        studentId,
        status: 'submitted',
      });
      if (existingAttempt) {
        return res.status(400).json({ message: 'You have already attempted this quiz' });
      }
    }

    const attempt = new QuizAttempt({
      quizId,
      studentId,
      totalMarks: quiz.totalMarks,
    });

    await attempt.save();

    res.status(201).json({
      success: true,
      attempt,
      message: 'Quiz attempt started',
    });
  } catch (error) {
    console.error('Start quiz attempt error:', error);
    res.status(500).json({ message: 'Failed to start quiz attempt' });
  }
};

// Submit Quiz (Student)
export const submitQuiz = async (req, res) => {
  try {
    const studentId = req.id;
    const { attemptId } = req.params;
    const { answers } = req.body;

    const attempt = await QuizAttempt.findOne({ _id: attemptId, studentId });
    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    if (attempt.status === 'submitted') {
      return res.status(400).json({ message: 'Quiz already submitted' });
    }

    const quiz = await Quiz.findById(attempt.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Calculate score
    let score = 0;
    answers.forEach(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId.toString());
      if (question && question.correctAnswer.toLowerCase().trim() === answer.answer.toLowerCase().trim()) {
        score += question.marks;
      }
    });

    const percentage = (score / quiz.totalMarks) * 100;
    const passed = score >= quiz.passingMarks;

    attempt.answers = answers;
    attempt.score = score;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.submittedAt = new Date();
    attempt.status = 'submitted';

    await attempt.save();

    res.status(200).json({
      success: true,
      attempt,
      message: 'Quiz submitted successfully',
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Failed to submit quiz' });
  }
};

// Get Quiz Attempts (Instructor)
export const getQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;
    const instructorId = req.id;

    const quiz = await Quiz.findOne({ _id: quizId, instructorId });
    if (!quiz) {
      return res.status(403).json({ message: 'You are not authorized to view attempts' });
    }

    const attempts = await QuizAttempt.find({ quizId, status: 'submitted' })
      .populate('studentId', 'name email photoUrl')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      attempts,
    });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({ message: 'Failed to get attempts' });
  }
};

// Get Student's Quiz Result
export const getMyQuizResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const studentId = req.id;

    const attempt = await QuizAttempt.findOne({ _id: attemptId, studentId })
      .populate('quizId');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    res.status(200).json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error('Get quiz result error:', error);
    res.status(500).json({ message: 'Failed to get quiz result' });
  }
};

// Get Detailed Attempt with Correct Answers (Instructor)
export const getAttemptDetail = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const instructorId = req.id;

    const attempt = await QuizAttempt.findById(attemptId)
      .populate('studentId', 'name email photoUrl')
      .populate('quizId');

    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }

    // Verify instructor owns the quiz
    if (attempt.quizId.instructorId.toString() !== instructorId) {
      return res.status(403).json({ message: 'You are not authorized to view this attempt' });
    }

    // Add detailed comparison for each answer
    const detailedAnswers = attempt.answers.map(answer => {
      const question = attempt.quizId.questions.find(
        q => q._id.toString() === answer.questionId.toString()
      );
      
      if (!question) return null;

      const isCorrect = question.correctAnswer.toLowerCase().trim() === 
                       answer.answer.toLowerCase().trim();

      return {
        questionId: answer.questionId,
        questionText: question.questionText,
        questionType: question.questionType,
        options: question.options,
        studentAnswer: answer.answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        marks: question.marks,
        earnedMarks: isCorrect ? question.marks : 0,
      };
    }).filter(Boolean);

    res.status(200).json({
      success: true,
      attempt: {
        _id: attempt._id,
        student: attempt.studentId,
        quiz: {
          _id: attempt.quizId._id,
          title: attempt.quizId.title,
          totalMarks: attempt.quizId.totalMarks,
          passingMarks: attempt.quizId.passingMarks,
        },
        score: attempt.score,
        totalMarks: attempt.totalMarks,
        percentage: attempt.percentage,
        passed: attempt.passed,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        detailedAnswers,
      },
    });
  } catch (error) {
    console.error('Get attempt detail error:', error);
    res.status(500).json({ message: 'Failed to get attempt detail' });
  }
};

// Get Course Students (Instructor)
export const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.id;

    const course = await Course.findOne({ _id: courseId, creator: instructorId })
      .populate('enrolledStudents', 'name email photoUrl createdAt');

    if (!course) {
      return res.status(403).json({ message: 'You are not authorized to view students' });
    }

    res.status(200).json({
      success: true,
      students: course.enrolledStudents,
      totalStudents: course.enrolledStudents.length,
    });
  } catch (error) {
    console.error('Get course students error:', error);
    res.status(500).json({ message: 'Failed to get students' });
  }
};
