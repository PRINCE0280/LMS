import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useGetQuizQuery, useUpdateQuizMutation } from '@/features/api/quizApi';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { data: quizData, isLoading: loadingQuiz } = useGetQuizQuery(quizId);
  const [updateQuiz, { isLoading }] = useUpdateQuizMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    totalMarks: 0,
    passingMarks: 0,
    allowMultipleAttempts: false,
  });

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: 1,
    },
  ]);

  // Load existing quiz data
  useEffect(() => {
    if (quizData?.quiz) {
      const quiz = quizData.quiz;
      setFormData({
        title: quiz.title || '',
        description: quiz.description || '',
        duration: quiz.duration || 30,
        totalMarks: quiz.totalMarks || 0,
        passingMarks: quiz.passingMarks || 0,
        allowMultipleAttempts: quiz.allowMultipleAttempts || false,
      });

      if (quiz.questions && quiz.questions.length > 0) {
        setQuestions(quiz.questions.map(q => ({
          _id: q._id,
          questionText: q.questionText || '',
          questionType: q.questionType || 'multiple-choice',
          options: q.options || ['', '', '', ''],
          correctAnswer: q.correctAnswer || '',
          marks: q.marks || 1,
        })));
      }
    }
  }, [quizData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        questionType: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        marks: 1,
      },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // Calculate total marks dynamically
  const calculatedTotalMarks = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || questions.length === 0) {
      toast.error('Please fill all required fields and add at least one question');
      return;
    }

    const totalMarks = calculatedTotalMarks;

    try {
      await updateQuiz({
        quizId,
        ...formData,
        questions,
        totalMarks,
      }).unwrap();

      toast.success('Quiz updated successfully');
      navigate(-1);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update quiz');
    }
  };

  if (loadingQuiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter quiz description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={calculatedTotalMarks}
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculated from questions</p>
              </div>

              <div>
                <Label htmlFor="passingMarks">Passing Marks *</Label>
                <Input
                  id="passingMarks"
                  name="passingMarks"
                  type="number"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  min="0"
                  max={calculatedTotalMarks}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowMultipleAttempts"
                checked={formData.allowMultipleAttempts}
                onChange={(e) =>
                  setFormData({ ...formData, allowMultipleAttempts: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="allowMultipleAttempts">Allow Multiple Attempts</Label>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Questions</h3>
                <Button type="button" onClick={addQuestion} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-4">
                {questions.map((question, qIndex) => (
                  <Card key={qIndex}>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Question {qIndex + 1}</h4>
                        {questions.length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQuestion(qIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div>
                        <Label>Question Text *</Label>
                        <Textarea
                          value={question.questionText}
                          onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                          placeholder="Enter question"
                          rows={2}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Question Type</Label>
                          <Select
                            value={question.questionType}
                            onValueChange={(value) => updateQuestion(qIndex, 'questionType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                              <SelectItem value="true-false">True/False</SelectItem>
                              <SelectItem value="short-answer">Short Answer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Marks *</Label>
                          <Input
                            type="number"
                            value={question.marks}
                            onChange={(e) => updateQuestion(qIndex, 'marks', e.target.value)}
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      {question.questionType === 'multiple-choice' && (
                        <div>
                          <Label>Options *</Label>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <Input
                                key={oIndex}
                                value={option}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                placeholder={`Option ${oIndex + 1}`}
                                required
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <Label>Correct Answer *</Label>
                        <Input
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                          placeholder="Enter correct answer"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Quiz'
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

export default EditQuiz;
