'use client'

import * as React from 'react'
import { Bell, MessageSquare, X, Check, BellRing } from 'lucide-react'
import Link from 'next/link'
import { createPortal } from 'react-dom'

interface NotificationItem {
  id: string
  type: string
  name: string
  phone: string
  service_type: string
  message: string
  created_at: string
  read: boolean
}

export function NotificationBell() {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [toast, setToast] = React.useState<NotificationItem | null>(null)
  const [shake, setShake] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // 1. Initialize notifications from localStorage
  React.useEffect(() => {
    const cached = localStorage.getItem('admin_notifications')
    if (cached) {
      try {
        setNotifications(JSON.parse(cached))
      } catch (e) {
        console.error('Error parsing notifications:', e)
      }
    }
  }, [])

  // 2. Play beautiful synthesized double chime using Web Audio API
  const playSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContextClass) return
      const audioCtx = new AudioContextClass()
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, start)
        
        gainNode.gain.setValueAtTime(0.08, start)
        gainNode.gain.exponentialRampToValueAtTime(0.001, start + duration)
        
        osc.connect(gainNode)
        gainNode.connect(audioCtx.destination)
        
        osc.start(start)
        osc.stop(start + duration)
      }

      // Beautiful C5 - G5 ascending chord
      playTone(523.25, audioCtx.currentTime, 0.15) // C5
      playTone(783.99, audioCtx.currentTime + 0.12, 0.3) // G5
    } catch (err) {
      console.warn('Notification sound failed:', err)
    }
  }

  // 3. Connect to Server-Sent Events (SSE) stream for real-time notifications
  React.useEffect(() => {
    let eventSource: EventSource | null = null

    const connectSSE = () => {
      eventSource = new EventSource('/api/admin/notifications/sse')

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data && data.type === 'NEW_CONTACT') {
            const newNotif: NotificationItem = {
              id: data.id,
              type: data.type,
              name: data.name,
              phone: data.phone,
              service_type: data.service_type,
              message: data.message,
              created_at: data.created_at || new Date().toISOString(),
              read: false,
            }

            setNotifications((prev) => {
              const updated = [newNotif, ...prev].slice(0, 30) // Cap at 30 notifications
              localStorage.setItem('admin_notifications', JSON.stringify(updated))
              return updated
            })

            // Trigger visual bell shaking & chime sound
            setShake(true)
            setTimeout(() => setShake(false), 1000)
            playSound()

            // Trigger banner Toast popup
            setToast(newNotif)
          }
        } catch (err) {
          console.error('Error handling SSE notification:', err)
        }
      }

      eventSource.onerror = (err) => {
        console.warn('SSE disconnected. Reconnecting in 5 seconds...', err)
        eventSource?.close()
        setTimeout(connectSSE, 5000)
      }
    }

    connectSSE()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [])

  // Auto-hide banner toast after 6 seconds
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }))
      localStorage.setItem('admin_notifications', JSON.stringify(updated))
      return updated
    })
  }

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      localStorage.setItem('admin_notifications', JSON.stringify(updated))
      return updated
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    localStorage.removeItem('admin_notifications')
  }

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }).format(date)
    } catch {
      return ''
    }
  }

  return (
    <div className="relative flex items-center">
      {/* 🔔 BELL BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white transition-all focus:outline-none relative cursor-pointer ${
          shake ? 'animate-bounce' : ''
        }`}
        title="Thông báo"
      >
        {unreadCount > 0 ? (
          <>
            <BellRing className={`w-4 h-4 text-primary animate-pulse`} />
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-secondary-dark scale-100 animate-pulse">
              {unreadCount}
            </span>
          </>
        ) : (
          <Bell className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* 📳 DROPDOWN DROPMENU PANEL */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-[#111c30] border border-white/10 rounded-2xl shadow-2xl p-4 z-40 flex flex-col space-y-3 animate-in fade-in slide-in-from-top-2 duration-150 text-left text-white max-h-[480px] overflow-y-auto">
            {/* Dropdown Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xs tracking-tight">THÔNG BÁO</span>
                {unreadCount > 0 && (
                  <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/10">
                    {unreadCount} mới
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-primary hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <Check className="w-3 h-3" /> Đã đọc hết
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[10px] text-gray-500 hover:text-gray-300 font-medium cursor-pointer"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
            </div>

            {/* Dropdown Body */}
            <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[320px] pr-1">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-xl border transition-all relative group ${
                      notif.read
                        ? 'bg-secondary-dark/30 border-white/5 text-gray-400'
                        : 'bg-primary/5 border-primary/10 text-white font-medium'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        notif.read ? 'bg-white/5 text-gray-500' : 'bg-primary/10 text-primary'
                      }`}>
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <p className="text-[11px] font-bold truncate">Yêu cầu báo giá mới</p>
                          <span className="text-[9px] text-gray-500 font-light shrink-0">
                            {formatTime(notif.created_at)}
                          </span>
                        </div>
                        <p className="text-[10px] leading-relaxed break-words">
                          Khách hàng <span className="font-bold text-white">{notif.name}</span> ({notif.phone}) vừa gửi yêu cầu báo giá cho dịch vụ <span className="font-bold text-primary">{notif.service_type}</span>.
                        </p>
                        <p className="text-[9px] text-gray-500 italic truncate">
                          "{notif.message}"
                        </p>
                      </div>
                    </div>
                    {/* Inline Hover Action to mark read & view */}
                    <div className="flex justify-end gap-2 mt-2 pt-1.5 border-t border-white/5">
                      <Link
                        href={`/admin/contacts?search=${notif.phone}`}
                        onClick={() => {
                          markSingleAsRead(notif.id)
                          setIsOpen(false)
                        }}
                        className="text-[9px] font-bold text-primary hover:underline"
                      >
                        Xem chi tiết
                      </Link>
                      {!notif.read && (
                        <button
                          onClick={() => markSingleAsRead(notif.id)}
                          className="text-[9px] font-bold text-gray-500 hover:text-white cursor-pointer"
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500 font-light text-xs">
                  Chưa có thông báo nào.
                </div>
              )}
            </div>

            {/* View all footer */}
            <div className="pt-2 border-t border-white/5">
              <Link
                href="/admin/contacts"
                onClick={() => setIsOpen(false)}
                className="block text-center text-xs font-bold text-gray-400 hover:text-white transition-colors"
              >
                Xem tất cả liên hệ khách hàng
              </Link>
            </div>
          </div>
        </>
      )}

      {/* 🚀 TOAST TO-THE-CORNER ALERT CARD BANNER (REAL-TIME POPUP) USING REACT PORTAL */}
      {mounted && toast && typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 w-96 bg-[#111c30] border border-primary/40 rounded-2xl shadow-2xl p-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 text-left text-white flex gap-3 flex-col">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
              <span className="font-heading font-extrabold text-xs tracking-wider text-primary uppercase">Long Việt Real-time</span>
            </div>
            <button
              onClick={() => setToast(null)}
              className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 border border-primary/20 animate-pulse">
              <BellRing className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-bold text-white">YÊU CẦU BÁO GIÁ MỚI</h4>
              <p className="text-[11px] text-gray-300 leading-normal">
                Khách hàng <span className="font-bold text-white">{toast.name}</span> ({toast.phone}) vừa gửi yêu cầu báo giá cho <span className="font-bold text-primary">{toast.service_type}</span>.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-1.5 pt-2.5 border-t border-white/5">
            <button
              onClick={() => setToast(null)}
              className="text-[10px] text-gray-400 hover:text-white font-bold cursor-pointer"
            >
              Bỏ qua
            </button>
            <Link
              href={`/admin/contacts?search=${toast.phone}`}
              onClick={() => {
                markSingleAsRead(toast.id)
                setToast(null)
              }}
              className="text-[10px] bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20"
            >
              Xem ngay
            </Link>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
