import type { Metadata } from "next";
import Auth from "@/views/Auth";

export const metadata: Metadata = {
  title: "Sign in — Video Speed Reader",
  description: "Sign in or create your Video Speed Reader account.",
  openGraph: {
    title: "Sign in — Video Speed Reader",
    description: "Sign in or create your Video Speed Reader account.",
    type: "website",
  },
  twitter: { card: "summary" },
};

export default function Page() {
  return <Auth mode="signup" />;
}
