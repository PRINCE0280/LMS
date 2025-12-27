import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const QuizConverter = () => {
  const [inputText, setInputText] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const convertToJson = () => {
    try {
      const lines = inputText.split("\n").filter(line => line.trim());
      const questions = [];
      let currentQuestion = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith("Question Text:")) {
          if (currentQuestion) {
            questions.push(currentQuestion);
          }
          currentQuestion = {
            questionText: line.replace("Question Text:", "").trim(),
            questionType: "multiple-choice",
            options: [],
            correctAnswer: "",
            marks: 1
          };
        } else if (line.startsWith("Options:")) {
          continue;
        } else if (line.match(/^[A-D]\)/)) {
          const option = line.substring(2).trim();
          currentQuestion.options.push(option);
        } else if (line.startsWith("Correct Answer:")) {
          currentQuestion.correctAnswer = line.replace("Correct Answer:", "").trim();
        }
      }

      if (currentQuestion) {
        questions.push(currentQuestion);
      }

      const formatted = JSON.stringify(questions, null, 2);
      setJsonOutput(formatted);
      toast.success(`Converted ${questions.length} questions!`);
    } catch (error) {
      toast.error("Error converting. Please check your input format.");
      console.error(error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleInput = `Question Text: What is DevOps?
Options:
A) A software programming language
B) A combination of Development and Operations
C) A testing framework
D) A cloud provider
Correct Answer: A combination of Development and Operations

Question Text: Which tool is commonly used for version control?
Options:
A) Docker
B) Jenkins
C) Git
D) Ansible
Correct Answer: Git`;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Quiz Text to JSON Converter</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Convert your quiz questions from text format to JSON</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input (Text Format)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={exampleInput}
              rows={25}
              className="font-mono text-sm"
            />
            <div className="flex gap-2 mt-4">
              <Button onClick={convertToJson}>Convert to JSON</Button>
              <Button
                variant="outline"
                onClick={() => setInputText(exampleInput)}
              >
                Load Example
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Output (JSON Format)
              {jsonOutput && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <><Check className="h-4 w-4 mr-2" /> Copied</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-2" /> Copy</>
                  )}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={jsonOutput}
              readOnly
              placeholder="JSON output will appear here..."
              rows={25}
              className="font-mono text-sm bg-gray-50 dark:bg-gray-900"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="text-lg">Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <ol className="list-decimal list-inside space-y-1">
            <li>Paste your questions in the left text area</li>
            <li>Make sure each question follows the format shown in the example</li>
            <li>Click "Convert to JSON"</li>
            <li>Copy the JSON output from the right side</li>
            <li>Go to "Bulk Import Quiz" page</li>
            <li>Paste the JSON and fill in quiz details</li>
            <li>Submit to create the quiz with all questions!</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizConverter;
