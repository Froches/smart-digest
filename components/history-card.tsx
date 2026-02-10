"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Calendar } from "lucide-react";
import type { HistoryItem } from "@/hooks/useHistory";

interface HistoryCardProps {
  item: HistoryItem;
  onView: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export function HistoryCard({ item, onView, onDelete }: HistoryCardProps) {
  const formattedDate = new Date(item.timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const summarySnippet = item.summary[0]?.substring(0, 150) + "..." || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card className="border-border/50 hover:border-border transition-all hover:shadow-lg group h-full flex flex-col">
        <CardHeader className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </CardTitle>
          </div>
          <CardDescription className="flex items-center gap-2 text-xs">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </CardDescription>
          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
            {summarySnippet}
          </p>
        </CardHeader>
        <CardContent className="pt-0 flex gap-2">
          <Button
            onClick={() => onView(item)}
            variant="default"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button onClick={() => onDelete(item.id)} variant="outline" size="sm">
            <Trash2 className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
