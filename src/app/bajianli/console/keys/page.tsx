'use client'

import { useEffect, useState } from 'react'
import {
  getKeys, createKey, deleteKey, toggleKey, ApiKey,
} from '@/lib/bajianli/api'
import {
  Key, Plus, Copy, Trash2, ToggleLeft, ToggleRight, X, AlertCircle,
} from 'lucide-react'

const availableModels = [
  'deepseek-chat', 'deepseek-reasoner', 'deepseek-coder',
  'gpt-4o', 'gpt-4o-mini', 'claude-3.5-sonnet',
  'text-embedding-3',
]

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // Create form state
  const [newName, setNewName] = useState('')
  const [newQuota, setNewQuota] = useState(1000000)
  const [newModels, setNewModels] = useState<string[]>(['deepseek-chat'])
  const [newIpWhitelist, setNewIpWhitelist] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchKeys = () => {
    setLoading(true)
    getKeys()
      .then(setKeys)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchKeys() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!newName.trim()) { setError('请输入 Key 名称'); return }
    setCreating(true)
    try {
      await createKey({
        name: newName.trim(),
        quota_limit: newQuota,
        model_permissions: newModels,
        ip_whitelist: newIpWhitelist.split(',').map(s => s.trim()).filter(Boolean),
      })
      setShowCreate(false)
      setNewName('')
      setNewQuota(1000000)
      setNewModels(['deepseek-chat'])
      setNewIpWhitelist('')
      fetchKeys()
    } catch (err: any) {
      setError(err.message || '创建失败')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteKey(id)
      setDeleteConfirm(null)
      fetchKeys()
    } catch (err: any) {
      setError(err.message || '删除失败')
    }
  }

  const handleToggle = async (id: number) => {
    try {
      await toggleKey(id)
      fetchKeys()
    } catch (err: any) {
      setError(err.message || '操作失败')
    }
  }

  const handleCopy = (key: ApiKey) => {
    navigator.clipboard.writeText(key.key_value)
    setCopiedId(key.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleModel = (model: string) => {
    setNewModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#fafafa' }}>API Key 管理</h1>
          <p className="text-sm mt-0.5" style={{ color: '#a1a1aa' }}>
            管理您的 API 访问密钥
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #825df4, #a78bfa)',
            boxShadow: '0 0 15px rgba(130,93,244,0.2)',
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          创建 Key
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

      {/* Keys Table */}
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
        ) : keys.length === 0 ? (
          <div className="text-center py-12">
            <Key className="w-8 h-8 mx-auto mb-2" style={{ color: '#a1a1aa' }} />
            <p className="text-sm" style={{ color: '#a1a1aa' }}>暂无 API Key</p>
            <button
              onClick={() => setShowCreate(true)}
              className="mt-3 text-xs font-medium hover:underline"
              style={{ color: '#825df4' }}
            >
              创建第一个 Key
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ color: '#a1a1aa' }}>
                  <th className="text-left px-4 py-3 font-medium">名称</th>
                  <th className="text-left px-4 py-3 font-medium">Key</th>
                  <th className="text-center px-4 py-3 font-medium">状态</th>
                  <th className="text-right px-4 py-3 font-medium">额度</th>
                  <th className="text-right px-4 py-3 font-medium">已用</th>
                  <th className="text-right px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => {
                  const maskedKey = key.key_value.substring(0, 8) + '...' + key.key_value.substring(key.key_value.length - 4)
                  const usagePercent = key.quota_limit > 0 ? ((key.quota_used / key.quota_limit) * 100).toFixed(1) : '0'
                  return (
                    <tr key={key.id} className="border-t" style={{ borderColor: '#1f1f23' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#fafafa' }}>{key.name}</td>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono" style={{ color: '#a1a1aa' }}>{maskedKey}</code>
                        <button
                          onClick={() => handleCopy(key)}
                          className="ml-1.5 inline-flex items-center transition-colors"
                          style={{ color: copiedId === key.id ? '#22c55e' : '#a1a1aa' }}
                          title="复制"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggle(key.id)}
                          className="inline-flex items-center transition-colors"
                          style={{ color: key.is_active ? '#22c55e' : '#a1a1aa' }}
                          title={key.is_active ? '点击禁用' : '点击启用'}
                        >
                          {key.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right font-mono" style={{ color: '#a1a1aa' }}>
                        {key.quota_limit.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono" style={{ color: parseFloat(usagePercent) > 80 ? '#f59e0b' : '#a1a1aa' }}>
                            {key.quota_used.toLocaleString()}
                          </span>
                          <div className="w-16 h-1.5 rounded-full" style={{ background: '#1f1f23' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(parseFloat(usagePercent), 100)}%`,
                                background: parseFloat(usagePercent) > 80 ? '#f59e0b' : '#825df4',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setDeleteConfirm(key.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all hover:bg-red-500/10"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 className="w-3 h-3" />
                          删除
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Key Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setShowCreate(false)} />
          <div
            className="relative w-full max-w-md rounded-lg p-6"
            style={{
              background: '#141416',
              border: '1px solid #1f1f23',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: '#fafafa' }}>创建 API Key</h2>
              <button onClick={() => setShowCreate(false)} style={{ color: '#a1a1aa' }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>名称</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="例如：生产环境 Key"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: '#0a0a0b',
                    border: '1px solid #1f1f23',
                    color: '#fafafa',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#825df4'}
                  onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>额度限制</label>
                <input
                  type="number"
                  value={newQuota}
                  onChange={(e) => setNewQuota(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: '#0a0a0b',
                    border: '1px solid #1f1f23',
                    color: '#fafafa',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#825df4'}
                  onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>模型权限</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableModels.map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => toggleModel(model)}
                      className="px-2 py-1 rounded text-[10px] font-medium transition-all"
                      style={{
                        background: newModels.includes(model) ? 'rgba(130,93,244,0.15)' : '#0a0a0b',
                        border: `1px solid ${newModels.includes(model) ? 'rgba(130,93,244,0.3)' : '#1f1f23'}`,
                        color: newModels.includes(model) ? '#a78bfa' : '#a1a1aa',
                      }}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#a1a1aa' }}>
                  IP 白名单 <span className="font-normal" style={{ color: '#a1a1aa' }}>(可选，逗号分隔)</span>
                </label>
                <input
                  type="text"
                  value={newIpWhitelist}
                  onChange={(e) => setNewIpWhitelist(e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.0/24"
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: '#0a0a0b',
                    border: '1px solid #1f1f23',
                    color: '#fafafa',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#825df4'}
                  onBlur={(e) => e.target.style.borderColor = '#1f1f23'}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: '#0a0a0b',
                    border: '1px solid #1f1f23',
                    color: '#a1a1aa',
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #825df4, #a78bfa)',
                  }}
                >
                  {creating ? '创建中...' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={() => setDeleteConfirm(null)} />
          <div
            className="relative w-full max-w-sm rounded-lg p-6 text-center"
            style={{
              background: '#141416',
              border: '1px solid #1f1f23',
            }}
          >
            <Trash2 className="w-10 h-10 mx-auto mb-3" style={{ color: '#ef4444' }} />
            <h2 className="text-sm font-semibold mb-1" style={{ color: '#fafafa' }}>确认删除</h2>
            <p className="text-xs mb-4" style={{ color: '#a1a1aa' }}>
              删除后该 Key 将立即失效，且无法恢复。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: '#0a0a0b',
                  border: '1px solid #1f1f23',
                  color: '#a1a1aa',
                }}
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                style={{ background: '#ef4444' }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
