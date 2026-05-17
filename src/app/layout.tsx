import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
})

export const metadata: Metadata = {
  title: 'Bảo Vệ Chuyên Nghiệp – An Toàn Tuyệt Đối | Long Việt Security',
  description:
    'Công Ty Dịch Vụ Bảo Vệ Long Việt chuyên nghiệp, uy tín. Cung cấp dịch vụ bảo vệ nhà máy, tòa nhà, sự kiện, yếu nhân an toàn 100%. Hotline: 0923 840 999.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://baovelongviet.vn'),
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-secondary">
        {children}
      </body>
    </html>
  )
}
