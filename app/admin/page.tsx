"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, TrendingUp, Clock, Database } from "lucide-react";

interface RecentUrl {
  url: string;
  title: string;
  timestamp: number;
  processingTime: number;
  ip: string;
}

interface AdminStats {
  stats: {
    totalDigests: number;
    digestsLast24h: number;
    avgProcessingTime: number;
    totalCached: number;
  };
  recentUrls: RecentUrl[];
  timestamp: string;
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async (pwd: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${pwd}`,
        },
      });

      if (response.status === 401) {
        setError("Invalid password");
        setIsAuthorized(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }

      const data = await response.json();
      setStats(data);
      setIsAuthorized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats(password);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatUrl = (url: string, maxLength: number = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  };

  // Auto-refresh every 30 seconds if authorized
  useEffect(() => {
    if (isAuthorized && password) {
      const interval = setInterval(() => {
        fetchStats(password);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthorized, password]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <CardTitle>Admin Dashboard</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-secondary/10">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthorized(false);
              setPassword("");
              setStats(null);
            }}
          >
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Total Digests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.stats.totalDigests.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Last 24 Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.stats.digestsLast24h}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Avg Processing Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.stats.avgProcessingTime}ms
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Cached Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {stats.stats.totalCached}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent URLs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Digests</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(stats.timestamp).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Processing Time</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stats.recentUrls.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="text-center text-muted-foreground"
                          >
                            No digests generated yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        stats.recentUrls.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-xs">
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                                title={item.url}
                              >
                                {formatUrl(item.url, 40)}
                              </a>
                            </TableCell>
                            <TableCell className="max-w-64 truncate">
                              {item.title}
                            </TableCell>
                            <TableCell>{item.processingTime}ms</TableCell>
                            <TableCell className="font-mono text-xs">
                              {item.ip}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDate(item.timestamp)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
