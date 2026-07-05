'use client'

import React, { useEffect, useState } from 'react'
import {
  getBillingSummary,
  exportBillingCSV,
  BillingItem,
  BillingSummary,
} from '@/lib/bajianli/api'
import {
  FileText, Download, AlertCircle, ChevronLeft, ChevronRight,
} from 'lucide-react'

function nowYearMonth(): { year: number; month: number } {
  const d = new Date()
  return { year: d.getFullYear(), month: d.getMonth() + 1 }
}

function monthOptions(y: number, m: number): { year: number; month: number }[] {
  const options: { year: number; month: number }[] = []
  for (let i = 0; i < 12; i++) {
    let year = y
    let month = m - i
    if (month <= 0) {
      month += 12
      year -= 1
    }
    options.push({ year, month })
  }
  return options
}

function formatMonth(year: number, month: number): string {
  return `${year}年${String(month).padStart(2, '0')}月`
}

function formatCost(cost: number): string {
  return `¥${cost.toFixed(4)}`
}

function formatTokens(tokens: number): string {
  return tokens.toLocaleString()
}

export default function BillingPage() {
  const init = nowYearMonth()
  const [year, setYear] = useState(init.year)
  const [month, setMonth] = useState(init.month)
  const [data, setData] = useState<BillingSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  const months = monthOptions(year, month)

  const fetchData = () => {
    setLoading(true)
    setError('')
    getBillingSummary(year, month)
      .then(setData)
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [year, month])

  const handlePrev = () => {
    const idx = months.findIndex((m) => m.year === year && m.month === month)
    if (idx < months.length - 1) {
      const prev = months[idx + 1]
      setYear(prev.year)
      setMonth(prev.month)
    }
  }

  const handleNext = () => {
    const idx = months.findIndex((m) => m.year === year && m.month === month)
    if (idx > 0) {
      const next = months[idx - 1]
      setYear(next.year)
      setMonth(next.month)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    setError('')
    try {
      await exportBillingCSV(year, month)
    } catch (err: any) {
      setError(err.message || '导出失败')
    } finally {
      setExporting(false)
    }
  }

  const items: BillingItem[] = data?.items || []
  const summary = data?.summary

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#fafafa' }}>月度账单</h1>
          <p className="text-sm mt-0.5" style={{ color: '#a1a1aa' }}>
            查看每月 API 调用消耗汇总
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || items.length === 0}
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

      {/* Month selector */}
      <div
        className="flex items-center justify-between rounded-lg px-4 py-3"
        style={{
          background: '#141416',
          border: '1px solid #1f1f23',
        }}
      >
        <button
          onClick={handlePrev}
          className="p-1.5 rounded transition-all hover:opacity-80"
          style={{ color: '#a1a1aa' }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-4">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium outline-none transition-all"
            style={{
              background: '#0a0a0b',
              border: '1px solid #1f1f23',
              color: '#fafafa',
            }}
          >
            {Array.from(new Set(months.map((m) => m.year))).map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium outline-none transition-all"
            style={{
              background: '#0a0a0b',
              border: '1px solid #1f1f23',
              color: '#fafafa',
            }}
          >
            {months
              .filter((m) => m.year === year)
              .map((m) => (
                <option key={m.month} value={m.month}>
                  {String(m.month).padStart(2, '0')}月
                </option>
              ))}
          </select>
          <span className="text-sm font-semibold" style={{ color: '#fafafa' }}>
            {formatMonth(year, month)}
          </span>
        </div>
        <button
          onClick={handleNext}
          className="p-1.5 rounded transition-all hover:opacity-80"
          style={{ color: '#a1a1aa' }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryCard label="总调用次数" value={summary.total_calls.toLocaleString()} />
          <SummaryCard label="总 Input Tokens" value={formatTokens(summary.total_input)} />
          <SummaryCard label="总 Output Tokens" value={formatTokens(summary.total_output)} />
          <SummaryCard label="总费用" value={formatCost(summary.total_cost)} highlight />
        </div>
      )}

      {/* Billing table */}
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
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: '#a1a1aa' }} />
            <p className="text-sm" style={{ color: '#a1a1aa' }}>暂无该月账单数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#a1a1aa' }}>
                  <th className="text-left px-4 py-3 font-medium">模型</th>
                  <th className="text-right px-4 py-3 font-medium">调用次数</th>
                  <th className="text-right px-4 py-3 font-medium">总 Input Tokens</th>
                  <th className="text-right px-4 py-3 font-medium">总 Output Tokens</th>
                  <th className="text-right px-4 py-3 font-medium">总费用(¥)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={item.model}
                    className="border-t transition-all"
                    style={{ borderColor: '#1f1f23' }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: '#fafafa' }}>
                      {item.model}
                    </td>
                    <td className="px-4 py-3 text-right font-mono" style={{ color: '#a1a1aa' }}>
                      {item.call_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono" style={{ color: '#a1a1aa' }}>
                      {item.total_input.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono" style={{ color: '#a1a1aa' }}>
                      {item.total_output.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono" style={{ color: '#fafafa' }}>
                      ¥{item.total_cost.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Totals row */}
              {summary && (
                <tfoot>
                  <tr style={{ borderTop: '2px solid #2f2f33' }}>
                    <td
                      className="px-4 py-3 font-semibold text-xs"
                      style={{ color: '#fafafa' }}
                    >
                      总计
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold" style={{ color: '#fafafa' }}>
                      {summary.total_calls.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold" style={{ color: '#fafafa' }}>
                      {summary.total_input.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold" style={{ color: '#fafafa' }}>
                      {summary.total_output.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold" style={{ color: '#825df4' }}>
                      ¥{summary.total_cost.toFixed(4)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{
        background: '#141416',
        border: highlight ? '1px solid rgba(130,93,244,0.3)' : '1px solid #1f1f23',
      }}
    >
      <div className="text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>
        {label}
      </div>
      <div
        className={`text-sm font-bold font-mono ${highlight ? '' : ''}`}
        style={{ color: highlight ? '#825df4' : '#fafafa' }}
      >
        {value}
      </div>
    </div>
  )
}
