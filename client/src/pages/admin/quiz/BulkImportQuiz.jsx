import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useCreateQuizMutation } from "@/features/api/quizApi";
import { toast } from "sonner";

const BulkImportQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [createQuiz, { isLoading }] = useCreateQuizMutation();

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    duration: 30,
    totalMarks: 0,
    passingMarks: 0,
    questionsJson: ""
  });

  const exampleJson = `[
  {
    "questionText": "What is DevOps?",
    "questionType": "multiple-choice",
    "options": ["A software programming language", "A combination of Development and Operations", "A testing framework", "A cloud provider"],
    "correctAnswer": "A combination of Development and Operations",
    "marks": 1
  },
  {
    "questionText": "Which tool is commonly used for version control?",
    "questionType": "multiple-choice",
    "options": ["Docker", "Jenkins", "Git", "Ansible"],
    "correctAnswer": "Git",
    "marks": 1
  }
]`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Parse the JSON
      const questions = JSON.parse(quizData.questionsJson);

      if (!Array.isArray(questions) || questions.length === 0) {
        toast.error("Please provide valid questions array");
        return;
      }

      // Validate each question
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.questionText || !q.questionType || !q.correctAnswer) {
          toast.error(`Question ${i + 1} is missing required fields`);
          return;
        }
        if (q.questionType === "multiple-choice" && (!q.options || q.options.length < 2)) {
          toast.error(`Question ${i + 1} needs at least 2 options for MCQ`);
          return;
        }
      }

      // Calculate total marks if not provided
      const totalMarks = quizData.totalMarks || questions.reduce((sum, q) => sum + (q.marks || 1), 0);
      const passingMarks = quizData.passingMarks || Math.ceil(totalMarks * 0.4);

      const payload = {
        courseId,
        title: quizData.title,
        description: quizData.description,
        duration: parseInt(quizData.duration),
        totalMarks: parseInt(totalMarks),
        passingMarks: parseInt(passingMarks),
        questions: questions.map(q => ({
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options || [],
          correctAnswer: q.correctAnswer,
          marks: q.marks || 1
        }))
      };

      const response = await createQuiz(payload).unwrap();
      
      if (response.success) {
        toast.success(`Quiz created with ${questions.length} questions!`);
        navigate(`/admin/course/${courseId}/quizzes`);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.message && error.message.includes("JSON")) {
        toast.error("Invalid JSON format. Please check your input.");
      } else {
        toast.error(error.data?.message || "Failed to create quiz");
      }
    }
  };

  const autoFillExample = () => {
    setQuizData({
      ...quizData,
      questionsJson: exampleJson
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bulk Import Quiz</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Import multiple questions at once using JSON format</p>
      </div>

      <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg">JSON Format Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm">Each question should have:</p>
          <ul className="list-disc list-inside text-sm space-y-1 mb-3">
            <li><strong>questionText</strong>: The question (required)</li>
            <li><strong>questionType</strong>: "multiple-choice", "true-false", or "short-answer" (required)</li>
            <li><strong>options</strong>: Array of options (required for multiple-choice/true-false)</li>
            <li><strong>correctAnswer</strong>: The correct answer (required)</li>
            <li><strong>marks</strong>: Points for question (optional, defaults to 1)</li>
          </ul>
          <Button variant="outline" size="sm" onClick={autoFillExample}>
            Load Example JSON
          </Button>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                name="title"
                value={quizData.title}
                onChange={handleInputChange}
                placeholder="e.g., DevOps Fundamentals Quiz"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={quizData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the quiz"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  type="number"
                  id="duration"
                  name="duration"
                  value={quizData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="totalMarks">Total Marks (auto-calculated if empty)</Label>
                <Input
                  type="number"
                  id="totalMarks"
                  name="totalMarks"
                  value={quizData.totalMarks}
                  onChange={handleInputChange}
                  placeholder="Leave blank for auto"
                />
              </div>
              <div>
                <Label htmlFor="passingMarks">Passing Marks (40% if empty)</Label>
                <Input
                  type="number"
                  id="passingMarks"
                  name="passingMarks"
                  value={quizData.passingMarks}
                  onChange={handleInputChange}
                  placeholder="Leave blank for 40%"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions (JSON Format) *</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="questionsJson"
              value={quizData.questionsJson}
              onChange={handleInputChange}
              placeholder={exampleJson}
              rows={20}
              className="font-mono text-sm"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Paste your questions in JSON array format above
            </p>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Quiz...
              </>
            ) : (
              "Create Quiz with All Questions"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}/quizzes`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BulkImportQuiz;
