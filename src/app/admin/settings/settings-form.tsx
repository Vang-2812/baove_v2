'use client'

import * as React from 'react'
import { Save, Info, BarChart2, Share2, MapPin, Edit, RefreshCw, HelpCircle, Globe, Home, FileText } from 'lucide-react'
import { saveSettings, updateBranch } from '../actions'

interface SettingsFormProps {
  initialSettings: Record<string, any>
  branches: any[]
}

export function SettingsForm({ initialSettings, branches: initialBranches }: SettingsFormProps) {
  const [activeTab, setActiveTab] = React.useState<'info' | 'seo' | 'home' | 'pages' | 'stats' | 'social' | 'branches'>('info')
  const [status, setStatus] = React.useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  // State fields mapped from initialSettings
  const [companyName, setCompanyName] = React.useState(initialSettings.company_name || 'Công Ty Cổ Phần Dịch Vụ Bảo Vệ Long Việt')
  const [companyHotline, setCompanyHotline] = React.useState(initialSettings.company_hotline || '0923 840 999')
  const [companyEmail, setCompanyEmail] = React.useState(initialSettings.company_email || 'info@baovelongviet.vn')
  const [companyAddress, setCompanyAddress] = React.useState(initialSettings.company_address || 'B23 Khu Dân Cư Nam Long, Phú Thuận, Quận 7, TP. HCM')

  // SEO & Web Name
  const [siteName, setSiteName] = React.useState(initialSettings.site_name || 'Long Việt Security')
  const [metaTitle, setMetaTitle] = React.useState(initialSettings.meta_title || 'Bảo Vệ Chuyên Nghiệp – An Toàn Tuyệt Đối')
  const [metaDescription, setMetaDescription] = React.useState(initialSettings.meta_description || 'Công Ty Dịch Vụ Bảo Vệ Long Việt chuyên nghiệp, uy tín. Cung cấp dịch vụ bảo vệ nhà máy, tòa nhà, sự kiện, yếu nhân an toàn 100%. Hotline: 0923 840 999.')

  // Homepage
  const [homeHeroTitle, setHomeHeroTitle] = React.useState(initialSettings.home_hero_title || 'Dịch Vụ Bảo Vệ Chuyên Nghiệp')
  const [homeHeroSubtitle, setHomeHeroSubtitle] = React.useState(initialSettings.home_hero_subtitle || 'An Toàn Tuyệt Đối – Kỷ Luật Thép – Phản Ứng Nhanh')
  const [homeAboutTitle, setHomeAboutTitle] = React.useState(initialSettings.home_about_title || 'Hành Trình Hơn 15 Năm Kiến Tạo Niềm Tin & Sự An Toàn Tuyệt Đối')
  const [homeAboutLead, setHomeAboutLead] = React.useState(initialSettings.home_about_lead || 'Thành lập từ năm 2009, Công Ty Dịch Vụ Bảo Vệ Long Việt đã khẳng định vị thế là một trong những doanh nghiệp cung cấp giải pháp an ninh chuyên nghiệp hàng đầu Việt Nam.')
  const [homeAboutBody, setHomeAboutBody] = React.useState(initialSettings.home_about_body || 'Chúng tôi không chỉ cung cấp dịch vụ bảo vệ đơn thuần mà mang đến giải pháp an ninh toàn diện được may đo phù hợp theo từng quy mô và nhu cầu cụ thể của doanh nghiệp, giúp bạn hoàn toàn an tâm tập trung sản xuất, kinh doanh.')

  // Page Subtitles
  const [subAbout, setSubAbout] = React.useState(initialSettings.sub_about || 'Hành trình xây dựng niềm tin và nền tảng an ninh bền vững')
  const [subVision, setSubVision] = React.useState(initialSettings.sub_vision || 'Kim chỉ nam dẫn lối mọi hành động của tập thể cán bộ chiến sĩ Long Việt Security')
  const [subDifference, setSubDifference] = React.useState(initialSettings.sub_difference || 'Tại sao hàng nghìn doanh nghiệp lựa chọn Long Việt thay vì tự tuyển bảo vệ nội bộ?')
  const [subHistory, setSubHistory] = React.useState(initialSettings.sub_history || 'Mốc son lịch sử đánh dấu sự trưởng thành và phát triển vượt trội của Long Việt')
  const [subOrg, setSubOrg] = React.useState(initialSettings.sub_org || 'Đội ngũ ban lãnh đạo bản lĩnh, chuyên nghiệp điều hành hệ thống an ninh tối tân')
  const [subPricing, setSubPricing] = React.useState(initialSettings.sub_pricing || 'Bảng báo giá các dịch vụ bảo vệ chuyên nghiệp cạnh tranh và minh bạch')
  const [subServices, setSubServices] = React.useState(initialSettings.sub_services || 'Danh mục các giải pháp an ninh toàn diện được thiết kế chuyên biệt cho mọi ngành nghề')
  const [subRecruitments, setSubRecruitments] = React.useState(initialSettings.sub_recruitments || 'Gia nhập đội ngũ vệ sĩ tinh nhuệ Long Việt với chế độ đãi ngộ và lộ trình thăng tiến tốt nhất')
  const [subNews, setSubNews] = React.useState(initialSettings.sub_news || 'Cập nhật các hoạt động thực địa, thông tin sự nghiệp an ninh và kiến thức bổ ích')
  const [subDocuments, setSubDocuments] = React.useState(initialSettings.sub_documents || 'Kho cẩm nang hướng dẫn nghiệp vụ, kỹ năng PCCC và sơ cấp cứu dành riêng cho chiến sĩ')
  const [subCooperation, setSubCooperation] = React.useState(initialSettings.sub_cooperation || 'Hợp tác liên kết bền vững – Cộng hưởng giá trị – Kiến tạo an tâm')
  const [subContact, setSubContact] = React.useState(initialSettings.sub_contact || 'Nhận khảo sát thực địa lỗ hổng an ninh miễn phí và tư vấn phương án tối ưu chi phí')

  // Stats
  const [statYears, setStatYears] = React.useState(initialSettings.stat_years || '15')
  const [statEmployees, setStatEmployees] = React.useState(initialSettings.stat_employees || '2000')
  const [statProjects, setStatProjects] = React.useState(initialSettings.stat_projects || '1500')
  const [statBranches, setStatBranches] = React.useState(initialSettings.stat_branches || '5')

  // Social URLs
  const [facebookUrl, setFacebookUrl] = React.useState(initialSettings.facebook_url || 'https://facebook.com/baovelongviet')
  const [zaloUrl, setZaloUrl] = React.useState(initialSettings.zalo_url || 'https://zalo.me/0923840999')
  const [youtubeUrl, setYoutubeUrl] = React.useState(initialSettings.youtube_url || 'https://youtube.com/baovelongviet')

  // Branches
  const [branches, setBranches] = React.useState(initialBranches)
  const [editingBranchId, setEditingBranchId] = React.useState<string | null>(null)
  
  // Branch fields
  const [branchName, setBranchName] = React.useState('')
  const [branchAddress, setBranchAddress] = React.useState('')
  const [branchPhone, setBranchPhone] = React.useState('')
  const [branchEmail, setBranchEmail] = React.useState('')
  const [branchMap, setBranchMap] = React.useState('')
  const [branchUpdating, setBranchUpdating] = React.useState(false)

  // Trigger editing a branch
  const handleEditBranch = (branch: any) => {
    setEditingBranchId(branch.id)
    setBranchName(branch.name)
    setBranchAddress(branch.address)
    setBranchPhone(branch.phone)
    setBranchEmail(branch.email || '')
    setBranchMap(branch.map_embed_url || '')
  }

  // Save branch
  const handleSaveBranch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBranchId) return
    setBranchUpdating(true)

    const payload = {
      name: branchName,
      address: branchAddress,
      phone: branchPhone,
      email: branchEmail,
      map_embed_url: branchMap,
    }

    const res = await updateBranch(editingBranchId, payload)
    if (res.success) {
      setBranches(
        branches.map((b) => (b.id === editingBranchId ? { ...b, ...payload } : b))
      )
      setEditingBranchId(null)
    } else {
      alert(res.error || 'Lỗi khi cập nhật chi nhánh.')
    }
    setBranchUpdating(false)
  }

  // Save main settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    setErrorMessage('')

    const payload = {
      company_name: companyName,
      company_hotline: companyHotline,
      company_email: companyEmail,
      company_address: companyAddress,
      
      stat_years: statYears,
      stat_employees: statEmployees,
      stat_projects: statProjects,
      stat_branches: statBranches,

      facebook_url: facebookUrl,
      zalo_url: zaloUrl,
      youtube_url: youtubeUrl,

      site_name: siteName,
      meta_title: metaTitle,
      meta_description: metaDescription,

      home_hero_title: homeHeroTitle,
      home_hero_subtitle: homeHeroSubtitle,
      home_about_title: homeAboutTitle,
      home_about_lead: homeAboutLead,
      home_about_body: homeAboutBody,

      sub_about: subAbout,
      sub_vision: subVision,
      sub_difference: subDifference,
      sub_history: subHistory,
      sub_org: subOrg,
      sub_pricing: subPricing,
      sub_services: subServices,
      sub_recruitments: subRecruitments,
      sub_news: subNews,
      sub_documents: subDocuments,
      sub_cooperation: subCooperation,
      sub_contact: subContact,
    }

    const res = await saveSettings(payload)
    if (res.success) {
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } else {
      setStatus('error')
      setErrorMessage(res.error || 'Lỗi khi lưu cấu hình.')
    }
  }

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Tabs list */}
      <div className="flex border-b border-white/5 gap-2 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Thông Tin Liên Hệ</span>
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'seo' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>SEO & Metadata</span>
        </button>
        <button
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'home' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Giới Thiệu Trang Chủ</span>
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'pages' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Giới Thiệu Các Trang</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'stats' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Thống Kê</span>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'social' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Mạng Xã Hội</span>
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2.5 font-bold text-xs md:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'branches' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Chi Nhánh Đại Diện</span>
        </button>
      </div>

      {/* Forms Panels */}
      {activeTab !== 'branches' ? (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
            
            {/* TAB 1: INFO */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-300">Tên công ty doanh nghiệp *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Số Hotline đại diện *</label>
                  <input
                    type="text"
                    required
                    value={companyHotline}
                    onChange={(e) => setCompanyHotline(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Email giao dịch chính *</label>
                  <input
                    type="email"
                    required
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-gray-300">Địa chỉ văn phòng chính *</label>
                  <input
                    type="text"
                    required
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>
              </div>
            )}

            {/* TAB: SEO & METADATA */}
            {activeTab === 'seo' && (
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Tên thương hiệu website (Site Name) *</label>
                  <input
                    type="text"
                    required
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Tiêu đề SEO trang chủ (Meta Title) *</label>
                  <input
                    type="text"
                    required
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Mô tả SEO trang chủ (Meta Description) *</label>
                  <textarea
                    rows={4}
                    required
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light resize-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: HOMEPAGE INTRO TEXTS */}
            {activeTab === 'home' && (
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Tiêu đề biểu ngữ chính trang chủ (Hero Title) *</label>
                  <input
                    type="text"
                    required
                    value={homeHeroTitle}
                    onChange={(e) => setHomeHeroTitle(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Phụ đề biểu ngữ chính trang chủ (Hero Subtitle) *</label>
                  <input
                    type="text"
                    required
                    value={homeHeroSubtitle}
                    onChange={(e) => setHomeHeroSubtitle(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left border-t border-white/5 pt-6">
                  <label className="text-xs font-bold text-gray-300">Tiêu đề phần Giới thiệu trang chủ (About Title) *</label>
                  <input
                    type="text"
                    required
                    value={homeAboutTitle}
                    onChange={(e) => setHomeAboutTitle(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Đoạn tóm tắt phần Giới thiệu trang chủ (About Lead Copy) *</label>
                  <textarea
                    rows={3}
                    required
                    value={homeAboutLead}
                    onChange={(e) => setHomeAboutLead(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light resize-none"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Nội dung chi tiết phần Giới thiệu trang chủ (About Body Copy) *</label>
                  <textarea
                    rows={4}
                    required
                    value={homeAboutBody}
                    onChange={(e) => setHomeAboutBody(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light resize-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: PAGE SUBTITLES */}
            {activeTab === 'pages' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Về Chúng Tôi (About us)</label>
                  <input
                    type="text"
                    value={subAbout}
                    onChange={(e) => setSubAbout(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Tầm Nhìn & Sứ Mệnh</label>
                  <input
                    type="text"
                    value={subVision}
                    onChange={(e) => setSubVision(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Sự Khác Biệt</label>
                  <input
                    type="text"
                    value={subDifference}
                    onChange={(e) => setSubDifference(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Quá Trình Hình Thành</label>
                  <input
                    type="text"
                    value={subHistory}
                    onChange={(e) => setSubHistory(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Cơ Cấu Tổ Chức</label>
                  <input
                    type="text"
                    value={subOrg}
                    onChange={(e) => setSubOrg(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Xem Bảng Giá</label>
                  <input
                    type="text"
                    value={subPricing}
                    onChange={(e) => setSubPricing(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu danh mục Dịch Vụ</label>
                  <input
                    type="text"
                    value={subServices}
                    onChange={(e) => setSubServices(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Tuyển Dụng</label>
                  <input
                    type="text"
                    value={subRecruitments}
                    onChange={(e) => setSubRecruitments(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Tin Tức</label>
                  <input
                    type="text"
                    value={subNews}
                    onChange={(e) => setSubNews(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Thư Viện Tài Liệu</label>
                  <input
                    type="text"
                    value={subDocuments}
                    onChange={(e) => setSubDocuments(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Hợp Tác</label>
                  <input
                    type="text"
                    value={subCooperation}
                    onChange={(e) => setSubCooperation(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Lời giới thiệu trang Liên Hệ</label>
                  <input
                    type="text"
                    value={subContact}
                    onChange={(e) => setSubContact(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: STATS */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Số năm kinh nghiệm</label>
                  <input
                    type="text"
                    value={statYears}
                    onChange={(e) => setStatYears(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Tổng số vệ sĩ / cán bộ</label>
                  <input
                    type="text"
                    value={statEmployees}
                    onChange={(e) => setStatEmployees(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Tổng dự án hoàn thành</label>
                  <input
                    type="text"
                    value={statProjects}
                    onChange={(e) => setStatProjects(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Mạng lưới chi nhánh</label>
                  <input
                    type="text"
                    value={statBranches}
                    onChange={(e) => setStatBranches(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL */}
            {activeTab === 'social' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Đường dẫn Facebook</label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Đường dẫn Zalo (Số điện thoại / link)</label>
                  <input
                    type="text"
                    value={zaloUrl}
                    onChange={(e) => setZaloUrl(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-gray-300">Kênh YouTube chính thức</label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full bg-secondary-dark/60 border border-white/5 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit status bar */}
          {status === 'error' && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs text-primary">
              {errorMessage}
            </div>
          )}

          {status === 'success' && (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-xs text-emerald-500">
              Lưu cấu hình hệ thống thành công!
            </div>
          )}

          {/* Submit button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={status === 'saving'}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 text-xs md:text-sm shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {status === 'saving' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Lưu Thay Đổi</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* TAB 4: REGIONAL BRANCHES */
        <div className="space-y-8">
          <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-3">
                    <th className="pb-3 pr-4">Tên chi nhánh / Văn phòng</th>
                    <th className="pb-3 pr-4">Địa chỉ văn phòng</th>
                    <th className="pb-3 pr-4">Số điện thoại</th>
                    <th className="pb-3 pr-4">Email</th>
                    <th className="pb-3 pr-4 w-28 text-center font-bold">Loại</th>
                    <th className="pb-3 w-20 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-gray-300 font-light font-sans">
                  {branches.map((b) => (
                    <tr key={b.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 pr-4 font-bold text-white whitespace-nowrap">{b.name}</td>
                      <td className="py-4 pr-4">{b.address}</td>
                      <td className="py-4 pr-4 whitespace-nowrap font-mono">{b.phone}</td>
                      <td className="py-4 pr-4 whitespace-nowrap">{b.email || 'N/A'}</td>
                      <td className="py-4 pr-4 text-center whitespace-nowrap">
                        {b.is_main ? (
                          <span className="text-[9px] font-extrabold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10 uppercase">
                            Trụ sở chính
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">
                            Chi nhánh
                          </span>
                        )}
                      </td>
                      <td className="py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEditBranch(b)}
                          className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all cursor-pointer"
                          title="Chỉnh Sửa Chi Nhánh"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Editing Branch Modal / Drawer */}
          {editingBranchId && (
            <div className="fixed inset-0 bg-secondary-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-secondary border border-white/5 w-full max-w-2xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    Cập Nhật Chi Nhánh
                  </h3>
                </div>

                <form onSubmit={handleSaveBranch} className="space-y-4 text-left font-sans">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Tên chi nhánh *</label>
                    <input
                      type="text"
                      required
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full bg-secondary-dark border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Địa chỉ cụ thể *</label>
                    <input
                      type="text"
                      required
                      value={branchAddress}
                      onChange={(e) => setBranchAddress(e.target.value)}
                      className="w-full bg-secondary-dark border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">Số điện thoại *</label>
                      <input
                        type="text"
                        required
                        value={branchPhone}
                        onChange={(e) => setBranchPhone(e.target.value)}
                        className="w-full bg-secondary-dark border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-300">Email chi nhánh</label>
                      <input
                        type="email"
                        value={branchEmail}
                        onChange={(e) => setBranchEmail(e.target.value)}
                        className="w-full bg-secondary-dark border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Google Maps embed */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Liên kết bản đồ nhúng (iframe URL)</label>
                    <input
                      type="text"
                      value={branchMap}
                      onChange={(e) => setBranchMap(e.target.value)}
                      className="w-full bg-secondary-dark border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white"
                      placeholder="https://google.com/maps/embed/..."
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingBranchId(null)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                    >
                      Hủy Bỏ
                    </button>
                    <button
                      type="submit"
                      disabled={branchUpdating}
                      className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-5 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {branchUpdating ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang cập nhật...</span>
                        </>
                      ) : (
                        <span>Cập nhật</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
