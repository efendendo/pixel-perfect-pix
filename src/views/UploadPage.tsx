"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { formatDistanceToNow } from "date-fns";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type JobRow = {
  id: string;
  created_at: string;
  video_source_url: string;
  status: string;
};

const statusStyles: Record<string, string> = {
  pending: "border-stone-300 bg-stone-100 text-stone-700",
  downloading: "border-stone-300 bg-stone-100 text-stone-700",
  transcribe: "border-sky-300 bg-sky-100 text-sky-800",
  done: "border-emerald-300 bg-emerald-100 text-emerald-800",
};

function truncate(text: string, max = 50) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default function UploadPage({ jobs }: { jobs: JobRow[] }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("zh");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_source_url: url, topic: topic || null, language }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Request failed (${res.status})`);
        return;
      }
      setUrl("");
      setTopic("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl font-semibold tracking-wide text-primary-glow">Video Speed Reader</Link>
        <Button asChild variant="outline">
          <Link href="/app">Dashboard</Link>
        </Button>
      </header>
      <main className="mx-auto max-w-4xl animate-fade-up space-y-10 px-6 pb-24 pt-12">
        <section className="marble rounded-2xl border bg-card p-6 sm:p-8">
          <h1 className="text-3xl font-semibold">Your transcriptions</h1>
          {jobs.length === 0 ? (
            <p className="mt-4 text-muted-foreground">No transcriptions yet. Submit your first video below.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b border-primary/30">
                    <th className="py-2 pr-4 font-medium">Created</th>
                    <th className="py-2 pr-4 font-medium">URL</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 font-medium">Transcript</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-primary/15 last:border-0">
                      <td className="whitespace-nowrap py-3 pr-4">
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </td>
                      <td className="py-3 pr-4" title={job.video_source_url}>
                        {truncate(job.video_source_url)}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={cn(
                            "inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold",
                            statusStyles[job.status] ?? statusStyles["pending"],
                          )}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3">
                        {job.status === "done" ? (
                          <a
                            href={`/api/jobs/${job.id}/transcript`}
                            download={`transcript-${job.id.slice(0, 8)}.txt`}
                            className="inline-flex items-center gap-1 text-primary-glow hover:underline"
                          >
                            <Download className="h-4 w-4" />
                            .txt
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <form onSubmit={onSubmit} className="marble space-y-4 rounded-2xl border bg-card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Transcribe a video</h2>
          <div className="space-y-2">
            <Label htmlFor="video_source_url">Video URL</Label>
            <Input
              id="video_source_url"
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Direct mp4 / mp3 URL (e.g. CloudFront, Vimeo, Internet Archive)"
            />
            <p className="text-xs text-muted-foreground">YouTube links are not supported yet.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Tech podcast — useful context for the model"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="zh">zh</option>
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="bg-gradient-primary shadow-glow" disabled={loading}>
            {loading ? "Submitting…" : "Transcribe"}
          </Button>
        </form>
      </main>
    </div>
  );
}
