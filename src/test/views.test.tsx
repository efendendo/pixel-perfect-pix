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

describe("UploadPage", () => {
  const base = { created_at: new Date().toISOString(), video_source_url: "https://archive.org/download/MLKDream/MLKDream.mp3" };

  it("shows the empty state", async () => {
    const { default: UploadPage } = await import("@/views/UploadPage");
    render(<UploadPage jobs={[]} />);
    expect(screen.getByText("No transcriptions yet. Submit your first video below.")).toBeInTheDocument();
  });

  it("links the transcript only for done jobs", async () => {
    const { default: UploadPage } = await import("@/views/UploadPage");
    render(
      <UploadPage
        jobs={[
          { ...base, id: "aaaaaaaa-1111-2222-3333-444444444444", status: "done" },
          { ...base, id: "bbbbbbbb-1111-2222-3333-444444444444", status: "pending" },
        ]}
      />,
    );
    expect(screen.getByRole("columnheader", { name: "Transcript" })).toBeInTheDocument();
    const links = screen.getAllByRole("link", { name: ".txt" });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/api/jobs/aaaaaaaa-1111-2222-3333-444444444444/transcript");
    expect(links[0]).toHaveAttribute("download", "transcript-aaaaaaaa.txt");
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
