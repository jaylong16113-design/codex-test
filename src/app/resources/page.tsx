import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '资源库 | AgentClaw',
  description: 'AgentClaw 资源库 — AI 工具推荐、运营模板、穿搭指南、情绪短视频教程等免费资源',
}

const categories = [
  {
    id: 'ai-tools',
    name: 'AI 工具推荐',
    icon: '01',
    color: '#D8FF00',
    items: [
      { title: 'ChatGPT / GPT-4o', desc: '全能 AI 助手，内容生成、分析、翻译一应俱全', url: 'https://chat.openai.com' },
      { title: 'Claude', desc: '长文本理解与写作，适合深度内容创作', url: 'https://claude.ai' },
      { title: 'Perplexity AI', desc: 'AI 搜索工具，带引用的深度研究', url: 'https://perplexity.ai' },
      { title: 'Midjourney', desc: 'AI 图像生成，适合电商产品图和场景图', url: 'https://midjourney.com' },
      { title: 'Canva AI', desc: '设计平台，AI 辅助社交媒体图片制作', url: 'https://canva.com' },
      { title: 'Runway Gen-3', desc: 'AI 视频生成，适合短视频内容创作', url: 'https://runwayml.com' },
      { title: 'Cline / Codex CLI', desc: 'AI 编程助手，提升开发效率 10x', url: 'https://github.com/cline/cline' },
    ],
  },
  {
    id: 'ops-templates',
    name: '运营模板',
    icon: '02',
    color: '#D8FF00',
    items: [
      { title: '内容排期表 Notion 模板', desc: '七天多平台内容排程模板，含 AI 提效节点', url: '#' },
      { title: 'SEO 文章检查清单', desc: '发布前的 SEO 自检清单，覆盖标题、Meta、关键词密度', url: '#' },
      { title: '竞品分析框架', desc: '系统化竞品分析方法论，含 LENS 工具集成指南', url: '#' },
      { title: '一人公司 OKR 模板', desc: '适合独立创业者的 OKR 设定与追踪模板', url: '#' },
      { title: '邮件营销流程模板', desc: '从 0 到 1000 订阅的邮件营销 SOP', url: '#' },
    ],
  },
  {
    id: 'style-guides',
    name: '穿搭指南',
    icon: '03',
    color: '#D8FF00',
    items: [
      { title: '男士西装选购指南', desc: '从版型、面料、工艺到预算分配的完整指南', url: '/wear/first-suit-guide' },
      { title: '西装颜色搭配表', desc: '不同场合的西装颜色选择速查表', url: '/wear/suit-color-guide' },
      { title: '通勤穿搭速查表', desc: '一周五天通勤穿搭方案', url: '#' },
      { title: '面试西装搭配建议', desc: '面试场景的着装规范与建议', url: '/wear/interview-suit-guide' },
      { title: '西装保养指南', desc: '干洗频率、熨烫技巧、收纳方法', url: '/wear/suit-care-guide' },
    ],
  },
  {
    id: 'mood-video',
    name: '情绪短视频资源',
    icon: '04',
    color: '#D8FF00',
    items: [
      { title: '情绪短视频脚本模板', desc: 'Hook → Mechanism → Demo → CTA 五步模板', url: '/mood/mood-video-script-guide' },
      { title: 'AI 虚拟人设构建指南', desc: '从人设定位到视觉统一的全流程', url: '#' },
      { title: '小红书爆款笔记公式', desc: '分析 14M+ 笔记总结的情感化内容公式', url: '/mood/xiaohongshu-viral-formula' },
      { title: '情绪标签库', desc: '60+ 高互动情绪标签分类与使用建议', url: '#' },
      { title: 'BGM 情绪映射表', desc: '背景音乐与情绪标签的对应关系速查', url: '#' },
    ],
  },
  {
    id: 'recommended-reading',
    name: '推荐阅读',
    icon: '05',
    color: '#D8FF00',
    items: [
      { title: '一人公司实践指南', desc: '从技术选型到增长策略的系统性思考', url: '/ops/what-is-solo-company' },
      { title: 'AI Agent 工作流指南', desc: '如何用 AI Agent 搭建自动化工作流', url: '/tool/ai-agent-workflows-solopreneur' },
      { title: '独立站 SEO 策略', desc: '一人公司如何零成本获取搜索引擎流量', url: '/ops/seo-strategy-solo-founder' },
      { title: '邮件订阅从零开始', desc: '从 0 到 1000 订阅者的实践复盘', url: '/tool/email-list-from-zero' },
      { title: 'AI 电商工具全景图', desc: '2026 年跨境电商 AI 工具生态概览', url: '/tool/ai-ecommerce-tools-2026' },
    ],
  },
  {
    id: 'downloads',
    name: '可下载资源',
    icon: '06',
    color: '#D8FF00',
    items: [
      { title: '一人公司启动 Checklist', desc: '从 0 开始搭建一人公司内容系统的完整清单', url: '#' },
      { title: 'AI Prompt 合集', desc: '30+ 经过验证的 AI 写作/分析 Prompt', url: '#' },
      { title: 'SEO 关键词库', desc: '跨境电商 SEO 关键词库（持续更新）', url: '#' },
      { title: '内容矩阵架构设计图', desc: 'AgentClaw 四站内容矩阵架构参考', url: '#' },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <div className="relative z-10">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(216,255,0,0.08) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="pointer-events-none fixed right-[8%] top-[10%] size-72 hidden" style={{ background: "rgba(216,255,0,0.05)" }} />
      <div className="pointer-events-none fixed left-[5%] bottom-[20%] size-64 hidden" style={{ background: "rgba(216,255,0,0.04)" }} />

      <div className="mx-auto max-w-5xl px-5 pb-20 pt-16 md:px-10 md:pt-24">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "#D8FF00" }}>
            Resources
          </p>
          <h1 className="font-display text-4xl font-bold md:text-5xl" style={{ color: "#fff" }}>
            资源库
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: "rgba(255,255,255,0.60)" }}>
            精选的 AI 工具、运营模板、穿搭指南和短视频资源，帮助你快速上手一人公司实践。
            持续更新中。
          </p>
        </div>

        {/* Resource categories */}
        <div className="space-y-10">
          {categories.map((cat) => (
            <div key={cat.id}>
              <div className="mb-5 flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h2 className="font-display text-xl font-bold" style={{ color: "#fff" }}>
                    {cat.name}
                  </h2>
                </div>
                <div className="ml-auto h-px flex-1" style={{ background: `linear-gradient(90deg, ${cat.color}44, transparent)` }} />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {cat.items.map((item) => (
                  <a
                    key={item.title}
                    href={item.url}
                    target={item.url.startsWith('http') && !item.url.startsWith('/') ? '_blank' : undefined}
                    rel={item.url.startsWith('http') && !item.url.startsWith('/') ? 'noopener noreferrer' : undefined}
                    className="group block rounded-sm p-5 no-underline transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                      background: "rgba(14,15,14,0.94)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3
                          className="text-sm font-semibold transition-colors group-hover:text-[#D8FF00]"
                          style={{ color: "#fff" }}
                        >
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-5" style={{ color: "rgba(255,255,255,0.50)" }}>
                          {item.desc}
                        </p>
                      </div>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="rgba(255,255,255,0.30)" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round"
                        className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-14 rounded-sm p-8 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(216,255,0,0.10), rgba(14,15,14,0.94))",
            border: "1px solid rgba(216,255,0,0.20)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h2 className="font-display text-2xl font-bold" style={{ color: "#fff" }}>
            缺少你想要的资源？
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
            资源库持续更新中。如果有你需要的资源还没有收录，或者你有好的资源推荐，欢迎告诉我。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="mailto:jaylong16113@gmail.com" className="btn-secondary px-5 py-2.5 text-sm">
              推荐资源
            </a>
            <a href="#subscribe" className="btn-primary px-5 py-2.5 text-sm">
              订阅更新通知
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
