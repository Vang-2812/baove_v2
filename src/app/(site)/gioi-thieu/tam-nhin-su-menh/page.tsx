import * as React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowLeft, Target, Heart, Shield, Sparkles, UserCheck, Flame } from 'lucide-react'

import { getSystemSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Tầm Nhìn Sứ Mệnh & Giá Trị Cốt Lõi | Long Việt Security',
  description: 'Khám phá tầm nhìn chiến lược, sứ mệnh bảo vệ an tâm và 4 giá trị cốt lõi làm nên uy tín hàng đầu của Công Ty Dịch Vụ Bảo Vệ Long Việt.',
  alternates: {
    canonical: '/gioi-thieu/tam-nhin-su-menh',
  },
}

export default async function MissionPage() {
  const settings = await getSystemSettings()
  const pageSubtitle = settings.sub_vision || 'Kim chỉ nam dẫn lối mọi hành động của tập thể cán bộ chiến sĩ Long Việt Security'

  const coreValues = [
    {
      title: 'Uy Tín Vàng',
      desc: 'Nói đi đôi với làm, luôn thực thi cam kết an ninh chuẩn mực trong hợp đồng pháp lý, đền bù tổn thất trung thực.',
      icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
    },
    {
      title: 'Tận Tâm Phục Vụ',
      desc: 'Xem tài sản và sự an toàn của khách hàng như chính của bản thân, đón tiếp cư dân lịch thiệp, lễ phép.',
      icon: <Heart className="w-5 h-5 text-rose-500" />,
    },
    {
      title: 'Kỷ Luật Thép',
      desc: 'Vệ sĩ tuân thủ nghiêm ngặt tác phong điều lệnh quân ngũ, tuyệt đối không ngủ gật, bỏ chốt trực gác.',
      icon: <Shield className="w-5 h-5 text-primary" />,
    },
    {
      title: 'Tiên Phong Công Nghệ',
      desc: 'Không ngừng nghiên cứu và ứng dụng công nghệ giám sát NFC/GPS trực tuyến hiện đại bậc nhất.',
      icon: <UserCheck className="w-5 h-5 text-emerald-500" />,
    },
  ]

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Tầm Nhìn & Sứ Mệnh"
        subtitle={pageSubtitle}
      />

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          
          {/* Back button */}
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Quay lại trang Giới Thiệu</span>
          </Link>

          <div className="space-y-16">
            
            {/* 1. VISION SECTION */}
            <div className="bg-secondary-light/30 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 backdrop-blur-md shadow-xl shadow-black/10">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-lg shadow-primary/5 border border-primary/10">
                <Target className="w-10 h-10 animate-spin-slow" />
              </div>
              <div className="space-y-3">
                <h3 className="font-heading font-extrabold text-lg md:text-xl text-white uppercase tracking-wider">
                  Tầm Nhìn Chiến Lược
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light">
                  Định hướng đến năm 2030, **Long Việt Security** quyết tâm vươn mình trở thành biểu tượng niềm tin hàng đầu của ngành dịch vụ bảo vệ tại Việt Nam. Chúng tôi cam kết không ngừng số hóa nghiệp vụ để trở thành doanh nghiệp an ninh công nghệ cao, chuyên nghiệp, bảo vệ bình an tuyệt đối cho sự phát triển vững mạnh của quý khách hàng.
                </p>
              </div>
            </div>

            {/* 2. MISSION SECTION */}
            <div className="bg-secondary-light/30 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row-reverse items-center gap-8 backdrop-blur-md shadow-xl shadow-black/10">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-lg shadow-primary/5 border border-primary/10">
                <Heart className="w-10 h-10 animate-pulse text-rose-500" />
              </div>
              <div className="space-y-3">
                <h3 className="font-heading font-extrabold text-lg md:text-xl text-white uppercase tracking-wider">
                  Sứ Mệnh Bảo Vệ Bình An
                </h3>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light">
                  Sứ mệnh thiêng liêng của tập thể Long Việt là **"Đồng hành bảo vệ giấc ngủ bình an, bảo toàn nguyên vẹn giá trị tài sản"** cho mọi đối tác. Mỗi ca trực, mỗi bước đi tuần của chiến sĩ vệ sĩ đều mang nặng trách nhiệm gìn giữ trật tự xã hội, đem lại niềm vui và sự an tâm tuyệt đối cho cán bộ công nhân viên và cư dân đô thị.
                </p>
              </div>
            </div>

            {/* 3. CORE VALUES SECTION */}
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h3 className="font-heading font-extrabold text-lg md:text-2xl text-white uppercase tracking-wider">
                  4 Giá Trị Cốt Lõi Vàng
                </h3>
                <p className="text-xs text-gray-400 font-light">
                  Những giá trị cốt lõi định hình nên uy tín cao cấp và tính kỷ luật mẫu mực của người chiến sĩ vệ sĩ Long Việt.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {coreValues.map((val, idx) => (
                  <div
                    key={idx}
                    className="group bg-secondary-light/30 border border-white/10 p-6 rounded-2xl space-y-4 hover:border-primary/30 hover:bg-secondary-light/50 transition-all duration-300 shadow-xl shadow-black/10"
                  >
                    <div className="w-10 h-10 bg-secondary-light/20 rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                      {val.icon}
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-heading font-bold text-sm md:text-base text-white group-hover:text-primary transition-colors">
                        {val.title}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        {val.desc}
                      </p>
                    </div>
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
