import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAssignmentQuery } from '@/features/api/assignmentApi';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Calendar, CheckCircle, FileText, Download, Eye, Users, BookOpen } from 'lucide-react';

const ViewAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetAssignmentQuery(assignmentId);

  const assignment = data?.assignment;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-gray-500">Assignment not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-2">{assignment.title}</CardTitle>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
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
            <Badge variant={assignment.isPublished ? 'default' : 'secondary'}>
              {assignment.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {assignment.description}
            </p>
          </div>

          {assignment.courseId && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {assignment.courseId?.courseTitle || 'N/A'}
              </p>
            </div>
          )}

          {assignment.instructorId && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Instructor</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {assignment.instructorId?.name || 'N/A'} ({assignment.instructorId?.email || 'N/A'})
              </p>
            </div>
          )}

          {assignment.selectedUsers && assignment.selectedUsers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Selected Students ({assignment.selectedUsers.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {assignment.selectedUsers.map((user) => (
                  <Badge key={user._id || user} variant="secondary">
                    {user.name || user.email || user}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {assignment.selectedCourses && assignment.selectedCourses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Additional Courses ({assignment.selectedCourses.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {assignment.selectedCourses.map((course) => (
                  <Badge key={course._id || course} variant="secondary">
                    {course.courseTitle || course}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {assignment.attachments && assignment.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Assignment Files</h3>
              <div className="space-y-2">
                {assignment.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
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

          <div className="flex gap-2 pt-4">
            <Button onClick={() => navigate(`/admin/assignment/${assignmentId}/edit`)}>
              Edit Assignment
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/admin/assignment/${assignmentId}/submissions`)}
            >
              <Users className="w-4 h-4 mr-2" />
              View Submissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewAssignment;
