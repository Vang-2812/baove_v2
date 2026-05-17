import * as React from 'react'
import Image from 'next/image'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { PageHero } from '@/components/ui/PageHero'
import { PartnerForm } from '@/components/forms/PartnerForm'
import { Handshake, TrendingUp, ShieldAlert, Sparkles, Building } from 'lucide-react'

import { getSystemSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Hợp Tác Phát Triển | Long Việt Security',
  description: 'Liên kết hợp tác cùng Long Việt Security để xây dựng chuỗi giải pháp an ninh toàn diện, chia sẻ cơ hội kinh doanh và tối đa hóa giá trị cho khách hàng.',
  alternates: {
    canonical: '/hop-tac',
  },
}

export default async function CooperationPage() {
  const settings = await getSystemSettings()
  const pageSubtitle = settings.sub_partnership || 'Hợp tác liên kết bền vững – Cộng hưởng giá trị – Kiến tạo an tâm'

  // Fetch active partners
  const partners = await prisma.partner.findMany({
    where: {
      is_active: true,
    },
    orderBy: {
      order: 'asc',
    },
  })

  const benefits = [
    {
      title: 'Gia Tăng Uy Tín Thương Hiệu',
      desc: 'Được liên kết với thương hiệu Long Việt Security uy tín hàng đầu với hơn 15 năm kinh nghiệm phục vụ các tập đoàn lớn.',
      icon: <Sparkles className="w-5 h-5 text-primary" />,
    },
    {
      title: 'Chia Sẻ Cơ Hội Kinh Doanh',
      desc: 'Chia sẻ lượng khách hàng khổng lồ từ các dự án nhà máy, tòa nhà chung cư, ngân hàng trên toàn lãnh thổ Việt Nam.',
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
    },
    {
      title: 'Hỗ Trợ Kỹ Thuật & Nghiệp Vụ',
      desc: 'Được chuyển giao công nghệ tuần tra GPS/NFC, quy chuẩn an ninh PCCC hiện đại và đào tạo nghiệp vụ vệ sĩ chất lượng cao.',
      icon: <Building className="w-5 h-5 text-primary" />,
    },
  ]

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Hợp Tác Cùng Long Việt"
        subtitle={pageSubtitle}
      />

      {/* 1. BENEFITS SECTION */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-0.5 bg-primary block" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Cộng Hưởng Giá Trị</span>
              <span className="w-3 h-0.5 bg-primary block" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
              Lợi Ích Khi Trở Thành Đối Tác
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
              Chúng tôi luôn mở rộng cơ hội liên kết phát triển cùng các nhà phân phối thiết bị an ninh, nhà thầu xây dựng và đơn vị quản lý vận hành tòa nhà.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="group bg-secondary-light/30 border border-white/10 p-8 rounded-3xl space-y-4 hover:border-primary/30 hover:bg-secondary-light/50 transition-all duration-300 backdrop-blur-md shadow-xl shadow-black/10"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200 shrink-0">
                  {benefit.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm md:text-base text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 2. REGISTRATION FORM & PARTNER LOGOS SPLIT LAYOUT */}
      <section className="py-16 md:py-24 bg-secondary-light/5 border-t border-white/5 relative">
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
            
            {/* Left Column: Form */}
            <div>
              <PartnerForm />
            </div>

            {/* Right Column: Existing Partners Grid */}
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-primary block" />
                  <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Mạng Lưới Đối Tác</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl md:text-2xl text-white tracking-tight">
                  Các Đối Tác Đang Đồng Hành
                </h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Long Việt Security tự hào là đối tác chiến lược tin cậy được lựa chọn đồng hành bởi hàng loạt tập đoàn, ngân hàng và nhà máy lớn tại Việt Nam.
                </p>
              </div>

              {/* Grid of partner logos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {partners.map((partner: any) => (
                  <div
                    key={partner.id}
                    className="group bg-secondary-light/30 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:border-primary/30 hover:bg-secondary-light/50 transition-all duration-300 h-24 relative overflow-hidden shadow-md shadow-black/10"
                  >
                    {partner.logo ? (
                      <div className="relative w-full h-12 grayscale group-hover:grayscale-0 transition-all duration-300">
                        <Image
                          src={partner.logo}
                          alt={partner.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-white font-bold">{partner.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
