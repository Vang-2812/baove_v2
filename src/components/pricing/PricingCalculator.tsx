'use client'

import * as React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ContactSchema, type ContactInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { formatPrice, ServiceIcon } from '@/components/ui/ServiceCard'
import { Shield, Sparkles, CheckCircle, Calculator, Info, Calendar, Users, Clock, ArrowRight } from 'lucide-react'

interface ServiceItem {
  id: string
  title: string
  slug: string
  price_min: number | null
  price_max: number | null
  price_unit: string | null
  description: string
  icon: string | null
}

interface PricingCalculatorProps {
  services: ServiceItem[]
}

export function PricingCalculator({ services }: PricingCalculatorProps) {
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(services[0]?.id || '')
  const [hours, setHours] = React.useState<number>(24) // 12h or 24h
  const [guards, setGuards] = React.useState<number>(1)
  const [duration, setDuration] = React.useState<number>(12) // 1, 3, 6, 12 months

  const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const selectedService = React.useMemo(() => {
    return services.find((s) => s.id === selectedServiceId) || services[0]
  }, [services, selectedServiceId])

  // Pricing math
  const calculations = React.useMemo(() => {
    if (!selectedService || !selectedService.price_min) {
      return { base: 0, discountRate: 0, discountVal: 0, total: 0, isContactRequired: true }
    }

    const priceMin = selectedService.price_min
    // Hour adjustment factor (12h ca is 58% of 24h cost due to split staffing overhead)
    const hourFactor = hours === 12 ? 0.58 : 1.0
    
    // Base cost per month
    let monthlyBase = priceMin * guards * hourFactor

    // If unit is "giờ" or "vị trí/giờ" (e.g. Sự kiện: 150k/giờ)
    const isHourly = selectedService.price_unit?.includes('giờ') || selectedService.price_unit?.includes('chuyến')
    if (isHourly) {
      // For hourly, monthlyBase is guards * hours * priceMin (assuming single event run)
      monthlyBase = priceMin * guards * hours
    }

    // Discount rate based on contract duration
    let discountRate = 0
    if (!isHourly) {
      if (duration === 3) discountRate = 0.03
      else if (duration === 6) discountRate = 0.05
      else if (duration === 12) discountRate = 0.08
    }

    const baseTotal = isHourly ? monthlyBase : monthlyBase * duration
    const discountVal = baseTotal * discountRate
    const finalTotal = baseTotal - discountVal

    return {
      base: baseTotal,
      discountRate,
      discountVal,
      total: finalTotal,
      isContactRequired: false
    }
  }, [selectedService, hours, guards, duration])

  // Form hooks
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
      service_type: selectedService?.title || '',
      message: '',
      source: 'pricing_calculator',
      recaptcha_token: 'recaptcha_bypassed_via_front',
    },
  })

  // Synchronize calculator values to form message field
  React.useEffect(() => {
    if (selectedService) {
      setValue('service_type', selectedService.title)
      const costStr = calculations.total > 0 ? `${formatPrice(calculations.total)} VNĐ` : 'Liên hệ báo giá'
      const detailMsg = `[Dự toán bảng giá] Dịch vụ: ${selectedService.title}, ca trực: ${hours}h/ngày, số lượng: ${guards} chốt trực, thời hạn hợp đồng: ${duration} tháng. Chi phí ước tính: ${costStr}.`
      setValue('message', detailMsg)
    }
  }, [selectedService, hours, guards, duration, calculations.total, setValue])

  const onSubmit = async (data: ContactInput) => {
    setSubmitStatus('submitting')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const resData = await response.json()

      if (response.ok && resData.success) {
        setSubmitStatus('success')
        reset({
          name: '',
          phone: '',
          email: '',
          province: '',
          service_type: selectedService?.title || '',
          message: '',
          source: 'pricing_calculator',
          recaptcha_token: 'recaptcha_bypassed_via_front',
        })
      } else {
        setSubmitStatus('error')
        setErrorMessage(resData.error || 'Có lỗi xảy ra, vui lòng thử lại.')
      }
    } catch (e) {
      console.error(e)
      setSubmitStatus('error')
      setErrorMessage('Lỗi kết nối mạng, vui lòng kiểm tra lại.')
    }
  }

  return (
    <div className="space-y-16">
      
      {/* SECTION 1: INTERACTIVE CALCULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Control Panel */}
        <div className="lg:col-span-7 bg-secondary-light/30 border border-white/5 p-6 md:p-8 rounded-3xl backdrop-blur-md space-y-6 text-left">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Calculator className="w-5.5 h-5.5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg md:text-xl text-white tracking-tight">
                Ước Tính Chi Phí Bảo Vệ
              </h2>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Nhập các thông số vị trí trực gác để tự động ước toán ngân sách
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full my-2" />

          {/* 1. Chọn loại hình dịch vụ */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>1. Loại hình dịch vụ bảo vệ</span>
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full bg-secondary-dark border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            >
              {services.map((item) => (
                <option key={item.id} value={item.id} className="bg-secondary-dark">
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Số lượng vị trí/chốt trực & ca trực */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Vị trí gác */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>2. Số lượng chốt trực (vệ sĩ)</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuards(Math.max(1, guards - 1))}
                  className="w-10 h-10 bg-white/5 hover:bg-primary hover:text-white rounded-lg text-white font-bold text-lg transition-colors border border-white/5"
                >
                  -
                </button>
                <span className="w-10 text-center font-heading font-extrabold text-white text-base md:text-lg">
                  {guards}
                </span>
                <button
                  type="button"
                  onClick={() => setGuards(guards + 1)}
                  className="w-10 h-10 bg-white/5 hover:bg-primary hover:text-white rounded-lg text-white font-bold text-lg transition-colors border border-white/5"
                >
                  +
                </button>
              </div>
            </div>

            {/* Ca trực */}
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>3. Ca trực hàng ngày</span>
              </label>
              <div className="grid grid-cols-2 gap-2 bg-secondary-dark p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setHours(12)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                    hours === 12
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  12h/ngày (Bán ca)
                </button>
                <button
                  type="button"
                  onClick={() => setHours(24)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                    hours === 24
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  24h/24h (Trọn ca)
                </button>
              </div>
            </div>
          </div>

          {/* 3. Thời hạn hợp đồng */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-semibold text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>4. Thời hạn cam kết hợp đồng</span>
            </label>
            <div className="grid grid-cols-4 gap-2 bg-secondary-dark p-1 rounded-xl border border-white/5 text-center">
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDuration(m)}
                  className={`py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                    duration === m
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {m === 1 ? '1 tháng' : `${m} tháng`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-400 leading-relaxed font-light">
            <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Lưu ý:</strong> Kết quả tính toán mang tính chất ước tính dựa trên đơn giá cơ bản tối thiểu. Đơn giá thực tế sẽ được chuyên viên khảo sát của Long Việt điều chỉnh tối ưu sau khi khảo sát rủi ro thực tế tại doanh nghiệp.
            </span>
          </div>

        </div>

        {/* Right Output & Inline Form Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Estimated Results */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary-light/30 to-secondary-light/10 border border-primary/20 rounded-3xl p-6 md:p-8 backdrop-blur-md text-left space-y-4">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary">Dự toán ngân sách ước tính</span>
            
            <div className="space-y-1">
              <span className="text-xs text-gray-400">Hạng mục: {selectedService?.title}</span>
              <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-white tracking-tight leading-none mt-1">
                {calculations.total > 0 ? `${formatPrice(calculations.total)} VNĐ` : 'Liên hệ báo giá'}
              </h3>
              {calculations.discountRate > 0 && (
                <p className="text-[11px] text-primary font-semibold mt-1">
                  Đã áp dụng giảm giá {(calculations.discountRate * 100).toFixed(0)}% hợp đồng {duration} tháng! (Tiết kiệm {formatPrice(calculations.discountVal)} VNĐ)
                </p>
              )}
            </div>

            <div className="h-px bg-white/5 w-full my-1" />

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-light">Số vệ sĩ:</span>
                <span className="font-bold text-white mt-0.5 block">{guards} vị trí gác</span>
              </div>
              <div>
                <span className="text-gray-400 block font-light">Ca trực:</span>
                <span className="font-bold text-white mt-0.5 block">{hours}h/ngày</span>
              </div>
              <div>
                <span className="text-gray-400 block font-light">Thời hạn:</span>
                <span className="font-bold text-white mt-0.5 block">{duration} tháng</span>
              </div>
              <div>
                <span className="text-gray-400 block font-light">Hình thức:</span>
                <span className="font-bold text-white mt-0.5 block">
                  {selectedService?.price_unit || 'tháng'}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="bg-secondary-light/20 border border-white/5 rounded-3xl p-6 backdrop-blur-md text-left">
            <h4 className="font-heading font-bold text-sm md:text-base text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Gửi Yêu Cầu Nhận Báo Giá Chính Xác</span>
            </h4>
            
            {submitStatus === 'success' ? (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center space-y-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
                  <CheckCircle className="w-5.5 h-5.5 animate-bounce" />
                </div>
                <h5 className="font-bold text-xs text-white">Yêu Cầu Đã Được Tiếp Nhận!</h5>
                <p className="text-[11px] text-gray-300 leading-relaxed font-light">
                  Bộ phận khảo sát của Long Việt sẽ liên hệ tư vấn trực tiếp và gửi báo giá chi tiết trong vòng 2 giờ làm việc.
                </p>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="text-[11px] text-primary font-bold hover:underline focus:outline-none"
                >
                  Nhập dự toán mới
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="Họ và Tên *"
                      {...register('name')}
                      disabled={submitStatus === 'submitting'}
                      className="w-full bg-secondary-dark/60 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {errors.name && <span className="text-[9px] text-primary mt-1 block">{errors.name.message}</span>}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Số điện thoại *"
                      {...register('phone')}
                      disabled={submitStatus === 'submitting'}
                      className="w-full bg-secondary-dark/60 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {errors.phone && <span className="text-[9px] text-primary mt-1 block">{errors.phone.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      {...register('email')}
                      disabled={submitStatus === 'submitting'}
                      className="w-full bg-secondary-dark/60 border border-white/5 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    {errors.email && <span className="text-[9px] text-primary mt-1 block">{errors.email.message}</span>}
                  </div>
                  <div>
                    <select
                      {...register('province')}
                      disabled={submitStatus === 'submitting'}
                      className="w-full bg-secondary-dark/60 border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                    >
                      <option value="">Khu vực gác *</option>
                      <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Hà Nội">TP. Hà Nội</option>
                      <option value="Đồng Nai">Đồng Nai</option>
                      <option value="Bình Dương">Bình Dương</option>
                      <option value="Long An">Long An</option>
                      <option value="Khác">Tỉnh Thành Khác</option>
                    </select>
                    {errors.province && <span className="text-[9px] text-primary mt-1 block">{errors.province.message}</span>}
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-[9px] text-primary bg-primary/5 p-2 rounded-lg border border-primary/10">
                    {errorMessage}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full shadow-md shadow-primary/20 text-xs font-bold py-2.5"
                  disabled={submitStatus === 'submitting'}
                >
                  {submitStatus === 'submitting' ? 'Đang gửi thông tin...' : 'Đăng Ký Nhận Khảo Sát Miễn Phí'}
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* SECTION 2: COMPREHENSIVE COMPARISON TABLE */}
      <div className="space-y-6 text-left">
        <div className="space-y-2">
          <h2 className="font-heading font-extrabold text-xl md:text-2xl text-white tracking-tight border-l-4 border-primary pl-4">
            Bảng Tra Cứu Giá Dịch Vụ 2026
          </h2>
          <p className="text-xs md:text-sm text-gray-400 font-light max-w-3xl leading-relaxed">
            Danh sách chi tiết đơn giá tham khảo của toàn bộ 12 dịch vụ an ninh tại Long Việt Security. Giá chưa bao gồm VAT và ưu đãi hợp đồng dài hạn.
          </p>
        </div>

        {/* Glassmorphism Table Container */}
        <div className="bg-secondary-light/20 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-secondary-light/40">
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-primary">Dịch Vụ An Ninh</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-primary text-right">Giá Tối Thiểu</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-primary text-right">Giá Tối Đa</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-primary">Đơn Vị Tính</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-primary text-center">Liên Kết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs md:text-sm">
                {services.map((item) => {
                  const minStr = item.price_min ? `${formatPrice(item.price_min)} VNĐ` : 'Liên hệ'
                  const maxStr = item.price_max ? `${formatPrice(item.price_max)} VNĐ` : 'Khảo sát'
                  const unitStr = item.price_unit ? `${item.price_unit}` : 'tháng'

                  return (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors duration-150">
                      <td className="p-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                            <ServiceIcon name={item.icon} className="w-3.5 h-3.5" />
                          </div>
                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-gray-300 font-bold">{minStr}</td>
                      <td className="p-4 text-right text-gray-400">{maxStr}</td>
                      <td className="p-4 text-gray-400 capitalize">{unitStr}</td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/dich-vu/${item.slug}`}
                          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark font-bold transition-colors"
                        >
                          <span>Xem chi tiết</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}
