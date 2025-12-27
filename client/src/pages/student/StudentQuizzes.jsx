import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCourseQuizzesQuery } from '@/features/api/quizApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Trophy, CheckCircle, XCircle, PlayCircle } from 'lucide-react';

const StudentQuizzes = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCourseQuizzesQuery(courseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Course Quizzes</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test your knowledge and track your progress
        </p>
      </div>

      {data?.quizzes?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500">No quizzes available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data?.quizzes?.map((quiz) => {
            const hasAttempts = quiz.attemptCount > 0;
            const hasPassed = quiz.bestScore >= quiz.passingMarks;

            return (
              <Card key={quiz._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{quiz.title}</h3>
                        {hasAttempts && (
                          <Badge variant={hasPassed ? 'default' : 'destructive'}>
                            {hasPassed ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Passed
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 mr-1" />
                                Failed
                              </>
                            )}
                          </Badge>
                        )}
                      </div>
                      
                      {quiz.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {quiz.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          {quiz.duration} minutes
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Trophy className="w-4 h-4" />
                          {quiz.totalMarks} marks
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          Passing: {quiz.passingMarks}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          {quiz.questions?.length || 0} questions
                        </div>
                      </div>

                      {hasAttempts && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Attempts: {quiz.attemptCount}
                            </span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              Best Score: {quiz.bestScore}/{quiz.totalMarks}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      {!hasAttempts || quiz.allowMultipleAttempts ? (
                        <Button
                          onClick={() => navigate(`/student/quiz/${quiz._id}/start`)}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {hasAttempts ? 'Retake Quiz' : 'Start Quiz'}
                        </Button>
                      ) : (
                        <Button variant="outline" disabled>
                          Already Attempted
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentQuizzes;
