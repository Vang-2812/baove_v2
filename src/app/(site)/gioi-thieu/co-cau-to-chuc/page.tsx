import * as React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowLeft, ShieldAlert, Award, Users, ChevronRight, UserCheck, Briefcase } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cơ Cấu Tổ Chức Ban Lãnh Đạo | Long Việt Security',
  description: 'Khám phá sơ đồ cơ cấu tổ chức quản lý chặt chẽ của Long Việt Security, từ Ban Giám đốc đến các phòng đào tạo nghiệp vụ và đội cơ động phản ứng nhanh.',
  alternates: {
    canonical: '/gioi-thieu/co-cau-to-chuc',
  },
}

export default function OrgChartPage() {
  const departments = [
    {
      name: 'Ban Đào Tạo Nghiệp Vụ',
      role: 'Đào tạo & Sát hạch quân sự',
      desc: 'Chịu trách nhiệm trực tiếp đào tạo kỹ năng võ thuật cận chiến, nghiệp vụ PCCC, sơ cấp cứu y tế và kỷ luật tác phong tác chiến.',
      icon: <Award className="w-5 h-5 text-primary" />,
    },
    {
      name: 'Phòng Điều Hành & Giám Sát',
      role: 'Giám sát chốt trực 24/7',
      desc: 'Sử dụng hệ thống tuần tra GPS/NFC và camera tác chiến AI để theo dõi trực tuyến chốt gác của vệ sĩ, kiểm tra đột xuất tại hiện trường.',
      icon: <UserCheck className="w-5 h-5 text-primary" />,
    },
    {
      name: 'Lực Lượng Cơ Động SOS',
      role: 'Phản ứng nhanh 24h',
      desc: 'Biên đội cơ động tinh nhuệ, sẵn sàng lên xe phân khối lớn chi viện khẩn cấp xử lý đình công, bạo loạn hay trộm cướp tại chốt trực.',
      icon: <ShieldAlert className="w-5 h-5 text-primary" />,
    },
    {
      name: 'Phòng Kinh Doanh & CSKH',
      role: 'Khảo sát & Lập phương án',
      desc: 'Tiếp nhận yêu cầu của đối tác, chuyên gia an ninh đến khảo sát thực địa mặt bằng và thiết kế phương án bố trí chốt gác tối ưu.',
      icon: <Briefcase className="w-5 h-5 text-primary" />,
    },
  ]

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Cơ Cấu Tổ Chức"
        subtitle="Hệ thống nhân sự chuyên nghiệp – Quản trị chặt chẽ – Vận hành kỷ luật"
      />

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          {/* Back button */}
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Quay lại trang Giới Thiệu</span>
          </Link>

          {/* Org Chart Visualization */}
          <div className="space-y-12">
            
            {/* Level 1: CEO / Board */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-primary to-primary-dark border border-primary/30 p-6 rounded-2xl shadow-xl shadow-primary/10 text-center max-w-sm w-full select-none">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-white bg-black/20 px-3 py-1 rounded-full border border-white/5">
                  Ban Tổng Giám Đốc
                </span>
                <h3 className="font-heading font-extrabold text-lg text-white mt-3">HỘI ĐỒNG QUẢN TRỊ</h3>
                <p className="text-xs text-white/80 font-light mt-1">Đứng đầu bởi các cựu sĩ quan cao cấp & võ sư chuyên nghiệp</p>
              </div>
              
              {/* Vertical connecting line */}
              <div className="w-0.5 h-10 bg-primary/30" />
            </div>

            {/* Level 2: Core Advisory Column */}
            <div className="flex flex-col items-center">
              <div className="bg-secondary-light/30 border border-white/10 p-5 rounded-2xl text-center max-w-xs w-full select-none backdrop-blur-md">
                <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">Hội Đồng Cố Vấn An Ninh</h4>
                <p className="text-[11px] text-gray-400 font-light mt-1">Hợp tác nghiệp vụ cùng Cục Cảnh sát QLHC</p>
              </div>
              
              {/* Vertical connecting line */}
              <div className="w-0.5 h-10 bg-primary/30" />
            </div>

            {/* Level 3: Department Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {departments.map((dept, idx) => (
                <div
                  key={idx}
                  className="group bg-secondary-light/10 border border-white/5 p-6 rounded-2xl space-y-4 hover:border-primary/20 hover:bg-secondary-light/20 transition-all duration-300 relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200 shrink-0">
                      {dept.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-sm md:text-base text-white">
                        {dept.name}
                      </h3>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                        {dept.role}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      {dept.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
