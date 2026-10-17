import { Link, useNavigate } from "react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Auth({ mode }: { mode: "signin" | "signup" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/app", { replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })
        : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    const { data } = await supabase.auth.getSession();
    if (data.session) navigate("/app", { replace: true });
    else setError("Check your email to confirm your account.");
  }

  return (
    <div className="flex min-h-screen flex-col bg-hero px-6">
      <title>Sign in — Video Speed Reader</title>
      <meta name="description" content="Sign in or create your Video Speed Reader account." />
      <meta property="og:title" content="Sign in — Video Speed Reader" />
      <meta property="og:description" content="Sign in or create your Video Speed Reader account." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <header className="mx-auto w-full max-w-6xl py-5">
        <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-primary-glow">Video Speed Reader</Link>
      </header>
      <div className="flex flex-1 items-center justify-center pb-20">
        <form onSubmit={onSubmit} className="w-full max-w-sm marble animate-fade-up rounded-2xl border bg-card p-8">
          <h1 className="text-3xl font-semibold">{mode === "signin" ? "Sign in / 登入" : "Create account / 註冊"}</h1>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-gradient-primary shadow-glow" disabled={loading}>
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
            </Button>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
            <button type="button" className="text-primary-glow hover:underline" onClick={() => { navigate(mode === "signin" ? "/sign-up" : "/sign-in"); setError(null); }}>
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
