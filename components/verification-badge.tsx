"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { VerificationMetadata } from "@/lib/schema";
import { generateContentHash, formatHash } from "@/lib/crypto";

interface VerificationBadgeProps {
  metadata: VerificationMetadata;
  originalContent?: string;
}

export function VerificationBadge({
  metadata,
  originalContent,
}: VerificationBadgeProps) {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<
    "idle" | "valid" | "invalid"
  >("idle");

  const handleVerify = async () => {
    if (!originalContent) {
      alert("Original content not available for verification");
      return;
    }

    setVerifying(true);
    setVerificationResult("idle");

    try {
      // Re-fetch the URL and verify
      const response = await fetch(metadata.source_url);
      const html = await response.text();

      // Extract text the same way the API does
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Remove script, style, nav, footer elements
      const elementsToRemove = doc.querySelectorAll(
        "script, style, nav, footer, iframe",
      );
      elementsToRemove.forEach((el) => el.remove());

      const bodyText = doc.body.textContent
        ?.replace(/\s+/g, " ")
        .trim()
        .substring(0, 10000);

      if (!bodyText) {
        throw new Error("Could not extract content from URL");
      }

      // Generate hash and compare
      const currentHash = await generateContentHash(bodyText);
      const isValid = currentHash === metadata.content_hash;

      setVerificationResult(isValid ? "valid" : "invalid");

      setTimeout(() => {
        setVerificationResult("idle");
      }, 5000);
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Failed to verify content. The source may be unavailable.");
      setVerificationResult("idle");
    } finally {
      setVerifying(false);
    }
  };

  const scrapeDate = new Date(metadata.scrape_timestamp);

  return (
    <Card className="border-2 border-primary/30 bg-primary/5 shadow-lg">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">
                  Verification Infrastructure
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tamper-proof audit trail
                </p>
              </div>
            </div>
            {verificationResult === "valid" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-green-600"
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Verified</span>
              </motion.div>
            )}
            {verificationResult === "invalid" && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 text-red-600"
              >
                <ShieldAlert className="w-5 h-5" />
                <span className="text-sm font-medium">Modified</span>
              </motion.div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground font-medium mb-1">
                Event Timestamp
              </p>
              <p className="font-mono text-xs bg-background/50 p-2 rounded border">
                {scrapeDate.toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "medium",
                })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground font-medium mb-1">
                Immutable Fingerprint
              </p>
              <p className="font-mono text-xs bg-background/50 p-2 rounded border break-all">
                {formatHash(metadata.content_hash, 24)}
              </p>
            </div>
          </div>

          {/* Full Hash (Expandable) */}
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              View Full SHA-256 Hash
            </summary>
            <p className="font-mono text-xs bg-background/50 p-3 rounded border mt-2 break-all">
              {metadata.content_hash}
            </p>
          </details>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={verifying}
            className="w-full gap-2"
            variant={
              verificationResult === "valid"
                ? "default"
                : verificationResult === "invalid"
                  ? "destructive"
                  : "outline"
            }
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying Integrity...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Verify Content Integrity
              </>
            )}
          </Button>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center">
            Re-fetches source and compares cryptographic hash to detect
            tampering
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
