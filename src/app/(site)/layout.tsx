import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingElements } from '@/components/layout/FloatingElements'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  title: 'Bảo Vệ Chuyên Nghiệp – An Toàn Tuyệt Đối | Long Việt Security',
  description:
    'Công Ty Dịch Vụ Bảo Vệ Long Việt chuyên nghiệp, uy tín. Cung cấp dịch vụ bảo vệ nhà máy, tòa nhà, sự kiện, yếu nhân an toàn 100%. Hotline: 0923 840 999.',
  openGraph: {
    title: 'Bảo Vệ Chuyên Nghiệp – An Toàn Tuyệt Đối | Long Việt Security',
    description:
      'Công Ty Dịch Vụ Bảo Vệ Long Việt chuyên nghiệp, uy tín. Cung cấp dịch vụ bảo vệ nhà máy, tòa nhà, sự kiện, yếu nhân an toàn 100%. Hotline: 0923 840 999.',
    url: '/',
    siteName: 'Long Việt Security',
    locale: 'vi_VN',
    type: 'website',
  },
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Google Analytics 4 Script */}
      <Analytics />

      {/* Sticky Header component */}
      <Header />

      {/* Main content wrapper */}
      <div className="flex-grow">{children}</div>

      {/* Footer component */}
      <Footer />

      {/* Floating CTA phone/Zalo widgets & back-to-top */}
      <FloatingElements />
    </div>
  )
}
