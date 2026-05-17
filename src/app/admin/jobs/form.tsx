'use client'

import * as React from 'react'
import { ArrowLeft, Save, Briefcase, MapPin, DollarSign, Globe } from 'lucide-react'
import Link from 'next/link'
import { upsertJob } from '../actions'

interface JobFormProps {
  id: string | null
  initialData?: any
}

export function JobForm({ id, initialData }: JobFormProps) {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<'content' | 'seo'>('content')

  // Fields
  const [title, setTitle] = React.useState(initialData?.title || '')
  const [slug, setSlug] = React.useState(initialData?.slug || '')
  const [location, setLocation] = React.useState(initialData?.location || '')
  const [salaryRange, setSalaryRange] = React.useState(initialData?.salary_range || '')
  const [type, setType] = React.useState(initialData?.type || 'FULLTIME')
  const [jobStatus, setJobStatus] = React.useState(initialData?.status || 'OPEN')
  const [description, setDescription] = React.useState(initialData?.description || '')
  const [requirements, setRequirements] = React.useState(initialData?.requirements || '')
  const [benefits, setBenefits] = React.useState(initialData?.benefits || '')
  const [metaTitle, setMetaTitle] = React.useState(initialData?.meta_title || '')
  const [metaDesc, setMetaDesc] = React.useState(initialData?.meta_desc || '')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !description) {
      setErrorMessage('Vui lòng nhập tiêu đề, đường dẫn tĩnh và mô tả công việc.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      title,
      slug,
      location,
      salary_range: salaryRange,
      type,
      status: jobStatus,
      description,
      requirements,
      benefits,
      meta_title: metaTitle,
      meta_desc: metaDesc,
    }

    const res = await upsertJob(id, payload)
    if (res.success) {
      setStatus('success')
      window.location.href = '/admin/jobs'
    } else {
      setStatus('error')
      setErrorMessage(res.error || 'Lỗi khi lưu tin tuyển dụng.')
    }
  }

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/jobs"
          className="p-2.5 bg-white/5 border border-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary shrink-0" />
            <span>{id ? 'Chỉnh Sửa Tin Tuyển Dụng' : 'Đăng Tuyển Dụng Mới'}</span>
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            {id ? `Mã tin: ${id}` : 'Đăng tin vị trí bảo vệ/vệ sĩ chất lượng cao thu hút nhân tài.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-2 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          Nội Dung Tuyển Dụng
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'seo' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          SEO Meta Tags
        </button>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          {activeTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Column: detailed description */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tiêu đề */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Tiêu đề tin tuyển dụng *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nhân Viên Bảo Vệ Nhà Máy Lương Cao..."
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Đường dẫn tĩnh (Slug) *</label>
                  <input
                    type="text"
                    required
                    placeholder="nhan-vien-bao-ve-nha-may-luong-cao"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-mono font-light"
                  />
                </div>

                {/* Mô tả công việc */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Mô tả công việc (HTML/Text) *</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Nhập nội dung mô tả chi tiết công việc cụ thể..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light font-mono"
                  />
                </div>

                {/* Yêu cầu công việc */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Yêu cầu đối với ứng viên (HTML/Text)</label>
                  <textarea
                    rows={6}
                    placeholder="Nhập các yêu cầu về độ tuổi, chiều cao, bằng cấp, lý lịch..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light font-mono"
                  />
                </div>

                {/* Quyền lợi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Quyền lợi và chế độ (HTML/Text)</label>
                  <textarea
                    rows={6}
                    placeholder="Nhập các quyền lợi về lương thưởng, bảo hiểm, hỗ trợ nhà ở nội trú..."
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light font-mono"
                  />
                </div>
              </div>

              {/* Right Column: sidebar */}
              <div className="space-y-6">
                {/* Thông tin tuyển dụng */}
                <div className="p-6 bg-secondary-dark/40 border border-white/5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-primary" />
                    <span>Chi Tiết Công Việc</span>
                  </h4>

                  <div className="space-y-3 font-light text-xs">
                    {/* Khu vực */}
                    <div className="space-y-1">
                      <label className="text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Địa bàn làm việc
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: TP.HCM, Bình Dương"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>

                    {/* Mức lương */}
                    <div className="space-y-1">
                      <label className="text-gray-400 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> Mức lương hàng tháng
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: 8.5 - 12 triệu"
                        value={salaryRange}
                        onChange={(e) => setSalaryRange(e.target.value)}
                        className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>

                    {/* Hình thức */}
                    <div className="space-y-1">
                      <label className="text-gray-400">Hình thức làm việc</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50"
                      >
                        <option value="FULLTIME">Toàn thời gian (Full-time)</option>
                        <option value="PARTTIME">Bán thời gian (Part-time)</option>
                        <option value="CONTRACT">Hợp đồng ngắn hạn</option>
                      </select>
                    </div>

                    {/* Trạng thái tuyển dụng */}
                    <div className="space-y-1">
                      <label className="text-gray-400">Trạng thái đăng tuyển</label>
                      <select
                        value={jobStatus}
                        onChange={(e) => setJobStatus(e.target.value)}
                        className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50"
                      >
                        <option value="OPEN">Đang tuyển (Công khai)</option>
                        <option value="PAUSED">Tạm dừng nhận hồ sơ</option>
                        <option value="CLOSED">Đã đóng tuyển dụng</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEO META */}
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
                  placeholder="Tiêu đề tin tuyển dụng trên kết quả Google..."
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
                  placeholder="Đoạn mô tả ngắn gọn về công việc thu hút ứng viên nhấp chuột..."
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>
            </div>
          )}
        </div>

        {/* Status indicators */}
        {status === 'error' && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs text-primary">
            {errorMessage}
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-xs text-emerald-500">
            Lưu tin tuyển dụng thành công! Đang quay lại...
          </div>
        )}

        {/* Form controls */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/jobs"
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
                <span>Đăng Tuyển Dụng</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
