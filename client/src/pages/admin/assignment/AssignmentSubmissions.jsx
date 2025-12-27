import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAssignmentSubmissionsQuery, useGradeSubmissionMutation } from '@/features/api/assignmentApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AssignmentSubmissions = () => {
  const { assignmentId } = useParams();
  const { data, isLoading } = useGetAssignmentSubmissionsQuery(assignmentId);
  const [gradeSubmission] = useGradeSubmissionMutation();
  const [gradingData, setGradingData] = useState({});

  const handleGrade = async (submissionId) => {
    const { marks, feedback } = gradingData[submissionId] || {};
    
    if (!marks) {
      toast.error('Please enter marks');
      return;
    }

    try {
      await gradeSubmission({
        submissionId,
        marksObtained: Number(marks),
        feedback: feedback || '',
      }).unwrap();
      
      toast.success('Submission graded successfully');
      setGradingData({ ...gradingData, [submissionId]: {} });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to grade submission');
    }
  };

  const updateGradingData = (submissionId, field, value) => {
    setGradingData({
      ...gradingData,
      [submissionId]: {
        ...gradingData[submissionId],
        [field]: value,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Assignment Submissions</h1>

      {data?.submissions?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">No submissions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {data?.submissions?.map((submission) => (
            <Card key={submission._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      {submission.studentId?.name}
                      <Badge
                        variant={
                          submission.status === 'graded'
                            ? 'default'
                            : submission.status === 'late'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {submission.status === 'graded' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {submission.status === 'late' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {submission.status === 'submitted' && <Clock className="w-3 h-3 mr-1" />}
                        {submission.status}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {submission.studentId?.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      Submitted: {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  {submission.marksObtained !== undefined && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {submission.marksObtained}
                      </p>
                      <p className="text-sm text-gray-500">marks</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Submission:</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {submission.submissionText}
                  </p>
                </div>

                {submission.attachments?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Attachments:</h4>
                    <div className="space-y-1">
                      {submission.attachments.map((file, index) => (
                        <a
                          key={index}
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline block"
                        >
                          {file.fileName}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {submission.feedback && (
                  <div>
                    <h4 className="font-semibold mb-2">Feedback:</h4>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {submission.feedback}
                    </p>
                  </div>
                )}

                {submission.status !== 'graded' && (
                  <div className="border-t pt-4 space-y-3">
                    <h4 className="font-semibold">Grade Submission</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Marks Obtained</label>
                        <Input
                          type="number"
                          placeholder="Enter marks"
                          value={gradingData[submission._id]?.marks || ''}
                          onChange={(e) => updateGradingData(submission._id, 'marks', e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Feedback (Optional)</label>
                      <Textarea
                        placeholder="Enter feedback for the student"
                        rows={3}
                        value={gradingData[submission._id]?.feedback || ''}
                        onChange={(e) => updateGradingData(submission._id, 'feedback', e.target.value)}
                      />
                    </div>
                    <Button onClick={() => handleGrade(submission._id)}>
                      Submit Grade
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmissions;
