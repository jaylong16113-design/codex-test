import type { Metadata } from "next";
import HomeCommandCenter from "@/components/HomeCommandCenter";
import { getSiteStats } from "@/lib/siteStats";

export const metadata: Metadata = {
  title: "AgentClaw — AI Growth Engine for Solo Entrepreneurs",
  description:
    "Four independent content engines—AI tools, menswear, solo operations and mood videos—working as one measurable AI growth system.",
  openGraph: {
    title: "AgentClaw — AI Growth Engine for Solo Entrepreneurs",
    description: "One operator. Four content engines. A system that compounds.",
    url: "https://agentclaw.sale/en",
    siteName: "AgentClaw",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentClaw — AI Growth Engine for Solo Entrepreneurs",
    description: "AI Tools · Style · Solo OPS · Mood Video",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://agentclaw.sale/en",
    languages: {
      en: "https://agentclaw.sale/en",
      "zh-CN": "https://agentclaw.sale",
      "x-default": "https://agentclaw.sale/en",
    },
  },
};

export default function EnHomePage() {
  return <HomeCommandCenter locale="en" stats={getSiteStats()} />;
}
