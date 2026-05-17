'use client'

import * as React from 'react'
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store access token in localStorage for client-side API authentication
        localStorage.setItem('adminAccessToken', data.accessToken)
        // Redirect to dashboard (force clean reload to update cookies/middleware state)
        window.location.href = '/admin/dashboard'
      } else {
        setStatus('error')
        setErrorMessage(data.error || 'Email hoặc mật khẩu không chính xác.')
      }
    } catch (error) {
      console.error(error)
      setStatus('error')
      setErrorMessage('Lỗi kết nối mạng, vui lòng thử lại.')
    }
  }

  return (
    <main className="bg-secondary-dark min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-secondary-light/10 border border-white/5 p-8 rounded-3xl backdrop-blur-md shadow-2xl relative z-10 space-y-8 text-left">
        {/* Branding header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto border border-primary/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-xl md:text-2xl text-white tracking-tight">
              BẢO VỆ LONG VIỆT
            </h2>
            <p className="text-xs text-gray-400 font-light mt-1">
              Hệ Thống Quản Trị Nội Dung & Tuyển Dụng
            </p>
          </div>
        </div>

        {/* Form panel */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Email đăng nhập</span>
            </label>
            <input
              type="email"
              required
              placeholder="admin@yourdomain.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'submitting'}
              className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors font-light"
            />
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Mật khẩu</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === 'submitting'}
                className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl pl-4 pr-10 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors font-light"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {status === 'error' && (
            <div className="bg-primary/5 border border-primary/20 p-3 rounded-xl flex items-start gap-2.5 text-primary text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all duration-200 text-xs md:text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {status === 'submitting' ? 'Đang xác thực...' : 'Đăng Nhập Quản Trị'}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center">
          <p className="text-[10px] text-gray-500 font-light">
            © 2026 Long Việt Security. Toàn quyền bảo lưu.
          </p>
        </div>
      </div>
    </main>
  )
}
