"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Link as LinkIcon,
  Trash2,
  History,
} from "lucide-react";
import type { DigestResult } from "@/lib/schema";
import { useHistory, type HistoryItem } from "@/hooks/useHistory";
import { HistoryCard } from "@/components/history-card";
import { ModeToggle } from "@/components/mode-toggle";
import { HowToUse } from "@/components/how-to-use";
import { InteractiveQuiz } from "@/components/interactive-quiz";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeResult, setActiveResult] = useState<DigestResult | null>(null);
  const [activeUrl, setActiveUrl] = useState("");
  const [error, setError] = useState("");

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
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearActive = () => {
    setActiveResult(null);
    setActiveUrl("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-secondary/10">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Smart Digest</h1>
          </div>
          <div className="flex items-center gap-2">
            <HowToUse />
            <ModeToggle />
          </div>
        </div>

        {/* Hero Section - Input & Active Result */}
        <div className="max-w-4xl mx-auto mb-16">
          {/* Tagline */}
          <div className="text-center mb-10">
            <p className="text-muted-foreground text-lg">
              Transform any technical article into a structured summary and
              interactive quiz
            </p>
          </div>

          {/* Input Section */}
          <Card className="mb-8 border-border/50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="Paste a technical article URL..."
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
                  className="min-w-32 gap-2"
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
                <p className="text-sm text-destructive mt-3">{error}</p>
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
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>
                </div>

                {/* URL Display */}
                {activeUrl && (
                  <Card className="border-primary/20 bg-primary/5 shadow-sm ring-2 ring-primary/10">
                    <CardContent className="pt-4 pb-4">
                      <p className="text-sm text-muted-foreground break-all">
                        <span className="font-medium text-foreground">
                          Source:
                        </span>{" "}
                        {activeUrl}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Title */}
                <Card className="border-border/50 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {activeResult.title}
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* Summary */}
                <Card className="border-border/50 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl">Executive Summary</CardTitle>
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
                <Card className="border-border/50 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl">Key Concepts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
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

                {/* Interactive Quiz */}
                <InteractiveQuiz questions={activeResult.quiz} />
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
              <Button
                onClick={clearHistory}
                variant="outline"
                size="sm"
                className="gap-2"
              >
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
