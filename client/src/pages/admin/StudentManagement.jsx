import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCourseStudentsQuery } from '@/features/api/quizApi';
import { useUnenrollStudentMutation } from '@/features/api/courseApi';
import { Loader2, Users, Mail, Calendar, ArrowLeft, Search, UserMinus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const StudentManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetCourseStudentsQuery(courseId);
  const [unenrollStudent, { isLoading: isUnenrolling }] = useUnenrollStudentMutation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleRemoveStudent = async (studentId, studentName) => {
    if (!confirm(`Are you sure you want to remove ${studentName} from this course? This action cannot be undone.`)) {
      return;
    }

    try {
      await unenrollStudent({ courseId, studentId }).unwrap();
      toast.success(`${studentName} has been removed from the course`);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to remove student');
    }
  };

  const filteredStudents = data?.students?.filter(student => 
    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Enrolled Students</h1>
          <p className="text-gray-500 mt-1">
            Total Students: {data?.totalStudents || 0}
          </p>
        </div>
        
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500">
              {searchQuery ? 'No students found matching your search' : 'No students enrolled yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredStudents.map((student, index) => (
            <Card key={student._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-400 w-8">
                      #{index + 1}
                    </div>
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={student.photoUrl} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                        {student.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{student.name}</h3>
                    <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${student.email}`} className="hover:text-blue-600 hover:underline">
                          {student.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Enrolled: {new Date(student.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/course/${courseId}/assignments`)}
                    >
                      View Assignments
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/admin/course/${courseId}/quizzes`)}
                    >
                      View Quizzes
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveStudent(student._id, student.name)}
                      disabled={isUnenrolling}
                    >
                      <UserMinus className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredStudents.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{data?.totalStudents || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Enrolled</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{filteredStudents.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Showing Results</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">
                  {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current Period</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentManagement;
