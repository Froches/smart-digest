"use client";

import { useState } from "react";
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

export function HowToUse() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">How to use</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>How to Use Smart Digest</DialogTitle>
          <DialogDescription>
            Follow these simple steps to get AI-powered summaries of technical
            content
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
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

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
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

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
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

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
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

          <div className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
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
