import * as React from 'react'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { PageHero } from '@/components/ui/PageHero'
import { JobBoard } from '@/components/recruitment/JobBoard'
import { Trophy, Gift, HeartPulse, Award, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react'

import { getSystemSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Tuyển Dụng Nhân Viên Bảo Vệ Lương Cao | Long Việt Security',
  description: 'Tuyển dụng nhân viên bảo vệ, vệ sĩ trên toàn quốc. Lương 8-25 triệu/tháng, đóng BHXH đầy đủ, miễn phí nhà ở nội trú, hỗ trợ đào tạo nghiệp vụ. Ứng tuyển ngay!',
  alternates: {
    canonical: '/tuyen-dung',
  },
}

export default async function RecruitmentPage() {
  const settings = await getSystemSettings()
  const pageSubtitle = settings.sub_recruitment || 'Gia nhập lực lượng vệ sĩ Long Việt – Thu nhập ổn định – Tương lai vững vàng'

  // Fetch active jobs (status=OPEN)
  const jobs = await prisma.job.findMany({
    where: {
      status: 'OPEN',
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  const benefits = [
    {
      title: 'Thu Nhập Lương Thưởng Hấp Dẫn',
      desc: 'Mức lương cạnh tranh từ 8 - 25 triệu/tháng (tùy vị trí), phụ cấp tăng ca, thưởng chuyên cần, lương tháng 13 đầy đủ.',
      icon: <Trophy className="w-5 h-5 text-primary" />,
    },
    {
      title: 'Hỗ Trợ Nhà Ở Nội Trú Miễn Phí',
      desc: 'Hỗ trợ chỗ ở nội trú khang trang gần mục tiêu làm việc cho nhân viên ở xa, hỗ trợ tạm ứng tiền ăn hàng tuần.',
      icon: <Gift className="w-5 h-5 text-primary" />,
    },
    {
      title: 'Bảo Hiểm & Chế Độ Phúc Lợi Đầy Đủ',
      desc: 'Tham gia đóng bảo hiểm xã hội BHXH, BHYT, BHTN và bảo hiểm tai nạn 24/7 ngay từ đầu, tặng quà hiếu hỉ, ốm đau.',
      icon: <HeartPulse className="w-5 h-5 text-primary" />,
    },
    {
      title: 'Đào Tạo Nghiệp Vụ & Võ Thuật Miễn Phí',
      desc: 'Được đào tạo võ thuật tự vệ chuyên nghiệp, nghiệp vụ PCCC chuyên sâu và cấp chứng chỉ nghiệp vụ hoàn toàn miễn phí.',
      icon: <Award className="w-5 h-5 text-primary" />,
    },
  ]

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Cơ Hội Nghề Nghiệp"
        subtitle={pageSubtitle}
      />

      {/* Benefits Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-0.5 bg-primary block" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Chính Sách Nhân Sự</span>
              <span className="w-3 h-0.5 bg-primary block" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
              Chế Độ & Quyền Lợi Của Vệ Sĩ Long Việt
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
              Chúng tôi luôn coi con người là tài sản quý giá nhất, cam kết mang lại môi trường làm việc kỷ luật, công bằng và chế độ đãi ngộ tốt nhất Việt Nam.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="group bg-secondary-light/30 border border-white/10 p-6 md:p-8 rounded-3xl space-y-4 hover:border-primary/30 hover:bg-secondary-light/50 transition-all duration-300 backdrop-blur-md shadow-xl shadow-black/10"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200 shrink-0">
                  {benefit.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-sm md:text-base text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light font-sans">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Job Board Section */}
      <section className="py-16 md:py-24 bg-secondary-light/5 border-t border-white/5 relative">
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="w-3 h-0.5 bg-primary block" />
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Cơ Hội Việc Làm</span>
              <span className="w-3 h-0.5 bg-primary block" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
              Vị Trí Đang Tuyển Dụng Gấp
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
              Dưới đây là danh sách các mục tiêu tuyển dụng trực tiếp tại nhà máy, ngân hàng, tòa nhà văn phòng, resort 5 sao. Hãy chọn vị trí phù hợp để ứng tuyển trực tuyến.
            </p>
          </div>

          <JobBoard initialJobs={jobs as any} />
        </div>
      </section>

      {/* General Requirements & Hotline section */}
      <section className="py-16 bg-secondary-dark border-t border-white/5 relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="bg-secondary-light/30 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-md grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl shadow-black/10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                <h3 className="font-heading font-bold text-lg text-white">Yêu Cầu Chung Đối Với Ứng Viên</h3>
              </div>
              <ul className="space-y-2 text-xs md:text-sm text-gray-400 font-light font-sans">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Nam giới cao từ 1m65 trở lên, nữ giới cao từ 1m55 trở lên.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Sức khỏe tốt, không mắc các bệnh truyền nhiễm hay mãn tính.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Lý lịch tư pháp rõ ràng, không có tiền án, tiền sự.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Tác phong chuẩn chỉnh, tính kỷ luật cao và có trách nhiệm.</span>
                </li>
              </ul>
            </div>
            <div className="bg-secondary-dark p-6 rounded-2xl border border-white/5 text-center space-y-4">
              <h4 className="font-heading font-bold text-sm text-white">
                Liên hệ trực tiếp phòng tuyển sự
              </h4>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi nào về thủ tục nộp hồ sơ, vui lòng gọi điện trực tiếp để nhận lịch hẹn phỏng vấn nhanh nhất.
              </p>
              <div className="pt-2">
                <a
                  href="tel:0923840999"
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 text-xs md:text-sm inline-block shadow-lg shadow-primary/20"
                >
                  📞 Hotline: 0923 840 999
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
