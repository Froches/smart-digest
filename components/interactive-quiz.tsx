"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface InteractiveQuizProps {
  questions: QuizQuestion[];
}

export function InteractiveQuiz({ questions }: InteractiveQuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return; // Prevent changes after submission

    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers(new Array(questions.length).fill(null));
    setIsSubmitted(false);
    setScore(0);
  };

  const allAnswered = selectedAnswers.every((answer) => answer !== null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Interactive Quiz</CardTitle>
          {isSubmitted && (
            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold">
                Score: {score}/{questions.length} (
                {Math.round((score / questions.length) * 100)}%)
              </div>
              <Button
                onClick={handleRetake}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retake
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, questionIndex) => {
          const userAnswer = selectedAnswers[questionIndex];
          const isCorrect = userAnswer === question.correctAnswer;

          return (
            <div key={questionIndex} className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-sm shrink-0">
                  Q{questionIndex + 1}.
                </span>
                <p className="font-medium">{question.question}</p>
              </div>
              <div className="space-y-2 pl-6">
                {question.options.map((option, optionIndex) => {
                  const isSelected = userAnswer === optionIndex;
                  const isCorrectAnswer =
                    optionIndex === question.correctAnswer;
                  const showCorrect = isSubmitted && isCorrectAnswer;
                  const showIncorrect = isSubmitted && isSelected && !isCorrect;

                  return (
                    <button
                      key={optionIndex}
                      onClick={() =>
                        handleAnswerSelect(questionIndex, optionIndex)
                      }
                      disabled={isSubmitted}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg border-2 transition-all
                        ${
                          isSelected && !isSubmitted
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }
                        ${showCorrect ? "border-green-500 bg-green-500/10" : ""}
                        ${showIncorrect ? "border-red-500 bg-red-500/10" : ""}
                        ${isSubmitted ? "cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm">{option}</span>
                        {showCorrect && (
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        )}
                        {showIncorrect && (
                          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {!isSubmitted && (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full"
          >
            Submit Quiz
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
