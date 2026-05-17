'use client'

import * as React from 'react'
import {
  MessageSquare,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  Save,
  CheckCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react'

interface ContactItem {
  id: string
  name: string
  phone: string
  email: string | null
  province: string | null
  service_type: string | null
  title: string | null
  message: string
  source: string | null
  status: 'NEW' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'
  note: string | null
  handled_by: string | null
  handled_at: string | null
  created_at: string
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = React.useState<ContactItem[]>([])
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [page, setPage] = React.useState<number>(1)
  const [totalPages, setTotalPages] = React.useState<number>(1)
  const [totalRecords, setTotalRecords] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  // Selected lead for detail view
  const [selectedLead, setSelectedLead] = React.useState<ContactItem | null>(null)
  const [leadStatus, setLeadStatus] = React.useState<string>('NEW')
  const [leadNote, setLeadNote] = React.useState<string>('')
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false)
  const [saveSuccess, setSaveSuccess] = React.useState<boolean>(false)

  const fetchContacts = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('adminAccessToken')
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        status: statusFilter,
        search: searchQuery,
      })

      const res = await fetch(`/api/admin/contacts?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setContacts(data.contacts)
        setTotalPages(data.pagination.totalPages)
        setTotalRecords(data.pagination.total)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [page, statusFilter, searchQuery])

  React.useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  // If a lead is in the query params, auto-open it
  React.useEffect(() => {
    if (contacts.length > 0 && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const leadId = urlParams.get('id')
      if (leadId) {
        const found = contacts.find((c) => c.id === leadId)
        if (found) {
          handleSelectLead(found)
        }
      }
    }
  }, [contacts])

  const handleSelectLead = (lead: ContactItem) => {
    setSelectedLead(lead)
    setLeadStatus(lead.status)
    setLeadNote(lead.note || '')
    setSaveSuccess(false)
  }

  const handleUpdateStatus = async () => {
    if (!selectedLead) return
    setIsUpdating(true)
    setSaveSuccess(false)
    try {
      const token = localStorage.getItem('adminAccessToken')
      const res = await fetch(`/api/admin/contacts/${selectedLead.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: leadStatus,
          note: leadNote,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSaveSuccess(true)
        // Refresh local items
        setContacts((prev) =>
          prev.map((c) => (c.id === selectedLead.id ? data.contact : c))
        )
        setSelectedLead(data.contact)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Update failed:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'Mới'
      case 'IN_PROGRESS':
        return 'Đang xử lý'
      case 'DONE':
        return 'Hoàn thành'
      case 'CANCELLED':
        return 'Hủy bỏ'
      default:
        return status
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="text-[10px] font-extrabold text-blue-500 bg-blue-500/5 px-2.5 py-0.5 rounded-full border border-blue-500/10 uppercase tracking-wider">
            Mới
          </span>
        )
      case 'IN_PROGRESS':
        return (
          <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/5 px-2.5 py-0.5 rounded-full border border-amber-500/10 uppercase tracking-wider">
            Đang Xử Lý
          </span>
        )
      case 'DONE':
        return (
          <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/10 uppercase tracking-wider">
            Hoàn thành
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="text-[10px] font-extrabold text-gray-500 bg-gray-500/5 px-2.5 py-0.5 rounded-full border border-gray-500/10 uppercase tracking-wider">
            Đã Hủy
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. FILTER BAR PANEL */}
      <div className="bg-secondary-light/10 border border-white/5 p-5 rounded-3xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Toggle Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
          {['ALL', 'NEW', 'IN_PROGRESS', 'DONE', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === s
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {s === 'ALL' ? 'Tất cả' : getStatusLabel(s)}
            </button>
          ))}
        </div>

        {/* Search Input Box */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="w-full bg-secondary-dark border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
          />
        </div>
      </div>

      {/* 2. SPLIT WORKSPACE: TABLE & DETAIL DRAWER */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-6 items-start">
        
        {/* Left: Contact List Table */}
        <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md overflow-hidden space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-3">
                  <th className="pb-3 pr-4">Thời Gian</th>
                  <th className="pb-3 pr-4">Họ Tên</th>
                  <th className="pb-3 pr-4">Số Điện Thoại</th>
                  <th className="pb-3 pr-4">Dịch Vụ Quan Tâm</th>
                  <th className="pb-3 pr-4">Khu Vực</th>
                  <th className="pb-3 pr-4">Nguồn</th>
                  <th className="pb-3 pr-4">Trạng Thái</th>
                  <th className="pb-3">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300 font-light">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Đang tải danh sách yêu cầu...
                    </td>
                  </tr>
                ) : contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <tr
                      key={contact.id}
                      onClick={() => handleSelectLead(contact)}
                      className={`hover:bg-white/[0.01] transition-colors cursor-pointer ${
                        selectedLead?.id === contact.id ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {new Date(contact.created_at).toLocaleDateString('vi-VN')} {new Date(contact.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 pr-4 font-bold text-white whitespace-nowrap">
                        {contact.name}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <a
                          href={`tel:${contact.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{contact.phone}</span>
                        </a>
                      </td>
                      <td className="py-4 pr-4 truncate max-w-[150px]">
                        {contact.service_type || 'Tư vấn chung'}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {contact.province || 'Chưa chọn'}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {contact.source === 'homepage_form' ? 'Trang chủ' : contact.source === 'service_page' ? 'Trang dịch vụ' : 'Trang liên hệ'}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {getStatusBadge(contact.status)}
                      </td>
                      <td className="py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleSelectLead(contact)}
                          className="p-1.5 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Không tìm thấy yêu cầu tư vấn nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-white/5 font-sans">
              <span className="text-xs text-gray-400 font-light">
                Hiển thị trang <strong className="text-white font-bold">{page}</strong> trên <strong className="text-white font-bold">{totalPages}</strong> trang ({totalRecords} leads)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Lead Detail Sidebar Card */}
        {selectedLead && (
          <div className="w-full xl:w-96 bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-6 text-left animate-in slide-in-from-right duration-250">
            {/* Header info */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <h3 className="font-heading font-extrabold text-base text-white">
                  Chi Tiết Yêu Cầu
                </h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-extrabold font-sans">
                  ID: {selectedLead.id.substring(0, 12)}...
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Fields List */}
            <div className="space-y-4 font-sans text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 leading-none">Khách hàng</p>
                  <strong className="text-white font-bold mt-1 block">{selectedLead.name}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 leading-none">Số điện thoại</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-white font-bold hover:text-primary mt-1 block">
                    {selectedLead.phone}
                  </a>
                </div>
              </div>

              {selectedLead.email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 leading-none">Email</p>
                    <a href={`mailto:${selectedLead.email}`} className="text-white font-light hover:text-primary mt-1 block">
                      {selectedLead.email}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 leading-none">Khu vực</p>
                  <strong className="text-white font-bold mt-1 block">{selectedLead.province || 'Chưa xác định'}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 leading-none">Thời gian gửi</p>
                  <strong className="text-white font-light mt-1 block">
                    {new Date(selectedLead.created_at).toLocaleDateString('vi-VN')} {new Date(selectedLead.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </strong>
                </div>
              </div>
            </div>

            {/* Message Box */}
            <div className="space-y-1.5 font-sans">
              <label className="text-[10px] uppercase font-extrabold tracking-widest text-gray-500">
                Nội dung yêu cầu
              </label>
              <div className="bg-secondary-dark border border-white/5 p-3.5 rounded-2xl text-xs text-gray-300 font-light leading-relaxed max-h-36 overflow-y-auto whitespace-pre-line">
                {selectedLead.message}
              </div>
            </div>

            {/* Internal Action Panel */}
            <div className="space-y-4 pt-4 border-t border-white/5 font-sans">
              {/* Status Select Box */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-widest text-gray-500">
                  Trạng thái xử lý
                </label>
                <select
                  value={leadStatus}
                  onChange={(e) => setLeadStatus(e.target.value)}
                  className="w-full bg-secondary-dark border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="NEW">Mới</option>
                  <option value="IN_PROGRESS">Đang xử lý</option>
                  <option value="DONE">Hoàn thành</option>
                  <option value="CANCELLED">Hủy bỏ</option>
                </select>
              </div>

              {/* Internal Notes Textarea */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-extrabold tracking-widest text-gray-500">
                  Ghi chú nội bộ
                </label>
                <textarea
                  placeholder="Ghi lại tiến độ liên hệ hoặc ghi chú riêng..."
                  value={leadNote}
                  onChange={(e) => setLeadNote(e.target.value)}
                  rows={3}
                  className="w-full bg-secondary-dark border border-white/5 rounded-xl p-3.5 text-xs text-gray-300 font-light placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              {/* Handled status tracking */}
              {selectedLead.handled_by && (
                <div className="bg-white/5 border border-white/5 p-3 rounded-2xl text-[10px] text-gray-400 font-light">
                  <p>Người xử lý: <strong className="text-white">{selectedLead.handled_by}</strong></p>
                  {selectedLead.handled_at && (
                    <p className="mt-0.5">Thời gian: {new Date(selectedLead.handled_at).toLocaleDateString('vi-VN')} {new Date(selectedLead.handled_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                  )}
                </div>
              )}

              {saveSuccess && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-2 text-emerald-500 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Đã cập nhật yêu cầu thành công.</span>
                </div>
              )}

              {/* Save & Call CTA buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isUpdating ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
                </button>
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="px-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-xl flex items-center justify-center transition-all"
                  title="Gọi Điện Ngay"
                >
                  <Phone className="w-4 h-4 text-primary" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
