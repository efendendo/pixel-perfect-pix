import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Index from "@/views/Index";
import Auth from "@/views/Auth";
import NotFound from "../../app/not-found";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { getSession: () => Promise.resolve({ data: { session: null } }) },
  }),
}));

describe("Views", () => {
  it("renders the landing page", () => {
    render(<Index />);
    expect(screen.getByRole("heading", { level: 1, name: "Video Speed Reader" })).toBeInTheDocument();
  });

  it("renders the sign-in form", () => {
    render(<Auth mode="signin" />);
    expect(screen.getByRole("heading", { name: "Sign in / 登入" })).toBeInTheDocument();
  });

  it("renders the sign-up form", () => {
    render(<Auth mode="signup" />);
    expect(screen.getByRole("heading", { name: "Create account / 註冊" })).toBeInTheDocument();
  });

  it("renders the not found page", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });
});
