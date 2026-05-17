'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, type ContactInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Shield, Sparkles, CheckCircle } from 'lucide-react'

interface QuoteFormCardProps {
  serviceType: string
}

export function QuoteFormCard({ serviceType }: QuoteFormCardProps) {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      province: '',
      service_type: serviceType,
      message: `Tôi muốn nhận báo giá dịch vụ: ${serviceType}.`,
      source: 'service_detail',
      recaptcha_token: 'recaptcha_bypassed_via_front',
    },
  })

  // Synchronize dynamic serviceType prop
  React.useEffect(() => {
    setValue('service_type', serviceType)
    setValue('message', `Tôi muốn nhận báo giá dịch vụ: ${serviceType}.`)
  }, [serviceType, setValue])

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
        reset({
          name: '',
          phone: '',
          email: '',
          province: '',
          service_type: serviceType,
          message: `Tôi muốn nhận báo giá dịch vụ: ${serviceType}.`,
          source: 'service_detail',
          recaptcha_token: 'recaptcha_bypassed_via_front',
        })
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
    <div className="bg-secondary-light/40 border border-white/5 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
      {/* Glow decorative */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
          <Shield className="w-4.5 h-4.5" />
        </div>
        <h3 className="font-heading font-bold text-base md:text-lg text-white">
          Yêu Cầu Báo Giá
        </h3>
      </div>
      
      <p className="text-xs text-gray-400 font-light mb-5 leading-relaxed">
        Để lại thông tin khảo sát, chúng tôi sẽ lập tức liên hệ tư vấn phương án và chi phí tối ưu nhất cho bạn.
      </p>

      {status === 'success' ? (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center space-y-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
            <CheckCircle className="w-6 h-6 animate-bounce" />
          </div>
          <h4 className="font-bold text-sm text-white">Gửi Yêu Cầu Thành Công!</h4>
          <p className="text-xs text-gray-300 leading-relaxed font-light">
            Cảm ơn bạn đã lựa chọn Long Việt. Chuyên viên tư vấn sẽ liên hệ trực tiếp với bạn trong vòng 24 giờ.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs text-primary font-bold hover:underline mt-2 inline-block focus:outline-none"
          >
            Gửi yêu cầu khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {/* Họ Tên */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Họ và Tên <span className="text-primary">*</span></label>
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
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Số điện thoại <span className="text-primary">*</span></label>
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
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email (không bắt buộc)</label>
            <input
              type="email"
              placeholder="email@example.com"
              {...register('email')}
              disabled={status === 'submitting'}
              className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
            />
            {errors.email && (
              <span className="text-[10px] text-primary mt-1 block">{errors.email.message}</span>
            )}
          </div>

          {/* Tỉnh / Thành */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Tỉnh / Thành <span className="text-primary">*</span></label>
            <select
              {...register('province')}
              disabled={status === 'submitting'}
              className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              <option value="" className="bg-secondary-dark">Chọn Tỉnh / Thành</option>
              <option value="Hồ Chí Minh" className="bg-secondary-dark">TP. Hồ Chí Minh</option>
              <option value="Hà Nội" className="bg-secondary-dark">TP. Hà Nội</option>
              <option value="Đồng Nai" className="bg-secondary-dark">Đồng Nai</option>
              <option value="Bình Dương" className="bg-secondary-dark">Bình Dương</option>
              <option value="Long An" className="bg-secondary-dark">Long An</option>
              <option value="Khác" className="bg-secondary-dark">Tỉnh Thành Khác</option>
            </select>
            {errors.province && (
              <span className="text-[10px] text-primary mt-1 block">{errors.province.message}</span>
            )}
          </div>

          {/* Lời nhắn */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">Yêu cầu chi tiết</label>
            <textarea
              rows={3}
              placeholder="Mô tả cụ thể quy mô cần bảo vệ..."
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
            className="w-full shadow-lg shadow-primary/20 flex items-center justify-center gap-1.5"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <span>Đang gửi yêu cầu...</span>
            ) : (
              <>
                <span>Gửi Yêu Cầu</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
