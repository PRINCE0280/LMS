import '../App.css'
import Login from "./pages/login"
import HeroSection from "./pages/student/HeroSection"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Courses from "./pages/student/Courses"
import CareerSkills from "./pages/student/CareerSkills"
import GenerateAI from "./pages/student/GenerateAI"
import ITCertifications from "./pages/student/ITCertifications"
import DataScience from "./pages/student/DataScience"
import MyLearning from "./pages/student/MyLearning"
import Profile from "./pages/student/Profile"
import Sidebar from "./pages/admin/lecture/Sidebar"
import Dashboard from "./pages/admin/lecture/Dashboard"
import CourseTable from "./pages/admin/course/CourseTable"
import AddCourse from "./pages/admin/course/AddCourse"
import EditCourse from "./pages/admin/course/EditCourse"
import CreateLecture from "./pages/admin/lecture/CreateLecture"
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute'
import SubscriptionProtectedRoute from './components/SubscriptionProtectedRoute'
import { ThemeProvider } from './components/ThemeProvider'
import CreateAssignment from './pages/admin/assignment/CreateAssignment'
import EditAssignment from './pages/admin/assignment/EditAssignment'
import ViewAssignment from './pages/admin/assignment/ViewAssignment'
import AssignmentList from './pages/admin/assignment/AssignmentList'
import AssignmentSubmissions from './pages/admin/assignment/AssignmentSubmissions'
import CreateQuiz from './pages/admin/quiz/CreateQuiz'
import EditQuiz from './pages/admin/quiz/EditQuiz'
import QuizList from './pages/admin/quiz/QuizList'
import QuizAttempts from './pages/admin/quiz/QuizAttempts'
import BulkImportQuiz from './pages/admin/quiz/BulkImportQuiz'
import QuizConverter from './pages/admin/quiz/QuizConverter'
import StudentManagement from './pages/admin/StudentManagement'
import StudentAssignments from './pages/student/StudentAssignments'
import AssignmentSubmission from './pages/student/AssignmentSubmission'
import StudentQuizzes from './pages/student/StudentQuizzes'
import TakeQuiz from './pages/student/TakeQuiz'
import QuizResult from './pages/student/QuizResult'
import InstructorReviews from './pages/admin/InstructorReviews'


  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <>
              <HeroSection />
              <CareerSkills />
              <Courses />
            </>
          ),
        },
        {
          path: "login",
          element: <AuthenticatedUser><Login /></AuthenticatedUser>
        },
        {
          path: "my-learning",
          element: <ProtectedRoute><MyLearning /></ProtectedRoute>
        },
        {
          path: "profile",
          element: <ProtectedRoute> <Profile /></ProtectedRoute>
        },
        {
          path: "generate-ai",
          element: <ProtectedRoute>
            <SubscriptionProtectedRoute subscriptionType="generative-ai">
              <GenerateAI />
            </SubscriptionProtectedRoute>
          </ProtectedRoute>
        },
        {
          path: "it-certifications",
          element: <ProtectedRoute>
            <SubscriptionProtectedRoute subscriptionType="it-certifications">
              <ITCertifications />
            </SubscriptionProtectedRoute>
          </ProtectedRoute>
        },
        {
          path: "data-science",
          element: <ProtectedRoute>
            <SubscriptionProtectedRoute subscriptionType="data-science">
              <DataScience />
            </SubscriptionProtectedRoute>
          </ProtectedRoute>
        },
        {
          path: "course/search",
          element: <ProtectedRoute><SearchPage /></ProtectedRoute>
        },
        {
          path: "course-detail/:courseId",
          element: <ProtectedRoute> <CourseDetail /></ProtectedRoute>
        },
        {
          path: "course-progress/:courseId",
          element: <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        },
        {
          path: "student/assignments/:courseId",
          element: <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <StudentAssignments />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        },
        {
          path: "student/assignment/:assignmentId",
          element: <ProtectedRoute><AssignmentSubmission /></ProtectedRoute>
        },
        {
          path: "student/quizzes/:courseId",
          element: <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <StudentQuizzes />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        },
        {
          path: "student/quiz/:quizId/start",
          element: <ProtectedRoute><TakeQuiz /></ProtectedRoute>
        },
        {
          path: "student/quiz/result/:attemptId",
          element: <ProtectedRoute><QuizResult /></ProtectedRoute>
        },
        {
          path: "admin",
          element: <AdminRoute><Sidebar /></AdminRoute>,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />
            },
            {
              path: "courses",
              element: <CourseTable />
            },
            {
              path: "courses/create",
              element: <AddCourse />
            },
            {
              path: "courses/:courseId",
              element: <EditCourse />
            },
            {
              path: "courses/:courseId/lectures",
              element: <CreateLecture />
            }, 
            {
              path: "courses/:courseId/lectures/:lectureId",
              element: <EditLecture />
            },
            {
              path: "course/:courseId/students",
              element: <StudentManagement />
            },
            {
              path: "courses/:courseId/students",
              element: <StudentManagement />
            },
            {
              path: "course/:courseId/assignments",
              element: <AssignmentList />
            },
            {
              path: "courses/:courseId/assignments",
              element: <AssignmentList />
            },
            {
              path: "course/:courseId/assignment/create",
              element: <CreateAssignment />
            },
            {
              path: "courses/:courseId/assignment/create",
              element: <CreateAssignment />
            },
            {
              path: "assignment/:assignmentId/edit",
              element: <EditAssignment />
            },
            {
              path: "assignment/:assignmentId",
              element: <ViewAssignment />
            },
            {
              path: "assignment/:assignmentId/submissions",
              element: <AssignmentSubmissions />
            },
            {
              path: "course/:courseId/quizzes",
              element: <QuizList />
            },
            {
              path: "courses/:courseId/quizzes",
              element: <QuizList />
            },
            {
              path: "course/:courseId/quiz/create",
              element: <CreateQuiz />
            },
            {
              path: "courses/:courseId/quiz/create",
              element: <CreateQuiz />
            },
            {
              path: "course/:courseId/quiz/bulk-import",
              element: <BulkImportQuiz />
            },
            {
              path: "courses/:courseId/quiz/bulk-import",
              element: <BulkImportQuiz />
            },
            {
              path: "quiz-converter",
              element: <QuizConverter />
            },
            {
              path: "quiz/:quizId/edit",
              element: <EditQuiz />
            },
            {
              path: "quiz/:quizId/attempts",
              element: <QuizAttempts />
            },
            {
              path: "reviews",
              element: <InstructorReviews />
            }
          ]
        }
      ]
    }
  ]);
function App() {
  return (
   <main>
    <ThemeProvider>
      <RouterProvider router={appRouter} />
    </ThemeProvider>
   </main>
  )
}

export default App
