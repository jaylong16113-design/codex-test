'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User, getMe } from '@/lib/bajianli/api'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Key,
  Wallet,
  FileText,
  ChevronLeft,
  ChevronRight,
  Share2,
  Settings,
  Receipt,
  CreditCard,
  Play,
} from 'lucide-react'

function getSidebarItems(isSuperAdmin: boolean) {
  const items = [
    { href: '/bajianli/console', label: '仪表盘', icon: LayoutDashboard },
    { href: '/bajianli/console/playground', label: 'Playground', icon: Play },
    { href: '/bajianli/console/keys', label: 'API Key', icon: Key },
    { href: '/bajianli/console/sub-keys', label: '子密钥', icon: Share2 },
    { href: '/bajianli/console/wallet', label: '钱包', icon: Wallet },
    { href: '/bajianli/console/billing', label: '账单', icon: CreditCard },
    { href: '/bajianli/console/invoices', label: '发票中心', icon: Receipt },
    { href: '/bajianli/console/logs', label: '调用日志', icon: FileText },
  ]
  if (isSuperAdmin) {
    items.push({ href: '/bajianli/console/admin/pricing', label: '管理', icon: Settings })
  }
  return items
}

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('bajianli_token')
    if (!token) {
      router.push('/bajianli/login')
      return
    }
    getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('bajianli_token')
        router.push('/bajianli/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]" style={{ background: '#0a0a0b' }}>
        <span className="w-6 h-6 border-2 border-[#825df4]/30 border-t-[#825df4] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-56px)]" style={{ background: '#0a0a0b' }}>
      {/* Sidebar */}
      <aside
        className={cn(
          'flex-shrink-0 border-r transition-all duration-200 hidden md:flex flex-col',
          sidebarCollapsed ? 'w-14' : 'w-56'
        )}
        style={{ borderColor: '#1f1f23', background: '#0a0a0b' }}
      >
        <div className="flex-1 py-4 px-2 space-y-1">
          {getSidebarItems(user?.is_superadmin || false).map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'text-[#fafafa]'
                    : 'text-[#a1a1aa] hover:text-[#fafafa]'
                )}
                style={{
                  background: active ? 'rgba(130,93,244,0.1)' : 'transparent',
                  color: active ? '#825df4' : undefined,
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center h-10 border-t text-[#a1a1aa] hover:text-[#fafafa] transition-colors"
          style={{ borderColor: '#1f1f23' }}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t"
        style={{ background: '#0a0a0b', borderColor: '#1f1f23' }}
      >
        {getSidebarItems(user?.is_superadmin || false).map((item: { href: string; icon: any; label: string }) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors"
              style={{ color: active ? '#825df4' : '#a1a1aa' }}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}
