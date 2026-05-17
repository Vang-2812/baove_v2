'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, type ContactInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Handshake, Sparkles, Building, Phone, User, Mail, MapPin } from 'lucide-react'

export function PartnerForm() {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      province: 'Hồ Chí Minh',
      service_type: 'Hợp Tác Kinh Doanh',
      title: 'Đăng Ký Đối Tác Long Việt',
      message: 'Tôi muốn tìm hiểu cơ hội hợp tác và cung ứng dịch vụ cùng Long Việt Security.',
      source: 'partner_page',
      recaptcha_token: 'recaptcha_bypassed_via_front',
    },
  })

  const onSubmit = async (data: ContactInput) => {
    setStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resData = await response.json()

      if (response.ok && resData.success) {
        setStatus('success')
        reset()
      } else {
        setStatus('error')
        setErrorMessage(resData.error || 'Có lỗi xảy ra, vui lòng thử lại.')
      }
    } catch (e) {
      console.error(e)
      setStatus('error')
      setErrorMessage('Lỗi kết nối mạng, vui lòng kiểm tra lại.')
    }
  }

  return (
    <div className="bg-secondary-light/20 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-md relative overflow-hidden">
      {/* Decorative light effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Handshake className="w-5 h-5" />
        </div>
        <h3 className="font-heading font-extrabold text-lg md:text-xl text-white">Đăng Ký Thông Tin Hợp Tác</h3>
      </div>

      {status === 'success' ? (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
            <CheckCircle className="w-6 h-6 animate-bounce" />
          </div>
          <h4 className="font-bold text-white text-base">Đăng Ký Thành Công!</h4>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light">
            Chúng tôi đã ghi nhận đề xuất hợp tác của bạn. Đại diện ban quản lý đối tác Long Việt Security sẽ trực tiếp liên hệ trao đổi chi tiết trong vòng 24 - 48 giờ.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs text-primary font-bold hover:underline mt-2 inline-block focus:outline-none"
          >
            Đăng ký đề xuất khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Đại Diện */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Họ và Tên Đại Diện <span className="text-primary">*</span></span>
              </label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                {...register('name')}
                disabled={status === 'submitting'}
                className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
              {errors.name && (
                <span className="text-[10px] text-primary mt-1 block">{errors.name.message}</span>
              )}
            </div>

            {/* Số Điện Thoại */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>Số Điện Thoại <span className="text-primary">*</span></span>
              </label>
              <input
                type="tel"
                placeholder="0923840999"
                {...register('phone')}
                disabled={status === 'submitting'}
                className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
              {errors.phone && (
                <span className="text-[10px] text-primary mt-1 block">{errors.phone.message}</span>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Địa Chỉ Email <span className="text-primary">*</span></span>
              </label>
              <input
                type="email"
                placeholder="partner@example.com"
                {...register('email')}
                disabled={status === 'submitting'}
                className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
              />
              {errors.email && (
                <span className="text-[10px] text-primary mt-1 block">{errors.email.message}</span>
              )}
            </div>

            {/* Tỉnh Thành */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Tỉnh / Thành Phố <span className="text-primary">*</span></span>
              </label>
              <select
                {...register('province')}
                disabled={status === 'submitting'}
                className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
              >
                <option value="Hồ Chí Minh" className="bg-secondary-dark">TP. Hồ Chí Minh</option>
                <option value="Hà Nội" className="bg-secondary-dark">TP. Hà Nội</option>
                <option value="Đồng Nai" className="bg-secondary-dark">Đồng Nai</option>
                <option value="Bình Dương" className="bg-secondary-dark">Bình Dương</option>
                <option value="Long An" className="bg-secondary-dark">Long An</option>
                <option value="Khác" className="bg-secondary-dark">Tỉnh Thành Khác</option>
              </select>
            </div>
          </div>

          {/* Lời đề nghị hợp tác */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 block">Đề Xuất Dự Án & Chi Tiết Hợp Tác</label>
            <textarea
              rows={4}
              placeholder="Mô tả cụ thể nhu cầu liên kết, cung ứng thiết bị hoặc triển khai dịch vụ chung..."
              {...register('message')}
              disabled={status === 'submitting'}
              className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="text-[10px] text-primary bg-primary/5 p-2 rounded-lg border border-primary/10">
              {errorMessage}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5 py-3"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <span>Đang gửi thông tin...</span>
            ) : (
              <>
                <span>Gửi Đề Xuất Hợp Tác</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </Button>

        </form>
      )}
    </div>
  )
}
