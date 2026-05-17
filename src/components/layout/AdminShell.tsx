'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NotificationBell } from './NotificationBell'
import {
  LayoutDashboard,
  Shield,
  FileText,
  UserCheck,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ChevronDown,
} from 'lucide-react'

interface AdminShellProps {
  children: React.ReactNode
  initialUser: {
    name: string
    email: string
    role: string
  }
}

export function AdminShell({ children, initialUser }: AdminShellProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  // Auto-close mobile drawer when route changes
  React.useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  const menuGroups = [
    {
      title: 'HỆ THỐNG',
      items: [
        {
          label: 'Dashboard',
          href: '/admin/dashboard',
          icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'NỘI DUNG',
      items: [
        {
          label: 'Dịch Vụ',
          href: '/admin/services',
          icon: <Shield className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Bài Viết / Tin Tức',
          href: '/admin/posts',
          icon: <FileText className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'NHÂN SỰ & TUYỂN DỤNG',
      items: [
        {
          label: 'Tin Tuyển Dụng',
          href: '/admin/jobs',
          icon: <FolderKanban className="w-4 h-4 shrink-0" />,
        },
        {
          label: 'Hồ Sơ Ứng Tuyển',
          href: '/admin/applications',
          icon: <UserCheck className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'KHÁCH HÀNG',
      items: [
        {
          label: 'Yêu Cầu Liên Hệ / Leads',
          href: '/admin/contacts',
          icon: <MessageSquare className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'CẤU HÌNH',
      items: [
        {
          label: 'Cài Đặt Website',
          href: '/admin/settings',
          icon: <Settings className="w-4 h-4 shrink-0" />,
        },
      ],
    },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      localStorage.removeItem('adminAccessToken')
      window.location.href = '/admin/login'
    } catch (e) {
      console.error('Logout error:', e)
    }
  }

  // Get current section label based on pathname
  const getCurrentSectionTitle = () => {
    for (const group of menuGroups) {
      const match = group.items.find((item) => pathname.startsWith(item.href))
      if (match) return match.label
    }
    return 'Hệ Thống Quản Trị'
  }

  return (
    <div className="bg-secondary-dark min-h-screen flex text-left text-white font-sans overflow-hidden">
      {/* 1. DESKTOP SIDEBAR PANEL */}
      <aside className="w-64 border-r border-white/5 bg-secondary-light/10 hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="flex flex-col overflow-y-auto flex-1">
          {/* Sidebar Logo */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/20">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-sm tracking-tight text-white leading-none">
                LONG VIỆT
              </h1>
              <span className="text-[10px] text-gray-500 font-light mt-0.5 block">
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="p-4 space-y-6 flex-1">
            {menuGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <span className="text-[9px] font-extrabold tracking-widest text-gray-500 uppercase px-3 block">
                  {group.title}
                </span>
                <div className="space-y-0.5">
                  {group.items.map((item, iIdx) => {
                    const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={iIdx}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Account block */}
        <div className="p-4 border-t border-white/5 bg-secondary-dark/40 flex flex-col gap-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{initialUser.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{initialUser.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-primary/10 hover:text-primary border border-white/5 rounded-xl py-2.5 text-xs font-bold text-gray-400 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY & PANEL */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden">
          <aside className="w-64 h-full border-r border-white/5 bg-secondary-dark flex flex-col justify-between p-0 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                    <Shield className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h1 className="font-heading font-extrabold text-sm text-white">LONG VIỆT</h1>
                    <span className="text-[9px] text-gray-500 font-light block">ADMIN PORTAL</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-4 space-y-6 flex-1">
                {menuGroups.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-1.5">
                    <span className="text-[9px] font-extrabold tracking-widest text-gray-500 uppercase px-3 block">
                      {group.title}
                    </span>
                    <div className="space-y-0.5">
                      {group.items.map((item, iIdx) => {
                        const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
                        return (
                          <Link
                            key={iIdx}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                              isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-white/5 bg-secondary-dark/60 space-y-3">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{initialUser.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{initialUser.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-primary/10 hover:text-primary border border-white/5 rounded-xl py-2.5 text-xs font-bold text-gray-400 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header bar */}
        <header className="h-16 border-b border-white/5 bg-secondary-light/5 backdrop-blur-md flex items-center justify-between px-4 md:px-8 relative z-40 sticky top-0 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile screens */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="font-heading font-extrabold text-sm md:text-base text-white tracking-tight">
              {getCurrentSectionTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* 🔔 Notification Bell */}
            <NotificationBell />

            {/* Account Profile drop-down */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/5 text-xs md:text-sm font-bold text-gray-300 hover:text-white transition-colors focus:outline-none cursor-pointer"
              >
                <div className="w-7 h-7 bg-primary/15 rounded-full flex items-center justify-center text-primary font-bold uppercase border border-primary/20 shrink-0">
                  {initialUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline">{initialUser.name}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-[#111c30] border border-white/10 rounded-2xl shadow-2xl p-1.5 z-20 flex flex-col space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-white/5 text-left mb-1">
                      <p className="text-xs font-bold text-white leading-none">{initialUser.name}</p>
                      <span className="text-[9px] text-gray-500 font-light mt-1 block">
                        Quyền: {initialUser.role}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-primary/5 transition-all text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Đăng xuất hệ thống</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
