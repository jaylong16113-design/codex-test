'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { getLogs, getPricing, exportLogsCSV, LogEntry, PricingEntry } from '@/lib/bajianli/api'
import {
  FileText, ChevronLeft, ChevronRight, Filter, X, AlertCircle, Download,
  ChevronDown, ChevronUp,
} from 'lucide-react'

const modelOptions = [
  'deepseek-chat', 'deepseek-reasoner', 'deepseek-coder',
  'gpt-4o', 'gpt-4o-mini', 'claude-3.5-sonnet',
  'text-embedding-3',
]

const statusOptions = ['success', 'failed', 'rate_limited']

type TimeRange = '' | 'today' | '7d' | '30d' | 'custom'

function formatDateInput(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getTimeRangeDates(range: TimeRange): { start_date?: string; end_date?: string } {
  const now = new Date()
  const end = formatDateInput(now) + 'T23:59:59'
  if (range === 'today') {
    const start = formatDateInput(now) + 'T00:00:00'
    return { start_date: start, end_date: end }
  }
  if (range === '7d') {
    const d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return { start_date: formatDateInput(d) + 'T00:00:00', end_date: end }
  }
  if (range === '30d') {
    const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return { start_date: formatDateInput(d) + 'T00:00:00', end_date: end }
  }
  return {}
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filterModel, setFilterModel] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [timeRange, setTimeRange] = useState<TimeRange>('')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [pricing, setPricing] = useState<Map<string, { input: number; output: number }>>(new Map())
  const [exporting, setExporting] = useState(false)

  const fetchLogs = useCallback(() => {
    setLoading(true)
    setError('')
    const timeParams = timeRange === 'custom'
      ? { start_date: customStart ? customStart + 'T00:00:00' : undefined, end_date: customEnd ? customEnd + 'T23:59:59' : undefined }
      : getTimeRangeDates(timeRange)
    getLogs({
      page,
      model: filterModel || undefined,
      status: filterStatus || undefined,
      ...timeParams,
    })
      .then((data) => {
        setLogs(data)
        setTotal(data.length)
        setPages(Math.max(1, Math.ceil(data.length / 50)))
      })
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false))
  }, [page, filterModel, filterStatus, timeRange, customStart, customEnd])

  // Fetch pricing data on mount
  useEffect(() => {
    getPricing()
      .then((data) => {
        const map = new Map<string, { input: number; output: number }>()
        for (const p of data) {
          const effective = p.base_price * p.markup_rate / 1000 // per token
          if (!map.has(p.model)) map.set(p.model, { input: 0, output: 0 })
          const entry = map.get(p.model)!
          if (p.category === 'input') entry.input = effective
          else if (p.category === 'output') entry.output = effective
        }
        setPricing(map)
      })
      .catch(() => {})
  }, [])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [filterModel, filterStatus, timeRange, customStart, customEnd])

  useEffect(() => { fetchLogs() }, [page, fetchLogs])

  const handleFilter = () => { fetchLogs() }

  const clearFilters = () => {
    setFilterModel('')
    setFilterStatus('')
    setTimeRange('')
    setCustomStart('')
    setCustomEnd('')
    setPage(1)
  }

  const formatTime = (t: string) => {
    return new Date(t).toLocaleString('zh-CN', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const hasActiveFilters = !!(filterModel || filterStatus || timeRange)

  // ── CSV Export ──────────────────────────────────────────────────────────────
  const exportCSV = async () => {
    setExporting(true)
    setError('')
    try {
      const timeParams = timeRange === 'custom'
        ? {
            start_date: customStart ? customStart + 'T00:00:00' : undefined,
            end_date: customEnd ? customEnd + 'T23:59:59' : undefined,
          }
        : getTimeRangeDates(timeRange)
      await exportLogsCSV({
        model: filterModel || undefined,
        ...timeParams,
      })
    } catch (err: any) {
      setError(err.message || '导出失败')
    } finally {
      setExporting(false)
    }
  }

  // ── Pricing helpers ─────────────────────────────────────────────────────────
  const getUnitPrice = (model: string, category: 'input' | 'output'): number => {
    return pricing.get(model)?.[category] ?? 0
  }

  // Render expanded row content
  const renderExpandedRow = (log: LogEntry) => {
    const inputPrice = getUnitPrice(log.model, 'input')
    const outputPrice = getUnitPrice(log.model, 'output')
    const inputCost = log.input_tokens * inputPrice
    const outputCost = log.output_tokens * outputPrice
    const calculatedCost = inputCost + outputCost
    const inputPricePerK = inputPrice * 1000
    const outputPricePerK = outputPrice * 1000

    // Duration display
    const durationSec = log.duration
    const durationDisplay = durationSec >= 1
      ? `${durationSec.toFixed(2)}s`
      : `${(durationSec * 1000).toFixed(0)}ms`

    return (
      <tr key={`expanded-${log.id}`}>
        <td colSpan={8} className="px-0 py-0">
          <div
            className="mx-4 mb-3 rounded-lg p-4"
            style={{
              background: '#0d0d10',
              border: '1px solid #1f1f23',
            }}
          >
            {/* Formula row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <DetailItem label="输入 Token" value={log.input_tokens.toLocaleString()} />
              <DetailItem label="输出 Token" value={log.output_tokens.toLocaleString()} />
              <DetailItem label="输入单价" value={`¥${inputPricePerK.toFixed(4)}/K`} />
              <DetailItem label="输出单价" value={`¥${outputPricePerK.toFixed(4)}/K`} />
              <DetailItem label="请求 ID" value={log.request_id} mono />
              <DetailItem label="上游请求 ID" value={log.upstream_request_id || '-'} mono />
              <DetailItem label="耗时" value={durationDisplay} />
              <DetailItem label="Endpoint" value={log.endpoint} mono />
            </div>

            {/* Formula */}
            <div
              className="pt-3 border-t text-[10px] leading-relaxed font-mono"
              style={{ borderColor: '#1f1f23', color: '#a1a1aa' }}
            >
              <div className="font-semibold text-[11px] mb-1" style={{ color: '#fafafa' }}>
                计费公式
              </div>
              ({log.input_tokens.toLocaleString()} × ¥{inputPricePerK.toFixed(4)}/K + {log.output_tokens.toLocaleString()} × ¥{outputPricePerK.toFixed(4)}/K) ÷ 1000
              {' = '}
              <span style={{ color: '#825df4' }}>
                ¥{calculatedCost.toFixed(8)}
              </span>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#fafafa' }}>调用日志</h1>
          <p className="text-sm mt-0.5" style={{ color: '#a1a1aa' }}>
            查看 API 调用记录和消耗明细
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={exporting}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
        >
          <Download className="w-3.5 h-3.5" />
          {exporting ? '导出中...' : '导出 CSV'}
        </button>
      </div>

      {/* Error */}
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

      {/* Filters */}
      <div
        className="rounded-lg p-4"
        style={{
          background: '#141416',
          border: '1px solid #1f1f23',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-xs font-medium transition-all"
            style={{ color: '#a1a1aa' }}
          >
            <Filter className="w-3.5 h-3.5" />
            {showFilters ? '收起筛选' : '展开筛选'}
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#825df4' }} />
            )}
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-[10px] font-medium transition-all"
              style={{ color: '#a1a1aa' }}
            >
              <X className="w-3 h-3" />
              清除筛选
            </button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3">
            {/* Model filter */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>模型</label>
              <select
                value={filterModel}
                onChange={(e) => setFilterModel(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs outline-none transition-all"
                style={{
                  background: '#0a0a0b',
                  border: '1px solid #1f1f23',
                  color: '#fafafa',
                }}
              >
                <option value="">全部模型</option>
                {modelOptions.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            {/* Status filter */}
            <div className="flex-1 min-w-[100px]">
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>状态</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs outline-none transition-all"
                style={{
                  background: '#0a0a0b',
                  border: '1px solid #1f1f23',
                  color: '#fafafa',
                }}
              >
                <option value="">全部状态</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s === 'success' ? '成功' : s === 'failed' ? '失败' : '频率限制'}</option>
                ))}
              </select>
            </div>
            {/* Time range filter */}
            <div className="flex-1 min-w-[130px]">
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>时间范围</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs outline-none transition-all"
                style={{
                  background: '#0a0a0b',
                  border: '1px solid #1f1f23',
                  color: '#fafafa',
                }}
              >
                <option value="">全部时间</option>
                <option value="today">今天</option>
                <option value="7d">最近 7 天</option>
                <option value="30d">最近 30 天</option>
                <option value="custom">自定义</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
              >
                筛选
              </button>
            </div>
          </div>
        )}

        {/* Custom date range */}
        {showFilters && timeRange === 'custom' && (
          <div className="flex flex-wrap items-end gap-3 mt-3 pt-3 border-t" style={{ borderColor: '#1f1f23' }}>
            <div>
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>开始日期</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg text-xs outline-none transition-all"
                style={{
                  background: '#0a0a0b',
                  border: '1px solid #1f1f23',
                  color: '#fafafa',
                }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>结束日期</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg text-xs outline-none transition-all"
                style={{
                  background: '#0a0a0b',
                  border: '1px solid #1f1f23',
                  color: '#fafafa',
                }}
              />
            </div>
            <button
              onClick={handleFilter}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
            >
              应用
            </button>
          </div>
        )}
      </div>

      {/* Logs Table */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          background: '#141416',
          border: '1px solid #1f1f23',
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="w-5 h-5 border-2 border-[#825df4]/30 border-t-[#825df4] rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#a1a1aa' }} />
            <p className="text-sm" style={{ color: '#a1a1aa' }}>暂无调用记录</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#a1a1aa' }}>
                  <th className="text-left px-4 py-3 font-medium whitespace-nowrap w-6"></th>
                  <th className="text-left px-4 py-3 font-medium whitespace-nowrap">时间</th>
                  <th className="text-left px-4 py-3 font-medium">模型</th>
                  <th className="text-left px-4 py-3 font-medium">Key</th>
                  <th className="text-right px-4 py-3 font-medium">Input</th>
                  <th className="text-right px-4 py-3 font-medium">Output</th>
                  <th className="text-right px-4 py-3 font-medium">费用</th>
                  <th className="text-right px-4 py-3 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr
                      className="border-t cursor-pointer transition-all"
                      style={{ borderColor: '#1f1f23' }}
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    >
                      <td className="px-3 py-3 text-center" style={{ color: '#a1a1aa' }}>
                        {expandedId === log.id
                          ? <ChevronUp className="w-3 h-3 inline" />
                          : <ChevronDown className="w-3 h-3 inline" />
                        }
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#a1a1aa' }}>
                        {formatTime(log.created_at)}
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#fafafa' }}>{log.model}</td>
                      <td className="px-4 py-3 font-mono" style={{ color: '#a1a1aa' }}>
                        {log.api_key_name || `Key #${log.api_key_id}`}
                      </td>
                      <td className="px-4 py-3 text-right font-mono" style={{ color: '#a1a1aa' }}>
                        {log.input_tokens.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono" style={{ color: '#a1a1aa' }}>
                        {log.output_tokens.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono" style={{ color: '#fafafa' }}>
                        ¥{log.cost.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{
                            background: log.status === 'success' ? 'rgba(34,197,94,0.1)' : log.status === 'failed' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                            color: log.status === 'success' ? '#22c55e' : log.status === 'failed' ? '#ef4444' : '#f59e0b',
                          }}
                        >
                          {log.status === 'success' ? '成功' : log.status === 'failed' ? '失败' : '限流'}
                        </span>
                      </td>
                    </tr>
                    {expandedId === log.id && renderExpandedRow(log)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3 border-t"
            style={{ borderColor: '#1f1f23' }}
          >
            <span className="text-[10px]" style={{ color: '#a1a1aa' }}>
              共 {total} 条，第 {page}/{pages} 页
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded transition-all disabled:opacity-30"
                style={{ color: '#a1a1aa' }}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, pages - 4))
                const p = start + i
                if (p > pages) return null
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className="w-7 h-7 rounded text-[11px] font-medium transition-all"
                    style={{
                      background: p === page ? 'rgba(130,93,244,0.15)' : 'transparent',
                      color: p === page ? '#825df4' : '#a1a1aa',
                    }}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                onClick={() => setPage(Math.min(pages, page + 1))}
                disabled={page >= pages}
                className="p-1.5 rounded transition-all disabled:opacity-30"
                style={{ color: '#a1a1aa' }}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailItem({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-medium mb-0.5" style={{ color: '#a1a1aa' }}>{label}</div>
      <div className={`text-xs ${mono ? 'font-mono' : ''}`} style={{ color: '#fafafa' }}>{value}</div>
    </div>
  )
}
