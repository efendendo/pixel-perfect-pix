"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function AppPage({ email }: { email: string }) {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-hero">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl font-semibold tracking-wide text-primary-glow">Video Speed Reader</Link>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </header>
      <main className="mx-auto max-w-3xl animate-fade-up px-6 pt-24">
        <h1 className="text-5xl font-semibold tracking-tight">Hi {email}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your dashboard is coming soon. Upload functionality will be added in the next milestone.
        </p>
      </main>
    </div>
  );
}
