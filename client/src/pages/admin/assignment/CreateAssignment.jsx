import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useCreateAssignmentMutation } from '@/features/api/assignmentApi';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';

const CreateAssignment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [createAssignment, { isLoading }] = useCreateAssignmentMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: 100,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await createAssignment({
        ...formData,
        courseId,
      }).unwrap();
      
      toast.success('Assignment created successfully');
      navigate(`/admin/course/${courseId}/assignments`);
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error(error?.data?.message || 'Failed to create assignment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Assignment</CardTitle>
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

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Assignment'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateAssignment;
