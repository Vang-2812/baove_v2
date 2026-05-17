import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingElements } from '@/components/layout/FloatingElements'
import { Analytics } from '@/components/Analytics'
import { getSystemSettings } from '@/lib/settings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSystemSettings()
  const siteName = settings.site_name || 'Long Việt Security'
  const title = settings.meta_title 
    ? `${settings.meta_title} | ${siteName}`
    : `Bảo Vệ Chuyên Nghiệp – An Toàn Tuyệt Đối | ${siteName}`
  const description = settings.meta_description || `Công Ty Dịch Vụ Bảo Vệ ${siteName} chuyên nghiệp, uy tín. Cung cấp dịch vụ bảo vệ nhà máy, tòa nhà, sự kiện, yếu nhân an toàn 100%. Hotline: ${settings.company_hotline || '0923 840 999'}.`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: '/',
      siteName,
      locale: 'vi_VN',
      type: 'website',
    },
  }
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSystemSettings()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dynamic Google Analytics 4 Script */}
      <Analytics />

      {/* Sticky Header component */}
      <Header settings={settings} />

      {/* Main content wrapper */}
      <div className="flex-grow">{children}</div>

      {/* Footer component */}
      <Footer settings={settings} />

      {/* Floating CTA phone/Zalo widgets & back-to-top */}
      <FloatingElements settings={settings} />
    </div>
  )
}
