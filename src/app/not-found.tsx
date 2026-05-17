'use client'

import * as React from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingElements } from '@/components/layout/FloatingElements'
import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Shared Header */}
      <Header />

      {/* Main 404 Content */}
      <main className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          {/* Large Stylized 404 */}
          <div className="relative mb-6">
            <h2 className="text-9xl font-extrabold tracking-widest text-primary/10 select-none">
              404
            </h2>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="w-16 h-16 text-primary animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl font-heading font-bold text-secondary mb-3">
            Trang Không Tìm Thấy
          </h1>
          
          <p className="text-body text-text-muted mb-8 leading-relaxed">
            Đường dẫn này không tồn tại, đã bị thay đổi hoặc đã bị xóa khỏi hệ thống Long Việt Security. Vui lòng quay lại Trang chủ hoặc liên hệ với chúng tôi để được hỗ trợ.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/" className="sm:flex-1">
              <Button variant="primary" size="md" className="w-full shadow-md shadow-primary/20">
                Về Trang Chủ
              </Button>
            </Link>
            <Link href="/lien-he" className="sm:flex-1">
              <Button variant="outline" size="md" className="w-full">
                Liên Hệ Hỗ Trợ
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Shared Footer & Floating Elements */}
      <Footer />
      <FloatingElements />
    </div>
  )
}
