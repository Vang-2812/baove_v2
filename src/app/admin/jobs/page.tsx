import * as React from 'react'
import prisma from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, Users, MapPin, DollarSign } from 'lucide-react'
import { deleteJob } from '../actions'
import { DeleteButton } from '@/components/ui/DeleteButton'
import { AdminSearch } from '@/components/ui/AdminSearch'
import { AdminPagination } from '@/components/ui/AdminPagination'
import { AdminSortHeader } from '@/components/ui/AdminSortHeader'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminJobsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const sortBy = typeof resolvedParams.sortBy === 'string' ? resolvedParams.sortBy : 'created_at'
  const sortOrder = typeof resolvedParams.sortOrder === 'string' && ['asc', 'desc'].includes(resolvedParams.sortOrder)
    ? (resolvedParams.sortOrder as 'asc' | 'desc')
    : 'desc'

  const limit = 7
  const skip = (page - 1) * limit

  // Search filter
  const where: any = q
    ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { slug: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {}

  // Fetch count and jobs in parallel
  const [jobs, totalRecords] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        _count: {
          select: {
            applications: true,
          },
        },
      },
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ])

  const totalPages = Math.ceil(totalRecords / limit)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/10 uppercase tracking-wider">
            Đang Tuyển
          </span>
        )
      case 'PAUSED':
        return (
          <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/5 px-2.5 py-0.5 rounded-full border border-amber-500/10 uppercase tracking-wider">
            Tạm Dừng
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-extrabold text-gray-500 bg-gray-500/5 px-2.5 py-0.5 rounded-full border border-gray-500/10 uppercase tracking-wider">
            Đóng
          </span>
        )
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'PARTTIME':
        return 'Bán thời gian'
      case 'CONTRACT':
        return 'Hợp đồng'
      default:
        return 'Toàn thời gian'
    }
  }

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            Quản Lý Tuyển Dụng
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Đăng tin tuyển dụng nhân viên vệ sĩ/bảo vệ chất lượng cao toàn quốc.
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Đăng Tin Tuyển Dụng</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-secondary-light/10 border border-white/5 p-5 rounded-3xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-gray-400 font-light">
          {q ? (
            <span>
              Tìm thấy <strong className="text-white font-bold">{totalRecords}</strong> kết quả phù hợp cho từ khóa &quot;<strong className="text-white font-bold">{q}</strong>&quot;
            </span>
          ) : (
            <span>Tổng cộng <strong className="text-white font-bold">{totalRecords}</strong> tin tuyển dụng</span>
          )}
        </div>
        <AdminSearch placeholder="Tìm theo vị trí, địa điểm..." />
      </div>

      {/* Jobs Table */}
      <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-3">
                <th className="pb-3 pr-4">
                  <AdminSortHeader field="title" currentSortBy={sortBy} currentSortOrder={sortOrder}>
                    Vị trí tuyển dụng
                  </AdminSortHeader>
                </th>
                <th className="pb-3 pr-4">
                  <AdminSortHeader field="location" currentSortBy={sortBy} currentSortOrder={sortOrder}>
                    Địa bàn / Khu vực
                  </AdminSortHeader>
                </th>
                <th className="pb-3 pr-4">Mức Lương</th>
                <th className="pb-3 pr-4">Hình thức</th>
                <th className="pb-3 pr-4 text-center">
                  <AdminSortHeader field="status" currentSortBy={sortBy} currentSortOrder={sortOrder} className="w-full justify-center">
                    Trạng Thái
                  </AdminSortHeader>
                </th>
                <th className="pb-3 pr-4 w-32 text-center">Đã nộp CV</th>
                <th className="pb-3 w-28 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300 font-light">
              {jobs.length > 0 ? (
                jobs.map((job: any) => (
                  <tr key={job.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 pr-4">
                      <div className="max-w-[250px] md:max-w-[350px]">
                        <p className="font-bold text-white truncate">{job.title}</p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">/tuyen-dung/{job.slug}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {job.location}
                      </span>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap text-white font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        {job.salary_range || 'Thỏa thuận'}
                      </span>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {getTypeLabel(job.type)}
                    </td>
                    <td className="py-4 pr-4 text-center whitespace-nowrap">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="py-4 pr-4 text-center whitespace-nowrap">
                      <Link
                        href={`/admin/applications?jobId=${job.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job._count.applications} hồ sơ</span>
                      </Link>
                    </td>
                    <td className="py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/jobs/${job.id}`}
                          className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all cursor-pointer"
                          title="Chỉnh Sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <DeleteButton
                          onConfirm={async () => {
                            'use server'
                            await deleteJob(job.id)
                          }}
                          confirmMessage="Bạn có chắc chắn muốn xóa tin tuyển dụng này không? Mọi hồ sơ ứng cử nộp cho vị trí này cũng sẽ bị xóa."
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-light">
                    Chưa có tin tuyển dụng nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={totalRecords}
          limit={limit}
        />
      </div>
    </div>
  )
}
