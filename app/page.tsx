"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
} from "lucide-react";
import type { DigestResult } from "@/lib/schema";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DigestResult | null>(null);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setSelectedAnswers({});
    setShowResults(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate digest");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: answerIndex,
      }));
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!result) return 0;
    let correct = 0;
    result.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Smart Digest</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Transform any article into a structured summary and quiz
          </p>
        </div>

        {/* Input Section */}
        <Card className="mb-8 border-border/50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="Enter article URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={loading}
                size="lg"
                className="min-w-30"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Title */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">{result.title}</CardTitle>
              </CardHeader>
            </Card>

            {/* Summary */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.summary.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-muted-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </CardContent>
            </Card>

            {/* Key Takeaways */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Key Takeaways</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quiz */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Knowledge Check</CardTitle>
                <CardDescription>
                  Test your understanding with these questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {result.quiz.map((question, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <h3 className="font-medium">
                      {qIdx + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = oIdx === question.correctAnswer;
                        const showCorrect = showResults && isCorrect;
                        const showIncorrect =
                          showResults && isSelected && !isCorrect;

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerSelect(qIdx, oIdx)}
                            disabled={showResults}
                            className={`w-full text-left px-4 py-3 rounded-md border transition-all ${
                              showCorrect
                                ? "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400"
                                : showIncorrect
                                  ? "bg-destructive/10 border-destructive/50 text-destructive"
                                  : isSelected
                                    ? "bg-primary/10 border-primary"
                                    : "bg-card border-border/50 hover:border-border hover:bg-accent"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showCorrect && (
                                <CheckCircle2 className="w-5 h-5" />
                              )}
                              {showIncorrect && <XCircle className="w-5 h-5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {!showResults && Object.keys(selectedAnswers).length === 3 && (
                  <Button
                    onClick={handleSubmitQuiz}
                    className="w-full"
                    size="lg"
                  >
                    Submit Quiz
                  </Button>
                )}

                {showResults && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <p className="text-center text-lg font-medium">
                        Your Score: {calculateScore()} / {result.quiz.length}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
