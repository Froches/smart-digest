"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface HowToUseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export function HowToUse({ open, onOpenChange, showTrigger = true }: HowToUseProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="hover:scale-105 hover:shadow-md transition-all duration-200">
            <HelpCircle className="h-5 w-5 transition-transform duration-200 hover:rotate-12" />
            <span className="sr-only">How to use</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How to Use Smart Digest</DialogTitle>
          <DialogDescription>
            Follow these simple steps to get AI-powered summaries of technical
            content
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex gap-4 group/step cursor-default">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 group-hover/step:scale-110 group-hover/step:shadow-lg group-hover/step:shadow-primary/50">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Paste a Technical URL</h4>
              <p className="text-sm text-muted-foreground">
                Enter the URL of any technical article, blog post, or
                documentation page you want to understand quickly.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group/step cursor-default">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 group-hover/step:scale-110 group-hover/step:shadow-lg group-hover/step:shadow-primary/50">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Click Generate Digest</h4>
              <p className="text-sm text-muted-foreground">
                Our AI will scrape the page, analyze the content, and create a
                concise summary with key concepts and practical tips.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group/step cursor-default">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 group-hover/step:scale-110 group-hover/step:shadow-lg group-hover/step:shadow-primary/50">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Read the AI Summary</h4>
              <p className="text-sm text-muted-foreground">
                Review the executive summary, key concepts, and practical tips
                to quickly grasp the main points.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group/step cursor-default">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 group-hover/step:scale-110 group-hover/step:shadow-lg group-hover/step:shadow-primary/50">
              4
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Take the Interactive Quiz</h4>
              <p className="text-sm text-muted-foreground">
                Test your understanding with an auto-generated quiz. Submit your
                answers to see your score, with correct answers highlighted in
                green and incorrect ones in red.
              </p>
            </div>
          </div>

          <div className="flex gap-4 group/step cursor-default">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-300 group-hover/step:scale-110 group-hover/step:shadow-lg group-hover/step:shadow-primary/50">
              5
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold">Review Your History</h4>
              <p className="text-sm text-muted-foreground">
                All your digests are automatically saved in the history section
                below. Click any card to view it again, or delete items you no
                longer need.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
