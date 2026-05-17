'use client'

import * as React from 'react'
import { QuoteFormInline } from '@/components/forms/QuoteFormInline'
import { Phone, Shield, Mail, CheckCircle2 } from 'lucide-react'

export function QuoteSection() {
  const benefits = [
    'Khảo sát thực địa và lập phương án an ninh hoàn toàn miễn phí.',
    'Báo giá cạnh tranh, rõ ràng, không phát sinh chi phí ẩn.',
    'Cam kết bảo mật thông tin dự án tuyệt đối.',
    'Hỗ trợ phản hồi phương án sơ bộ trong vòng 2 giờ.',
  ]

  return (
    <section id="quote-form" className="relative py-24 bg-white overflow-hidden scroll-mt-10">
      
      {/* Decorative styling bubble on background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Value Proposition & Marketing Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Shield Icon Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary-light rounded-full text-xs font-bold uppercase tracking-wider mb-6 w-fit">
              <Shield className="w-3.5 h-3.5" /> Báo Giá Trực Tuyến
            </div>

            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-secondary leading-tight tracking-tight mb-4">
              Yêu Cầu Khảo Sát & Nhận Báo Giá Miễn Phí
            </h2>

            <p className="text-body text-text-muted mb-8 max-w-lg leading-relaxed">
              Hãy mô tả sơ bộ nhu cầu của doanh nghiệp. Đội ngũ chuyên viên an ninh của Long Việt Security sẽ liên hệ để khảo sát thực tế và lên thiết kế phương án tối ưu nhất.
            </p>

            {/* Benefits Checklist */}
            <div className="flex flex-col gap-3.5 mb-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-secondary leading-relaxed">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Contact Lines */}
            <div className="flex flex-col sm:flex-row gap-6 border-t border-gray-100 pt-8 mt-2">
              <a
                href="tel:0923840999"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-200">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase font-bold leading-none">Hotline khẩn cấp</span>
                  <span className="text-base font-bold text-secondary group-hover:text-primary transition-colors mt-1 leading-none">
                    0923 840 999
                  </span>
                </div>
              </a>

              <a
                href="mailto:info@baovelongviet.vn"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center text-secondary group-hover:scale-105 transition-transform duration-200">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-text-muted uppercase font-bold leading-none">Email liên hệ</span>
                  <span className="text-base font-bold text-secondary group-hover:text-primary transition-colors mt-1 leading-none">
                    info@baovelongviet.vn
                  </span>
                </div>
              </a>
            </div>

          </div>

          {/* Right Column: Quote Form inside Card */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-gray-100 p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden">
              {/* Highlight header colored bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
              
              <h3 className="text-h3 font-heading font-bold text-secondary mb-1">
                Gửi yêu cầu báo giá
              </h3>
              <p className="text-xs text-text-muted mb-6">
                Vui lòng điền đầy đủ các trường thông tin có dấu (*)
              </p>

              <QuoteFormInline source="homepage_section" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
