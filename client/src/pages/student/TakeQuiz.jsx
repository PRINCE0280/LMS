import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetQuizQuery, useStartQuizAttemptMutation, useSubmitQuizMutation } from '@/features/api/quizApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { data: quizData, isLoading } = useGetQuizQuery(quizId);
  const [startQuizAttempt] = useStartQuizAttemptMutation();
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();

  const [attemptId, setAttemptId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const quiz = quizData?.quiz;

  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining]);

  const handleStartQuiz = async () => {
    try {
      const result = await startQuizAttempt(quizId).unwrap();
      setAttemptId(result.attempt._id);
      setTimeRemaining(quiz.duration * 60);
      setQuizStarted(true);
      toast.success('Quiz started! Good luck!');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to start quiz');
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async () => {
    if (!attemptId) return;

    const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    try {
      const result = await submitQuiz({
        attemptId,
        answers: answersArray,
      }).unwrap();

      toast.success('Quiz submitted successfully!');
      navigate(`/student/quiz/result/${attemptId}`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit quiz');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quizStarted) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{quiz?.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quiz?.description && (
              <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                <p className="text-xl font-semibold">{quiz?.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Questions</p>
                <p className="text-xl font-semibold">{quiz?.questions?.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Marks</p>
                <p className="text-xl font-semibold">{quiz?.totalMarks}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Passing Marks</p>
                <p className="text-xl font-semibold">{quiz?.passingMarks}</p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold mb-1">Instructions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>The timer will start once you begin the quiz</li>
                    <li>The quiz will auto-submit when time runs out</li>
                    <li>Make sure you have a stable internet connection</li>
                    <li>You cannot pause or restart once started</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleStartQuiz} className="flex-1">
                Start Quiz
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pb-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{quiz?.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Question {Object.keys(answers).length}/{quiz?.questions?.length} answered
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-blue-600'}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Time Remaining</p>
                </div>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Quiz'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {quiz?.questions?.map((question, index) => (
          <Card key={question._id}>
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">Q{index + 1}</Badge>
                <div className="flex-1">
                  <p className="text-lg font-medium">{question.questionText}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {question.questionType === 'multiple-choice' && (
                <div className="space-y-2">
                  {question.options?.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        answers[question._id] === option
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        checked={answers[question._id] === option}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.questionType === 'true-false' && (
                <div className="space-y-2">
                  {['True', 'False'].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                        answers[question._id] === option
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        checked={answers[question._id] === option}
                        onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.questionType === 'short-answer' && (
                <div>
                  <Label>Your Answer</Label>
                  <Input
                    type="text"
                    value={answers[question._id] || ''}
                    onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    placeholder="Type your answer..."
                    className="mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 sticky bottom-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Make sure you've answered all questions before submitting
            </p>
            <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Quiz
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TakeQuiz;
