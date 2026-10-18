"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Sparkles, Timer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && setShown(true), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={shown ? "animate-fade-up" : "opacity-0"} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const features = [
  { icon: Sparkles, title: "高準確度逐字稿", en: "High-accuracy transcripts", body: "Powered by OpenAI Whisper. Supports Chinese and English." },
  { icon: Timer, title: "三分鐘交付", en: "Three-minute turnaround", body: "Processed in the background — you get an email when it's ready." },
  { icon: ShieldCheck, title: "可商用授權", en: "Commercial-use ready", body: "You own the output. Use it however you like." },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-2xl font-semibold tracking-wide text-primary-glow">Video Speed Reader</span>
        <Button asChild className="bg-gradient-primary shadow-glow">
          <Link href="/sign-in">Sign in / 登入</Link>
        </Button>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-6 pb-24 pt-20 text-center sm:pt-32">
          <div className="animate-fade-up">
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              <span className="text-gradient">Video Speed Reader</span>
            </h1>
            <p className="mt-6 text-2xl font-medium sm:text-3xl">上傳影片，三分鐘內拿到逐字稿。</p>
            <p className="mt-3 text-lg text-muted-foreground">Upload your video, get a clean transcript in three minutes.</p>
            <Button asChild size="lg" className="mt-10 bg-gradient-primary px-10 shadow-glow">
              <Link href="/sign-in">Get started</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-28 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.en} delay={i * 120}>
              <div className="h-full marble rounded-2xl border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary">
                <div className="mb-5 inline-flex rounded-full border border-primary/40 bg-accent p-2.5 text-primary-glow">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.en}</p>
                <p className="mt-4 text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </section>
      </main>

      <footer className="border-t border-primary/40 py-8 text-center text-sm text-muted-foreground">© 2026 Video Speed Reader</footer>
    </div>
  );
}
