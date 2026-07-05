'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { User, getMe } from '@/lib/bajianli/api'
import { cn } from '@/lib/utils'
import {
  Home,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Key,
  Wallet,
  FileText,
  Menu,
  X,
  LogOut,
} from 'lucide-react'

export default function BajianliLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isConsole = pathname?.startsWith('/bajianli/console')
  const isAuth = pathname?.startsWith('/bajianli/login') || pathname?.startsWith('/bajianli/register')
  const isHome = pathname === '/bajianli'

  useEffect(() => {
    const token = localStorage.getItem('bajianli_token')
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => localStorage.removeItem('bajianli_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('bajianli_token')
    setUser(null)
    router.push('/bajianli')
  }

  const navLinks = [
    { href: '/bajianli', label: '首页', icon: Home, show: true },
    { href: '/bajianli/login', label: '登录', icon: LogIn, show: !user && !loading },
    { href: '/bajianli/register', label: '注册', icon: UserPlus, show: !user && !loading },
    { href: '/bajianli/console', label: '控制台', icon: LayoutDashboard, show: !!user },
    { href: '/bajianli/console/keys', label: 'API Key', icon: Key, show: !!user },
    { href: '/bajianli/console/wallet', label: '钱包', icon: Wallet, show: !!user },
    { href: '/bajianli/console/logs', label: '日志', icon: FileText, show: !!user },
  ].filter(l => l.show)

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0b' }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(10,10,11,0.88)',
          backdropFilter: 'blur(16px)',
          borderColor: '#1f1f23',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/bajianli" className="flex items-center gap-2.5 flex-shrink-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
              >
                八
              </div>
              <span className="font-semibold text-sm text-[#fafafa] hidden sm:block">
                八千里
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const active = pathname === link.href || (link.href !== '/bajianli' && pathname?.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                      active
                        ? 'text-[#fafafa]'
                        : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#141416]'
                    )}
                    style={active ? { color: '#825df4' } : undefined}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                )
              })}
              {user && (
                <div className="flex items-center gap-2 ml-3 pl-3" style={{ borderLeft: '1px solid #1f1f23' }}>
                  <span className="text-xs text-[#a1a1aa]">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#141416] transition-all duration-150"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    退出
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center justify-center p-2 rounded-md text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#141416] transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-3 border-t pt-2" style={{ borderColor: '#1f1f23' }}>
              {navLinks.map((link) => {
                const Icon = link.icon
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
                      active ? 'text-[#825df4] bg-[#141416]' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#141416]'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
              {user && (
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#141416] w-full mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer for public pages */}
      {isHome && (
        <footer
          className="border-t py-8 px-4"
          style={{ borderColor: '#1f1f23', background: '#0a0a0b' }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #825df4, #a78bfa)' }}
                >
                  八
                </div>
                <span className="text-sm font-semibold text-[#fafafa]">八千里</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-[#a1a1aa]">
                <span>AI API 聚合平台</span>
                <span>·</span>
                <span>© 2024 八千里</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
