import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import { Link, Navigate, Outlet, Route, Routes, useLocation } from "react-router";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import AppPage from "@/pages/AppPage";

const queryClient = new QueryClient();

export default function App() {
  const location = useLocation();
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary key={location.pathname}>
        <AppRoutes />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/sign-in" element={<Auth mode="signin" />} />
      <Route path="/sign-up" element={<Auth mode="signup" />} />
      <Route path="/auth" element={<Navigate to="/sign-in" replace />} />
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<AppPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export type AuthContext = { user: User };

// Client-side guard: resolve the Supabase user before rendering protected pages.
function RequireAuth() {
  const [state, setState] = useState<{ status: "loading" } | { status: "done"; user: User | null }>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) setState({ status: "done", user: data.user });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") return null;
  if (!state.user) return <Navigate to="/sign-in" replace />;
  return <Outlet context={{ user: state.user } satisfies AuthContext} />;
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: unknown }> {
  override state: { error: unknown } = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  override componentDidCatch(error: unknown, _info: ErrorInfo) {
    console.error(error);
    reportLovableError(error, { boundary: "root_error_boundary" });
  }

  override render() {
    if (this.state.error == null) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong on our end. You can try refreshing or head back home.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => this.setState({ error: null })}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
