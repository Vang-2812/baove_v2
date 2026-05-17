import * as React from 'react'
import { Activity, ShieldAlert, Award, FileText, UserPlus, GraduationCap, CheckCircle, RefreshCcw } from 'lucide-react'

export function WorkProcess() {
  const steps = [
    {
      step: 1,
      title: 'Khảo Sát Thực Địa',
      desc: 'Chuyên gia an ninh trực tiếp đến khảo sát địa hình, sơ đồ hạ tầng mặt bằng.',
      icon: Activity,
    },
    {
      step: 2,
      title: 'Phân Tích Rủi Ro',
      desc: 'Đánh giá các lỗ hổng an ninh, rủi ro đột nhập và cháy nổ tiềm ẩn.',
      icon: ShieldAlert,
    },
    {
      step: 3,
      title: 'Lập Phương Án An Ninh',
      desc: 'Thiết kế sơ đồ bố trí chốt gác, lịch trình tuần tra và quy trình kiểm soát.',
      icon: Award,
    },
    {
      step: 4,
      title: 'Báo Giá & Hợp Đồng',
      desc: 'Thống nhất bảng chi phí minh bạch, ký kết hợp đồng bảo hiểm tài sản.',
      icon: FileText,
    },
    {
      step: 5,
      title: 'Tuyển Chọn Nhân Sự',
      desc: 'Biên chế lực lượng vệ sĩ có thể hình và kinh nghiệm phù hợp với mục tiêu.',
      icon: UserPlus,
    },
    {
      step: 6,
      title: 'Huấn Luyện Nghiệp Vụ',
      desc: 'Đào tạo sơ đồ thực địa, nghiệp vụ chuyên biệt của nhà máy/tòa nhà đó.',
      icon: GraduationCap,
    },
    {
      step: 7,
      title: 'Triển Khai Chốt Trực',
      desc: 'Bàn giao thực địa, cài đặt chốt tuần tra GPS và chính thức trực gác.',
      icon: CheckCircle,
    },
    {
      step: 8,
      title: 'Giám Sát & Cải Tiến',
      desc: 'Đội tuần tra kiểm tra đột xuất 24/7 và định kỳ họp nâng cao chất lượng.',
      icon: RefreshCcw,
    },
  ]

  return (
    <section className="py-20 md:py-24 bg-secondary-dark relative overflow-hidden border-b border-white/5 text-left">
      {/* Decorative background light */}
      <div className="absolute top-1/4 right-1/4 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-3 h-0.5 bg-primary block" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Quy Trình Hoạt Động</span>
            <span className="w-3 h-0.5 bg-primary block" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
            Quy Trình Nghiệp Vụ 8 Bước Chuẩn Hóa
          </h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            Chúng tôi tuân thủ nghiêm ngặt quy trình an ninh quốc tế từ khâu khảo sát đến trực chiến thực tế, đảm bảo an toàn tuyệt đối cho mọi mục tiêu.
          </p>
        </div>

        {/* Stepped Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="group relative bg-secondary-light/20 border border-white/5 p-6 rounded-2xl flex flex-col justify-between hover:border-primary/20 transition-all duration-200 backdrop-blur-md"
              >
                {/* Connecting Line (Only visible on desktop between columns) */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[90%] w-[25%] h-px border-t border-dashed border-white/10 z-0 pointer-events-none group-hover:border-primary/30" />
                )}

                <div className="space-y-4">
                  {/* Step Number & Icon Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-3xl md:text-4xl text-white/5 group-hover:text-primary/10 transition-colors duration-250 leading-none select-none">
                      {item.step < 10 ? `0${item.step}` : item.step}
                    </span>
                    <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-sm md:text-base text-white group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Bottom decorative bar */}
                <div className="w-8 h-1 bg-white/5 rounded-full mt-6 group-hover:w-full group-hover:bg-primary transition-all duration-300" />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
