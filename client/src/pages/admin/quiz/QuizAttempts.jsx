import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetQuizAttemptsQuery, useGetAttemptDetailQuery } from '@/features/api/quizApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, CheckCircle, XCircle, Eye, ArrowLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const QuizAttempts = () => {
  const { quizId } = useParams();
  const { data, isLoading } = useGetQuizAttemptsQuery(quizId);
  const [selectedAttemptId, setSelectedAttemptId] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Quiz Attempts</h1>

      {data?.attempts?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">No attempts yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.attempts?.map((attempt) => (
            <Card key={attempt._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {attempt.studentId?.name}
                      {attempt.passed ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Passed
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Failed
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {attempt.studentId?.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(attempt.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <p className="text-2xl font-bold">
                        {attempt.score}/{attempt.totalMarks}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {attempt.percentage?.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Taken:</span>
                    <span className="font-medium">
                      {Math.round(
                        (new Date(attempt.submittedAt) - new Date(attempt.startedAt)) / 60000
                      )}{' '}
                      minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Questions Answered:</span>
                    <span className="font-medium">{attempt.answers?.length || 0}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setSelectedAttemptId(attempt._id)}
                  className="mt-4 w-full"
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Detailed Answers
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AttemptDetailDialog 
        attemptId={selectedAttemptId}
        onClose={() => setSelectedAttemptId(null)}
      />
    </div>
  );
};

const AttemptDetailDialog = ({ attemptId, onClose }) => {
  const { data, isLoading } = useGetAttemptDetailQuery(attemptId, {
    skip: !attemptId,
  });

  return (
    <Dialog open={!!attemptId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detailed Quiz Results</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : data?.attempt ? (
          <div className="space-y-6">
            {/* Student Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Student</p>
                    <p className="font-semibold">{data.attempt.student.name}</p>
                    <p className="text-sm text-gray-500">{data.attempt.student.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Score</p>
                    <p className="text-3xl font-bold">
                      {data.attempt.score}/{data.attempt.totalMarks}
                    </p>
                    <p className="text-sm text-gray-500">
                      {data.attempt.percentage?.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                  <span>
                    Started: {new Date(data.attempt.startedAt).toLocaleString()}
                  </span>
                  <span>
                    Submitted: {new Date(data.attempt.submittedAt).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Questions and Answers */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Question-wise Analysis</h3>
              {data.attempt.detailedAnswers.map((item, index) => (
                <Card key={item.questionId} className={item.isCorrect ? 'border-green-300' : 'border-red-300'}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex items-start gap-2">
                        <span className="text-sm font-normal text-gray-500">Q{index + 1}.</span>
                        <span>{item.questionText}</span>
                      </CardTitle>
                      <Badge className={item.isCorrect ? 'bg-green-500' : 'bg-red-500'}>
                        {item.isCorrect ? (
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
                    {item.questionType === 'multiple-choice' && item.options.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">Options:</p>
                        <ul className="space-y-1">
                          {item.options.map((option, optIdx) => (
                            <li 
                              key={optIdx}
                              className={`text-sm p-2 rounded ${
                                option === item.correctAnswer 
                                  ? 'bg-green-50 border border-green-300' 
                                  : option === item.studentAnswer && !item.isCorrect
                                  ? 'bg-red-50 border border-red-300'
                                  : 'bg-gray-50'
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
                        <p className="text-sm font-medium text-gray-600 mb-1">Student's Answer:</p>
                        <p className={`font-medium ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {item.studentAnswer}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</p>
                        <p className="font-medium text-green-600">
                          {item.correctAnswer}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-sm text-gray-600">Marks:</span>
                      <span className="font-semibold">
                        {item.earnedMarks}/{item.marks}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default QuizAttempts;
