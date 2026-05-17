import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { PageHero } from '@/components/ui/PageHero'
import { StatsSection } from '@/components/sections/StatsSection'
import { Award, Compass, Heart, Users, Network, TrendingUp, Sparkles, Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { getSystemSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Giới Thiệu Về Long Việt Security | An Tâm Tuyệt Đối',
  description: 'Long Việt Security với hơn 15 năm hình thành và phát triển, tự hào sở hữu lực lượng vệ sĩ tinh nhuệ, kỷ luật thép chuẩn quân đội phục vụ hơn 1000 khách hàng.',
  alternates: {
    canonical: '/gioi-thieu',
  },
}

export default async function AboutPage() {
  const settings = await getSystemSettings()
  const pageSubtitle = settings.sub_about || '15 năm kiến tạo niềm tin – Đồng hành bảo vệ an toàn cho hàng nghìn doanh nghiệp'

  // Fetch regional branches
  const branches = await prisma.branch.findMany({
    orderBy: { order: 'asc' },
  })

  const subPages = [
    {
      title: 'Quá Trình Hình Thành',
      desc: 'Hành trình 15 năm bền bỉ xây dựng uy tín từ những ngày đầu lập nghiệp đến nay.',
      href: '/gioi-thieu/qua-trinh-hinh-thanh',
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Cơ Cấu Tổ Chức',
      desc: 'Hệ thống ban điều hành, phòng đào tạo nghiệp vụ và kiểm soát kỷ luật vững mạnh.',
      href: '/gioi-thieu/co-cau-to-chuc',
      icon: <Network className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Tầm Nhìn & Sứ Mệnh',
      desc: 'Định hướng kiến tạo môi trường an toàn tuyệt đối và 4 giá trị cốt lõi uy tín.',
      href: '/gioi-thieu/tam-nhin-su-menh',
      icon: <Compass className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Sự Khác Biệt',
      desc: 'Bảng so sánh chi tiết giữa tự tuyển dụng bảo vệ nội bộ và thuê Long Việt chuyên nghiệp.',
      href: '/gioi-thieu/su-khac-biet',
      icon: <Award className="w-6 h-6 text-primary" />,
    },
  ]

  const certificates = [
    { name: 'Chứng nhận Hệ thống Quản lý Chất lượng ISO 9001:2015', code: 'Cấp bởi Bureau Veritas', img: 'https://images.unsplash.com/photo-1589330694653-ded6df53f7ec?q=80&w=400&auto=format&fit=crop' },
    { name: 'Giấy chứng nhận đủ điều kiện an ninh trật tự', code: 'Cục Cảnh sát QLHC về TTXH', img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=400&auto=format&fit=crop' },
    { name: 'Giấy chứng nhận huấn luyện phòng cháy chữa cháy', code: 'Phòng Cảnh sát PCCC', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=400&auto=format&fit=crop' },
  ]

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Về Chúng Tôi"
        subtitle={pageSubtitle}
      />

      {/* 1. OVERVIEW SECTION */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col: Introduction Text */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary block" />
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Tổng Quan Công Ty</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight leading-tight">
                Lực Lượng Bảo Vệ Tinh Nhuệ – Kỷ Luật Quân Đội
              </h2>
              <div className="space-y-4 text-xs md:text-sm text-gray-400 font-light leading-relaxed">
                <p>
                  Được thành lập từ năm 2009, <strong>Công Ty Dịch Vụ Bảo Vệ Long Việt</strong> đã bền bỉ vượt qua nhiều thử thách để khẳng định vị thế là một trong những nhà cung cấp dịch vụ an ninh hàng đầu tại Việt Nam. Chúng tôi cung cấp các phương án bảo vệ tối ưu cho hàng trăm nhà máy KCN, cao ốc tòa nhà văn phòng, ngân hàng, sự kiện quy mô lớn và cận vệ yếu nhân VIP.
                </p>
                <p>
                  Sự khác biệt vượt trội của Long Việt nằm ở **kỷ luật thép chuẩn quân đội** áp dụng nghiêm ngặt từ khâu tuyển chọn nhân lực đầu vào đến chương trình huấn luyện thể chất và nghiệp vụ thực chiến. Đội ngũ chỉ huy và cố vấn cao cấp của chúng tôi là cựu sĩ quan công an đặc nhiệm và bộ đội xuất ngũ giàu kinh nghiệm tác chiến thực tiễn.
                </p>
                <p>
                  Bên cạnh đó, Long Việt không ngừng tiên phong ứng dụng **công nghệ giám sát thông minh 4.0** (check-in NFC, tuần tra định vị GPS thời gian thực, kết nối camera AI tác chiến trung tâm) và cam kết bảo hiểm trách nhiệm pháp lý 20 tỷ đồng, mang lại sự an tâm tuyệt đối và bảo vệ tối đa lợi ích tài sản của khách hàng.
                </p>
              </div>
            </div>

            {/* Right Col: Graphic & Floating Badges */}
            <div className="relative">
              <div className="relative w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden bg-secondary-light/30 border border-white/10 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
                  alt="Giới thiệu Long Việt Security"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Badges */}
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-5 rounded-3xl shadow-xl shadow-primary/20 flex flex-col items-center justify-center border border-primary-light/15 shrink-0 select-none">
                <span className="font-heading font-extrabold text-3xl leading-none">15+</span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Năm Kinh Nghiệm</span>
              </div>

              <div className="absolute -top-6 -right-6 bg-secondary-light/90 border border-white/10 backdrop-blur-md text-white p-5 rounded-3xl shadow-xl flex flex-col items-center justify-center shrink-0 select-none">
                <span className="font-heading font-extrabold text-3xl text-primary leading-none">2K+</span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1 text-gray-300">Vệ Sĩ Tinh Nhuệ</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (REUSED) */}
      <StatsSection />

      {/* 3. CERTIFICATES SECTION */}
      <section className="py-16 md:py-20 bg-secondary-light/10 border-t border-b border-white/10 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-0.5 bg-primary block" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Chứng Thư Pháp Lý</span>
              <span className="w-3 h-0.5 bg-primary block" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
              Bằng Khen & Chứng Nhận Quốc Tế
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
              Chúng tôi cam kết tuân thủ nghiêm ngặt các quy định pháp luật Việt Nam và đạt chứng chỉ chất lượng dịch vụ chuẩn hóa quốc tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificates.map((cert, idx) => (
              <div
                key={idx}
                className="group bg-secondary-light/30 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 hover:bg-secondary-light/50 transition-all duration-300 flex flex-col shadow-xl shadow-black/10"
              >
                <div className="relative w-full h-48 bg-secondary-dark overflow-hidden">
                  <Image
                    src={cert.img}
                    alt={cert.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent opacity-60" />
                </div>
                <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                  <h4 className="font-bold text-xs md:text-sm text-white group-hover:text-primary transition-colors leading-snug">
                    {cert.name}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-light block uppercase tracking-wider">
                    {cert.code}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. BRANCHES SECTION */}
      <section className="py-16 md:py-24 relative">
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-0.5 bg-primary block" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Mạng Lưới Toàn Quốc</span>
              <span className="w-3 h-0.5 bg-primary block" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
              Hệ Thống Chi Nhánh Trực Thuộc
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
              Mạng lưới hoạt động rộng khắp ba miền, sẵn sàng cung cấp phản ứng nhanh và triển khai lực lượng tức thì.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className={`bg-secondary-light/30 border p-6 rounded-2xl space-y-4 flex flex-col justify-between hover:border-primary/30 hover:bg-secondary-light/50 transition-all duration-300 relative shadow-xl shadow-black/10 ${
                  branch.is_main ? 'border-primary/35 ring-1 ring-primary/25' : 'border-white/10'
                }`}
              >
                {branch.is_main && (
                  <span className="absolute top-4 right-4 text-[9px] font-extrabold bg-primary text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Trụ sở chính
                  </span>
                )}
                
                <div className="space-y-3">
                  <h3 className="font-heading font-bold text-sm md:text-base text-white">
                    {branch.name}
                  </h3>
                  
                  <div className="space-y-2 text-xs text-gray-400 font-light">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <a href={`tel:${branch.phone}`} className="hover:text-primary transition-colors">{branch.phone}</a>
                    </p>
                    {branch.email && (
                      <p className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <a href={`mailto:${branch.email}`} className="hover:text-primary transition-colors">{branch.email}</a>
                      </p>
                    )}
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 border-b border-primary/10 hover:border-primary pb-0.5 w-max pt-4"
                >
                  <span>Xem vị trí bản đồ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. SUB-PAGES NAVIGATION CARDS */}
      <section className="py-16 md:py-20 bg-secondary-light/10 border-t border-white/5">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h2 className="font-heading font-extrabold text-lg md:text-2xl text-white tracking-tight">
              Khám Phá Sâu Hơn Về Long Việt
            </h2>
            <p className="text-xs text-gray-400 font-light leading-relaxed">
              Nhấp vào các mục bên dưới để tìm hiểu về sơ đồ cơ cấu tổ chức, quá trình hình thành lịch sử hoặc sự khác biệt chất lượng của vệ sĩ Long Việt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subPages.map((sub, idx) => (
              <Link
                key={idx}
                href={sub.href}
                className="group bg-secondary-light/20 border border-white/5 hover:border-primary/20 p-6 rounded-2xl space-y-4 flex flex-col justify-between hover:bg-secondary-light/30 transition-all duration-300 text-left"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-200 shrink-0">
                    {sub.icon}
                  </div>
                  <h3 className="font-heading font-bold text-sm md:text-base text-white group-hover:text-primary transition-colors">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">
                    {sub.desc}
                  </p>
                </div>
                
                <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-all pt-2">
                  <span>Tìm hiểu thêm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </main>
  )
}
