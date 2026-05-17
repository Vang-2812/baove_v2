'use client'

import * as React from 'react'
import { FileText, Download, Phone, Mail, CheckCircle, Search, RefreshCw, XCircle } from 'lucide-react'
import { updateApplicationStatus } from '../actions'

interface ApplicationsListProps {
  initialApplications: any[]
  jobs: any[]
}

export function ApplicationsList({ initialApplications, jobs }: ApplicationsListProps) {
  const [applications, setApplications] = React.useState(initialApplications)
  const [selectedJobId, setSelectedJobId] = React.useState('')
  const [selectedStatus, setSelectedStatus] = React.useState('')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [updatingId, setUpdatingId] = React.useState<string | null>(null)

  // Status mapping and styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'text-blue-500 bg-blue-500/5 border-blue-500/10'
      case 'REVIEWING':
        return 'text-amber-500 bg-amber-500/5 border-amber-500/10'
      case 'ACCEPTED':
        return 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'
      case 'REJECTED':
        return 'text-red-500 bg-red-500/5 border-red-500/10'
      default:
        return 'text-gray-500 bg-gray-500/5 border-gray-500/10'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'Mới Nhận'
      case 'REVIEWING':
        return 'Đang Duyệt'
      case 'ACCEPTED':
        return 'Nhận Việc'
      case 'REJECTED':
        return 'Từ Chối'
      default:
        return status
    }
  }

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    const res = await updateApplicationStatus(id, newStatus as any)
    if (res.success) {
      setApplications(
        applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      )
    } else {
      alert(res.error || 'Không thể cập nhật trạng thái.')
    }
    setUpdatingId(null)
  }

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesJob = selectedJobId ? app.job_id === selectedJobId : true
    const matchesStatus = selectedStatus ? app.status === selectedStatus : true
    const matchesSearch = searchQuery
      ? app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone.includes(searchQuery) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesJob && matchesStatus && matchesSearch
  })

  // Export to CSV with UTF-8 BOM
  const exportToExcel = () => {
    const headers = [
      'STT',
      'Họ và Tên',
      'Số Điện Thoại',
      'Email',
      'Vị Trí Ứng Tuyển',
      'Kinh Nghiệm (Năm)',
      'Khu Vực Mong Muốn',
      'Trạng Thái',
      'Ngày Nộp Hồ Sơ',
      'Ghi Chú',
    ]

    const rows = filteredApps.map((app, idx) => [
      idx + 1,
      app.name,
      app.phone,
      app.email,
      app.job?.title || 'Khác',
      app.experience_years || 'Chưa cập nhật',
      app.preferred_location || 'Chưa cập nhật',
      getStatusLabel(app.status),
      new Date(app.created_at).toLocaleDateString('vi-VN'),
      app.note || '',
    ])

    const csvContent =
      '\uFEFF' + // UTF-8 BOM to ensure Vietnamese characters are read correctly in Excel
      [headers.join(','), ...rows.map((row) => row.map((val) => `"${val}"`).join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `Danh_sach_ung_vien_${new Date().toLocaleDateString('vi-VN').replace(/\//g, '_')}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Filters Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md items-end">
        {/* Search */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Tìm kiếm</label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tên, số điện thoại..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary-dark border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
            />
          </div>
        </div>

        {/* Vị trí tuyển dụng */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Vị Trí Đang Tuyển</label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full bg-secondary-dark border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
          >
            <option value="">Tất cả vị trí</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        {/* Trạng thái duyệt */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Trạng Thái Hồ Sơ</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-secondary-dark border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="NEW">Mới Nhận</option>
            <option value="REVIEWING">Đang Duyệt</option>
            <option value="ACCEPTED">Nhận Việc</option>
            <option value="REJECTED">Từ Chối</option>
          </select>
        </div>

        {/* Export Excel Button */}
        <button
          onClick={exportToExcel}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Xuất File Excel</span>
        </button>
      </div>

      {/* Applications list table */}
      <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-3">
                <th className="pb-3 pr-4">Họ và Tên</th>
                <th className="pb-3 pr-4">Liên Hệ</th>
                <th className="pb-3 pr-4">Vị trí ứng tuyển</th>
                <th className="pb-3 pr-4 text-center">Kinh nghiệm</th>
                <th className="pb-3 pr-4">Khu vực</th>
                <th className="pb-3 pr-4">Ngày nộp</th>
                <th className="pb-3 pr-4 w-40 text-center">Trạng Thái</th>
                <th className="pb-3 w-20 text-right">CV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300 font-light font-sans">
              {filteredApps.length > 0 ? (
                filteredApps.map((app: any) => (
                  <tr key={app.id} className="hover:bg-white/[0.01] transition-colors">
                    {/* Name */}
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-bold text-white whitespace-nowrap">{app.name}</p>
                        {app.note && (
                          <p className="text-[10px] text-gray-500 truncate max-w-[200px] mt-0.5" title={app.note}>
                            💡 {app.note}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Contacts */}
                    <td className="py-4 pr-4">
                      <div className="space-y-0.5">
                        <a href={`tel:${app.phone}`} className="hover:text-primary transition-colors flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-500" />
                          {app.phone}
                        </a>
                        <a href={`mailto:${app.email}`} className="hover:text-primary transition-colors flex items-center gap-1 text-[10px] text-gray-400">
                          <Mail className="w-3.5 h-3.5 text-gray-500" />
                          {app.email}
                        </a>
                      </div>
                    </td>

                    {/* Vacancy */}
                    <td className="py-4 pr-4 whitespace-nowrap text-white font-semibold">
                      {app.job?.title || 'Khác'}
                    </td>

                    {/* Experience years */}
                    <td className="py-4 pr-4 text-center whitespace-nowrap font-mono">
                      {app.experience_years ? `${app.experience_years} năm` : 'Chưa cập nhật'}
                    </td>

                    {/* Location */}
                    <td className="py-4 pr-4 whitespace-nowrap text-gray-400">
                      {app.preferred_location || 'Chưa cập nhật'}
                    </td>

                    {/* Date */}
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString('vi-VN')}
                    </td>

                    {/* Inline Status Dropdown */}
                    <td className="py-4 pr-4 text-center whitespace-nowrap">
                      <div className="relative inline-block w-full">
                        {updatingId === app.id ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-gray-500">
                            <RefreshCw className="w-3 h-3 animate-spin" /> Đang cập nhật...
                          </span>
                        ) : (
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className={`w-full text-center text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusStyle(
                              app.status
                            )}`}
                          >
                            <option value="NEW" className="text-blue-500 bg-secondary-dark">Mới Nhận</option>
                            <option value="REVIEWING" className="text-amber-500 bg-secondary-dark">Đang Duyệt</option>
                            <option value="ACCEPTED" className="text-emerald-500 bg-secondary-dark">Nhận Việc</option>
                            <option value="REJECTED" className="text-red-500 bg-secondary-dark">Từ Chối</option>
                          </select>
                        )}
                      </div>
                    </td>

                    {/* CV file link */}
                    <td className="py-4 text-right whitespace-nowrap">
                      {app.cv_file ? (
                        <a
                          href={app.cv_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:text-primary-dark font-bold cursor-pointer transition-colors"
                          title="Tải CV / Hồ sơ"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Mở</span>
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 font-light">
                    Chưa có hồ sơ ứng cử nào trùng khớp với bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
