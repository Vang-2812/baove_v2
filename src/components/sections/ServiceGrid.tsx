import * as React from 'react'
import Link from 'next/link'
import prisma from '@/lib/db'
import { ArrowRight } from 'lucide-react'
import { ServiceGridTabs } from '@/components/sections/ServiceGridTabs'

export async function ServiceGrid() {
  // Fetch active services directly from database
  const services = await prisma.service.findMany({
    where: {
      is_active: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      image: true,
      icon: true,
      price_min: true,
      price_max: true,
      price_unit: true,
      order: true,
    },
    orderBy: {
      order: 'asc',
    },
  })

  return (
    <section id="services-grid" className="py-20 md:py-24 bg-secondary-dark relative overflow-hidden border-b border-white/5 text-left">
      {/* Glow decorative element */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary block" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Dịch Vụ An Ninh</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
              Giải Pháp Bảo Vệ Chuyên Nghiệp
            </h2>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Long Việt Security cung cấp đa dạng các gói dịch vụ bảo vệ tinh nhuệ, kỷ luật và ứng dụng công nghệ hiện đại, đáp ứng tối đa nhu cầu an ninh của khách hàng.
            </p>
          </div>
          <Link
            href="/dich-vu"
            className="text-xs md:text-sm font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1.5 shrink-0 self-start md:self-end border-b border-primary/20 hover:border-primary pb-1"
          >
            <span>Tất cả dịch vụ</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tab & Grid (Delegated to Client Component for reactive filtering) */}
        <ServiceGridTabs services={services} />

      </div>
    </section>
  )
}
