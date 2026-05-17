import * as React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { PageHero } from '@/components/ui/PageHero'
import { ArrowLeft, Check, X, Shield, Phone, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sự Khác Biệt & Lợi Thế Cạnh Tranh | Long Việt Security',
  description: 'Bảng so sánh chi tiết và thuyết phục giữa giải pháp tự tuyển dụng bảo vệ nội bộ và thuê dịch vụ bảo vệ chuyên nghiệp Long Việt Security.',
  alternates: {
    canonical: '/gioi-thieu/su-khac-biet',
  },
}

export default function DifferencePage() {
  const comparison = [
    {
      aspect: 'Chi phí quản lý phát sinh',
      self: 'Cao (Phí tuyển dụng, BHXH, BHYT, thưởng lễ tết, trang bị quân phục, dụng cụ tự vệ).',
      us: 'Tối ưu 100% (Giá trọn gói trong hợp đồng, hoàn toàn không phát sinh chi phí quản lý hay phúc lợi).',
      isUsBetter: true,
    },
    {
      aspect: 'Huấn luyện nghiệp vụ an ninh',
      self: 'Hạn chế (Khó tự tổ chức đào tạo võ thuật chuyên sâu, PCCC, sơ cấp cứu hoặc kỹ năng chống đình công).',
      us: 'Bài bản chuyên nghiệp (Được đào tạo sát hạch định kỳ bởi cựu đặc công và công an, có đầy đủ chứng chỉ nghiệp vụ).',
      isUsBetter: true,
    },
    {
      aspect: 'Hỗ trợ bồi thường khi mất mát',
      self: 'Phức tạp & Rủi ro (Doanh nghiệp tự chịu tổn thất hoặc xảy ra tranh chấp pháp lý nội bộ mệt mỏi).',
      us: 'Cam kết tuyệt đối (Bồi thường 100% giá trị tài sản thất thoát theo điều khoản hợp đồng bảo hiểm trách nhiệm 20 tỷ).',
      isUsBetter: true,
    },
    {
      aspect: 'Thay thế nhân sự khẩn cấp',
      self: 'Chậm trễ (Tốn 1-2 tuần tuyển mới khi bảo vệ tự nghỉ việc, gây lỗ hổng an ninh nguy hiểm).',
      us: 'Tức thì (Cam kết thay thế quân số hoặc tăng cường lực lượng cơ động chi viện trong vòng 24 giờ hoàn toàn miễn phí).',
      isUsBetter: true,
    },
    {
      aspect: 'Giám sát tính trung thực',
      self: 'Rất khó (Khó quản lý hành vi thông đồng, ngủ gật trong ca trực đêm do thiếu thiết bị kiểm soát chuyên dụng).',
      us: 'Minh bạch số hóa (Ứng dụng máy tuần tra GPS/NFC trực tuyến, ghi nhận nhật ký đi tuần thời gian thực gửi ban giám đốc).',
      isUsBetter: true,
    },
    {
      aspect: 'Quan hệ pháp lý chính quyền',
      self: 'Tự liên hệ (Doanh nghiệp tự xử lý các vụ việc xô xát, gây rối trật tự phức tạp với công an khu vực).',
      us: 'Ủy thác hoàn toàn (Long Việt trực tiếp đại diện làm việc cùng chính quyền, công an địa phương xử lý sự cố từ A-Z).',
      isUsBetter: true,
    },
  ]

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Sự Khác Biệt Vượt Trội"
        subtitle="Tại sao hàng nghìn doanh nghiệp lựa chọn Long Việt thay vì tự tuyển bảo vệ nội bộ?"
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

          <div className="space-y-12">
            
            {/* Header intro */}
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-0.5 bg-primary block" />
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Phân Tích Giải Pháp</span>
              </div>
              <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
                So Sánh Kinh Tế & Nghiệp Vụ An Ninh
              </h2>
              <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">
                Nhiều doanh nghiệp đắn đo giữa việc tự vận hành tổ bảo vệ nội bộ hay thuê ngoài chuyên nghiệp. Bảng phân tích dưới đây sẽ làm rõ những rủi ro tài chính và nghiệp vụ tiềm ẩn mà chỉ dịch vụ chuyên nghiệp Long Việt mới có thể xử lý triệt để.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-secondary-light/10 backdrop-blur-md shadow-2xl">
              <table className="w-full min-w-[700px] border-collapse text-left text-xs md:text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-white font-heading font-extrabold">
                    <th className="p-5 md:p-6 w-[20%] uppercase tracking-wider">Hạng Mục So Sánh</th>
                    <th className="p-5 md:p-6 w-[40%] text-gray-400 uppercase tracking-wider">Tự Tuyển Bảo Vệ Nội Bộ</th>
                    <th className="p-5 md:p-6 w-[40%] text-primary uppercase tracking-wider bg-primary/5">Dịch Vụ Long Việt Security</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {comparison.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      {/* Aspect title */}
                      <td className="p-5 md:p-6 font-bold text-white bg-white/5 md:bg-transparent">
                        {item.aspect}
                      </td>
                      
                      {/* Self hiring */}
                      <td className="p-5 md:p-6 text-gray-400 font-light leading-relaxed">
                        <div className="flex items-start gap-2.5">
                          <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                          <span>{item.self}</span>
                        </div>
                      </td>

                      {/* Long Viet service */}
                      <td className="p-5 md:p-6 font-light leading-relaxed bg-primary/5">
                        <div className="flex items-start gap-2.5">
                          <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-white font-medium">{item.us}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Call to Action Card */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/20 border border-primary/20 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 mt-12">
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-white text-base md:text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Trải Nghiệm An Ninh Chuẩn Mực Ngay Hôm Nay</span>
                </h4>
                <p className="text-xs text-gray-300 font-light max-w-2xl leading-relaxed">
                  Đội ngũ chuyên gia của chúng tôi sẵn sàng đến tận thực địa để tiến hành khảo sát lỗ hổng an ninh hoàn toàn miễn phí cho doanh nghiệp của bạn.
                </p>
              </div>
              <a
                href="tel:0923840999"
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-primary/25 text-center shrink-0 w-full md:w-auto flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4 animate-bounce" />
                <span>Hotline: 0923 840 999</span>
              </a>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
