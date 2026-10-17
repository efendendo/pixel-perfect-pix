import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import { AppRoutes } from "@/App";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe("App routing", () => {
  it("renders the landing page for /", () => {
    renderAt("/");
    expect(screen.getByRole("heading", { level: 1, name: "Video Speed Reader" })).toBeInTheDocument();
  });

  it("renders the sign-in form for /sign-in", () => {
    renderAt("/sign-in");
    expect(screen.getByRole("heading", { name: "Sign in / 登入" })).toBeInTheDocument();
  });

  it("renders the sign-up form for /sign-up", () => {
    renderAt("/sign-up");
    expect(screen.getByRole("heading", { name: "Create account / 註冊" })).toBeInTheDocument();
  });

  it("falls back to not found for unknown paths", () => {
    renderAt("/does-not-exist");
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });
});
