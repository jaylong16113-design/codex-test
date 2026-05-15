'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ToolLayout from '@/components/ToolLayout'

export default function WorkerPage() {
  const router = useRouter()
  const [authed, setAuthed] = useState<'loading' | 'yes' | 'no'>('loading')
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // ── Auth check ──
  useEffect(() => {
    // Check for tools_token cookie
    const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('tools_token='))
    if (!hasCookie) {
      setAuthed('no')
      router.push('/login?redirect=/worker')
    } else {
      setAuthed('yes')
    }
  }, [router])

  if (authed === 'loading') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090a]">
        <div className="text-sm text-zinc-500">验证身份中...</div>
      </main>
    )
  }

  if (authed === 'no') {
    return null // will redirect
  }

  return (
    <ToolLayout title="RickyWorker" icon="⚡" subtitle="AI 短视频生成 · 用户系统 · 自动化工作流" accentColor="#00C9A7">
    <main className="flex flex-col" style={{ color: '#f7f8f8' }}>
      {/* ── Title bar ── */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(14,22,38,0.50)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl text-lg font-bold"
            style={{
              background: 'linear-gradient(135deg, #00C9A7, #00D4AA)',
              color: '#fff',
              boxShadow: '0 0 20px rgba(0,201,167,0.25)',
            }}
          >
            ⚡
          </span>
          <div>
            <h1 className="text-base font-bold text-white">RickyWorker</h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              AI 短视频生成 · 用户系统 · 自动化工作流
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium"
            style={{
              background: 'rgba(0,201,167,0.12)',
              color: '#00C9A7',
              border: '1px solid rgba(0,201,167,0.15)',
            }}
          >
            <span className="inline-block size-1.5 rounded-full bg-[#00C9A7] animate-pulse" />
            已认证
          </span>
        </div>
      </div>

      {/* ── Content area ── */}
      <div ref={containerRef} className="flex-1">
        <iframe
          ref={iframeRef}
          src="/api/auth/verify"
          className="hidden"
        />
        <WorkerContent />
      </div>
    </main>
    </ToolLayout>
  )
}

// ── RickyWorker content ──
function WorkerContent() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-8">
      {/* Description card */}
      <div className="mb-6 rounded-xl p-5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2 className="mb-2 text-sm font-semibold text-white">⚡ RickyWorker 是什么</h2>
        <p className="text-xs leading-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
          RickyWorker 是 Ricky 的专属 AI 自动化工作系统，支持 JWT 认证的用户体系、
          AI 短视频批量生成、API 调用计费（¥20/月）、多模型集成等功能。
          部署在腾讯云服务器，通过网关统一管理。
        </p>
      </div>

      {/* Feature cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title}
            className="group rounded-xl p-4 transition-all"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,201,167,0.3)'; e.currentTarget.style.background = 'rgba(0,201,167,0.04)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
          >
            <span className="mb-2 inline-block text-lg">{f.icon}</span>
            <h3 className="mb-1 text-sm font-semibold text-white">{f.title}</h3>
            <p className="text-xs leading-5" style={{ color: 'rgba(255,255,255,0.50)' }}>
              {f.desc}
            </p>
            <span className="mt-2 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                background: f.badgeColor + '15',
                color: f.badgeColor,
              }}
            >
              {f.badge}
            </span>
          </div>
        ))}
      </div>

      {/* API Status */}
      <div className="mt-6 rounded-xl p-5"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h3 className="mb-3 text-sm font-semibold text-white">🔗 接入方式</h3>
        <div className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-[#22C55E]" />
            <span>网关入口: <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[#00E5FF]">https://agentclaw.sale/api/worker</code></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-[#22C55E]" />
            <span>密码认证: <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[#00E5FF]">Basic Auth — Ricky</code></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-[#F59E0B]" />
            <span>API Key: <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[#00E5FF]">Bearer Token (通过 Revenue API 验证)</code></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-[#6366F1]" />
            <span>部署: <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[#00E5FF]">腾讯云 122.51.220.35 · Port 8766</code></span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="/login?redirect=/axiom"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold text-white transition-all no-underline"
          style={{
            background: 'linear-gradient(135deg, #00C9A7, #00D4AA)',
            boxShadow: '0 0 20px rgba(0,201,167,0.20)',
          }}
        >
          ← 返回工具套件
        </a>
      </div>
    </div>
  )
}

const features = [
  {
    icon: '👤',
    title: '用户系统',
    desc: 'JWT 认证 · 注册/登录/充值 · 管理员后台 · 余额管理',
    badge: '核心功能',
    badgeColor: '#00C9A7',
  },
  {
    icon: '🤖',
    title: 'AI 视频生成',
    desc: '多模型支持 · 批量生成 · 视频混剪 · 自动发布',
    badge: '自动化',
    badgeColor: '#6366F1',
  },
  {
    icon: '💰',
    title: '计费系统',
    desc: '月度订阅 ¥20/月 · 按次扣费 · 充值历史 · 使用统计',
    badge: '商业化',
    badgeColor: '#F59E0B',
  },
  {
    icon: '🔗',
    title: 'API 集成',
    desc: 'REST API · 多模型 API Key 代理 · 飞书集成',
    badge: '开发者',
    badgeColor: '#FF6A00',
  },
  {
    icon: '📊',
    title: '数据看板',
    desc: '实时用量监控 · 收入统计 · 用户活跃度分析',
    badge: '可视化',
    badgeColor: '#8B5CF6',
  },
  {
    icon: '🛡️',
    title: '安全体系',
    desc: 'Basic Auth · Bearer Token · 腾讯云部署 · 数据加密',
    badge: '安全',
    badgeColor: '#EF4444',
  },
]
