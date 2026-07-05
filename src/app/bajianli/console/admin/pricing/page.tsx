'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  getPricing, updatePricing, createPricing, deletePricing, seedPricing, PricingEntry,
} from '@/lib/bajianli/api'
import {
  DollarSign, Plus, X, ToggleLeft, ToggleRight, Trash2, Database, AlertCircle, Check,
} from 'lucide-react'

interface EditModalData {
  id: number
  model: string
  base_price: number
  markup_rate: number
}

interface CreateModalData {
  model: string
  category: string
  unit: string
  base_price: number
  markup_rate: number
  is_active: boolean
}

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<PricingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Edit modal
  const [editModal, setEditModal] = useState<EditModalData | null>(null)
  const [editBasePrice, setEditBasePrice] = useState('')
  const [editMarkupRate, setEditMarkupRate] = useState('')
  const [saving, setSaving] = useState(false)

  // Create modal
  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<CreateModalData>({
    model: '',
    category: 'chat',
    unit: 'per_1m_tokens',
    base_price: 0,
    markup_rate: 1.5,
    is_active: true,
  })
  const [creating, setCreating] = useState(false)

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const [seeding, setSeeding] = useState(false)

  const fetchPricing = useCallback(async () => {
    try {
      setError('')
      const data = await getPricing()
      setPricing(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load pricing')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPricing()
  }, [fetchPricing])

  const calcSellPrice = (base: number, markup: number) => {
    return (base * markup).toFixed(4)
  }

  const openEdit = (item: PricingEntry) => {
    setEditModal({ id: item.id, model: item.model, base_price: item.base_price, markup_rate: item.markup_rate })
    setEditBasePrice(String(item.base_price))
    setEditMarkupRate(String(item.markup_rate))
  }

  const handleSaveEdit = async () => {
    if (!editModal) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const bp = parseFloat(editBasePrice)
      const mr = parseFloat(editMarkupRate)
      if (isNaN(bp) || isNaN(mr)) {
        setError('Invalid numbers')
        return
      }
      await updatePricing(editModal.id, { base_price: bp, markup_rate: mr })
      setSuccess(`Updated ${editModal.model}`)
      setEditModal(null)
      await fetchPricing()
    } catch (err: any) {
      setError(err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (item: PricingEntry) => {
    setError('')
    setSuccess('')
    try {
      await updatePricing(item.id, { is_active: !item.is_active })
      setSuccess(`${item.model} ${item.is_active ? 'disabled' : 'enabled'}`)
      await fetchPricing()
    } catch (err: any) {
      setError(err.message || 'Toggle failed')
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    setError('')
    setSuccess('')
    try {
      await createPricing({
        model: createForm.model,
        category: createForm.category,
        unit: createForm.unit,
        base_price: createForm.base_price,
        markup_rate: createForm.markup_rate,
        is_active: createForm.is_active,
      })
      setSuccess(`Created ${createForm.model}`)
      setShowCreate(false)
      setCreateForm({ model: '', category: 'chat', unit: 'per_1m_tokens', base_price: 0, markup_rate: 1.5, is_active: true })
      await fetchPricing()
    } catch (err: any) {
      setError(err.message || 'Create failed')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    setError('')
    setSuccess('')
    try {
      await deletePricing(id)
      setSuccess('Pricing deleted')
      setDeleteConfirm(null)
      await fetchPricing()
    } catch (err: any) {
      setError(err.message || 'Delete failed')
    }
  }

  const handleSeed = async () => {
    setSeeding(true)
    setError('')
    setSuccess('')
    try {
      const result = await seedPricing()
      setSuccess(`Seeded ${result.length} pricing records`)
      await fetchPricing()
    } catch (err: any) {
      setError(err.message || 'Seed failed')
    } finally {
      setSeeding(false)
    }
  }

  const CategoryBadge = ({ category }: { category: string }) => {
    const colors: Record<string, string> = {
      chat: 'bg-blue-500/10 text-blue-400',
      video: 'bg-purple-500/10 text-purple-400',
      image: 'bg-green-500/10 text-green-400',
      audio: 'bg-yellow-500/10 text-yellow-400',
      embedding: 'bg-orange-500/10 text-orange-400',
    }
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[category] || 'bg-gray-500/10 text-gray-400'}`}>
        {category}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="w-6 h-6 border-2 border-[#825df4]/30 border-t-[#825df4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#fafafa]">模型管理 / 定价配置</h1>
          <p className="text-sm text-[#a1a1aa] mt-1">管理所有模型的定价、售价和可用状态</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 border"
            style={{ borderColor: '#1f1f23', color: '#a1a1aa' }}
          >
            <Database className="w-4 h-4" />
            {seeding ? '初始化中...' : '初始化默认数据'}
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
            style={{ background: '#825df4', color: '#fff' }}
          >
            <Plus className="w-4 h-4" />
            新增模型
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg text-sm" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Check className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Pricing table */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#1f1f23' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#121214' }}>
                <th className="text-left px-4 py-3 font-medium text-[#a1a1aa] text-xs uppercase tracking-wider">模型名称</th>
                <th className="text-left px-4 py-3 font-medium text-[#a1a1aa] text-xs uppercase tracking-wider">分类</th>
                <th className="text-left px-4 py-3 font-medium text-[#a1a1aa] text-xs uppercase tracking-wider">计费单位</th>
                <th className="text-right px-4 py-3 font-medium text-[#a1a1aa] text-xs uppercase tracking-wider">成本价 ($)</th>
                <th className="text-right px-4 py-3 font-medium text-[#a1a1aa] text-xs uppercase tracking-wider">加价率</th>
                <th className="text-right px-4 py-3 font-medium text-[#a1a1aa] text-xs uppercase tracking-wider">售价 ($)</th>
                <th className="text-center px-4 py-3 font-medium text-[#a1a1aa] text-xs uppercase tracking-wider">状态</th>
                <th className="text-right px-4 py-3 font-medium text-[#a1a1aa] text-xs uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody>
              {pricing.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#a1a1aa]">
                    暂无定价数据，请点击「初始化默认数据」
                  </td>
                </tr>
              ) : (
                pricing.map((item) => (
                  <tr key={item.id} className="border-t transition-colors hover:bg-white/[0.02]" style={{ borderColor: '#1f1f23' }}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#fafafa]">{item.model}</div>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={item.category} />
                    </td>
                    <td className="px-4 py-3 text-[#a1a1aa]">{item.unit === 'per_1m_tokens' ? '每百万 Token' : item.unit === 'per_second' ? '每秒' : item.unit}</td>
                    <td className="px-4 py-3 text-right text-[#fafafa] font-mono">${item.base_price.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-[#825df4]">×{item.markup_rate}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#fafafa] font-mono font-medium">
                      ${calcSellPrice(item.base_price, item.markup_rate)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggle(item)}
                        className="inline-flex items-center gap-1 text-xs"
                        title={item.is_active ? '点击禁用' : '点击启用'}
                      >
                        {item.is_active ? (
                          <ToggleRight className="w-5 h-5 text-green-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-[#a1a1aa]" />
                        )}
                        <span className={item.is_active ? 'text-green-400' : 'text-[#a1a1aa]'}>
                          {item.is_active ? '启用' : '禁用'}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-white/10 text-[#a1a1aa] hover:text-[#fafafa]"
                          title="编辑"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        {deleteConfirm === item.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-2 py-1 rounded text-xs font-medium text-white"
                              style={{ background: '#ef4444' }}
                            >
                              确认
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 rounded text-xs font-medium text-[#a1a1aa]"
                              style={{ background: '#1f1f23' }}
                            >
                              取消
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10 text-[#a1a1aa] hover:text-red-400"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setEditModal(null)}>
          <div
            className="w-full max-w-md rounded-xl border p-6 shadow-xl"
            style={{ background: '#121214', borderColor: '#1f1f23' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#fafafa]">编辑定价</h2>
              <button onClick={() => setEditModal(null)} className="text-[#a1a1aa] hover:text-[#fafafa]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#a1a1aa] mb-4">{editModal.model}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">成本价 (APIMart)</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={editBasePrice}
                  onChange={(e) => setEditBasePrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-[#fafafa] outline-none border transition-colors focus:border-[#825df4]"
                  style={{ background: '#0a0a0b', borderColor: '#1f1f23' }}
                />
              </div>
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">加价率 (如 1.5 = 加价50%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={editMarkupRate}
                  onChange={(e) => setEditMarkupRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm text-[#fafafa] outline-none border transition-colors focus:border-[#825df4]"
                  style={{ background: '#0a0a0b', borderColor: '#1f1f23' }}
                />
              </div>
              <div className="text-sm text-[#a1a1aa]">
                计算售价: ${(parseFloat(editBasePrice || '0') * parseFloat(editMarkupRate || '1')).toFixed(4)}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditModal(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#a1a1aa] border transition-colors"
                style={{ borderColor: '#1f1f23' }}
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ background: '#825df4' }}
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowCreate(false)}>
          <div
            className="w-full max-w-md rounded-xl border p-6 shadow-xl"
            style={{ background: '#121214', borderColor: '#1f1f23' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#fafafa]">新增模型定价</h2>
              <button onClick={() => setShowCreate(false)} className="text-[#a1a1aa] hover:text-[#fafafa]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">模型名称</label>
                <input
                  type="text"
                  value={createForm.model}
                  onChange={(e) => setCreateForm({ ...createForm, model: e.target.value })}
                  placeholder="e.g. gpt-4o-mini"
                  className="w-full px-3 py-2 rounded-lg text-sm text-[#fafafa] outline-none border transition-colors focus:border-[#825df4]"
                  style={{ background: '#0a0a0b', borderColor: '#1f1f23' }}
                />
              </div>
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">分类</label>
                <select
                  value={createForm.category}
                  onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-[#fafafa] outline-none border transition-colors focus:border-[#825df4]"
                  style={{ background: '#0a0a0b', borderColor: '#1f1f23' }}
                >
                  <option value="chat">Chat</option>
                  <option value="video">Video</option>
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                  <option value="embedding">Embedding</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">计费单位</label>
                <select
                  value={createForm.unit}
                  onChange={(e) => setCreateForm({ ...createForm, unit: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-[#fafafa] outline-none border transition-colors focus:border-[#825df4]"
                  style={{ background: '#0a0a0b', borderColor: '#1f1f23' }}
                >
                  <option value="per_1m_tokens">每百万 Token</option>
                  <option value="per_second">每秒</option>
                  <option value="per_image">每张</option>
                  <option value="per_request">每次请求</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">成本价 ($)</label>
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={createForm.base_price}
                  onChange={(e) => setCreateForm({ ...createForm, base_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-[#fafafa] outline-none border transition-colors focus:border-[#825df4]"
                  style={{ background: '#0a0a0b', borderColor: '#1f1f23' }}
                />
              </div>
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-1">加价率 (如 1.5 = 加价50%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={createForm.markup_rate}
                  onChange={(e) => setCreateForm({ ...createForm, markup_rate: parseFloat(e.target.value) || 1 })}
                  className="w-full px-3 py-2 rounded-lg text-sm text-[#fafafa] outline-none border transition-colors focus:border-[#825df4]"
                  style={{ background: '#0a0a0b', borderColor: '#1f1f23' }}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="create-active"
                  checked={createForm.is_active}
                  onChange={(e) => setCreateForm({ ...createForm, is_active: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="create-active" className="text-sm text-[#a1a1aa]">创建后启用</label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[#a1a1aa] border transition-colors"
                style={{ borderColor: '#1f1f23' }}
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !createForm.model}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ background: '#825df4' }}
              >
                {creating ? '创建中...' : '创建'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
