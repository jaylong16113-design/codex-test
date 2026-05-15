import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";
import HeroBackground from "@/components/HeroBackground";
import ShinyHeroTitle from "@/components/ShinyHeroTitle";
import ControlNodeRings from "@/components/ControlNodeRings";
import SubscribeSection from "@/components/SubscribeSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgentClaw — 一人公司的AI增长引擎 | AI工具·穿搭·运营·短视频",
  description: "AgentClaw 是一人公司的数字中台。AI 工具评测、男士西装穿搭指南、一人公司运营 SOP、情绪短视频创作——四个独立内容站，一套AI增长系统。一个人，一个域名，无限可能。",
  openGraph: {
    title: "AgentClaw — 一人公司的AI增长引擎",
    description: "AI 工具评测 · 男士穿搭指南 · 一人公司运营 · 情绪短视频",
    url: "https://agentclaw.sale",
    siteName: "AgentClaw",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentClaw — 一人公司的AI增长引擎",
    description: "AI 工具评测 · 男士穿搭指南 · 一人公司运营 · 情绪短视频",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://agentclaw.sale",
    languages: {
      en: "https://agentclaw.sale/en",
      "x-default": "https://agentclaw.sale/en",
    },
  },
};

const channels = [
  { key: "tool", title: "AI Tools", desc: "跨境电商AI工具评测、对比与实操清单", accent: "#00E5FF", icon: "✦", count: 95, label: "AI工具评测" },
  { key: "wear", title: "Style", desc: "男士西装配搭指南，建立可复制的形象系统", accent: "#8B5CF6", icon: "◌", count: 62, label: "穿搭指南" },
  { key: "ops", title: "OPS", desc: "一人公司运营SOP、增长实验与零成本路径", accent: "#22C55E", icon: "⌁", count: 64, label: "一人公司运营" },
  { key: "mood", title: "Mood Video", desc: "情绪钩子、AI工具链与爆款短视频拆解", accent: "#FF6A00", icon: "◍", count: 47, label: "情绪短视频" },
];

const tools = [
  { name: "COMPASS", icon: "🧭", label: "导航系统", href: "/compass" },
  { name: "LENS", icon: "🔍", label: "情报系统", href: "/lens" },
  { name: "AXIOM", icon: "⚡", label: "社会推演", href: "/axiom" },
  { name: "FORGE", icon: "🔧", label: "内容中台", href: "/forge" },
  { name: "BLAZE", icon: "🔥", label: "爆款复刻", href: "/blaze" },
  { name: "HUNTER", icon: "🎯", label: "工具箱", href: "/hunter" },
  { name: "MIST", icon: "🌫️", label: "情绪短视频", href: "/mist" },
  { name: "WORKER", icon: "⚡", label: "AI工作流", href: "/worker" },
];

function getStats() {
  try {
    const index = JSON.parse(
      readFileSync(join(process.cwd(), "src/lib/content/zh/index.json"), "utf8")
    );
    const tool = index.tool?.length || 0;
    const wear = index.wear?.length || 0;
    const ops = index.ops?.length || 0;
    const mood = index.mood?.length || 0;
    const total = tool + wear + ops + mood;
    const pages = total * 2 + 10 + 2;
    return { articles: total, pages, tool, wear, ops, mood };
  } catch {
    return { articles: 268, pages: 548, tool: 95, wear: 62, ops: 64, mood: 47 };
  }
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function HomePage() {
  const stats = getStats();

  return (
    <>
      {/* ============ DECORATIVE BACKGROUND — subtle glow ============ */}
      <HeroBackground />

      <div className="relative z-10">
        {/* ============ HERO SECTION ============ */}
        <section className="mx-auto max-w-7xl px-6 pt-24 pb-10 md:px-12 md:pt-32 md:pb-14">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            
            {/* Left: Hero Title */}
            <div className="card-base flex flex-col justify-center p-8 md:p-12" style={{ minHeight: "400px" }}>
              {/* Status badge */}
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium font-body"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  color: "var(--text-secondary)",
                }}>
                <span className="size-1.5 rounded-full" style={{ background: "#FF6A00" }} />
                在线运行中 · {stats.pages} pages indexed
              </div>

              <ShinyHeroTitle />

              <p className="mt-5 max-w-xl text-base leading-7 md:text-lg text-secondary font-body">
                从工具评测、穿搭指南、运营 SOP 到情绪短视频，四个独立内容站组成一套低成本、一人可控、持续扩张的 AI 增长系统。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#channels" className="btn-primary px-6 py-3 text-sm">
                  探索内容矩阵 <ArrowRight />
                </a>
                <a href="/tool" className="btn-secondary px-6 py-3 text-sm">
                  查看 AI 工具站
                </a>
              </div>
            </div>

            {/* Right: Control Node Panel */}
            <div className="card-base relative flex flex-col justify-center overflow-hidden p-8 md:p-10" style={{ minHeight: "400px" }}>
              <ControlNodeRings />
              <div className="relative z-10">
                {/* Terminal header */}
                <div className="mb-6 flex items-center justify-between border-b pb-4"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <span className="font-mono text-xs tracking-wider text-quaternary">
                    AGENTCLAW / CONTROL NODE
                  </span>
                  <span className="font-mono text-xs font-semibold" style={{ color: "#FF6A00" }}>
                    ACTIVE
                  </span>
                </div>

                <div className="space-y-5">
                  {[
                    { num: "01", label: "品牌 · AgentClaw", desc: "一人公司的数字中台，AI 驱动内容生产与增长" },
                    { num: "02", label: "价值主张", desc: "低成本建站 · 一人可控 · AI 驱动 · 持续增长" },
                    { num: "03", label: "数据驱动", desc: `${stats.articles}+ 篇文章 · ${stats.pages}+ 静态页面 · 4 独立站点` },
                    { num: "04", label: "四大独立站点", desc: "AI 工具 · 穿搭 · 运营 · 情绪短视频，各站独立运营" },
                    { num: "05", label: "订阅社区", desc: "加入社群，获取独家 AI 工具更新与运营干货" },
                  ].map((item) => (
                    <div key={item.num}
                      className="group flex items-start gap-4 transition-all duration-300">
                      <span className="mt-0.5 font-mono text-sm font-bold shrink-0" style={{ color: "#FF6A00" }}>
                        {item.num}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold transition-colors" style={{ color: "#fff" }}>
                          {item.label}
                        </div>
                        <div className="mt-0.5 text-xs leading-5 text-tertiary font-body">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ METRIC CARDS ============ */}
        <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              { value: `${stats.articles}+`, label: "文章", color: "#00E5FF", desc: "持续更新的原创内容" },
              { value: `${stats.pages}+`, label: "静态页面", color: "#8B5CF6", desc: "自动生成的站点页面" },
              { value: "4", label: "独立站点", color: "#22C55E", desc: "四个垂直内容站" },
              { value: `${stats.mood}+`, label: "情绪专题", color: "#FF6A00", desc: "情绪短视频专题内容" },
            ].map((metric) => (
              <div key={metric.label}
                className="card-base relative overflow-hidden p-6 transition-all duration-500 hover:-translate-y-1">
                <div className="font-mono text-3xl font-bold md:text-4xl tracking-tight" style={{ color: metric.color }}>
                  {metric.value}
                </div>
                <div className="mt-2 text-sm font-semibold" style={{ color: "#fff" }}>
                  {metric.label}
                </div>
                <div className="mt-1 text-xs text-tertiary font-body">
                  {metric.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CONTENT CHANNEL MATRIX ============ */}
        <section id="channels" className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-quaternary">
                Content Matrix
              </p>
              <h2 className="font-display text-3xl font-bold md:text-5xl tracking-[-1px]" style={{ color: "#fff" }}>
                四个站点，一套增长引擎
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-tertiary font-body">
              每个内容站都是独立入口，也共同服务于一人公司的获客、信任、转化与复利沉淀。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {channels.map((ch) => {
              const counts: Record<string, number> = { tool: stats.tool, wear: stats.wear, ops: stats.ops, mood: stats.mood };
              return (
                <Link key={ch.key} href={`/${ch.key}`}
                  className="card-base group relative overflow-hidden p-6 no-underline transition-all duration-500 hover:-translate-y-1.5 md:p-8">
                  {/* Accent top bar */}
                  <div className="absolute left-0 right-0 top-0 h-[3px] opacity-50 transition-all duration-500 group-hover:opacity-100"
                    style={{ background: ch.accent }} />
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute -inset-20 opacity-0 transition-opacity duration-500 group-hover:opacity-10 blur-3xl"
                    style={{ background: ch.accent }} />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <div className="grid size-14 place-items-center rounded-xl text-2xl font-bold transition-transform duration-500 group-hover:scale-110"
                        style={{
                          background: `${ch.accent}12`,
                          border: `1px solid ${ch.accent}25`,
                          color: ch.accent,
                        }}>
                        {ch.icon}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium font-body" style={{ color: ch.accent }}>
                        <span>{counts[ch.key]}篇</span>
                        <ChevronRight />
                      </div>
                    </div>

                    <h3 className="mt-5 font-display text-2xl font-bold tracking-[-0.3px]" style={{ color: "#fff" }}>
                      {ch.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-secondary font-body">
                      {ch.desc}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-xs text-tertiary font-body">
                      <span className="inline-block size-1.5 rounded-full" style={{ background: ch.accent }} />
                      {ch.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ============ INTERNAL TOOL PANEL ============ */}
        <section className="mx-auto max-w-7xl px-6 py-14 md:px-12 md:py-20">
          <div className="mb-10 text-center">
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-quaternary">
              Internal Tools
            </p>
            <h2 className="font-display text-3xl font-bold md:text-4xl tracking-[-1px]" style={{ color: "#fff" }}>
              内部工具套件
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-tertiary font-body">
              一人公司全流程工具链，从内容生产到数据分析，从竞品情报到爆款复刻
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 md:gap-4">
            {tools.map((tool) => (
              <a key={tool.name} href={tool.href}
                className="card-base group relative flex flex-col items-center rounded-xl p-5 text-center no-underline transition-all duration-500 hover:-translate-y-1">
                <span className="mb-3 text-2xl transition-transform duration-500 group-hover:scale-125">
                  {tool.icon}
                </span>
                <span className="text-sm font-bold tracking-wide transition-colors group-hover:text-[#FF6A00]" style={{ color: "#fff" }}>
                  {tool.name}
                </span>
                <span className="mt-1 text-[10px] text-quaternary font-body tracking-wide uppercase">
                  {tool.label}
                </span>
                <span className="absolute bottom-2 text-[8px] opacity-0 transition-opacity duration-300 group-hover:opacity-50 text-tertiary font-body">
                  🔒 需密码
                </span>
              </a>
            ))}
          </div>
          <p className="mt-6 text-center text-[10px] tracking-wider text-quaternary uppercase font-body">
            需密码 · 仅供演示
          </p>
        </section>

        {/* ============ SUBSCRIPTION & COMMUNITY ============ */}
        <section id="subscribe" className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <div className="grid gap-6 md:grid-cols-2">
            <SubscribeSection />

            {/* Community Card */}
            <div className="card-base relative overflow-hidden p-8 md:p-10">
              <div className="pointer-events-none absolute -left-16 -bottom-16 size-48 rounded-full opacity-8 blur-3xl"
                style={{ background: "#8B5CF6" }} />
              <h3 className="font-display text-2xl font-bold tracking-[-0.3px]" style={{ color: "#fff" }}>
                加入社区
              </h3>
              <p className="mt-3 text-sm leading-6 text-secondary font-body">
                与 100+ 同行者一起探讨一人公司实践、AI 工具应用和独立站增长策略。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="https://discord.gg/agentclaw" className="btn-secondary px-5 py-2.5 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Discord 社区
                </a>
                <a href="https://github.com/jaylong16113-design" className="btn-secondary px-5 py-2.5 text-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
