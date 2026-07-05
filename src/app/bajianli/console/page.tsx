'use client'

import { useEffect, useState } from 'react'
import { getMe, getBalance, getLogs, getKeys, User, LogEntry, ApiKey } from '@/lib/bajianli/api'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts'
import { Wallet, Activity, BarChart3, ArrowUpRight, Clock } from 'lucide-react'

export default function ConsoleDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [balance, setBalance] = useState(0)
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([])
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)

  // Generate mock 7-day trend data
  const trendData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      calls: Math.floor(Math.random() * 80 + 20),
      tokens: Math.floor(Math.random() * 50000 + 10000),
      cost: parseFloat((Math.random() * 2 + 0.5).toFixed(2)),
    }
  })

  useEffect(() => {
    Promise.all([
      getMe(),
      getBalance().then(r => r.balance).catch(() => 0),
      getLogs({ page: 1 }).then(r => r.slice(0, 5)).catch(() => []),
      getKeys().catch(() => []),
    ])
      .then(([u, b, logs, ks]) => {
        setUser(u)
        setBalance(b)
        setRecentLogs(logs)
        setKeys(ks)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const monthlyCost = recentLogs.reduce((sum, l) => sum + l.cost, 0)
  const todayCalls = recentLogs.length

  const statsCards = [
    {
      label: '账户余额',
      value: `¥${balance.toFixed(2)}`,
      icon: Wallet,
      color: '#825df4',
    },
    {
      label: '本月消耗',
      value: `¥${monthlyCost.toFixed(2)}`,
      icon: Activity,
      color: '#22c55e',
    },
    {
      label: '今日调用',
      value: todayCalls.toString(),
      icon: BarChart3,
      color: '#f59e0b',
    },
    {
      label: 'API Key',
      value: keys.length.toString(),
      icon: ArrowUpRight,
      color: '#3b82f6',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="w-6 h-6 border-2 border-[#825df4]/30 border-t-[#825df4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#fafafa' }}>仪表盘</h1>
        <p className="text-sm mt-0.5" style={{ color: '#a1a1aa' }}>
          欢迎回来，{user?.company_name || user?.email}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-lg p-4 transition-all duration-200"
              style={{
                background: '#141416',
                border: '1px solid #1f1f23',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium" style={{ color: '#a1a1aa' }}>{stat.label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${stat.color}15`, color: stat.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold" style={{ color: '#fafafa' }}>{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div
        className="rounded-lg p-4 sm:p-5"
        style={{
          background: '#141416',
          border: '1px solid #1f1f23',
        }}
      >
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#fafafa' }}>近7天调用趋势</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#825df4" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#825df4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                axisLine={{ stroke: '#1f1f23' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#a1a1aa', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  background: '#141416',
                  border: '1px solid #1f1f23',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fafafa',
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="calls"
                stroke="#825df4"
                strokeWidth={2}
                fill="url(#callsGradient)"
                name="调用次数"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="cost"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#costGradient)"
                name="费用 (¥)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Logs */}
      <div
        className="rounded-lg"
        style={{
          background: '#141416',
          border: '1px solid #1f1f23',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: '#1f1f23' }}>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" style={{ color: '#825df4' }} />
            <h2 className="text-sm font-semibold" style={{ color: '#fafafa' }}>最近调用</h2>
          </div>
        </div>
        {recentLogs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs" style={{ color: '#a1a1aa' }}>暂无调用记录</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#a1a1aa' }}>
                  <th className="text-left px-4 py-2.5 font-medium">时间</th>
                  <th className="text-left px-4 py-2.5 font-medium">模型</th>
                  <th className="text-right px-4 py-2.5 font-medium">Tokens</th>
                  <th className="text-right px-4 py-2.5 font-medium">费用</th>
                  <th className="text-right px-4 py-2.5 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} className="border-t" style={{ borderColor: '#1f1f23' }}>
                    <td className="px-4 py-2.5" style={{ color: '#a1a1aa' }}>
                      {new Date(log.created_at).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-2.5 font-medium" style={{ color: '#fafafa' }}>{log.model}</td>
                    <td className="px-4 py-2.5 text-right" style={{ color: '#a1a1aa' }}>
                      {(log.input_tokens + log.output_tokens).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono" style={{ color: '#fafafa' }}>
                      ¥{log.cost.toFixed(4)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          background: log.status === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          color: log.status === 'success' ? '#22c55e' : '#ef4444',
                        }}
                      >
                        {log.status === 'success' ? '成功' : log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
