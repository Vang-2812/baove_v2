'use client'

import * as React from 'react'
import { Shield, Sparkles, CheckCircle2, ShieldAlert, Award, Radio } from 'lucide-react'

type TabType = 'discipline' | 'staffing' | 'insurance' | 'technology'

export function BenefitsTab() {
  const [activeTab, setActiveTab] = React.useState<TabType>('discipline')

  const tabContents = {
    discipline: {
      title: 'Kỷ Luật Thép Quân Đội',
      headline: 'Ý thức tự giác và kỷ luật tự giác cao độ trong mọi hoàn cảnh',
      desc: 'Toàn bộ lực lượng cán bộ chiến sĩ vệ sĩ tại Long Việt Security đều được huấn luyện và rèn luyện dưới môi trường kỷ luật nghiêm ngặt tương tự như trong quân đội nhân dân Việt Nam. Chúng tôi cam kết tác phong tác chiến chuẩn mực, chấp hành tuyệt đối nội quy mục tiêu trực gác.',
      bullets: [
        'Tuyệt đối nói không với ngủ gật, bỏ chốt gác trong ca làm việc.',
        'Tác phong quân phục trang nghiêm, đầu tóc gọn gàng, thái độ đón tiếp niềm nở.',
        'Chấp hành nghiêm chỉnh mệnh lệnh và nội quy đặc thù của doanh nghiệp đối tác.',
      ],
      icon: Award,
    },
    staffing: {
      title: 'Nhân Sự Tuyển Chọn Khắt Khe',
      headline: '100% nhân sự có lý lịch trong sạch và đạt chuẩn thể hình nghiệp vụ',
      desc: 'Chúng tôi hiểu rằng chất lượng an ninh phụ thuộc lớn vào yếu tố con người. Long Việt áp dụng quy trình kiểm tra lý lịch tư pháp khắt khe qua công an cơ sở và sát hạch thể lực, võ thuật, kỹ năng mềm trước khi đưa nhân sự vào biên chế chính thức.',
      bullets: [
        '100% đạt chứng chỉ nghiệp vụ bảo vệ do Cục Cảnh sát QLHC về TTXH cấp.',
        'Ưu tiên cựu quân nhân, công an hoàn thành nghĩa vụ quân sự xuất ngũ.',
        'Định kỳ huấn luyện thể lực, võ thuật tự vệ và diễn tập phòng cháy chữa cháy.',
      ],
      icon: ShieldAlert,
    },
    insurance: {
      title: 'Gói Bảo Hiểm Trách Nhiệm 20 Tỷ',
      headline: 'An tâm tuyệt đối trước mọi rủi ro thất thoát tài sản',
      desc: 'Để củng cố sự an tâm và thể hiện trách nhiệm cao nhất với khách hàng, Long Việt Security đã ký kết hợp đồng bảo hiểm trách nhiệm công cộng và trách nhiệm pháp lý đối với nghề nghiệp với giá trị bồi thường lên đến 20 tỷ đồng cho các sự cố mất mát xảy ra.',
      bullets: [
        'Bồi thường 100% giá trị thiệt hại vật chất do lỗi lơ là của nhân viên bảo vệ.',
        'Quy trình xác minh thiệt hại nhanh chóng, phối hợp tích cực cùng cơ quan công an.',
        'Đảm bảo không ảnh hưởng đến tài chính và chuỗi hoạt động của doanh nghiệp.',
      ],
      icon: Shield,
    },
    technology: {
      title: 'Ứng Dụng Công Nghệ 4.0',
      headline: 'Giám sát trực tuyến thời gian thực thông minh từ trung tâm chỉ huy',
      desc: 'Bảo vệ hiện đại không chỉ dựa vào sức người. Chúng tôi đi đầu trong ứng dụng công nghệ tuần tra số hóa: thiết bị tuần tra GPS thời gian thực, báo cáo sự cố qua ứng dụng điện thoại và camera AI nhận diện khuôn mặt kết nối trực tiếp về trung tâm chỉ huy 24/7.',
      bullets: [
        'Vệ sĩ check-in vị trí gác định kỳ bằng máy quét NFC/GPS chống bỏ chốt.',
        'Cung cấp báo cáo điện tử tuần tra trực tuyến cho ban giám đốc hàng ngày.',
        'Kích hoạt còi báo động và nút bấm SOS khẩn cấp kết nối công an khu vực.',
      ],
      icon: Radio,
    },
  }

  const activeContent = tabContents[activeTab]
  const ActiveIcon = activeContent.icon

  const tabs = [
    { id: 'discipline', label: 'Kỷ Luật Thép', sub: 'Tác phong quân đội' },
    { id: 'staffing', label: 'Nhân Sự Tinh Nhuệ', sub: 'Tuyển lựa khắt khe' },
    { id: 'insurance', label: 'Bảo Hiểm 20 Tỷ', sub: 'Cam kết bồi thường' },
    { id: 'technology', label: 'Công Nghệ 4.0', sub: 'Giám sát trực tuyến' },
  ]

  return (
    <section className="py-20 md:py-24 bg-secondary relative overflow-hidden border-b border-white/5 text-left">
      {/* Decorative light overlay */}
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-3 h-0.5 bg-primary block" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Cam Kết Lợi Ích</span>
            <span className="w-3 h-0.5 bg-primary block" />
          </div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight">
            Giá Trị Khác Biệt & Cam Kết Vàng
          </h2>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            Chúng tôi kiến tạo sự an tâm tuyệt đối cho quý doanh nghiệp bằng việc thực thi nghiêm ngặt 4 trụ cột cam kết vàng chất lượng cao.
          </p>
        </div>

        {/* Interactive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left: Tab selection buttons */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full p-4.5 rounded-2xl flex items-start gap-4 transition-all duration-200 text-left border ${
                  activeTab === tab.id
                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                    : 'bg-secondary-light/20 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}
                >
                  {React.createElement(
                    tab.id === 'discipline'
                      ? Award
                      : tab.id === 'staffing'
                      ? ShieldAlert
                      : tab.id === 'insurance'
                      ? Shield
                      : Radio,
                    { className: 'w-4.5 h-4.5' }
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-sm md:text-base leading-none">
                    {tab.label}
                  </span>
                  <span
                    className={`text-[11px] font-light mt-1.5 leading-none ${
                      activeTab === tab.id ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {tab.sub}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Selected Tab Details Display */}
          <div className="lg:col-span-8 bg-secondary-light/30 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md min-h-[380px] flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Header inside display card */}
              <div className="flex items-start gap-4.5">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <ActiveIcon className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-extrabold text-lg md:text-xl text-white tracking-tight">
                    {activeContent.title}
                  </h3>
                  <p className="text-xs text-primary font-semibold">{activeContent.headline}</p>
                </div>
              </div>

              {/* Description Paragraph */}
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light">
                {activeContent.desc}
              </p>

              {/* Bullet guarantees list */}
              <div className="space-y-3 pt-2">
                {activeContent.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs md:text-sm text-gray-300 font-light">
                    <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

            </div>

            {/* Bottom verification badge */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>Cam kết thực thi 100% hợp đồng</span>
              </span>
              <span className="font-bold text-primary flex items-center gap-1">
                <span>Long Việt Security</span>
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
