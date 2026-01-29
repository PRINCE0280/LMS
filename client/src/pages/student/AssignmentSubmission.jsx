import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAssignmentQuery, useGetMySubmissionQuery, useSubmitAssignmentMutation } from '@/features/api/assignmentApi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Calendar, CheckCircle, AlertCircle, FileText, Download, Eye } from 'lucide-react';

const AssignmentSubmission = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { data: assignmentData, isLoading } = useGetAssignmentQuery(assignmentId);
  const { data: submissionData } = useGetMySubmissionQuery(assignmentId);
  const [submitAssignment, { isLoading: isSubmitting }] = useSubmitAssignmentMutation();
  
  const [submissionText, setSubmissionText] = useState('');

  const assignment = assignmentData?.assignment;
  const submission = submissionData?.submission;

  const handleSubmit = async () => {
    if (!submissionText.trim()) {
      toast.error('Please enter your submission');
      return;
    }

    try {
      await submitAssignment({
        assignmentId,
        submissionData: {
          submissionText,
          attachments: [],
        },
      }).unwrap();
      
      toast.success('Assignment submitted successfully!');
      navigate(-1);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to submit assignment');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const isPastDue = new Date() > new Date(assignment?.dueDate);

  return (
    <div className="max-w-4xl mx-auto p-6 pt-8 mt-4">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Assignments
      </Button>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{assignment?.title}</CardTitle>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due: {new Date(assignment?.dueDate).toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {assignment?.totalMarks} marks
                </div>
              </div>
            </div>
            {isPastDue ? (
              <Badge variant="destructive">
                <AlertCircle className="w-3 h-3 mr-1" />
                Past Due
              </Badge>
            ) : (
              <Badge variant="secondary">
                <CheckCircle className="w-3 h-3 mr-1" />
                Open
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {assignment?.description}
            </p>
          </div>

          {/* Display Assignment Files */}
          {assignment?.attachments && assignment.attachments.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                Assignment Files:
              </h3>
              <div className="space-y-2">
                {assignment.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{file.fileName}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(file.fileUrl, '_blank')}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = file.fileUrl;
                          link.download = file.fileName;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {submission ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Submission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Badge variant={submission.status === 'graded' ? 'default' : submission.status === 'late' ? 'destructive' : 'secondary'}>
                {submission.status}
              </Badge>
            </div>
            
            <div>
              <Label className="font-semibold">Submitted At:</Label>
              <p className="text-gray-700 dark:text-gray-300 mt-1">
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>

            <div>
              <Label className="font-semibold">Your Answer:</Label>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1">
                {submission.submissionText}
              </p>
            </div>

            {submission.status === 'graded' && (
              <>
                <div>
                  <Label className="font-semibold">Marks Obtained:</Label>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {submission.marksObtained} / {assignment?.totalMarks}
                  </p>
                </div>

                {submission.feedback && (
                  <div>
                    <Label className="font-semibold">Instructor Feedback:</Label>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      {submission.feedback}
                    </p>
                  </div>
                )}
              </>
            )}

            {submission.status !== 'graded' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Your assignment is under review. You'll be notified once it's graded.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="submission">Your Answer *</Label>
              <Textarea
                id="submission"
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Type your answer here..."
                rows={10}
                className="mt-2"
              />
            </div>

            {isPastDue && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ⚠️ Warning: This assignment is past the due date. Your submission will be marked as late.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Assignment'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssignmentSubmission;
