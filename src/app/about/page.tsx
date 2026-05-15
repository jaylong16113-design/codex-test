import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '关于我 | AgentClaw',
  description: '关于 AgentClaw — AI 驱动的一人公司内容矩阵，从零到一的独立创业者故事',
}

export default function AboutPage() {
  return (
    <div className="relative z-10">
      {/* Subtle background */}
      <div className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,106,0,0.08) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="pointer-events-none fixed left-[5%] top-[20%] size-96 rounded-full blur-3xl" style={{ background: "rgba(255,106,0,0.06)" }} />
      <div className="pointer-events-none fixed right-[10%] bottom-[15%] size-80 rounded-full blur-3xl" style={{ background: "rgba(0,229,255,0.04)" }} />

      <div className="mx-auto max-w-4xl px-5 pb-20 pt-16 md:px-10 md:pt-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <div
            className="mx-auto mb-6 grid size-20 place-items-center rounded-full text-3xl font-bold"
            style={{
              background: "linear-gradient(135deg, #FF6A00, #FF8A2A)",
              color: "#fff",
              boxShadow: "0 0 30px rgba(255,106,0,0.25)",
            }}
          >
            ✦
          </div>
          <h1 className="font-display text-4xl font-bold md:text-5xl" style={{ color: "#fff" }}>
            关于我
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7" style={{ color: "rgba(255,255,255,0.60)" }}>
            我是 Ricky，一名独立创业者、全栈工程师 &amp; AI 应用实践者。
            AgentClaw 是我一个人运营的内容矩阵——四个站点、一个域名、一套 AI 增长系统。
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { value: "5+", label: "年开发经验", color: "#00E5FF" },
            { value: "268+", label: "AI 生成文章", color: "#8B5CF6" },
            { value: "4", label: "独立内容站", color: "#22C55E" },
            { value: "100+", label: "社区成员", color: "#FF6A00" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-[24px] p-6 text-center"
              style={{
                background: "rgba(14,22,38,0.82)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="font-mono text-3xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="mt-1 text-sm font-semibold" style={{ color: "#fff" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Story timeline */}
        <div className="mb-14 space-y-8">
          {[
            {
              year: "2024 Q4",
              title: "项目启动",
              desc: "萌生一人公司内容矩阵的想法。目标是证明：一个人 + AI 工具链 = 可持续运营的多个内容站。从 AI 工具评测切入，搭建第一个站点。",
              color: "#FF6A00",
            },
            {
              year: "2025 Q1",
              title: "矩阵扩张",
              desc: "从 AI 工具站扩展到男装穿搭指南、一人公司运营日志。开始构建内部工具链——COMPASS 导航系统、FORGE 内容中台等，实现内容生产半自动化。",
              color: "#00E5FF",
            },
            {
              year: "2025 Q3",
              title: "技术升级",
              desc: "落地 AXIOM 社会推演引擎、LENS 竞品情报雷达、BLAZE 爆款复刻系统。内容生产流程全面升级，文章质量与数量同步提升。",
              color: "#8B5CF6",
            },
            {
              year: "2026 Q1",
              title: "情绪短视频站",
              desc: "新增情绪短视频内容站（Mood Video），探索 AI 虚拟人设 + 情感化内容在小红书的增长潜力。同时启动 NEBULA 品牌深度调研系统。",
              color: "#22C55E",
            },
            {
              year: "2026 Q2",
              title: "Present",
              desc: "四个内容站稳定运营，月均输出 60+ 篇 AI 辅助内容。7 个内部工具持续迭代，形成完整的一人公司技术中台。持续探索 AI 驱动的增长可能性。",
              color: "#FF6A00",
            },
          ].map((item) => (
            <div key={item.year} className="relative flex gap-6">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className="size-4 rounded-full ring-4"
                  style={{
                    background: item.color,
                    outline: `4px solid ${item.color}33`,
                    boxShadow: `0 0 12px ${item.color}44`,
                  }}
                />
                <div
                  className="mt-1 w-px flex-1"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
              </div>
              {/* Content */}
              <div
                className="mb-4 flex-1 rounded-[24px] p-6"
                style={{
                  background: "rgba(14,22,38,0.82)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span
                  className="font-mono text-xs font-bold tracking-wider"
                  style={{ color: item.color }}
                >
                  {item.year}
                </span>
                <h3 className="mt-1 font-display text-lg font-bold" style={{ color: "#fff" }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div
          className="mb-14 rounded-[24px] p-8"
          style={{
            background: "rgba(14,22,38,0.82)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h2 className="font-display text-2xl font-bold" style={{ color: "#fff" }}>
            技术栈
          </h2>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            构建一人公司内容矩阵用到的核心技术
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: "Next.js", desc: "App Router · SSG", color: "#fff" },
              { name: "Tailwind CSS", desc: "暗色主题设计系统", color: "#00E5FF" },
              { name: "TypeScript", desc: "全栈类型安全", color: "#3178C6" },
              { name: "OpenAI API", desc: "内容生成 · 分析", color: "#22C55E" },
              { name: "Vercel", desc: "部署 · 托管 · 分析", color: "#8B5CF6" },
              { name: "GitHub", desc: "版本控制 · CI/CD", color: "#FF6A00" },
              { name: "Python", desc: "数据处理 · 自动化", color: "#FFD43B" },
              { name: "AI Agents", desc: "工作流自动化", color: "#FF6A00" },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-xl p-4"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="text-sm font-bold" style={{ color: t.color }}>
                  {t.name}
                </div>
                <div className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                  {t.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact / Social */}
        <div
          className="rounded-[24px] p-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(255,106,0,0.10), rgba(14,22,38,0.82))",
            border: "1px solid rgba(255,106,0,0.20)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h2 className="font-display text-2xl font-bold" style={{ color: "#fff" }}>
            保持联系
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            如果你也在一人创业、探索 AI 工具，欢迎交流。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="mailto:jaylong16113@gmail.com" className="btn-secondary px-5 py-2.5 text-sm">
              📧 发送邮件
            </a>
            <a href="https://discord.gg/agentclaw" className="btn-secondary px-5 py-2.5 text-sm">
              💬 Discord 社区
            </a>
            <a href="https://github.com/jaylong16113-design" className="btn-secondary px-5 py-2.5 text-sm">
              🐙 GitHub
            </a>
            <a href="#subscribe" className="btn-primary px-5 py-2.5 text-sm">
              订阅更新
            </a>
          </div>
        </div>

        {/* Back to home */}
        <div className="mt-10 text-center">
          <Link href="/" className="text-sm underline" style={{ color: "rgba(255,255,255,0.40)" }}>
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
