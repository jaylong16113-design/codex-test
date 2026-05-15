'use client'

import { useState } from 'react'

export default function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error')
      setMessage('请输入有效的邮箱地址')
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || '订阅成功！')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || '订阅失败，请稍后重试')
      }
    } catch {
      setStatus('error')
      setMessage('网络错误，请稍后重试')
    }

    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 4000)
  }

  return (
    <div
      className="relative overflow-hidden rounded-[24px] p-8 md:p-10"
      style={{
        background: "linear-gradient(135deg, rgba(255,106,0,0.12), rgba(14,22,38,0.82))",
        border: "1px solid rgba(255,106,0,0.20)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-10 blur-3xl"
        style={{ background: "#FF6A00" }}
      />
      <h3 className="font-display text-2xl font-bold" style={{ color: "#fff" }}>
        订阅更新
      </h3>
      <p className="mt-3 text-sm leading-6" style={{ color: "rgba(255,255,255,0.55)" }}>
        获取最新的 AI 工具评测、运营干货和增长策略。每周精选内容，直击收件箱。
      </p>
      <div className="mt-6 flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
          placeholder="输入你的邮箱"
          className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none transition-all focus:border-[#FF6A00]"
          style={{
            background: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.12)",
            color: "#fff",
          }}
          disabled={status === 'loading'}
        />
        <button
          onClick={handleSubscribe}
          disabled={status === 'loading'}
          className="btn-primary whitespace-nowrap px-5 py-2.5 text-sm"
        >
          {status === 'loading' ? '提交中...' : '订阅'}
        </button>
      </div>
      {message && (
        <p
          className="mt-3 text-xs"
          style={{
            color: status === 'success' ? '#22C55E' : status === 'error' ? '#FF6A00' : 'rgba(255,255,255,0.25)',
          }}
        >
          {message}
        </p>
      )}
      {status === 'idle' && (
        <p className="mt-3 text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          不发送垃圾邮件。随时退订。
        </p>
      )}
    </div>
  )
}
