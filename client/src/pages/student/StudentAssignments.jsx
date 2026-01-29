import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCourseAssignmentsQuery } from '@/features/api/assignmentApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, CheckCircle, Clock, FileText, AlertCircle, Download, Eye } from 'lucide-react';

const StudentAssignments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCourseAssignmentsQuery(courseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isPastDue = now > dueDate;

    if (isPastDue) {
      return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Past Due</Badge>;
    }
    return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Open</Badge>;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-8 mt-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Course Assignments</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and submit your assignments
        </p>
      </div>

      {data?.assignments?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500">No assignments available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data?.assignments?.map((assignment) => (
            <Card key={assignment._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{assignment.title}</h3>
                      {getStatusBadge(assignment)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {assignment.description}
                    </p>

                    {/* Display Assignment Files */}
                    {assignment.attachments && assignment.attachments.length > 0 && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                          Assignment Files:
                        </p>
                        <div className="space-y-2">
                          {assignment.attachments.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border"
                            >
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">{file.fileName}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(file.fileUrl, '_blank')}
                                  className="h-8"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
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
                                  className="h-8"
                                >
                                  <Download className="w-3 h-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(assignment.dueDate).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {assignment.totalMarks} marks
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate(`/student/assignment/${assignment._id}`)}
                  >
                    View & Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
