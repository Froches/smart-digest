"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
  Trash2,
  History,
} from "lucide-react";
import type { DigestResult } from "@/lib/schema";
import { useHistory, type HistoryItem } from "@/hooks/useHistory";
import { HistoryCard } from "@/components/history-card";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<DigestResult | null>(null);
  const [activeUrl, setActiveUrl] = useState("");
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [showResults, setShowResults] = useState(false);

  const { history, isHydrated, addToHistory, removeFromHistory, clearHistory } =
    useHistory();

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setActiveResult(null);
    setActiveUrl(url);
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

      setActiveResult(data);

      // Add to history
      addToHistory({
        ...data,
        url: url,
      });

      // Clear the input
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = (item: HistoryItem) => {
    setActiveResult(item);
    setActiveUrl(item.url);
    setSelectedAnswers({});
    setShowResults(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearActive = () => {
    setActiveResult(null);
    setActiveUrl("");
    setSelectedAnswers({});
    setShowResults(false);
    setError("");
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
    if (!activeResult) return 0;
    let correct = 0;
    activeResult.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section - Input & Active Result */}
        <div className="max-w-4xl mx-auto mb-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">
                Smart Digest
              </h1>
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

          {/* Active Results Section */}
          <AnimatePresence mode="wait">
            {activeResult && (
              <motion.div
                key="active-result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Active Result Header with Clear Button */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Active Digest</h2>
                  <Button
                    onClick={handleClearActive}
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>
                </div>

                {/* URL Display */}
                {activeUrl && (
                  <Card className="border-border/50 bg-muted/30">
                    <CardContent className="pt-4 pb-4">
                      <p className="text-sm text-muted-foreground break-all">
                        <span className="font-medium">Source:</span> {activeUrl}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Title */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {activeResult.title}
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* Summary */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl">Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeResult.summary.map((paragraph, idx) => (
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
                      {activeResult.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            {takeaway}
                          </span>
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
                    {activeResult.quiz.map((question, qIdx) => (
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
                                  {showIncorrect && (
                                    <XCircle className="w-5 h-5" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {!showResults &&
                      Object.keys(selectedAnswers).length === 3 && (
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
                            Your Score: {calculateScore()} /{" "}
                            {activeResult.quiz.length}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Section */}
        {isHydrated && history.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Previous Digests</h2>
                <span className="text-muted-foreground text-sm">
                  ({history.length})
                </span>
              </div>
              <Button onClick={clearHistory} variant="outline" size="sm">
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>

            <ScrollArea className="h-150 pr-4">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {history.map((item) => (
                    <HistoryCard
                      key={item.id}
                      item={item}
                      onView={handleViewHistory}
                      onDelete={removeFromHistory}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
