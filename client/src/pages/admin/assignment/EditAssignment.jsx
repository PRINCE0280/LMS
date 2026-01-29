import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useGetAssignmentQuery, useUpdateAssignmentMutation } from '@/features/api/assignmentApi';
import { useGetCourseStudentsQuery } from '@/features/api/quizApi';
import { useGetCreatorCoursesQuery } from '@/features/api/courseApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Upload, X, FileText } from 'lucide-react';
import axios from 'axios';

const MEDIA_API = "http://localhost:5000/api/v1/media";

const EditAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { data: assignmentData, isLoading: loadingAssignment } = useGetAssignmentQuery(assignmentId);
  const [updateAssignment, { isLoading }] = useUpdateAssignmentMutation();
  
  const assignment = assignmentData?.assignment;
  const courseId = assignment?.courseId?._id || assignment?.courseId;

  const { data: studentsData } = useGetCourseStudentsQuery(courseId, { skip: !courseId });
  const { data: coursesData } = useGetCreatorCoursesQuery();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: 100,
    selectedUsers: [],
    selectedCourses: [],
  });

  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (assignment) {
      setFormData({
        title: assignment.title || '',
        description: assignment.description || '',
        dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().slice(0, 16) : '',
        totalMarks: assignment.totalMarks || 100,
        selectedUsers: assignment.selectedUsers?.map(u => u._id || u) || [],
        selectedCourses: assignment.selectedCourses?.map(c => c._id || c) || [],
      });
      setAttachments(assignment.attachments || []);
    }
  }, [assignment]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadedFiles = [];

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${MEDIA_API}/upload-file`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });

        if (response.data.success) {
          uploadedFiles.push({
            fileName: file.name,
            fileUrl: response.data.data.url,
          });
        }
      }

      setAttachments([...attachments, ...uploadedFiles]);
      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await updateAssignment({
        assignmentId,
        ...formData,
        attachments,
        selectedUsers: formData.selectedUsers,
        selectedCourses: formData.selectedCourses,
      }).unwrap();
      
      toast.success('Assignment updated successfully');
      navigate(-1);
    } catch (error) {
      console.error('Error updating assignment:', error);
      toast.error(error?.data?.message || 'Failed to update assignment');
    }
  };

  if (loadingAssignment) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
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
          <CardTitle>Edit Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Assignment Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter assignment title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter assignment description and instructions"
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="totalMarks">Total Marks *</Label>
                <Input
                  id="totalMarks"
                  name="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <Label>Selected Students (Leave empty for all enrolled students)</Label>
              <div className="space-y-2">
                <Select
                  onValueChange={(value) => {
                    if (value && !formData.selectedUsers.includes(value)) {
                      setFormData({
                        ...formData,
                        selectedUsers: [...formData.selectedUsers, value]
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select students to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentsData?.students?.map((student) => (
                      <SelectItem key={student._id} value={student._id}>
                        {student.name} ({student.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    {formData.selectedUsers.map((userId) => {
                      const student = studentsData?.students?.find(s => s._id === userId);
                      return student ? (
                        <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                          {student.name}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                selectedUsers: formData.selectedUsers.filter(id => id !== userId)
                              });
                            }}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Display in Additional Courses (Current course is always included)</Label>
              <div className="space-y-2">
                <Select
                  onValueChange={(value) => {
                    if (value && !formData.selectedCourses.includes(value) && value !== courseId) {
                      setFormData({
                        ...formData,
                        selectedCourses: [...formData.selectedCourses, value]
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select additional courses" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesData?.courses?.filter(c => c._id !== courseId).map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.courseTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.selectedCourses.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                    {formData.selectedCourses.map((courseIdSelected) => {
                      const course = coursesData?.courses?.find(c => c._id === courseIdSelected);
                      return course ? (
                        <Badge key={courseIdSelected} variant="secondary" className="flex items-center gap-1">
                          {course.courseTitle}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                selectedCourses: formData.selectedCourses.filter(id => id !== courseIdSelected)
                              });
                            }}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="attachments">Assignment Files (Optional)</Label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    id="attachments"
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
                    className="flex-1"
                    disabled={isUploading}
                  />
                  {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
                </div>
                
                {attachments.length > 0 && (
                  <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded border">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{file.fileName}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading || isUploading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Update Assignment
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditAssignment;
