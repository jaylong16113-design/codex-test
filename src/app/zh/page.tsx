import Link from "next/link";
import { readFileSync } from "fs";
import { join } from "path";
import SubscribeSection from "@/components/SubscribeSection";
import Image from "next/image";

const channels = [
  {
    key: "tool",
    title: "AI Tools",
    desc: "95篇文章，跨境电商AI工具评测",
    accent: "#00E5FF",
    icon: "✦",
    count: 95,
    label: "AI工具评测",
  },
  {
    key: "wear",
    title: "Style",
    desc: "62篇文章，男士西装穿搭",
    accent: "#8B5CF6",
    icon: "◌",
    count: 62,
    label: "穿搭指南",
  },
  {
    key: "ops",
    title: "OPS",
    desc: "64篇文章，运营SOP与增长实验",
    accent: "#22C55E",
    icon: "⌁",
    count: 64,
    label: "一人公司运营",
  },
  {
    key: "mood",
    title: "Mood Video",
    desc: "47篇文章，情绪短视频拆解",
    accent: "#FF6A00",
    icon: "◍",
    count: 47,
    label: "情绪短视频",
  },
];

const tools = [
  { name: "COMPASS", icon: "🧭", label: "导航系统" },
  { name: "LENS", icon: "🔍", label: "情报系统" },
  { name: "AXIOM", icon: "⚡", label: "社会推演" },
  { name: "FORGE", icon: "🔧", label: "内容中台" },
  { name: "BLAZE", icon: "🔥", label: "爆款复刻" },
  { name: "HUNTER", icon: "🎯", label: "工具箱" },
  { name: "MIST", icon: "🌫️", label: "情绪短视频" },
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

export default function ZhHomePage() {
  const stats = getStats();

  return (
    <>
      {/* ============ HERO BANNER ============ */}
      <section className="relative w-full h-[45vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1920&q=85"
          alt="AI Technology 人工智能"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070812] via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 px-4 py-1.5 text-xs font-medium text-[#FF6A00] mb-4">
                <span className="size-1.5 rounded-full bg-[#FF6A00]" />
                一人公司 · AI驱动 · 持续增长
              </span>
              <h1 className="font-display text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-6xl">
                AI 赋能一人公司
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/60 md:text-lg">
                从工具到内容，从运营到增长 — 一个域名，四个内容站，一个人掌控全局。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ DECORATIVE BACKGROUND ============ */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,106,0,0.08) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div
        className="pointer-events-none fixed left-[10%] top-[15%] size-96 rounded-full blur-3xl"
        style={{ background: "rgba(255,106,0,0.06)" }}
      />
      <div
        className="pointer-events-none fixed right-[5%] top-[10%] size-80 rounded-full blur-3xl"
        style={{ background: "rgba(0,229,255,0.05)" }}
      />
      <div
        className="pointer-events-none fixed bottom-[20%] left-[40%] size-72 rounded-full blur-3xl"
        style={{ background: "rgba(139,92,246,0.04)" }}
      />

      <div className="relative z-10">
        {/* ============ HERO DASHBOARD ============ */}
        <section className="mx-auto max-w-7xl px-5 pb-8 pt-8 md:px-10 md:pt-12">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left Card: Hero Title */}
            <div
              className="relative flex flex-col justify-center overflow-hidden rounded-[24px] p-8 md:p-12"
              style={{
                background: "rgba(14,22,38,0.82)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                minHeight: "360px",
              }}
            >
              {/* Orange claw decoration */}
              <div
                className="pointer-events-none absolute -right-10 -top-10 text-[200px] font-bold leading-none opacity-[0.04] select-none"
                style={{ color: "#FF6A00" }}
              >
                ✦
              </div>
              <div
                className="pointer-events-none absolute -bottom-6 -left-6 size-32 rounded-full opacity-10 blur-2xl"
                style={{ background: "#FF6A00" }}
              />

              <div
                className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
                style={{
                  borderColor: "rgba(255,106,0,0.30)",
                  background: "rgba(255,106,0,0.08)",
                  color: "#FF6A00",
                }}
              >
                <span
                  className="size-1.5 rounded-full"
                  style={{ background: "#FF6A00" }}
                />
                在线运行中 · {stats.pages} pages indexed
              </div>

              <h1
                className="font-display text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl"
                style={{ color: "#fff" }}
              >
                一人公司，<br />
                也能引领未来。
              </h1>

              <p
                className="mt-5 max-w-xl text-base leading-7 md:text-lg"
                style={{ color: "rgba(255,255,255,0.60)" }}
              >
                从 AI 工具评测、男士穿搭、运营增长到情绪短视频，四个独立内容站组成一套低成本、一人可控、持续扩张的 AI 增长系统。一个域名，四个站点，一个人。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#channels"
                  className="btn-primary px-6 py-3 text-sm"
                >
                  探索内容矩阵
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <a
                  href="/tool"
                  className="btn-secondary px-6 py-3 text-sm"
                >
                  查看 AI 工具站
                </a>
              </div>
            </div>

            {/* Right Card: 5 Value Points */}
            <div
              className="flex flex-col justify-center rounded-[24px] p-8 md:p-10"
              style={{
                background: "rgba(14,22,38,0.82)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                minHeight: "360px",
              }}
            >
              <div
                className="mb-6 flex items-center justify-between border-b pb-4 text-xs"
                style={{
                  borderColor: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.40)",
                }}
              >
                <span className="font-mono tracking-wider">
                  AGENTCLAW / CONTROL NODE
                </span>
                <span style={{ color: "#FF6A00", fontWeight: 600 }}>
                  ACTIVE
                </span>
              </div>

              <div className="space-y-5">
                {[
                  {
                    num: "01",
                    label: "品牌 · AgentClaw",
                    desc: "一人公司的数字中台，AI 驱动内容生产与增长",
                    color: "#FF6A00",
                  },
                  {
                    num: "02",
                    label: "价值主张",
                    desc: "低成本建站 · 一人可控 · AI 驱动 · 持续增长",
                    color: "#00E5FF",
                  },
                  {
                    num: "03",
                    label: "数据驱动",
                    desc: `${stats.articles}+ 篇文章 · ${stats.pages}+ 静态页面 · 4 独立站点`,
                    color: "#8B5CF6",
                  },
                  {
                    num: "04",
                    label: "四大独立站点",
                    desc: "AI 工具 · 穿搭 · 运营 · 情绪短视频，各站独立运营",
                    color: "#22C55E",
                  },
                  {
                    num: "05",
                    label: "订阅社区",
                    desc: "加入社群，获取独家 AI 工具更新与运营干货",
                    color: "#FF6A00",
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="group flex items-start gap-4 transition-all duration-300"
                  >
                    <span
                      className="mt-0.5 font-mono text-sm font-bold"
                      style={{ color: item.color }}
                    >
                      {item.num}
                    </span>
                    <div className="flex-1">
                      <div
                        className="text-sm font-semibold transition-colors group-hover:brightness-125"
                        style={{ color: "#fff" }}
                      >
                        {item.label}
                      </div>
                      <div
                        className="mt-0.5 text-xs leading-5"
                        style={{ color: "rgba(255,255,255,0.50)" }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ METRIC CARDS ============ */}
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {[
              {
                value: `${stats.articles}+`,
                label: "文章",
                color: "#00E5FF",
                desc: "持续更新的原创内容",
              },
              {
                value: `${stats.pages}+`,
                label: "静态页面",
                color: "#8B5CF6",
                desc: "自动生成的站点页面",
              },
              {
                value: "4",
                label: "独立站点",
                color: "#22C55E",
                desc: "四个垂直内容站",
              },
              {
                value: `${stats.mood}+`,
                label: "情绪专题",
                color: "#FF6A00",
                desc: "情绪短视频专题内容",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="group relative overflow-hidden rounded-[24px] p-6 transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: "rgba(14,22,38,0.82)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Accent glow on hover */}
                <div
                  className="pointer-events-none absolute -inset-20 opacity-0 transition-opacity duration-500 group-hover:opacity-20 blur-3xl"
                  style={{ background: metric.color }}
                />
                <div
                  className="font-mono text-3xl font-bold md:text-4xl"
                  style={{ color: metric.color }}
                >
                  {metric.value}
                </div>
                <div
                  className="mt-2 text-sm font-semibold"
                  style={{ color: "#fff" }}
                >
                  {metric.label}
                </div>
                <div
                  className="mt-1 text-xs"
                  style={{ color: "rgba(255,255,255,0.40)" }}
                >
                  {metric.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ CONTENT CHANNEL MATRIX ============ */}
        <section
          id="channels"
          className="mx-auto max-w-7xl px-5 py-12 md:px-10"
        >
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: "#FF6A00" }}
              >
                Content Matrix
              </p>
              <h2
                className="font-display text-3xl font-bold md:text-5xl"
                style={{ color: "#fff" }}
              >
                四个站点，一套增长引擎
              </h2>
            </div>
            <p
              className="max-w-md text-sm leading-6"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              每个内容站都是独立入口，也共同服务于一人公司的获客、信任、转化与复利沉淀。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {channels.map((ch, i) => {
              const counts: Record<string, number> = {
                tool: stats.tool,
                wear: stats.wear,
                ops: stats.ops,
                mood: stats.mood,
              };
              return (
                <Link
                  key={ch.key}
                  href={`/${ch.key}`}
                  className="group relative overflow-hidden rounded-[24px] p-6 no-underline transition-all duration-500 hover:-translate-y-1 md:p-8"
                  style={{
                    background: "rgba(14,22,38,0.82)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Accent gradient top bar */}
                  <div
                    className="absolute left-0 right-0 top-0 h-1 opacity-60 transition-all duration-500 group-hover:opacity-100"
                    style={{ background: ch.accent }}
                  />
                  {/* Accent glow */}
                  <div
                    className="pointer-events-none absolute -inset-20 opacity-0 transition-opacity duration-500 group-hover:opacity-15 blur-3xl"
                    style={{ background: ch.accent }}
                  />

                  <div className="relative z-10 flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <div
                        className="grid size-14 place-items-center rounded-2xl text-2xl font-bold transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                        style={{
                          background: `linear-gradient(135deg, ${ch.accent}22, transparent)`,
                          border: `1px solid ${ch.accent}33`,
                          color: ch.accent,
                        }}
                      >
                        {ch.icon}
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs font-medium"
                        style={{ color: ch.accent }}
                      >
                        <span>{counts[ch.key]}篇</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="transition-transform group-hover:translate-x-1"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>

                    <h3
                      className="mt-5 font-display text-2xl font-bold"
                      style={{ color: "#fff" }}
                    >
                      {ch.title}
                    </h3>
                    <p
                      className="mt-2 flex-1 text-sm leading-6"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {ch.desc}
                    </p>

                    <div
                      className="mt-6 flex items-center gap-2 text-xs"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      <span
                        className="inline-block size-1.5 rounded-full"
                        style={{ background: ch.accent }}
                      />
                      {ch.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ============ INTERNAL TOOL PANEL ============ */}
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-10">
          <div className="mb-8 text-center">
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-[0.25em]"
              style={{ color: "#FF6A00" }}
            >
              Internal Tools
            </p>
            <h2
              className="font-display text-3xl font-bold md:text-4xl"
              style={{ color: "#fff" }}
            >
              内部工具套件
            </h2>
            <p
              className="mx-auto mt-3 max-w-lg text-sm"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              一人公司全流程工具链，从内容生产到数据分析，从竞品情报到爆款复刻
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {tools.map((tool) => (
              <a
                key={tool.name}
                href={`/${tool.name.toLowerCase()}`}
                className="group relative flex flex-col items-center rounded-[24px] p-6 text-center no-underline transition-all duration-500 hover:-translate-y-1"
                style={{
                  background: "rgba(14,22,38,0.82)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Hover glow */}
                <div
                  className="pointer-events-none absolute -inset-10 rounded-[24px] opacity-0 transition-opacity duration-500 group-hover:opacity-20 blur-2xl"
                  style={{ background: "#FF6A00" }}
                />
                <span
                  className="mb-3 text-2xl transition-transform duration-500 group-hover:scale-125"
                >
                  {tool.icon}
                </span>
                <span
                  className="text-sm font-bold tracking-wide transition-colors group-hover:text-[#FF6A00]"
                  style={{ color: "#fff" }}
                >
                  {tool.name}
                </span>
                <span
                  className="mt-1 text-[10px]"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {tool.label}
                </span>
                {/* Lock notice on hover */}
                <span
                  className="absolute bottom-2 text-[8px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ color: "rgba(255,106,0,0.40)" }}
                >
                  🔒 需密码
                </span>
              </a>
            ))}
          </div>
          <p
            className="mt-6 text-center text-[10px] tracking-wider"
            style={{ color: "rgba(255,255,255,0.20)" }}
          >
            需密码 · 仅供演示
          </p>
        </section>

        {/* ============ SUBSCRIPTION & COMMUNITY ============ */}
        <section
          id="subscribe"
          className="mx-auto max-w-7xl px-5 py-16 md:px-10"
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Subscription Card — functional */}
            <SubscribeSection />

            {/* Community Card */}
            <div
              className="relative overflow-hidden rounded-[24px] p-8 md:p-10"
              style={{
                background: "rgba(14,22,38,0.82)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div
                className="pointer-events-none absolute -left-16 -bottom-16 size-48 rounded-full opacity-10 blur-3xl"
                style={{ background: "#8B5CF6" }}
              />
              <h3
                className="font-display text-2xl font-bold"
                style={{ color: "#fff" }}
              >
                加入社区
              </h3>
              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                与 100+ 同行者一起探讨一人公司实践、AI 工具应用和独立站增长策略。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://discord.gg/agentclaw"
                  className="btn-secondary px-5 py-2.5 text-sm"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Discord 社区
                </a>
                <a
                  href="https://github.com/jaylong16113-design"
                  className="btn-secondary px-5 py-2.5 text-sm"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
