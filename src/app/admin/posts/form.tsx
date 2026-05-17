'use client'

import * as React from 'react'
import { ArrowLeft, Save, FileText, Image, Globe, Tag } from 'lucide-react'
import Link from 'next/link'
import { upsertPost } from '../actions'

interface PostFormProps {
  id: string | null
  initialData?: any
  categories: any[]
}

export function PostForm({ id, initialData, categories }: PostFormProps) {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [activeTab, setActiveTab] = React.useState<'content' | 'seo'>('content')

  // Fields
  const [title, setTitle] = React.useState(initialData?.title || '')
  const [slug, setSlug] = React.useState(initialData?.slug || '')
  const [content, setContent] = React.useState(initialData?.content || '')
  const [excerpt, setExcerpt] = React.useState(initialData?.excerpt || '')
  const [thumbnail, setThumbnail] = React.useState(initialData?.thumbnail || '')
  const [type, setType] = React.useState(initialData?.type || 'BLOG')
  const [postStatus, setPostStatus] = React.useState(initialData?.status || 'DRAFT')
  const [categoryId, setCategoryId] = React.useState(initialData?.category_id || '')
  const [metaTitle, setMetaTitle] = React.useState(initialData?.meta_title || '')
  const [metaDesc, setMetaDesc] = React.useState(initialData?.meta_desc || '')
  const [tagsInput, setTagsInput] = React.useState(initialData?.tags?.join(', ') || '')

  // Filter categories based on selected Type (BLOG vs DOCUMENT)
  const filteredCategories = categories.filter((cat) => cat.type === type)

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
    if (!title || !slug || !content) {
      setErrorMessage('Vui lòng điền tiêu đề, đường dẫn tĩnh và nội dung bài viết.')
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const tags = tagsInput
      .split(',')
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0)

    const payload = {
      title,
      slug,
      content,
      excerpt,
      thumbnail,
      type,
      status: postStatus,
      category_id: categoryId || null,
      meta_title: metaTitle,
      meta_desc: metaDesc,
      tags,
    }

    const res = await upsertPost(id, payload)
    if (res.success) {
      setStatus('success')
      window.location.href = '/admin/posts'
    } else {
      setStatus('error')
      setErrorMessage(res.error || 'Đã xảy ra lỗi khi lưu bài viết.')
    }
  }

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/posts"
          className="p-2.5 bg-white/5 border border-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary shrink-0" />
            <span>{id ? 'Chỉnh Sửa Bài Viết' : 'Viết Bài Mới'}</span>
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            {id ? `Mã bài viết: ${id}` : 'Thêm tin tức, sự kiện hoặc tài liệu hướng dẫn nghiệp vụ vệ sĩ mới.'}
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
          Nội Dung Bài Viết
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

      {/* Form panel */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          {activeTab === 'content' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Form: title, slug, content, excerpt */}
              <div className="lg:col-span-2 space-y-6">
                {/* Tiêu đề */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Tiêu đề bài viết *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Lễ Ra Quân Bảo Vệ Sự Kiện Năm 2026..."
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
                    placeholder="le-ra-quan-bao-ve-su-kien-2026"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-mono font-light"
                  />
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Tóm tắt ngắn gọn (Sapo)</label>
                  <textarea
                    rows={3}
                    placeholder="Đoạn mô tả ngắn hiển thị ở trang danh sách..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                {/* Nội dung soạn thảo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Nội dung chi tiết (Hỗ trợ định dạng HTML/Text) *</label>
                  <textarea
                    rows={12}
                    required
                    placeholder="Soạn thảo nội dung bài viết bằng mã HTML hoặc văn bản thường tại đây..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light font-mono"
                  />
                </div>
              </div>

              {/* Right Sidebar: configuration */}
              <div className="space-y-6">
                {/* Cài đặt đăng tải */}
                <div className="p-6 bg-secondary-dark/40 border border-white/5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-primary" />
                    <span>Cài Đặt Đăng Tải</span>
                  </h4>

                  <div className="space-y-3 font-light text-xs">
                    {/* Thể loại */}
                    <div className="space-y-1">
                      <label className="text-gray-400">Loại bài viết</label>
                      <select
                        value={type}
                        onChange={(e) => {
                          setType(e.target.value)
                          setCategoryId('')
                        }}
                        className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50"
                      >
                        <option value="BLOG">Tin Tức / Blog</option>
                        <option value="DOCUMENT">Tài Liệu Nghiệp Vụ</option>
                      </select>
                    </div>

                    {/* Danh mục */}
                    <div className="space-y-1">
                      <label className="text-gray-400">Danh mục phân loại</label>
                      <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50"
                      >
                        <option value="">Chọn danh mục...</option>
                        {filteredCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Trạng thái bài viết */}
                    <div className="space-y-1">
                      <label className="text-gray-400">Trạng thái hiển thị</label>
                      <select
                        value={postStatus}
                        onChange={(e) => setPostStatus(e.target.value)}
                        className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50"
                      >
                        <option value="DRAFT">Nháp (Ẩn)</option>
                        <option value="PUBLISHED">Công khai (Đăng ngay)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ảnh đại diện bài viết */}
                <div className="p-6 bg-secondary-dark/40 border border-white/5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Image className="w-4 h-4 text-primary" />
                    <span>Ảnh Đại Diện (Thumbnail)</span>
                  </h4>

                  <div className="space-y-3 font-light text-xs">
                    <input
                      type="text"
                      placeholder="Nhập liên kết ảnh URL..."
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50"
                    />
                    {thumbnail && (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary-dark border border-white/5">
                        <img src={thumbnail} alt="Preview" className="object-cover w-full h-full" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Từ khóa tags */}
                <div className="p-6 bg-secondary-dark/40 border border-white/5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-primary" />
                    <span>Từ Khóa / Tags</span>
                  </h4>

                  <div className="space-y-2 text-xs font-light">
                    <input
                      type="text"
                      placeholder="Cách nhau bằng dấu phẩy (,)..."
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full bg-secondary-dark border border-white/5 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary/50"
                    />
                    <p className="text-[10px] text-gray-500 font-light">
                      Ví dụ: Bảo vệ, Nghiệp vụ, PCCC, Liveshow
                    </p>
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
                  placeholder="Tiêu đề hiển thị trên Google..."
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
                  placeholder="Đoạn văn ngắn gọn thu hút người dùng nhấp chuột..."
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                />
              </div>
            </div>
          )}
        </div>

        {/* Status indicator */}
        {status === 'error' && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs text-primary">
            {errorMessage}
          </div>
        )}

        {status === 'success' && (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-xs text-emerald-500">
            Lưu bài viết thành công! Đang chuyển hướng...
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/posts"
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
                <span>Lưu Bài Viết</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
