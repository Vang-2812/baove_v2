import * as React from 'react'
import { HeroBanner } from '@/components/sections/HeroBanner'
import { AboutSection } from '@/components/sections/AboutSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { ServiceGrid } from '@/components/sections/ServiceGrid'
import { PricingPreview } from '@/components/sections/PricingPreview'
import { WhyUsSection } from '@/components/sections/WhyUsSection'
import { WorkProcess } from '@/components/sections/WorkProcess'
import { BenefitsTab } from '@/components/sections/BenefitsTab'
import { QuoteSection } from '@/components/sections/QuoteSection'
import { getSystemSettings } from '@/lib/settings'

export default async function HomePage() {
  const settings = await getSystemSettings()

  return (
    <main className="w-full">
      {/* Section 1: Hero Carousel Banner */}
      <HeroBanner settings={settings} />

      {/* Section 2: Về Công Ty / Giới thiệu */}
      <AboutSection settings={settings} />

      {/* Section 3: Con Số Nổi Bật / Scroll count */}
      <StatsSection settings={settings} />

      {/* Section 4: Danh Mục Dịch Vụ Nổi Bật */}
      <ServiceGrid />

      {/* Section 5: Xem Trước Bảng Giá / Dùng thử calculator */}
      <PricingPreview />

      {/* Section 6: Lý Do Chọn Chúng Tôi / 6 key features cards */}
      <WhyUsSection />

      {/* Section 8: Quy Trình Nghiệp Vụ 8 Bước */}
      <WorkProcess />

      {/* Section 9: Cam Kết Lợi Ích Trụ Cột */}
      <BenefitsTab />

      {/* Section 7: Form Báo Giá Nhanh / Online quote request */}
      <QuoteSection />
    </main>
  )
}
