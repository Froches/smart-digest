/**
 * Cryptographic Utilities for Verification Infrastructure
 * Provides SHA-256 hashing for content integrity verification
 */

/**
 * Generate SHA-256 hash of content (Browser-compatible)
 * Creates an immutable fingerprint for tamper detection
 */
export async function generateContentHash(content: string): Promise<string> {
  // Use Web Crypto API (available in browsers and Node.js 15+)
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

/**
 * Generate SHA-256 hash of content (Node.js compatible)
 * Used in API routes where Web Crypto API might not be available
 */
export function generateContentHashSync(content: string): string {
  // For Node.js environment
  if (typeof window === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(content).digest("hex");
  }

  // Fallback - should not be used, prefer async version
  throw new Error(
    "Synchronous hashing not available in browser. Use generateContentHash instead.",
  );
}

/**
 * Verify content integrity by comparing hashes
 * Returns true if content matches the stored hash (untampered)
 */
export async function verifyContentIntegrity(
  content: string,
  storedHash: string,
): Promise<boolean> {
  const currentHash = await generateContentHash(content);
  return currentHash === storedHash;
}

/**
 * Format hash for display (truncated with ellipsis)
 */
export function formatHash(hash: string, length: number = 16): string {
  if (hash.length <= length) return hash;
  return `${hash.substring(0, length)}...`;
}
