import * as React from 'react'
import Link from 'next/link'
import { formatPrice } from '@/components/ui/ServiceCard'
import { ArrowRight, CheckCircle, Calculator, PhoneCall } from 'lucide-react'

export function PricingPreview() {
  const previewServices = [
    {
      title: 'Bảo Vệ Nhà Máy',
      desc: 'Kho bãi, phân xưởng, khu công nghiệp',
      price: 15000000,
      unit: 'tháng',
      bullets: ['Trực gác cổng 24/24', 'Tuần tra hàng rào định kỳ', 'Kiểm soát hàng hóa ra vào', 'Đội tuần tra cơ động hỗ trợ'],
    },
    {
      title: 'Bảo Vệ Tòa Nhà',
      desc: 'Chung cư, cao ốc văn phòng, TTTM',
      price: 16000000,
      unit: 'tháng',
      bullets: ['Kiểm soát hầm xe & sảnh sần', 'Giám sát camera CCTV', 'Vận hành hệ thống PCCC', 'Lễ tân thân thiện đón tiếp'],
    },
    {
      title: 'Bảo Vệ Sự Kiện',
      desc: 'Liveshow, hội nghị, lễ hội, khai trương',
      price: 150000,
      unit: 'giờ/vị trí',
      bullets: ['Kiểm soát giỏ xách & cổng vào', 'Hộ tống an toàn cho VIP', 'Bảo vệ khán đài, sân khấu', 'Đội phản ứng nhanh ứng cứu'],
    },
    {
      title: 'Bảo Vệ VIP / Yếu Nhân',
      desc: 'Doanh nhân, ngôi sao giải trí, VIP',
      price: 2500000,
      unit: 'ngày/vệ sĩ',
      bullets: ['Cận vệ đặc nhiệm tinh nhuệ', 'Trang bị áo giáp & vũ khí', 'Khảo sát lộ trình di chuyển', 'Bảo mật thông tin đời tư'],
    },
  ]

  return (
    <section className="py-20 md:py-24 bg-secondary relative overflow-hidden border-b border-white/5 text-left">
      {/* Lights decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-3 h-0.5 bg-primary block" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Xem Trước Bảng Giá</span>
            <span className="w-3 h-0.5 bg-primary block" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
            Giá Thuê Bảo Vệ Tối Ưu, Minh Bạch
          </h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            Chúng tôi cam kết cung cấp bảng giá cạnh tranh cùng nhiều ưu đãi hấp dẫn tùy thuộc vào quy mô vị trí và thời hạn hợp đồng.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {previewServices.map((item, idx) => (
            <div
              key={idx}
              className="bg-secondary-light/30 border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/20 transition-colors duration-200 backdrop-blur-md"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-base md:text-lg text-white">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-light mt-0.5 min-h-[32px]">
                    {item.desc}
                  </p>
                </div>

                <div className="py-2 border-y border-white/5">
                  <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Từ khoảng</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="font-heading font-extrabold text-lg md:text-xl text-white">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-xs text-gray-400 font-light">VNĐ/{item.unit}</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-gray-300 font-light">
                  {item.bullets.map((bullet, bidx) => (
                    <li key={bidx} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <Link
                  href="/bang-gia"
                  className="w-full py-2.5 bg-white/5 hover:bg-primary text-gray-300 hover:text-white rounded-xl text-center text-xs font-semibold transition-all duration-200 border border-white/5 hover:border-primary/20 flex items-center justify-center gap-1.5"
                >
                  <span>Xem Chi Tiết Báo Giá</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banners */}
        <div className="p-6 md:p-8 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
          <div className="space-y-1.5">
            <h4 className="font-heading font-bold text-base md:text-lg text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <span>Bạn Muốn Ước Tính Chi Phí Ca Trực Riêng?</span>
            </h4>
            <p className="text-xs text-gray-300 font-light leading-relaxed max-w-2xl">
              Sử dụng công cụ tính toán chi phí tự động thông minh của chúng tôi để dự toán ngân sách ngay lập tức dựa trên số lượng vệ sĩ và số giờ trực gác.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href="/bang-gia"
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all duration-200 text-center shadow-lg shadow-primary/10 flex items-center justify-center gap-1.5"
            >
              <span>Dùng Máy Tính Chi Phí</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="tel:0923840999"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-all duration-200 border border-white/5 text-center flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-primary" />
              <span>Gọi 0923 840 999</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
