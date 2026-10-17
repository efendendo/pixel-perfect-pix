import { Link, useNavigate, useOutletContext } from "react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { AuthContext } from "@/App";

export default function AppPage() {
  const { user } = useOutletContext<AuthContext>();
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate("/sign-in", { replace: true });
  }

  return (
    <div className="min-h-screen bg-hero">
      <title>Dashboard — Video Speed Reader</title>
      <meta name="description" content="Your Video Speed Reader dashboard." />
      <meta property="og:title" content="Dashboard — Video Speed Reader" />
      <meta property="og:description" content="Your Video Speed Reader dashboard." />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-semibold tracking-tight">Video Speed Reader</Link>
        <Button variant="outline" onClick={signOut}>Sign out</Button>
      </header>
      <main className="mx-auto max-w-3xl animate-fade-up px-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight">Hi {user.email}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your dashboard is coming soon. Upload functionality will be added in the next milestone.
        </p>
      </main>
    </div>
  );
}
