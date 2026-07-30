import type { Metadata } from "next";
import HomeCommandCenter from "@/components/HomeCommandCenter";
import { getSiteStats } from "@/lib/siteStats";

export const metadata: Metadata = {
  title: "AgentClaw — 一人公司的 AI 增长引擎",
  description:
    "AI 工具评测、男士穿搭、一人公司运营与情绪短视频，四个内容引擎组成一套持续复利的 AI 增长系统。",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://agentclaw.sale/zh",
    languages: {
      en: "https://agentclaw.sale/en",
      "zh-CN": "https://agentclaw.sale/zh",
      "x-default": "https://agentclaw.sale/en",
    },
  },
};

export default function ZhHomePage() {
  return <HomeCommandCenter locale="zh" stats={getSiteStats()} />;
}
