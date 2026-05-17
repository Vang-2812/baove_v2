'use client'

import * as React from 'react'
import { ArrowLeft, Save, Sparkles, Plus, Trash2, HelpCircle, Shield } from 'lucide-react'
import Link from 'next/link'
import { upsertService } from '../actions'

interface ServiceFormProps {
  id: string | null
  initialData?: any
}

export function ServiceForm({ id, initialData }: ServiceFormProps) {
  const [activeTab, setActiveTab] = React.useState<'info' | 'content' | 'faq' | 'seo'>('info')
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  // State fields
  const [title, setTitle] = React.useState(initialData?.title || '')
  const [slug, setSlug] = React.useState(initialData?.slug || '')
  const [description, setDescription] = React.useState(initialData?.description || '')
  const [scope, setScope] = React.useState(initialData?.scope || '')
  const [benefits, setBenefits] = React.useState(initialData?.benefits || '')
  const [icon, setIcon] = React.useState(initialData?.icon || 'Shield')
  const [image, setImage] = React.useState(initialData?.image || '')
  const [priceMin, setPriceMin] = React.useState(initialData?.price_min?.toString() || '')
  const [priceMax, setPriceMax] = React.useState(initialData?.price_max?.toString() || '')
  const [priceUnit, setPriceUnit] = React.useState(initialData?.price_unit || 'tháng')
  const [order, setOrder] = React.useState(initialData?.order?.toString() || '0')
  const [isActive, setIsActive] = React.useState(initialData ? initialData.is_active : true)
  const [metaTitle, setMetaTitle] = React.useState(initialData?.meta_title || '')
  const [metaDesc, setMetaDesc] = React.useState(initialData?.meta_desc || '')

  // Dynamic Processes List [{step, title, description}]
  const parsedProcess = initialData?.process ? JSON.parse(initialData.process) : []
  const [processes, setProcesses] = React.useState<any[]>(parsedProcess.length > 0 ? parsedProcess : [{ step: 1, title: '', description: '' }])

  // Dynamic FAQs List [{q, a}]
  const parsedFaq = initialData?.faq ? JSON.parse(initialData.faq) : []
  const [faqs, setFaqs] = React.useState<any[]>(parsedFaq.length > 0 ? parsedFaq : [{ q: '', a: '' }])

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!id) {
      const generated = val
        .toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      setSlug(generated)
    }
  }

  // Handle Dynamic Process Changes
  const handleAddProcess = () => {
    setProcesses([...processes, { step: processes.length + 1, title: '', description: '' }])
  }

  const handleRemoveProcess = (idx: number) => {
    const updated = processes.filter((_, i) => i !== idx).map((p, i) => ({ ...p, step: i + 1 }))
    setProcesses(updated)
  }

  const handleProcessChange = (idx: number, field: string, value: string) => {
    const updated = processes.map((p, i) => {
      if (i === idx) {
        return { ...p, [field]: value }
      }
      return p
    })
    setProcesses(updated)
  }

  // Handle Dynamic FAQ Changes
  const handleAddFaq = () => {
    setFaqs([...faqs, { q: '', a: '' }])
  }

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx))
  }

  const handleFaqChange = (idx: number, field: string, value: string) => {
    const updated = faqs.map((f, i) => {
      if (i === idx) {
        return { ...f, [field]: value }
      }
      return f
    })
    setFaqs(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug) {
      setErrorMessage('Vui lòng nhập tên dịch vụ và đường dẫn tĩnh (slug).')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      title,
      slug,
      description,
      scope,
      process: processes.filter((p) => p.title.trim() !== ''),
      benefits,
      icon,
      image,
      price_min: priceMin || null,
      price_max: priceMax || null,
      price_unit: priceUnit,
      faq: faqs.filter((f) => f.q.trim() !== ''),
      order,
      is_active: isActive,
      meta_title: metaTitle,
      meta_desc: metaDesc,
    }

    const res = await upsertService(id, payload)
    if (res.success) {
      setStatus('success')
      window.location.href = '/admin/services'
    } else {
      setStatus('error')
      setErrorMessage(res.error || 'Đã có lỗi xảy ra.')
    }
  }

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="p-2.5 bg-white/5 border border-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary shrink-0" />
              <span>{id ? 'Chỉnh Sửa Dịch Vụ' : 'Tạo Dịch Vụ Mới'}</span>
            </h1>
            <p className="text-xs text-gray-400 font-light mt-1">
              {id ? `ID dịch vụ: ${id}` : 'Thêm dịch vụ bảo vệ chất lượng cao vào danh mục hệ thống.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-white/5 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Thông Tin Cơ Bản
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Mô Tả & Quy Trình
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'faq' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Câu Hỏi FAQ
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'seo' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          SEO Meta Tags
        </button>
      </div>

      {/* Form panel */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tên dịch vụ */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-300">Tên dịch vụ *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Bảo Vệ Nhà Máy"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Đường dẫn tĩnh */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-300">Đường dẫn tĩnh (Slug) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: bao-ve-nha-may"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-mono font-light"
                />
              </div>

              {/* Hình ảnh banner */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-300">Ảnh đại diện / Banner (URL)</label>
                <input
                  type="text"
                  placeholder="Nhập liên kết ảnh unsplash hoặc đường dẫn ảnh..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Icon name lucide */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Tên Icon Lucide (Ví dụ: Shield, Building2, Calendar)</label>
                <input
                  type="text"
                  placeholder="Shield"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Thứ tự hiển thị */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Thứ tự ưu tiên hiển thị (order)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Giá Min */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Giá thấp nhất (VND) - Để trống nếu là thỏa thuận</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 15000000"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Giá Max */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Giá cao nhất (VND) - Để trống nếu là thỏa thuận</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 28000000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Đơn vị giá */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Đơn vị giá</label>
                <input
                  type="text"
                  placeholder="tháng/vị trí"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Trạng thái hoạt động */}
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-white/5 bg-secondary-dark accent-primary"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-gray-300 cursor-pointer">
                  Kích hoạt hiển thị công khai dịch vụ này
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & PROCESS */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Mô tả dịch vụ */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Mô tả dịch vụ chi tiết</label>
                <textarea
                  rows={4}
                  placeholder="Nhập nội dung giới thiệu chi tiết về dịch vụ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Phạm vi cung cấp */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Phạm vi cung cấp / Công việc cụ thể</label>
                <textarea
                  rows={4}
                  placeholder="Nhập danh sách công việc tuần tra kiểm soát (mỗi dòng một ý)..."
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Lợi ích mang lại */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Lợi ích mang lại cho khách hàng</label>
                <textarea
                  rows={4}
                  placeholder="Nhập các quyền lợi và cam kết đền bù bảo hiểm..."
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Dynamic Quy trình triển khai */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Quy Trình Triển Khai Dịch Vụ
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddProcess}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm Bước Quy Trình
                  </button>
                </div>

                <div className="space-y-4">
                  {processes.map((p, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-secondary-dark/40 border border-white/5 rounded-2xl relative group">
                      <div className="w-7 h-7 bg-primary/10 rounded-full border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                        {p.step}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 md:col-span-2">
                          <input
                            type="text"
                            placeholder="Tên bước (Ví dụ: Khảo sát thực tế)"
                            value={p.title}
                            onChange={(e) => handleProcessChange(idx, 'title', e.target.value)}
                            className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 transition-all"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <textarea
                            rows={2}
                            placeholder="Mô tả cụ thể nội dung triển khai ở bước này..."
                            value={p.description}
                            onChange={(e) => handleProcessChange(idx, 'description', e.target.value)}
                            className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                          />
                        </div>
                      </div>
                      {processes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProcess(idx)}
                          className="absolute right-4 top-4 p-1.5 bg-white/5 border border-white/5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Các Câu Hỏi Thường Gặp
                  </h4>
                  <p className="text-[10px] text-gray-500 font-light mt-0.5">
                    Các câu hỏi giúp tăng độ tin cậy và giải đáp nhanh thắc mắc của khách hàng trước khi đăng ký báo giá.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm Câu Hỏi FAQ
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 bg-secondary-dark/40 border border-white/5 rounded-2xl relative group space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <HelpCircle className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-bold">Câu hỏi #{idx + 1}</span>
                    </div>

                    <div className="space-y-3 font-light">
                      <div className="space-y-1">
                        <input
                          type="text"
                          placeholder="Nhập câu hỏi (Ví dụ: Dịch vụ bảo vệ có bao gồm bảo hiểm không?)"
                          value={faq.q}
                          onChange={(e) => handleFaqChange(idx, 'q', e.target.value)}
                          className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <textarea
                          rows={2}
                          placeholder="Nhập câu trả lời giải đáp chi tiết..."
                          value={faq.a}
                          onChange={(e) => handleFaqChange(idx, 'a', e.target.value)}
                          className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 transition-all"
                        />
                      </div>
                    </div>

                    {faqs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(idx)}
                        className="absolute right-4 top-4 p-1.5 bg-white/5 border border-white/5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-300">Thẻ Title SEO</label>
                  <span className={`text-[10px] font-mono ${metaTitle.length > 70 ? 'text-red-500' : 'text-gray-500'}`}>
                    {metaTitle.length}/70 ký tự
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Tiêu đề hiển thị trên thanh tab trình duyệt và kết quả Google..."
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-300">Thẻ Description SEO</label>
                  <span className={`text-[10px] font-mono ${metaDesc.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
                    {metaDesc.length}/160 ký tự
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Đoạn văn ngắn gọn (chứa từ khóa chính) thu hút người dùng nhấp chuột từ kết quả Google..."
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit notification status */}
        {status === 'error' && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs text-primary">
            {errorMessage}
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-xs text-emerald-500">
            Lưu thông tin dịch vụ thành công! Hệ thống đang tải lại...
          </div>
        )}

        {/* Save button */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/services"
            className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer"
          >
            Hủy Bỏ
          </Link>
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs md:text-sm shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {status === 'submitting' ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu Thay Đổi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
