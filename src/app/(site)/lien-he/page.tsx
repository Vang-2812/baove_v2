import * as React from 'react'
import { Metadata } from 'next'
import { PageHero } from '@/components/ui/PageHero'
import { QuoteFormInline } from '@/components/forms/QuoteFormInline'
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake } from 'lucide-react'

import { getSystemSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Liên Hệ Long Việt Security | Khảo Sát Phương Án 24/7',
  description: 'Liên hệ ngay với Long Việt Security qua Hotline: 0923 840 999 để nhận tư vấn và khảo sát phương án bảo vệ miễn phí trên toàn quốc.',
  alternates: {
    canonical: '/lien-he',
  },
}

export default async function ContactPage() {
  const settings = await getSystemSettings()
  
  const pageSubtitle = settings.sub_contact || 'Hệ thống chi nhánh hỗ trợ toàn quốc – Luôn sẵn sàng lắng nghe và bảo vệ bạn 24/7'
  const address = settings.company_address || 'B23, Khu dân cư Nam Long, Phường Thạnh Lộc, Quận 12, TP. Hồ Chí Minh'
  const hotline = settings.company_hotline || '0923 840 999'
  const email = settings.company_email || 'info@baovelongviet.vn'

  const contactInfo = [
    {
      title: 'Trụ Sở Chính (TP.HCM)',
      desc: address,
      icon: <MapPin className="w-5 h-5 text-primary" />,
    },
    {
      title: 'Đường Dây Nóng 24/7',
      desc: `Hotline: ${hotline}`,
      icon: <Phone className="w-5 h-5 text-primary" />,
    },
    {
      title: 'Hòm Thư Điện Tử',
      desc: email,
      icon: <Mail className="w-5 h-5 text-primary" />,
    },
    {
      title: 'Thời Gian Làm Việc',
      desc: 'Hành chính: 08:00 - 17:00 (Thứ 2 - Thứ 7). Đội SOS trực ứng cứu: 24/7/365.',
      icon: <Clock className="w-5 h-5 text-primary" />,
    },
  ]

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Liên Hệ Với Chúng Tôi"
        subtitle={pageSubtitle}
      />

      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Decorative blur rings */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN: CONTACT DETAILS */}
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-primary block" />
                  <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Thông Tin Liên Hệ</span>
                </div>
                <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight leading-tight">
                  Long Việt Sẵn Sàng Kết Nối
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
                  Đừng ngần ngại liên hệ với chúng tôi để nhận khảo sát thực địa lỗ hổng an ninh miễn phí hoặc yêu cầu tư vấn phương án cắt giảm chi phí bảo vệ tối ưu.
                </p>
              </div>

              {/* Info cards list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, idx) => (
                  <div
                    key={idx}
                    className="bg-secondary-light/30 border border-white/10 p-6 rounded-2xl space-y-3 hover:border-primary/30 hover:bg-secondary-light/50 transition-all duration-300 backdrop-blur-md shadow-xl shadow-black/10"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      {info.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading font-bold text-xs md:text-sm text-white">{info.title}</h4>
                      <p className="text-xs text-gray-400 font-light leading-relaxed">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[300px] bg-secondary-light/30 relative">
                <iframe
                  src="https://www.google.com/maps?q=B23+KDC+Nam+Long,Thạnh+Lộc,Quận+12,TP.Hồ+Chí+Minh&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: CONSULTATION FORM CONTAINER */}
            <div className="bg-secondary-light/40 border border-white/10 p-6 md:p-10 rounded-3xl backdrop-blur-md shadow-2xl relative shadow-xl shadow-black/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="space-y-4 mb-8">
                <h3 className="font-heading font-extrabold text-lg md:text-xl text-white">Yêu Cầu Khảo Sát & Báo Giá</h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Hãy điền đầy đủ các thông tin bên dưới, chuyên gia tư vấn an ninh của chúng tôi sẽ gọi điện lại cho bạn trong vòng 15 phút.
                </p>
              </div>

              <QuoteFormInline source="contact_page" isDark />
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
