import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import { PageHero } from '@/components/ui/PageHero'
import { Calendar, ArrowLeft, Award, Sparkles } from 'lucide-react'

import { getSystemSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Quá Trình Hình Thành & Lịch Sử | Long Việt Security',
  description: 'Hành trình 15 năm hình thành và phát triển bền bỉ xây dựng niềm tin của Long Việt Security từ năm 2009 đến nay.',
  alternates: {
    canonical: '/gioi-thieu/qua-trinh-hinh-thanh',
  },
}

export default async function HistoryPage() {
  const settings = await getSystemSettings()
  const pageSubtitle = settings.sub_history || 'Hành trình 15 năm vượt qua thử thách – Khẳng định vị thế uy tín hàng đầu'

  const milestones = [
    {
      year: '2009',
      title: 'Khởi đầu lập nghiệp',
      desc: 'Công Ty Dịch Vụ Bảo Vệ Long Việt chính thức được thành lập tại TP.HCM với quân số ban đầu chỉ 50 chiến sĩ vệ sĩ, trực gác tại các văn phòng, showroom nhỏ.',
      img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&auto=format&fit=crop',
    },
    {
      year: '2012',
      title: 'Mở rộng chi nhánh Long An & Bình Dương',
      desc: 'Nhận thấy sự bùng nổ của các khu công nghiệp phía Nam, Long Việt tiên phong cung cấp dịch vụ bảo vệ nhà máy KCN quy mô lớn, tăng tổng quân số lên hơn 500 vệ sĩ.',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop',
    },
    {
      year: '2015',
      title: 'Đạt chứng nhận quản lý chất lượng ISO 9001',
      desc: 'Chuẩn hóa toàn bộ quy trình nghiệp vụ huấn luyện, lập phương án an ninh và trực chỉ huy, giúp Long Việt thắng thầu hàng loạt dự án cao ốc văn phòng hạng A.',
      img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=400&auto=format&fit=crop',
    },
    {
      year: '2018',
      title: 'Thành lập Chi nhánh Đà Nẵng',
      desc: 'Chính thức vươn mạng lưới hoạt động ra khu vực Miền Trung, thiết lập tổng hành dinh chi nhánh Đà Nẵng phục vụ các khu du lịch nghỉ dưỡng lớn.',
      img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=400&auto=format&fit=crop',
    },
    {
      year: '2021',
      title: 'Số hóa tuần tra & Thành lập Chi nhánh Hà Nội',
      desc: 'Tiên phong trang bị thiết bị NFC trực tuyến và phần mềm tuần tra định vị GPS. Đồng thời thành lập chi nhánh Hà Nội hoàn thiện mạng lưới phủ khắp 3 miền đất nước.',
      img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop',
    },
    {
      year: '2024',
      title: 'Quy mô hơn 2000 cán bộ chiến sĩ',
      desc: 'Long Việt tự hào là một trong những nhà cung cấp dịch vụ bảo vệ uy tín bậc nhất, sở hữu lực lượng vệ sĩ kỷ luật cao, cam kết đền bù tổn thất tài sản lên tới 20 tỷ đồng.',
      img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400&auto=format&fit=crop',
    },
  ]

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Quá Trình Hình Thành"
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

          {/* Timeline Wrapper */}
          <div className="relative border-l-2 border-primary/20 md:border-l-0 md:before:absolute md:before:top-0 md:before:bottom-0 md:before:left-1/2 md:before:w-0.5 md:before:bg-primary/20 space-y-12 md:space-y-16 pl-6 md:pl-0">
            {milestones.map((item, idx) => {
              const isEven = idx % 2 === 0
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row md:justify-between items-start md:items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot Indicator */}
                  <div className="absolute top-1.5 left-[-31px] md:left-1/2 md:translate-x-[-8px] w-4 h-4 bg-primary border-4 border-secondary-dark rounded-full z-20 shadow-lg shadow-primary/30" />

                  {/* Year Tag Column */}
                  <div className={`w-full md:w-[45%] text-left ${isEven ? 'md:text-left' : 'md:text-right'} mb-4 md:mb-0`}>
                    <span className="font-heading font-extrabold text-2xl md:text-4xl text-primary drop-shadow-[0_0_20px_rgba(235,53,60,0.15)] leading-none select-none">
                      {item.year}
                    </span>
                  </div>

                  {/* Content Card Column */}
                  <div className="w-full md:w-[45%] bg-secondary-light/10 border border-white/5 p-6 rounded-2xl space-y-4 hover:border-primary/20 transition-all duration-300 backdrop-blur-md">
                    {item.img && (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-secondary-dark border border-white/5">
                        <Image
                          src={item.img}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h3 className="font-heading font-bold text-sm md:text-base text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>
    </main>
  )
}
