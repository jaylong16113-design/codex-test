'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getModels } from '@/lib/bajianli/api'
import { Check, ArrowRight, Zap, Shield, DollarSign, Clock } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: '多模型支持',
    desc: '接入主流大语言模型，包括 DeepSeek、GPT、Claude 等，一站式调用',
  },
  {
    icon: Shield,
    title: '企业级稳定',
    desc: '99.9% 可用性 SLA，智能负载均衡，自动故障转移',
  },
  {
    icon: DollarSign,
    title: '透明定价',
    desc: '按量计费，无隐藏费用，实时查看消耗明细',
  },
  {
    icon: Clock,
    title: '实时到账',
    desc: '充值即时到账，API Key 立即可用，无需等待审核',
  },
]

const defaultModels = [
  { id: 'deepseek-chat', name: 'DeepSeek V3', price: '¥2/1M tokens', category: '对话' },
  { id: 'deepseek-reasoner', name: 'DeepSeek R1', price: '¥4/1M tokens', category: '推理' },
  { id: 'gpt-4o', name: 'GPT-4o', price: '¥10/1M tokens', category: '对话' },
  { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', price: '¥15/1M tokens', category: '对话' },
  { id: 'deepseek-coder', name: 'DeepSeek Coder', price: '¥1/1M tokens', category: '代码' },
  { id: 'text-embedding-3', name: 'Text Embedding 3', price: '¥0.5/1M tokens', category: '嵌入' },
]

const pricingTiers = [
  { name: '入门版', price: '免费', desc: '开始体验 API 服务', features: ['100万 tokens 免费额度', '3个 API Key', '基础模型访问', '邮件支持'], popular: false },
  { name: '专业版', price: '¥99/月', desc: '适合个人开发者和小团队', features: ['1000万 tokens/月', '10个 API Key', '所有模型访问', '优先支持'], popular: true },
  { name: '企业版', price: '¥999/月', desc: '适合中大型团队和企业', features: ['1亿 tokens/月', '无限 API Key', '专属模型部署', '7×24 技术支持', 'IP 白名单'], popular: false },
]

export default function BajianliHomePage() {
  const [models, setModels] = useState(defaultModels)

  useEffect(() => {
    getModels()
      .then((data: any) => {
        if (data?.data?.length) {
          setModels(data.data.map((m: any) => ({
            id: m.id,
            name: m.id,
            price: '按量计费',
            category: m.id.includes('embed') ? '嵌入' : '对话',
          })))
        }
      })
      .catch(() => {/* use defaults */})
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 50%, rgba(130,93,244,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(130,93,244,0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 80%, rgba(130,93,244,0.06) 0%, transparent 50%)
            `,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center pt-24 pb-16 md:pt-32 md:pb-20">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-6"
              style={{
                background: 'rgba(130,93,244,0.1)',
                border: '1px solid rgba(130,93,244,0.2)',
                color: '#a78bfa',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#22c55e' }} />
              API 服务稳定运行中
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-4xl leading-tight"
              style={{ color: '#fafafa' }}
            >
              八千里 —
              <span className="block mt-2" style={{
                background: 'linear-gradient(135deg, #825df4, #a78bfa, #c4b5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                AI API 聚合平台
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg max-w-2xl" style={{ color: '#a1a1aa' }}>
              在 APIMart 之上，为您提供更稳定、更专业的 API 服务。
              多模型接入、企业级稳定、透明定价、实时到账。
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 mt-8">
              <Link
                href="/bajianli/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #825df4, #a78bfa)',
                  boxShadow: '0 0 20px rgba(130,93,244,0.25)',
                }}
              >
                免费注册
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/bajianli/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  color: '#fafafa',
                  border: '1px solid #1f1f23',
                  background: '#141416',
                }}
              >
                登录
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 sm:gap-12 mt-12 pt-8 border-t" style={{ borderColor: '#1f1f23' }}>
              {[
                { value: '50+', label: '接入模型' },
                { value: '99.9%', label: '可用性' },
                { value: '10ms', label: '平均延迟' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl sm:text-2xl font-bold" style={{ color: '#fafafa' }}>{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: '#a1a1aa' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#fafafa' }}>
              为什么选择八千里？
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#a1a1aa' }}>
              为开发者打造的 AI API 服务平台
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="rounded-lg p-5 transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: '#141416',
                    border: '1px solid #1f1f23',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      background: 'rgba(130,93,244,0.1)',
                      color: '#825df4',
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5" style={{ color: '#fafafa' }}>{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#a1a1aa' }}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Models / Pricing */}
      <section className="py-16 md:py-20" style={{ background: '#0a0a0b' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#fafafa' }}>
              支持模型
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#a1a1aa' }}>
              覆盖主流大语言模型，满足各类场景需求
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {models.map((m) => (
              <div
                key={m.id}
                className="rounded-lg p-4 flex items-center justify-between"
                style={{
                  background: '#141416',
                  border: '1px solid #1f1f23',
                }}
              >
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#fafafa' }}>{m.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#a1a1aa' }}>{m.category}</div>
                </div>
                <div className="text-xs font-medium px-2 py-1 rounded" style={{
                  background: 'rgba(130,93,244,0.1)',
                  color: '#a78bfa',
                }}>
                  {m.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#fafafa' }}>
              定价方案
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#a1a1aa' }}>
              灵活选择，按需付费
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-lg p-6 relative transition-all duration-200"
                style={{
                  background: tier.popular ? '#1a1628' : '#141416',
                  border: tier.popular ? '1px solid rgba(130,93,244,0.3)' : '1px solid #1f1f23',
                  boxShadow: tier.popular ? '0 0 30px rgba(130,93,244,0.1)' : undefined,
                }}
              >
                {tier.popular && (
                  <div
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
                  >
                    最受欢迎
                  </div>
                )}
                <h3 className="text-sm font-semibold" style={{ color: '#fafafa' }}>{tier.name}</h3>
                <div className="mt-3">
                  <span className="text-2xl font-bold" style={{ color: '#fafafa' }}>{tier.price}</span>
                </div>
                <p className="text-xs mt-1.5" style={{ color: '#a1a1aa' }}>{tier.desc}</p>
                <ul className="mt-4 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs" style={{ color: '#a1a1aa' }}>
                      <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#22c55e' }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/bajianli/register"
                  className="block text-center mt-5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    background: tier.popular ? 'linear-gradient(135deg, #825df4, #a78bfa)' : '#1f1f23',
                    color: '#fafafa',
                  }}
                >
                  开始使用
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#fafafa' }}>
            准备好开始了吗？
          </h2>
          <p className="mt-3 text-sm" style={{ color: '#a1a1aa' }}>
            注册即享 100 万 tokens 免费额度
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link
              href="/bajianli/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #825df4, #a78bfa)',
                boxShadow: '0 0 20px rgba(130,93,244,0.25)',
              }}
            >
              免费注册
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
