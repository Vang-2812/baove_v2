import * as React from 'react'
import prisma from '@/lib/db'
import Link from 'next/link'
import {
  MessageSquare,
  TrendingUp,
  Users,
  FileText,
  Plus,
  ArrowUpRight,
  ClipboardList,
  Eye,
  Settings,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const startOfWeek = new Date()
  const day = startOfWeek.getDay()
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)
  startOfWeek.setHours(0, 0, 0, 0)

  // Fetch counts and recent records in parallel
  const [
    leadsToday,
    leadsWeek,
    newApplications,
    publishedPosts,
    recentContacts,
  ] = await Promise.all([
    prisma.contact.count({
      where: {
        created_at: { gte: startOfToday },
      },
    }),
    prisma.contact.count({
      where: {
        created_at: { gte: startOfWeek },
      },
    }),
    prisma.application.count({
      where: {
        status: 'NEW',
      },
    }),
    prisma.post.count({
      where: {
        status: 'PUBLISHED',
      },
    }),
    prisma.contact.findMany({
      take: 7,
      orderBy: {
        created_at: 'desc',
      },
    }),
  ])

  const stats = [
    {
      label: 'Lead Hôm Nay',
      value: leadsToday,
      icon: <MessageSquare className="w-5 h-5 text-red-500" />,
      colorClass: 'border-red-500/10 bg-red-500/5 text-red-500',
    },
    {
      label: 'Lead Tuần Này',
      value: leadsWeek,
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      colorClass: 'border-blue-500/10 bg-blue-500/5 text-blue-500',
    },
    {
      label: 'Hồ Sơ Ứng Tuyển Mới',
      value: newApplications,
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      colorClass: 'border-emerald-500/10 bg-emerald-500/5 text-emerald-500',
    },
    {
      label: 'Bài Viết Đang Đăng',
      value: publishedPosts,
      icon: <FileText className="w-5 h-5 text-purple-500" />,
      colorClass: 'border-purple-500/10 bg-purple-500/5 text-purple-500',
    },
  ]

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
            Xong
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-extrabold text-gray-500 bg-gray-500/5 px-2.5 py-0.5 rounded-full border border-gray-500/10 uppercase tracking-wider">
            Hủy
          </span>
        )
    }
  }

  return (
    <div className="space-y-8">
      {/* Page header title & subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Tổng quan dữ liệu vận hành hệ thống Website Bảo Vệ Long Việt.
          </p>
        </div>
        <div className="text-xs text-gray-400 font-light bg-secondary-light/10 border border-white/5 px-4 py-2 rounded-xl">
          📅 Hôm nay: <strong className="text-white font-bold">{new Date().toLocaleDateString('vi-VN')}</strong>
        </div>
      </div>

      {/* Row 1: Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`border p-6 rounded-3xl backdrop-blur-md flex items-center justify-between hover:scale-[1.01] transition-all duration-300 ${stat.colorClass}`}
          >
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
                {stat.label}
              </span>
              <p className="text-3xl font-extrabold text-white leading-none pt-1">
                {stat.value}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Recent Leads Table & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Left: Recent Leads table card */}
        <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-base text-white">
              Yêu Cầu Tư Vấn / Báo Giá Mới Nhất
            </h3>
            <Link
              href="/admin/contacts"
              className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-0.5 border-b border-primary/20 pb-0.5"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-3">
                  <th className="pb-3 pr-4">Thời Gian</th>
                  <th className="pb-3 pr-4">Khách Hàng</th>
                  <th className="pb-3 pr-4">Số Điện Thoại</th>
                  <th className="pb-3 pr-4">Dịch Vụ Quan Tâm</th>
                  <th className="pb-3 pr-4">Tỉnh Thành</th>
                  <th className="pb-3 pr-4">Trạng Thái</th>
                  <th className="pb-3">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-300 font-light font-sans">
                {recentContacts.length > 0 ? (
                  recentContacts.map((lead: any) => (
                    <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 pr-4 whitespace-nowrap">
                        {lead.created_at.toLocaleDateString('vi-VN')} {lead.created_at.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 pr-4 font-bold text-white whitespace-nowrap">{lead.name}</td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <a href={`tel:${lead.phone}`} className="hover:text-primary transition-colors">
                          {lead.phone}
                        </a>
                      </td>
                      <td className="py-4 pr-4 truncate max-w-[150px]">{lead.service_type || 'Tư vấn chung'}</td>
                      <td className="py-4 pr-4 whitespace-nowrap">{lead.province || 'Chưa cập nhật'}</td>
                      <td className="py-4 pr-4 whitespace-nowrap">{getStatusBadge(lead.status)}</td>
                      <td className="py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/contacts?id=${lead.id}`}
                          className="p-1.5 bg-white/5 border border-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all w-max cursor-pointer"
                          title="Xem Chi Tiết"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500 font-light">
                      Chưa có yêu cầu tư vấn nào được ghi nhận.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Actions list */}
        <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-6">
          <h3 className="font-heading font-extrabold text-base text-white">
            Thao Tác Nhanh
          </h3>

          <div className="flex flex-col gap-3 font-sans">
            <Link
              href="/admin/posts"
              className="flex items-center justify-between p-4 bg-secondary-dark/60 hover:bg-primary/5 border border-white/5 rounded-2xl hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Tạo Bài Viết Mới</p>
                  <span className="text-[10px] text-gray-500 font-light">Viết tin tức hoặc cẩm nang</span>
                </div>
              </div>
              <Plus className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/jobs"
              className="flex items-center justify-between p-4 bg-secondary-dark/60 hover:bg-primary/5 border border-white/5 rounded-2xl hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <ClipboardList className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Đăng Tuyển Dụng</p>
                  <span className="text-[10px] text-gray-500 font-light">Tạo vị trí bảo vệ tuyển gấp</span>
                </div>
              </div>
              <Plus className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/contacts?status=NEW"
              className="flex items-center justify-between p-4 bg-secondary-dark/60 hover:bg-primary/5 border border-white/5 rounded-2xl hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Duyệt Lead Chưa Xử Lý</p>
                  <span className="text-[10px] text-gray-500 font-light">Xem và gọi điện tư vấn ngay</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center justify-between p-4 bg-secondary-dark/60 hover:bg-primary/5 border border-white/5 rounded-2xl hover:border-primary/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-white">Cấu Hình Website</p>
                  <span className="text-[10px] text-gray-500 font-light">Số điện thoại, địa chỉ chi nhánh</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
