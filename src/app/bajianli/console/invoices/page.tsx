'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  getInvoices,
  getInvoiceAvailable,
  createInvoice,
  approveInvoice,
  rejectInvoice,
  getMe,
  InvoiceEntry,
  User,
} from '@/lib/bajianli/api'
import { Receipt, Plus, X, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react'

const INVOICE_TYPES = ['普票', '专票']

function formatTime(t: string) {
  return new Date(t).toLocaleString('zh-CN', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bg: string; color: string; icon: any }> = {
    pending: {
      label: '待审核',
      bg: 'rgba(245,158,11,0.1)',
      color: '#f59e0b',
      icon: Clock,
    },
    approved: {
      label: '已通过',
      bg: 'rgba(34,197,94,0.1)',
      color: '#22c55e',
      icon: CheckCircle,
    },
    rejected: {
      label: '已驳回',
      bg: 'rgba(239,68,68,0.1)',
      color: '#ef4444',
      icon: X,
    },
  }
  const c = config[status] || { label: status, bg: 'rgba(161,161,170,0.1)', color: '#a1a1aa', icon: AlertCircle }
  const Icon = c.icon
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
      style={{ background: c.bg, color: c.color }}
    >
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  )
}

export default function InvoicesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [invoices, setInvoices] = useState<InvoiceEntry[]>([])
  const [available, setAvailable] = useState<{ total_consumed: number; total_invoiced: number; available: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('普票')
  const [formAmount, setFormAmount] = useState('')
  const [formCompany, setFormCompany] = useState('')
  const [formTaxId, setFormTaxId] = useState('')
  const [formAddress, setFormAddress] = useState('')
  const [formBankInfo, setFormBankInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Admin reject dialog
  const [rejectId, setRejectId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const fetchData = useCallback(() => {
    setLoading(true)
    setError('')
    Promise.all([
      getMe(),
      getInvoices(),
      getInvoiceAvailable(),
    ])
      .then(([u, inv, avail]) => {
        setUser(u)
        setInvoices(inv)
        setAvailable(avail)
      })
      .catch((err) => setError(err.message || '加载失败'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const resetForm = () => {
    setFormType('普票')
    setFormAmount('')
    setFormCompany(user?.company_name || '')
    setFormTaxId(user?.tax_id || '')
    setFormAddress('')
    setFormBankInfo('')
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!formCompany || !formTaxId || !formAddress || !formBankInfo) {
      setError('请填写完整的开票信息')
      return
    }
    const amount = parseFloat(formAmount)
    if (isNaN(amount) || amount <= 0) {
      setError('请输入有效的开票金额')
      return
    }
    if (available && amount > available.available) {
      setError(`开票金额不能超过可开票余额 ¥${available.available.toFixed(2)}`)
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await createInvoice({
        invoice_type: formType,
        amount,
        company_name: formCompany,
        tax_id: formTaxId,
        address: formAddress,
        bank_info: formBankInfo,
      })
      resetForm()
      fetchData()
    } catch (err: any) {
      setError(err.message || '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  const handleApprove = async (id: number) => {
    try {
      await approveInvoice(id)
      fetchData()
    } catch (err: any) {
      setError(err.message || '操作失败')
    }
  }

  const handleReject = async () => {
    if (rejectId === null || !rejectReason) return
    try {
      await rejectInvoice(rejectId, rejectReason)
      setRejectId(null)
      setRejectReason('')
      fetchData()
    } catch (err: any) {
      setError(err.message || '操作失败')
    }
  }

  const isAdmin = user?.is_superadmin || false

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#fafafa' }}>发票中心</h1>
          <p className="text-sm mt-0.5" style={{ color: '#a1a1aa' }}>
            申请开票并查看开票记录
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          申请开票
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

      {/* Available balance card */}
      {available && (
        <div className="grid grid-cols-3 gap-4">
          <div
            className="rounded-lg p-4"
            style={{ background: '#141416', border: '1px solid #1f1f23' }}
          >
            <p className="text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>已消费</p>
            <p className="text-lg font-bold" style={{ color: '#fafafa' }}>
              ¥{available.total_consumed.toFixed(2)}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ background: '#141416', border: '1px solid #1f1f23' }}
          >
            <p className="text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>已开票</p>
            <p className="text-lg font-bold" style={{ color: '#fafafa' }}>
              ¥{available.total_invoiced.toFixed(2)}
            </p>
          </div>
          <div
            className="rounded-lg p-4"
            style={{ background: '#141416', border: '1px solid #1f1f23' }}
          >
            <p className="text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>可开票</p>
            <p className="text-lg font-bold" style={{ color: '#825df4' }}>
              ¥{available.available.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Invoice Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div
            className="w-full max-w-md rounded-xl p-6 mx-4"
            style={{ background: '#141416', border: '1px solid #1f1f23' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold" style={{ color: '#fafafa' }}>申请开票</h2>
              <button onClick={resetForm} style={{ color: '#a1a1aa' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Invoice type */}
              <div>
                <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>发票类型</label>
                <div className="flex gap-2">
                  {INVOICE_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormType(t)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: formType === t ? 'rgba(130,93,244,0.15)' : '#0a0a0b',
                        color: formType === t ? '#825df4' : '#a1a1aa',
                        border: formType === t ? '1px solid rgba(130,93,244,0.3)' : '1px solid #1f1f23',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>
                  开票金额
                  {available && <span className="ml-1">(可开票: ¥{available.available.toFixed(2)})</span>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none transition-all"
                  style={{
                    background: '#0a0a0b',
                    border: '1px solid #1f1f23',
                    color: '#fafafa',
                  }}
                />
              </div>

              {/* Company name */}
              <div>
                <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>公司名称</label>
                <input
                  type="text"
                  placeholder="请输入公司名称"
                  value={formCompany}
                  onChange={(e) => setFormCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none transition-all"
                  style={{
                    background: '#0a0a0b',
                    border: '1px solid #1f1f23',
                    color: '#fafafa',
                  }}
                />
              </div>

              {/* Tax ID */}
              <div>
                <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>税号</label>
                <input
                  type="text"
                  placeholder="请输入税号"
                  value={formTaxId}
                  onChange={(e) => setFormTaxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none transition-all"
                  style={{
                    background: '#0a0a0b',
                    border: '1px solid #1f1f23',
                    color: '#fafafa',
                  }}
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>地址</label>
                <input
                  type="text"
                  placeholder="请输入公司地址"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none transition-all"
                  style={{
                    background: '#0a0a0b',
                    border: '1px solid #1f1f23',
                    color: '#fafafa',
                  }}
                />
              </div>

              {/* Bank info */}
              <div>
                <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>银行信息</label>
                <input
                  type="text"
                  placeholder="开户行及账号"
                  value={formBankInfo}
                  onChange={(e) => setFormBankInfo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none transition-all"
                  style={{
                    background: '#0a0a0b',
                    border: '1px solid #1f1f23',
                    color: '#fafafa',
                  }}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
              >
                {submitting ? '提交中...' : '提交开票申请'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject dialog */}
      {rejectId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRejectId(null)}>
          <div
            className="w-full max-w-sm rounded-xl p-6 mx-4"
            style={{ background: '#141416', border: '1px solid #1f1f23' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-sm font-bold mb-3" style={{ color: '#fafafa' }}>驳回发票</h2>
            <div className="mb-3">
              <label className="block text-[10px] font-medium mb-1" style={{ color: '#a1a1aa' }}>驳回原因</label>
              <textarea
                rows={3}
                placeholder="请输入驳回原因"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs outline-none transition-all resize-none"
                style={{
                  background: '#0a0a0b',
                  border: '1px solid #1f1f23',
                  color: '#fafafa',
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setRejectId(null); setRejectReason('') }}
                className="flex-1 py-2 rounded-lg text-xs font-medium"
                style={{ background: '#0a0a0b', border: '1px solid #1f1f23', color: '#a1a1aa' }}
              >
                取消
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason}
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                style={{ background: '#ef4444' }}
              >
                确认驳回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice List */}
      <div
        className="rounded-lg overflow-hidden"
        style={{ background: '#141416', border: '1px solid #1f1f23' }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="w-5 h-5 border-2 border-[#825df4]/30 border-t-[#825df4] rounded-full animate-spin" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="w-8 h-8 mx-auto mb-2" style={{ color: '#a1a1aa' }} />
            <p className="text-sm" style={{ color: '#a1a1aa' }}>暂无发票记录</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#a1a1aa' }}>
                  <th className="text-left px-4 py-3 font-medium">发票编号</th>
                  <th className="text-left px-4 py-3 font-medium">类型</th>
                  <th className="text-right px-4 py-3 font-medium">金额</th>
                  <th className="text-left px-4 py-3 font-medium">公司名称</th>
                  <th className="text-left px-4 py-3 font-medium">税号</th>
                  <th className="text-left px-4 py-3 font-medium">时间</th>
                  <th className="text-center px-4 py-3 font-medium">状态</th>
                  {isAdmin && <th className="text-right px-4 py-3 font-medium">操作</th>}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-t transition-all"
                    style={{ borderColor: '#1f1f23' }}
                  >
                    <td className="px-4 py-3 font-mono" style={{ color: '#fafafa' }}>
                      {inv.invoice_id}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#a1a1aa' }}>
                      {inv.invoice_type}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold" style={{ color: '#fafafa' }}>
                      ¥{inv.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 max-w-[140px] truncate" style={{ color: '#a1a1aa' }}>
                      {inv.company_name}
                    </td>
                    <td className="px-4 py-3 font-mono" style={{ color: '#a1a1aa' }}>
                      {inv.tax_id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#a1a1aa' }}>
                      {formatTime(inv.created_at)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        {inv.status === 'pending' && (
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => handleApprove(inv.id)}
                              className="px-2 py-1 rounded text-[10px] font-semibold text-white"
                              style={{ background: '#22c55e' }}
                            >
                              通过
                            </button>
                            <button
                              onClick={() => setRejectId(inv.id)}
                              className="px-2 py-1 rounded text-[10px] font-semibold text-white"
                              style={{ background: '#ef4444' }}
                            >
                              驳回
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rejected invoices note column */}
      {invoices.filter(inv => inv.admin_note).length > 0 && (
        <div
          className="rounded-lg p-4"
          style={{ background: '#141416', border: '1px solid #1f1f23' }}
        >
          <h3 className="text-xs font-semibold mb-2" style={{ color: '#fafafa' }}>驳回记录备注</h3>
          <div className="space-y-2">
            {invoices.filter(inv => inv.admin_note).map(inv => (
              <div key={`note-${inv.id}`} className="flex items-start gap-2">
                <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
                <div>
                  <span className="font-mono text-[10px]" style={{ color: '#a1a1aa' }}>{inv.invoice_id}</span>
                  <p className="text-xs mt-0.5" style={{ color: '#fafafa' }}>{inv.admin_note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
