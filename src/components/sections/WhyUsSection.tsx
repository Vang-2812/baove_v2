'use client'

import * as React from 'react'
import { Users, Award, Cpu, ShieldAlert, Zap, ClipboardCheck } from 'lucide-react'

export function WhyUsSection() {
  const reasons = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: 'Đội ngũ tinh nhuệ',
      desc: '100% tuyển chọn khắt khe, ưu tiên bộ đội, công an xuất ngũ có kỷ luật thép.',
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: 'Đào tạo chuyên sâu',
      desc: 'Huấn luyện nghiệp vụ võ thuật, kỹ năng PCCC, sơ cấp cứu chuyên nghiệp.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      title: 'Quản lý công nghệ',
      desc: 'Tích hợp camera giám sát AI và định vị tuần tra GPS thời gian thực.',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-primary" />,
      title: 'Bảo hiểm đền bù 100%',
      desc: 'Trang bị gói bảo hiểm trách nhiệm dân sự lên đến 20 tỷ đồng cho mọi rủi ro.',
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: 'Đội phản ứng nhanh 24/7',
      desc: 'Lực lượng cơ động tuần tra sẵn sàng giải cứu, chi viện trong tình huống khẩn cấp.',
    },
    {
      icon: <ClipboardCheck className="w-6 h-6 text-primary" />,
      title: 'Quy trình bài bản',
      desc: 'Báo cáo điện tử chi tiết hàng ngày, kiểm soát chất lượng từ xa nghiêm ngặt.',
    },
  ]

  return (
    <section className="py-20 bg-bg-light overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary mb-3 block">
            Tại Sao Chọn Long Việt?
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary leading-tight tracking-tight">
            Sự Khác Biệt Làm Nên Uy Tín Hàng Đầu Của Chúng Tôi
          </h2>
          <p className="text-body text-text-muted mt-4">
            Chúng tôi cam kết mang lại giải pháp an ninh chất lượng cao nhất nhờ sự kết hợp giữa con người tinh nhuệ và công nghệ hiện đại.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 p-8 rounded-2xl shadow-card card-hover flex flex-col gap-5 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="text-h4 font-bold text-secondary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
