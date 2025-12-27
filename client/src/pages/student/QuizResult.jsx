import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetMyQuizResultQuery } from '@/features/api/quizApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const QuizResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetMyQuizResultQuery(attemptId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const attempt = data?.attempt;
  const quiz = attempt?.quizId;

  // Calculate correct/incorrect counts
  const correctCount = attempt?.answers?.filter(answer => {
    const question = quiz?.questions?.find(q => q._id === answer.questionId);
    return question?.correctAnswer?.toLowerCase().trim() === answer.answer?.toLowerCase().trim();
  }).length || 0;
  
  const totalQuestions = quiz?.questions?.length || 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Quizzes
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {attempt?.passed ? (
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl mb-2">
              {attempt?.passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              {quiz?.title}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{attempt?.score}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{attempt?.totalMarks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Marks</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{attempt?.percentage?.toFixed(1)}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Percentage</p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">
                {attempt?.passed ? 'Passed' : 'Failed'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Result</p>
            </div>
          </div>

          <div className="mt-6 p-4 border-t">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Passing Marks:</span>
              <span className="font-semibold">{quiz?.passingMarks}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Questions:</span>
              <span className="font-semibold">{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Correct Answers:</span>
              <span className="font-semibold text-green-600">{correctCount}/{totalQuestions}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Submitted At:</span>
              <span className="font-semibold">
                {new Date(attempt?.submittedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Answer Review */}
      <div className="space-y-4 mb-6">
        <h2 className="text-2xl font-bold">Answer Review</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Review your answers and see the correct ones
        </p>
        
        {quiz?.questions?.map((question, index) => {
          const studentAnswer = attempt?.answers?.find(a => a.questionId === question._id);
          const isCorrect = question.correctAnswer?.toLowerCase().trim() === 
                          studentAnswer?.answer?.toLowerCase().trim();

          return (
            <Card key={question._id} className={isCorrect ? 'border-green-300' : 'border-red-300'}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg flex items-start gap-2">
                    <span className="text-sm font-normal text-gray-500">Q{index + 1}.</span>
                    <span>{question.questionText}</span>
                  </CardTitle>
                  <Badge className={isCorrect ? 'bg-green-500' : 'bg-red-500'}>
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Correct
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" />
                        Incorrect
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.questionType === 'multiple-choice' && question.options?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Options:</p>
                    <ul className="space-y-1">
                      {question.options.map((option, optIdx) => (
                        <li 
                          key={optIdx}
                          className={`text-sm p-2 rounded ${
                            option === question.correctAnswer 
                              ? 'bg-green-50 dark:bg-green-900/20 border border-green-300' 
                              : option === studentAnswer?.answer && !isCorrect
                              ? 'bg-red-50 dark:bg-red-900/20 border border-red-300'
                              : 'bg-gray-50 dark:bg-gray-800'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Answer:</p>
                    <p className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {studentAnswer?.answer || 'Not answered'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Correct Answer:</p>
                    <p className="font-medium text-green-600">
                      {question.correctAnswer}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Marks:</span>
                  <span className="font-semibold">
                    {isCorrect ? question.marks : 0}/{question.marks}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Button
          variant="outline"
          onClick={() => navigate(`/course-progress/${quiz?.courseId}`)}
          className="flex-1"
        >
          Back to Course
        </Button>
        {quiz?.allowMultipleAttempts && (
          <Button
            onClick={() => navigate(`/student/quiz/${quiz?._id}/start`)}
            className="flex-1"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizResult;
