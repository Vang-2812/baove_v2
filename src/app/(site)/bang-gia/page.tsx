import * as React from 'react'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { PageHero } from '@/components/ui/PageHero'
import { PricingCalculator } from '@/components/pricing/PricingCalculator'
import { QuoteSection } from '@/components/sections/QuoteSection'

export const metadata: Metadata = {
  title: 'Bảng Giá Dịch Vụ Bảo Vệ Chuyên Nghiệp | Long Việt Security',
  description: 'Tra cứu bảng giá dịch vụ bảo vệ chuyên nghiệp 2026. Công cụ tính toán chi phí bảo vệ tự động theo số chốt, ca trực. Hotline nhận báo giá chi tiết: 0923 840 999.',
  alternates: {
    canonical: 'https://baovelongviet.vn/bang-gia',
  },
}

export default async function PricingPage() {
  // Fetch active services directly from the database to populate the calculator dropdown & comparison table
  const services = await prisma.service.findMany({
    where: {
      is_active: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      price_min: true,
      price_max: true,
      price_unit: true,
      description: true,
      icon: true,
    },
    orderBy: {
      order: 'asc',
    },
  })

  const breadcrumb = [
    { label: 'Bảng Giá' }
  ]

  return (
    <div className="bg-secondary-dark min-h-screen">
      <PageHero
        title="Bảng Giá Dịch Vụ Bảo Vệ"
        subtitle="Tra cứu bảng giá dịch vụ bảo vệ chuyên nghiệp và ước lượng chi phí thuê bảo vệ nhanh chóng nhất."
        breadcrumb={breadcrumb}
      />

      <section className="py-20 relative overflow-hidden">
        {/* Decorative lighting */}
        <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <PricingCalculator services={services} />
        </div>
      </section>

      {/* Reusable Quote Section */}
      <QuoteSection />
    </div>
  )
}
