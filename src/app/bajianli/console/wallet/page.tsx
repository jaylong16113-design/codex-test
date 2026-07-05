'use client'

import { useEffect, useState } from 'react'
import {
  getBalance, getWalletRecords, createTopup, mockPay,
  WalletRecord,
} from '@/lib/bajianli/api'
import {
  Wallet, Plus, History, QrCode, Check, X, AlertCircle, Copy,
} from 'lucide-react'

const presetAmounts = [100, 500, 1000, 2000, 5000]

export default function WalletPage() {
  const [balance, setBalance] = useState(0)
  const [records, setRecords] = useState<WalletRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showTopup, setShowTopup] = useState(false)
  const [amount, setAmount] = useState(100)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('wechat')
  const [orderId, setOrderId] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchData = () => {
    setLoading(true)
    Promise.all([
      getBalance().then(r => r.balance).catch(() => 0),
      getWalletRecords().catch(() => []),
    ])
      .then(([b, r]) => {
        setBalance(b)
        setRecords(r)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleTopup = async () => {
    setError('')
    setSuccess('')
    const amt = customAmount ? parseFloat(customAmount) : amount
    if (!amt || amt <= 0) {
      setError('请输入有效金额')
      return
    }
    setPaying(true)
    try {
      const res = await createTopup(amt, paymentMethod)
      setOrderId(res.order_id)
      // Simulate mock payment
      await mockPay(res.order_id)
      setSuccess(`充值 ¥${amt.toFixed(2)} 成功！`)
      setShowTopup(false)
      setOrderId(null)
      fetchData()
    } catch (err: any) {
      setError(err.message || '充值失败')
    } finally {
      setPaying(false)
    }
  }

  const formatTime = (t: string) => {
    return new Date(t).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="w-6 h-6 border-2 border-[#825df4]/30 border-t-[#825df4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#fafafa' }}>钱包</h1>
        <p className="text-sm mt-0.5" style={{ color: '#a1a1aa' }}>
          管理账户余额和充值记录
        </p>
      </div>

      {/* Error / Success */}
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
      {success && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
          style={{
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            color: '#22c55e',
          }}
        >
          <Check className="w-3.5 h-3.5 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Balance Card */}
      <div
        className="rounded-lg p-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1628, #141416)',
          border: '1px solid rgba(130,93,244,0.2)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
          style={{ background: '#825df4', transform: 'translate(30%, -30%)' }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4" style={{ color: '#825df4' }} />
            <span className="text-xs font-medium" style={{ color: '#a1a1aa' }}>账户余额</span>
          </div>
          <div className="text-3xl font-bold mt-1" style={{ color: '#fafafa' }}>
            ¥{balance.toFixed(2)}
          </div>
          <button
            onClick={() => setShowTopup(true)}
            className="mt-4 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #825df4, #a78bfa)',
              boxShadow: '0 0 15px rgba(130,93,244,0.2)',
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            充值
          </button>
        </div>
      </div>

      {/* Records */}
      <div
        className="rounded-lg"
        style={{
          background: '#141416',
          border: '1px solid #1f1f23',
        }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: '#1f1f23' }}>
          <History className="w-4 h-4" style={{ color: '#825df4' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#fafafa' }}>充值记录</h2>
        </div>
        {records.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs" style={{ color: '#a1a1aa' }}>暂无充值记录</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#a1a1aa' }}>
                  <th className="text-left px-4 py-2.5 font-medium">时间</th>
                  <th className="text-left px-4 py-2.5 font-medium">订单号</th>
                  <th className="text-right px-4 py-2.5 font-medium">金额</th>
                  <th className="text-left px-4 py-2.5 font-medium">方式</th>
                  <th className="text-right px-4 py-2.5 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} className="border-t" style={{ borderColor: '#1f1f23' }}>
                    <td className="px-4 py-2.5" style={{ color: '#a1a1aa' }}>{formatTime(r.created_at)}</td>
                    <td className="px-4 py-2.5 font-mono" style={{ color: '#a1a1aa' }}>
                      {r.id}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono font-medium" style={{ color: '#22c55e' }}>
                      +¥{r.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5" style={{ color: '#a1a1aa' }}>
                      {r.payment_gateway === 'wechat' ? '微信支付' : r.payment_gateway === 'alipay' ? '支付宝' : r.payment_gateway}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          background: r.status === 'completed' ? 'rgba(34,197,94,0.1)' : r.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                          color: r.status === 'completed' ? '#22c55e' : r.status === 'pending' ? '#f59e0b' : '#ef4444',
                        }}
                      >
                        {r.status === 'completed' ? '已完成' : r.status === 'pending' ? '处理中' : '失败'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Topup Modal */}
      {showTopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => { setShowTopup(false); setOrderId(null); setError('') }} />
          <div
            className="relative w-full max-w-sm rounded-lg p-6"
            style={{
              background: '#141416',
              border: '1px solid #1f1f23',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: '#fafafa' }}>充值</h2>
              <button onClick={() => { setShowTopup(false); setOrderId(null); setError('') }} style={{ color: '#a1a1aa' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {orderId ? (
              /* Success state */
              <div className="text-center py-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(34,197,94,0.1)' }}
                >
                  <Check className="w-7 h-7" style={{ color: '#22c55e' }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: '#fafafa' }}>充值成功</p>
                <p className="text-xs mt-1" style={{ color: '#a1a1aa' }}>
                  订单号: {orderId.substring(0, 16)}...
                </p>
                <button
                  onClick={() => { setShowTopup(false); setOrderId(null) }}
                  className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
                >
                  完成
                </button>
              </div>
            ) : (
              /* Form */
              <div className="space-y-4">
                {/* Preset amounts */}
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>选择金额</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetAmounts.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => { setAmount(a); setCustomAmount('') }}
                        className="px-3 py-2.5 rounded-lg text-sm font-semibold transition-all"
                        style={{
                          background: !customAmount && amount === a ? 'rgba(130,93,244,0.15)' : '#0a0a0b',
                          border: `1px solid ${!customAmount && amount === a ? 'rgba(130,93,244,0.3)' : '#1f1f23'}`,
                          color: !customAmount && amount === a ? '#a78bfa' : '#fafafa',
                        }}
                      >
                        ¥{a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom amount */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>自定义金额</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold" style={{ color: '#a1a1aa' }}>¥</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setAmount(0) }}
                      placeholder="输入金额"
                      min="1"
                      className="w-full pl-7 pr-3 py-2.5 rounded-lg text-sm outline-none transition-all"
                      style={{
                        background: '#0a0a0b',
                        border: '1px solid #1f1f23',
                        color: '#fafafa',
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#825df4'}
                      onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
                    />
                  </div>
                </div>

                {/* Payment method */}
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: '#a1a1aa' }}>支付方式</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'wechat', label: '微信支付' },
                      { value: 'alipay', label: '支付宝' },
                    ].map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setPaymentMethod(m.value)}
                        className="px-3 py-2.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: paymentMethod === m.value ? 'rgba(130,93,244,0.15)' : '#0a0a0b',
                          border: `1px solid ${paymentMethod === m.value ? 'rgba(130,93,244,0.3)' : '#1f1f23'}`,
                          color: paymentMethod === m.value ? '#a78bfa' : '#fafafa',
                        }}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleTopup}
                    disabled={paying}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60"
                    style={{
                      background: 'linear-gradient(135deg, #825df4, #a78bfa)',
                    }}
                  >
                    {paying ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" />
                        确认充值 ¥{(customAmount ? parseFloat(customAmount) : amount).toFixed(2)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
