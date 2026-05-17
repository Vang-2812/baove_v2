import * as React from 'react'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { PageHero } from '@/components/ui/PageHero'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { QuoteSection } from '@/components/sections/QuoteSection'

import { getSystemSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Dịch Vụ Bảo Vệ Chuyên Nghiệp | Long Việt Security',
  description: '12 loại dịch vụ bảo vệ chuyên nghiệp trọn gói: nhà máy, tòa nhà, ngân hàng, sự kiện... Đội ngũ kỷ luật, an toàn tuyệt đối. Báo giá miễn phí: 0923 840 999.',
  alternates: {
    canonical: 'https://baovelongviet.vn/dich-vu',
  },
}

export default async function ServicesPage() {
  const settings = await getSystemSettings()
  const pageSubtitle = settings.sub_services || 'Giải pháp an ninh toàn diện, tinh nhuệ và an toàn tuyệt đối cho mọi nhu cầu khách hàng trên toàn quốc.'

  // Fetch active services directly from database
  const services = await prisma.service.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      order: 'asc',
    },
  })

  const breadcrumb = [
    { label: 'Dịch Vụ' }
  ]

  return (
    <div className="bg-secondary-dark min-h-screen">
      <PageHero
        title="Dịch Vụ Bảo Vệ Chuyên Nghiệp"
        subtitle={pageSubtitle}
        breadcrumb={breadcrumb}
      />

      <section className="py-20 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight">
              Danh Mục Dịch Vụ An Ninh
            </h2>
            <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed">
              Long Việt Security cung cấp đầy đủ 12 loại hình dịch vụ bảo vệ, từ tuần tra an ninh cơ bản đến hộ tống đặc biệt và cận vệ cao cấp.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Reusable Quote Section */}
      <QuoteSection />
    </div>
  )
}
