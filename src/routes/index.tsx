import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/profile" });
  },
  head: () => ({
    meta: [
      { title: "FORM Portal" },
      { name: "description", content: "FORM Portal — your professional profile and employee experience." },
      { property: "og:title", content: "FORM Portal" },
      { property: "og:description", content: "Your professional profile and employee experience at FORM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
