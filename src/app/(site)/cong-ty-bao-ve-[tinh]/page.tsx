import * as React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import { PageHero } from '@/components/ui/PageHero'
import { QuoteSection } from '@/components/sections/QuoteSection'
import { MapPin, Phone, Mail, Award, Shield, CheckCircle2, ChevronRight } from 'lucide-react'

// Dynamic Segment Configuration
export const dynamic = 'force-static'

interface ProvinceData {
  displayName: string
  provinceCode: string
  h1: string
  metaTitle: string
  metaDesc: string
  localContent: string
  highlights: string[]
}

const provinceDataMap: Record<string, ProvinceData> = {
  'tphcm': {
    displayName: 'TP. Hồ Chí Minh',
    provinceCode: 'tphcm',
    h1: 'Dịch Vụ Bảo Vệ Chuyên Nghiệp Tại TP. Hồ Chí Minh',
    metaTitle: 'Công Ty Dịch Vụ Bảo Vệ Uy Tín Tại TPHCM | Long Việt Security',
    metaDesc: 'Dịch vụ bảo vệ uy tín tại TP.HCM. Hơn 15 năm kinh nghiệm, lực lượng tinh nhuệ kỷ luật cao, phản ứng ứng phó 24/7. Khảo sát lên phương án an ninh miễn phí.',
    localContent: 'Tại TP. Hồ Chí Minh, trung tâm kinh tế năng động bậc nhất Việt Nam, nhu cầu bảo vệ an ninh trật tự là cực kỳ quan trọng đối với các nhà máy, tòa nhà văn phòng, trung tâm thương mại và hệ thống ngân hàng. Long Việt Security tự hào là đối tác chiến lược hàng đầu, cung cấp hàng ngàn nhân viên bảo vệ chuyên nghiệp cho các dự án lớn tại Quận 1, Quận 7, TP. Thủ Đức và các khu công nghiệp trọng điểm như KCN Tân Thuận, KCN Linh Trung, KCN Hiệp Phước. Chúng tôi trang bị hệ thống tuần tra thông minh, đội phản ứng nhanh cơ động tuần tra liên tục sẵn sàng giải quyết mọi tình huống mất an toàn chỉ trong vòng 10 phút.',
    highlights: [
      'Lực lượng cơ động phản ứng nhanh ứng cứu dưới 10 phút.',
      '100% bảo vệ có chứng chỉ nghiệp vụ PCCC và sơ cấp cứu y tế.',
      'Cam kết bảo hiểm trách nhiệm pháp lý lên tới 10 tỷ đồng.',
      'Áp dụng công nghệ tuần tra định vị GPS giám sát thời gian thực.'
    ]
  },
  'ha-noi': {
    displayName: 'Hà Nội',
    provinceCode: 'hanoi',
    h1: 'Dịch Vụ Bảo Vệ Uy Tín, Chuyên Nghiệp Tại Hà Nội',
    metaTitle: 'Công Ty Bảo Vệ Chuyên Nghiệp Tại Hà Nội | Long Việt Security',
    metaDesc: 'Dịch vụ bảo vệ chuyên nghiệp tại Hà Nội. Bảo vệ tòa nhà văn phòng, cơ quan ngoại giao, sự kiện lớn và đại sứ quán. Đội ngũ kỷ luật thép chuẩn quân đội.',
    localContent: 'Là trung tâm văn hóa và hành chính của cả nước, Hà Nội đòi hỏi những quy chuẩn an ninh nghiêm ngặt bậc nhất. Long Việt chi nhánh Hà Nội đã phát triển hệ thống bảo vệ nghiêm cẩn phù hợp cho các cơ quan ngoại giao, các tòa tháp chung cư cao cấp và trung tâm thương mại lớn tại Ba Đình, Cầu Giấy, Hoàn Kiếm và Hai Bà Trưng. Đội ngũ vệ sĩ của chúng tôi tại Hà Nội được tuyển chọn kỹ lưỡng, trải qua khóa đào tạo nghiêm ngặt về kỹ năng ứng xử ngoại giao, kiểm soát an ninh nghiêm ngặt và xử lý tình huống khẩn cấp tuyệt đối an toàn.',
    highlights: [
      'Tác phong quân đội nghiêm trang, lịch thiệp chuẩn ngoại giao.',
      'Chuyên môn nghiệp vụ kiểm soát lối vào tòa chung cư cao tầng.',
      'Sẵn sàng cung cấp dịch vụ bảo vệ sự kiện quy mô lớn.',
      'Chính sách đền bù tài sản rõ ràng, cam kết bằng văn bản.'
    ]
  },
  'da-nang': {
    displayName: 'Đà Nẵng',
    provinceCode: 'danang',
    h1: 'Công Ty Bảo Vệ Chuyên Nghiệp Tại Đà Nẵng',
    metaTitle: 'Dịch Vụ Bảo Vệ Uy Tín Tại Đà Nẵng | Long Việt Security',
    metaDesc: 'Công ty bảo vệ uy tín tại Đà Nẵng. Bảo vệ khách sạn, resort nghỉ dưỡng cao cấp, lễ hội du lịch sự kiện. Giải pháp an ninh toàn diện và lịch thiệp.',
    localContent: 'Đà Nẵng là thành phố trung tâm du lịch - dịch vụ lớn của miền Trung. Giải pháp an ninh của Long Việt tại đây tập trung vào sự kết hợp giữa tính an toàn tuyệt đối và thái độ phục vụ khách hàng lịch thiệp, niềm nở. Chúng tôi hiện đang cung cấp dịch vụ cho các chuỗi resort 5 sao dọc biển Mỹ Khê, các tòa nhà căn hộ cao cấp tại Hải Châu, Sơn Trà và Ngũ Hành Sơn. Nhân viên bảo vệ được trang bị kỹ năng ngoại ngữ giao tiếp cơ bản và luôn tận tụy hỗ trợ khách du lịch chu đáo.',
    highlights: [
      'Đội ngũ vệ sĩ thân thiện, giao tiếp tiếng Anh cơ bản.',
      'Kinh nghiệm thực chiến bảo vệ khách sạn, khu nghỉ dưỡng resort 5 sao.',
      'Đội tuần tra đêm liên tục tuần tra bờ biển và an ninh vành đai.',
      'Hỗ trợ đắc lực công tác hướng dẫn phân luồng giao thông sự kiện.'
    ]
  },
  'dong-nai': {
    displayName: 'Đồng Nai',
    provinceCode: 'dongnai',
    h1: 'Dịch Vụ Bảo Vệ Nhà Máy KCN Tại Đồng Nai',
    metaTitle: 'Công Ty Bảo Vệ Tại Đồng Nai | Long Việt Security',
    metaDesc: 'Dịch vụ bảo vệ nhà máy, kho bãi tại Đồng Nai. Hơn 15 năm bảo vệ an ninh khu công nghiệp Amata, Biên Hòa, Nhơn Trạch. Lập phương án an ninh tối ưu.',
    localContent: 'Đồng Nai là thủ phủ công nghiệp lớn với hàng chục KCN quy mô lớn như KCN Amata, KCN Biên Hòa, KCN Nhơn Trạch. Long Việt Security thiết lập giải pháp an ninh chuyên sâu cho nhà máy sản xuất, tổng kho logistics, kiểm soát luồng xe hàng hóa ra vào, phòng ngừa thất thoát vật tư và tuần tra an toàn PCCC nghiêm ngặt. Hệ thống giám sát của chúng tôi giúp giảm thiểu rủi ro nội bộ lên tới 98% cho các chủ đầu tư nước ngoài.',
    highlights: [
      'Kiểm soát cổng xuất nhập hàng hóa nhà máy chặt chẽ.',
      'Đội phản ứng nhanh ứng cứu sự cố lộn xộn nội bộ.',
      'Tuần tra vành đai tường rào nhà xưởng bằng thiết bị chuyên dụng.',
      'Báo cáo tuần tra điện tử định kỳ gửi thẳng ban giám đốc.'
    ]
  },
  'long-an': {
    displayName: 'Long An',
    provinceCode: 'longan',
    h1: 'Dịch Vụ Bảo Vệ Khu Công Nghiệp Tại Long An',
    metaTitle: 'Công Ty Bảo Vệ Uy Tín Tại Long An | Long Việt Security',
    metaDesc: 'Công ty bảo vệ uy tín tại Long An. Chuyên cung cấp bảo vệ nhà xưởng, kho bãi, KCN Đức Hòa, Bến Lức. Phương án tuần tra cơ động 24/7 an toàn.',
    localContent: 'Với vị trí cửa ngõ miền Tây Nam Bộ đón làn sóng chuyển dịch nhà máy lớn, Long An (đặc biệt là Bến Lức, Đức Hòa, Cần Giuộc) có nhu cầu an ninh khu công nghiệp vô cùng mạnh mẽ. Long Việt Security mang đến đội ngũ bảo vệ dày dặn kinh nghiệm thực tế, có thể lập phương án phòng ngừa trộm cắp và phá hoại tài sản nhà xưởng toàn diện. Sự hiện diện của lực lượng vệ sĩ Long Việt là cam kết bảo hộ vững chắc cho sự yên tâm sản xuất của doanh nghiệp.',
    highlights: [
      'Kinh nghiệm thực chiến bảo vệ cụm nhà xưởng KCN Đức Hòa, Bến Lức.',
      'Quy trình kiểm soát công nhân, khách ra vào và nhà thầu nghiêm ngặt.',
      'Phát hiện sớm và ngăn chặn các nguy cơ rò rỉ điện, cháy nổ.',
      'Phối hợp chặt chẽ với lực lượng công an khu vực.'
    ]
  }
}

export async function generateStaticParams() {
  return [
    { tinh: 'tphcm' },
    { tinh: 'ha-noi' },
    { tinh: 'da-nang' },
    { tinh: 'dong-nai' },
    { tinh: 'long-an' },
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ tinh: string }> }): Promise<Metadata> {
  const { tinh } = await params
  const data = provinceDataMap[tinh]

  if (!data) {
    return {
      title: 'Không Tìm Thấy Trang',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baovelongviet.vn'

  return {
    title: data.metaTitle,
    description: data.metaDesc,
    alternates: {
      canonical: `${baseUrl}/cong-ty-bao-ve-${tinh}`,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDesc,
      url: `${baseUrl}/cong-ty-bao-ve-${tinh}`,
      type: 'website',
    },
  }
}

export default async function LocalSeoPage({ params }: { params: Promise<{ tinh: string }> }) {
  const { tinh } = await params
  const data = provinceDataMap[tinh]

  if (!data) {
    notFound()
  }

  // Fetch active services
  const services = await prisma.service.findMany({
    where: { is_active: true },
    orderBy: { order: 'asc' },
    take: 6,
  })

  // Fetch local branch
  let branch = await prisma.branch.findFirst({
    where: {
      province: {
        equals: data.provinceCode,
        mode: 'insensitive',
      },
    },
  })

  if (!branch) {
    // Safe fallback to HQ
    branch = await prisma.branch.findFirst({
      where: { is_main: true },
    })
  }

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title={data.h1}
        subtitle={`Long Việt Security – Giải pháp an ninh tối ưu, an toàn tuyệt đối tại ${data.displayName}`}
      />

      {/* BREADCRUMB BAR */}
      <div className="bg-secondary-light/20 border-b border-white/5 py-4 font-sans text-xs">
        <div className="container mx-auto px-4 max-w-7xl flex items-center gap-2 text-gray-400">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/dich-vu" className="hover:text-primary transition-colors">
            Dịch vụ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-medium">Bảo vệ tại {data.displayName}</span>
        </div>
      </div>

      {/* MAIN LOCAL SEO SECTION */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
            
            {/* Left Col: local SEO content details (65%) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-0.5 bg-primary block" />
                  <span className="text-xs uppercase font-extrabold tracking-widest text-primary">An Tâm Tuyệt Đối</span>
                  <span className="w-3 h-0.5 bg-primary block" />
                </div>
                <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight leading-tight">
                  Công Ty Bảo Vệ Chuyên Nghiệp Hàng Đầu Tại {data.displayName}
                </h2>
                <p className="text-xs md:text-sm text-gray-300 font-light leading-relaxed whitespace-pre-line pt-2">
                  {data.localContent}
                </p>
              </div>

              {/* Highlights block */}
              <div className="bg-secondary-light/10 border border-white/5 p-6 md:p-8 rounded-3xl space-y-6">
                <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Ưu Thế Vượt Trội Của Chúng Tôi</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm text-gray-300 font-light leading-normal">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services block */}
              <div className="space-y-6">
                <h3 className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Dịch Vụ Đang Triển Khai Tại {data.displayName}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service: any) => (
                    <Link
                      key={service.id}
                      href={`/dich-vu/${service.slug}`}
                      className="p-4 bg-secondary-light/10 border border-white/5 rounded-2xl hover:border-primary/20 transition-all flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                          {service.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-light block">
                          Tiêu chuẩn ISO 9001:2015
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: local Branch details & Maps iframe (35%) */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-6">
              {branch && (
                <div className="bg-secondary-light/10 border border-white/5 p-6 rounded-3xl space-y-6">
                  <div className="space-y-2">
                    <span className="text-[9px] font-extrabold bg-primary/20 text-primary-light px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-max">
                      {branch.is_main ? 'Trụ sở chính' : 'Chi nhánh'}
                    </span>
                    <h3 className="font-heading font-bold text-base text-white">
                      {branch.name}
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs text-gray-300 font-light font-sans">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-primary shrink-0" />
                      <a href={`tel:${branch.phone}`} className="hover:text-primary transition-colors">
                        {branch.phone}
                      </a>
                    </div>
                    {branch.email && (
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <a href={`mailto:${branch.email}`} className="hover:text-primary transition-colors">
                          {branch.email}
                        </a>
                      </div>
                    )}
                  </div>

                  {branch.map_embed_url && (
                    <div className="w-full h-64 rounded-2xl overflow-hidden border border-white/5">
                      <iframe
                        src={branch.map_embed_url}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ONLINE QUOTE CTA */}
      <QuoteSection />
    </main>
  )
}
