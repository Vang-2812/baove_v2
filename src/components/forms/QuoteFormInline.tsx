'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { trackEvent } from '@/components/Analytics'
import { CheckCircle, AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'

const isValidVnPhone = (phone: string) => {
  const clean = phone.replace(/[\s.-]/g, '')
  return /^(0|\+84)(3[2-9]|5[6-9]|7[06-9]|8[0-9]|9[0-9])[0-9]{7}$/.test(clean)
}

const FormSchema = z.object({
  name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone: z.string().refine(isValidVnPhone, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  service_type: z.string().min(1, 'Vui lòng chọn dịch vụ'),
  message: z.string().min(10, 'Nội dung yêu cầu tối thiểu 10 ký tự'),
})

type FormData = z.infer<typeof FormSchema>

interface Props {
  source: string
  serviceType?: string
  className?: string
  isDark?: boolean
}

const serviceOptions = [
  { value: '', label: 'Chọn dịch vụ cần báo giá...' },
  { value: 'bao-ve-nha-may', label: 'Bảo vệ nhà máy' },
  { value: 'bao-ve-su-kien', label: 'Bảo vệ sự kiện' },
  { value: 'bao-ve-toa-nha', label: 'Bảo vệ tòa nhà / văn phòng' },
  { value: 'bao-ve-ngan-hang', label: 'Bảo vệ ngân hàng' },
  { value: 'bao-ve-benh-vien', label: 'Bảo vệ bệnh viện' },
  { value: 'bao-ve-nha-hang', label: 'Bảo vệ nhà hàng / siêu thị' },
  { value: 'bao-ve-truong-hoc', label: 'Bảo vệ trường học' },
  { value: 'bao-ve-ngay-tet', label: 'Bảo vệ ngày Tết' },
  { value: 'bao-ve-cong-truong', label: 'Bảo vệ công trường' },
  { value: 'bao-ve-khu-cong-nghiep', label: 'Bảo vệ khu công nghiệp' },
  { value: 'bao-ve-ap-tai-tien', label: 'Bảo vệ áp tải tiền' },
  { value: 'bao-ve-yeu-nhan', label: 'Bảo vệ yếu nhân / VIP' },
  { value: 'khac', label: 'Dịch vụ khác' },
]

export function QuoteFormInline({ source, serviceType = '', className, isDark = false }: Props) {
  const labelColor = isDark ? 'text-gray-200' : 'text-secondary'
  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service_type: serviceType,
      message: '',
    },
  })

  // Format phone format on input blur or change (e.g. 0923840999 -> 0923 840 999)
  const handlePhoneFormat = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '')
    if (value.length === 10 && value.startsWith('0')) {
      const formatted = `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7)}`
      setValue('phone', formatted)
    }
  }

  // Safe client-side reCAPTCHA v3 execution
  const executeRecaptcha = async (): Promise<string> => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!siteKey || siteKey === 'recaptcha_site_key_here') {
      return 'mock_recaptcha_token_dev'
    }

    return new Promise((resolve) => {
      const windowObj = window as unknown as {
        grecaptcha?: {
          ready: (callback: () => Promise<void>) => void
          execute: (key: string, options: { action: string }) => Promise<string>
        }
      }
      if (windowObj.grecaptcha && windowObj.grecaptcha.ready) {
        windowObj.grecaptcha.ready(async () => {
          try {
            const token = await windowObj.grecaptcha!.execute(siteKey, { action: 'quote_submit' })
            resolve(token)
          } catch (err) {
            console.error('reCAPTCHA execution failed:', err)
            resolve('error_recaptcha_token')
          }
        })
      } else {
        console.warn('reCAPTCHA script not loaded yet.')
        resolve('missing_recaptcha_token')
      }
    })
  }

  const onSubmit = async (data: FormData) => {
    setSubmitStatus('loading')
    setErrorMessage('')

    try {
      // 1. Execute reCAPTCHA to get score token
      const token = await executeRecaptcha()

      // 2. Format phone to clear digits before database submit
      const cleanPhone = data.phone.replace(/\s+/g, '')

      // 3. Post to API Contacts endpoint
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          phone: cleanPhone,
          source,
          recaptcha_token: token,
        }),
      })

      const resData = await response.json()

      if (response.ok && resData.success) {
        setSubmitStatus('success')
        trackEvent('form_submit', 'QuoteForm', source)
        reset()
      } else {
        setSubmitStatus('error')
        setErrorMessage(
          resData.error === 'RECAPTCHA_FAILED'
            ? 'Xác minh bảo mật reCAPTCHA thất bại. Vui lòng tải lại trang và thử lại.'
            : resData.error === 'VALIDATION_ERROR'
            ? 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường thông tin.'
            : 'Có lỗi xảy ra từ máy chủ. Vui lòng liên hệ trực tiếp số hotline.'
        )
      }
    } catch (error) {
      console.error('Submit quote form error:', error)
      setSubmitStatus('error')
      setErrorMessage('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.')
    }
  }

  return (
    <div className={clsx('relative', className)}>
      {submitStatus === 'success' ? (
        <div className="text-center py-10 px-4 flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success mb-2">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h3 className={clsx('text-h3 font-bold', isDark ? 'text-white' : 'text-secondary')}>Gửi Yêu Cầu Thành Công!</h3>
          <p className={clsx('text-body max-w-sm', isDark ? 'text-gray-300' : 'text-text-muted')}>
            Cảm ơn bạn đã tin tưởng dịch vụ của Long Việt. Chúng tôi đã nhận được yêu cầu báo giá và chuyên viên sẽ chủ động liên hệ tư vấn trong 24h.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubmitStatus('idle')}
            className="mt-4"
          >
            Gửi yêu cầu mới
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {submitStatus === 'error' && (
            <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className={clsx('block text-sm font-medium mb-1', labelColor)}>
              Họ tên của bạn <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Nguyễn Văn A"
              {...register('name')}
              className={clsx(
                'w-full px-4 py-3 border rounded-btn text-body text-secondary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all duration-150',
                errors.name
                  ? 'border-error focus:ring-error/20 focus:border-error'
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
              )}
            />
            {errors.name && <p className="text-xs text-error mt-1">{errors.name.message}</p>}
          </div>

          {/* Phone & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Field */}
            <div>
              <label className={clsx('block text-sm font-medium mb-1', labelColor)}>
                Số điện thoại <span className="text-primary">*</span>
              </label>
              <input
                type="tel"
                placeholder="Ví dụ: 0923 840 999"
                {...register('phone')}
                onBlur={handlePhoneFormat}
                className={clsx(
                  'w-full px-4 py-3 border rounded-btn text-body text-secondary placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all duration-150',
                  errors.phone
                    ? 'border-error focus:ring-error/20 focus:border-error'
                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                )}
              />
              {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className={clsx('block text-sm font-medium mb-1', labelColor)}>
                Địa chỉ Email
              </label>
              <input
                type="email"
                placeholder="Ví dụ: name@company.com"
                {...register('email')}
                className={clsx(
                  'w-full px-4 py-3 border border-gray-200 rounded-btn text-body text-secondary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150',
                  errors.email ? 'border-error focus:ring-error/20 focus:border-error' : ''
                )}
              />
              {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {/* Service Type Selection */}
          <div>
            <label className={clsx('block text-sm font-medium mb-1', labelColor)}>
              Dịch vụ cần báo giá <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <select
                {...register('service_type')}
                className={clsx(
                  'w-full px-4 py-3 border rounded-btn text-body text-secondary bg-white focus:outline-none focus:ring-2 transition-all duration-150 appearance-none',
                  errors.service_type
                    ? 'border-error focus:ring-error/20 focus:border-error'
                    : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
                )}
              >
                {serviceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.service_type && <p className="text-xs text-error mt-1">{errors.service_type.message}</p>}
          </div>

          {/* Message Field */}
          <div>
            <label className={clsx('block text-sm font-medium mb-1', labelColor)}>
              Nhu cầu bảo vệ chi tiết <span className="text-primary">*</span>
            </label>
            <textarea
              placeholder="Vui lòng mô tả yêu cầu bảo vệ của quý doanh nghiệp (Số lượng vị trí, ca làm việc, quy mô địa điểm...)"
              {...register('message')}
              rows={4}
              className={clsx(
                'w-full px-4 py-3 border rounded-btn text-body text-secondary placeholder:text-text-muted resize-y min-h-[120px] focus:outline-none focus:ring-2 transition-all duration-150',
                errors.message
                  ? 'border-error focus:ring-error/20 focus:border-error'
                  : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
              )}
            />
            {errors.message && <p className="text-xs text-error mt-1">{errors.message.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={submitStatus === 'loading'}
            className="w-full shadow-lg shadow-primary/20 mt-2"
          >
            Nhận Báo Giá Miễn Phí
          </Button>
        </form>
      )}
    </div>
  )
}
