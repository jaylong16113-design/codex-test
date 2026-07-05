'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/bajianli/api'
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('请填写邮箱和密码')
      return
    }
    setLoading(true)
    try {
      const res = await login(email, password)
      localStorage.setItem('bajianli_token', res.access_token)
      router.push('/bajianli/console')
    } catch (err: any) {
      setError(err.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
          >
            八
          </div>
          <h1 className="text-xl font-bold" style={{ color: '#fafafa' }}>欢迎回来</h1>
          <p className="text-sm mt-1" style={{ color: '#a1a1aa' }}>登录到八千里控制台</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#ef4444',
              }}
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
              邮箱
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#a1a1aa' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-150"
                style={{
                  background: '#141416',
                  border: '1px solid #1f1f23',
                  color: '#fafafa',
                }}
                onFocus={(e) => e.target.style.borderColor = '#825df4'}
                onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#a1a1aa' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                className="w-full pl-9 pr-9 py-2.5 rounded-lg text-sm outline-none transition-all duration-150"
                style={{
                  background: '#141416',
                  border: '1px solid #1f1f23',
                  color: '#fafafa',
                }}
                onFocus={(e) => e.target.style.borderColor = '#825df4'}
                onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#a1a1aa' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #825df4, #a78bfa)',
              boxShadow: '0 0 20px rgba(130,93,244,0.25)',
            }}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: '#a1a1aa' }}>
          没有账号？{' '}
          <Link href="/bajianli/register" className="font-medium hover:underline" style={{ color: '#825df4' }}>
            注册
          </Link>
        </p>
      </div>
    </div>
  )
}
