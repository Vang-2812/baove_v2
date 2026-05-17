'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ShieldCheck, Award, Briefcase, Zap } from 'lucide-react'

export interface AboutSectionProps {
  settings?: Record<string, any>
}

export function AboutSection({ settings = {} }: AboutSectionProps) {
  const siteName = settings.site_name || 'Long Việt Security'
  const siteNameFirst = siteName.split(' ')[0] || 'Long Việt'
  const expYears = settings.stat_years || '15'
  
  const aboutTitle = settings.home_about_title || 'Hành Trình Hơn 15 Năm Kiến Tạo Niềm Tin & Sự An Toàn Tuyệt Đối'
  const aboutLead = settings.home_about_lead || 'Thành lập từ năm 2009, Công Ty Dịch Vụ Bảo Vệ Long Việt đã khẳng định vị thế là một trong những doanh nghiệp cung cấp giải pháp an ninh chuyên nghiệp hàng đầu Việt Nam.'
  const aboutBody = settings.home_about_body || 'Chúng tôi không chỉ cung cấp dịch vụ bảo vệ đơn thuần mà mang đến giải pháp an ninh toàn diện được may đo phù hợp theo từng quy mô và nhu cầu cụ thể của doanh nghiệp, giúp bạn hoàn toàn an tâm tập trung sản xuất, kinh doanh.'

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Stylized Visual Representation */}
          <div className="lg:col-span-5 relative w-full h-[400px] sm:h-[500px]">
            {/* Main Image */}
            <div className="relative w-[90%] h-[90%] rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
                alt={`${siteName} corporate scale`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-secondary/10" />
            </div>

            {/* Overlapping Badge Card (Glassmorphic) */}
            <div className="absolute bottom-0 right-0 w-60 bg-white/90 backdrop-blur-md border border-gray-200/50 p-5 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce duration-1000">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-secondary leading-none">{expYears}+ Năm</span>
                <span className="text-xs text-text-muted mt-1 font-medium">Kinh Nghiệm Thực Chiến</span>
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10" />
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Section Header */}
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Giới Thiệu {siteNameFirst}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6 leading-tight tracking-tight">
              {aboutTitle}
            </h2>

            {/* Lead text */}
            <p className="text-body font-semibold text-secondary mb-4 leading-relaxed">
              {aboutLead}
            </p>

            {/* Body copy */}
            <p className="text-body text-text-muted mb-8 leading-relaxed">
              {aboutBody}
            </p>

            {/* Core Pillars list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-secondary">Pháp lý đầy đủ</h4>
                  <p className="text-xs text-text-muted mt-0.5">Đầy đủ chứng chỉ hành nghề và bảo hiểm dân sự.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-secondary">Vệ sĩ tinh nhuệ</h4>
                  <p className="text-xs text-text-muted mt-0.5">Xuất thân bộ đội, công an xuất ngũ được tái đào tạo bài bản.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 col-span-1 sm:col-span-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-secondary">Phản ứng khẩn cấp 24/7</h4>
                  <p className="text-xs text-text-muted mt-0.5">Đội phản ứng nhanh cơ động xử lý kịp thời mọi tình huống đột xuất trong vòng 15-30 phút.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <Link href="/gioi-thieu">
                <Button variant="outline" size="md" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                  Xem Thêm Về Chúng Tôi
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
