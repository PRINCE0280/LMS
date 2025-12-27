import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCourseQuizzesQuery, useDeleteQuizMutation, useUpdateQuizMutation } from '@/features/api/quizApi';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Eye, Users, Clock, Trophy, Upload, Code, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const QuizList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCourseQuizzesQuery(courseId);
  const [deleteQuiz] = useDeleteQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();

  const handleDelete = async (quizId) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await deleteQuiz(quizId).unwrap();
      toast.success('Quiz deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete quiz');
    }
  };

  const togglePublish = async (quiz) => {
    try {
      await updateQuiz({
        quizId: quiz._id,
        isPublished: !quiz.isPublished,
      }).unwrap();
      toast.success(quiz.isPublished ? 'Quiz unpublished' : 'Quiz published');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update quiz');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/quiz-converter`)}
          >
            <Code className="mr-2 h-4 w-4" />
            Text to JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}/quiz/bulk-import`)}
          >
            <Upload className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button onClick={() => navigate(`/admin/course/${courseId}/quiz/create`)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </div>
      </div>

      {data?.quizzes?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No quizzes created yet</p>
            <Button onClick={() => navigate(`/admin/course/${courseId}/quiz/create`)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Quiz
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data?.quizzes?.map((quiz) => (
            <Card key={quiz._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{quiz.title}</h3>
                      <Badge variant={quiz.isPublished ? 'default' : 'secondary'}>
                        {quiz.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      {quiz.allowMultipleAttempts && (
                        <Badge variant="outline">Multiple Attempts</Badge>
                      )}
                    </div>
                    {quiz.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {quiz.description}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {quiz.duration} minutes
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {quiz.totalMarks} marks
                      </div>
                      <div className="flex items-center gap-1">
                        Passing: {quiz.passingMarks} marks
                      </div>
                      <div className="flex items-center gap-1">
                        {quiz.questions?.length || 0} questions
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/quiz/${quiz._id}/attempts`)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Attempts
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/quiz/${quiz._id}/edit`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish(quiz)}
                    >
                      {quiz.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/quiz/${quiz._id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(quiz._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
