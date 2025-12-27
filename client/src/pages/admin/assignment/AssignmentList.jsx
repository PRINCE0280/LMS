import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCourseAssignmentsQuery, useDeleteAssignmentMutation, useUpdateAssignmentMutation } from '@/features/api/assignmentApi';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Eye, Users, Calendar, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AssignmentList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetCourseAssignmentsQuery(courseId);
  const [deleteAssignment] = useDeleteAssignmentMutation();
  const [updateAssignment] = useUpdateAssignmentMutation();

  const handleDelete = async (assignmentId) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await deleteAssignment(assignmentId).unwrap();
      toast.success('Assignment deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete assignment');
    }
  };

  const togglePublish = async (assignment) => {
    try {
      await updateAssignment({
        assignmentId: assignment._id,
        isPublished: !assignment.isPublished,
      }).unwrap();
      toast.success(assignment.isPublished ? 'Assignment unpublished' : 'Assignment published');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update assignment');
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
        <h1 className="text-3xl font-bold">Assignments</h1>
        <Button onClick={() => navigate(`/admin/course/${courseId}/assignment/create`)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {data?.assignments?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-4">No assignments created yet</p>
            <Button onClick={() => navigate(`/admin/course/${courseId}/assignment/create`)}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Assignment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {data?.assignments?.map((assignment) => (
            <Card key={assignment._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{assignment.title}</h3>
                      <Badge variant={assignment.isPublished ? 'default' : 'secondary'}>
                        {assignment.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {assignment.description}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {assignment.totalMarks} marks
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/assignment/${assignment._id}/submissions`)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Submissions
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish(assignment)}
                    >
                      {assignment.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/assignment/${assignment._id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(assignment._id)}
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

export default AssignmentList;
