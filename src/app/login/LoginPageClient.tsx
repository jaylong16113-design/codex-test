'use client'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const res = await fetch('/api/auth/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
    if (res.ok) router.push(redirect)
    else { setError('密码错误，请重试'); setLoading(false) }
  }
  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      <label className="block">
        <span className="eyebrow mb-3 block">Access password</span>
        <input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入密码" className="w-full rounded-none border border-white/20 bg-[#0d0e0d] px-4 py-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#d8ff00]" autoFocus />
      </label>
      {error && <div role="alert" className="border border-red-400/40 bg-red-400/5 px-4 py-3 text-sm text-red-300">{error}</div>}
      <button type="submit" disabled={loading || !password} className="btn-primary w-full">{loading ? '验证中…' : '进入经营驾驶舱'}</button>
    </form>
  )
}

export default function LoginPageClient() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#080908] p-5">
      <div className="w-full max-w-md border-t border-white/20 pt-8">
        <div className="eyebrow">AgentClaw / Private Operations</div>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-[-.05em] text-white md:text-5xl">进入系统。</h1>
        <p className="mt-4 text-sm leading-6 text-white/45">这是受保护的运营入口，仅对授权用户开放。</p>
        <Suspense fallback={<div className="py-8 text-sm text-white/40">加载中…</div>}><LoginForm /></Suspense>
        <p className="mt-6 border-t border-white/10 pt-4 font-mono text-[10px] tracking-[.12em] text-white/25">SECURE SESSION / PASSWORD REQUIRED</p>
      </div>
    </div>
  )
}
