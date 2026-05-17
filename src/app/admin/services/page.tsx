import * as React from 'react'
import prisma from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, Trash2, Check, X } from 'lucide-react'
import { deleteService } from '../actions'
import { DeleteButton } from '@/components/ui/DeleteButton'
import { AdminSearch } from '@/components/ui/AdminSearch'
import { AdminPagination } from '@/components/ui/AdminPagination'
import { AdminSortHeader } from '@/components/ui/AdminSortHeader'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminServicesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : ''
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1
  const sortBy = typeof resolvedParams.sortBy === 'string' ? resolvedParams.sortBy : 'order'
  const sortOrder = typeof resolvedParams.sortOrder === 'string' && ['asc', 'desc'].includes(resolvedParams.sortOrder)
    ? (resolvedParams.sortOrder as 'asc' | 'desc')
    : 'asc'

  const limit = 7
  const skip = (page - 1) * limit

  // Search condition
  const where: any = q
    ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { slug: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {}

  // Fetch count and services in parallel
  const [services, totalRecords] = await Promise.all([
    prisma.service.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    }),
    prisma.service.count({ where }),
  ])

  const totalPages = Math.ceil(totalRecords / limit)

  // Format currency in VND helper
  const formatPrice = (val: number | null) => {
    if (val === null) return 'Liên hệ'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            Quản Lý Dịch Vụ
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Danh sách dịch vụ bảo vệ chuyên nghiệp hiển thị trên trang chủ và trang danh mục.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Dịch Vụ Mới</span>
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
            <span>Tổng cộng <strong className="text-white font-bold">{totalRecords}</strong> dịch vụ</span>
          )}
        </div>
        <AdminSearch placeholder="Tìm theo tên dịch vụ, slug..." />
      </div>

      {/* Services List Table */}
      <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-3">
                <th className="pb-3 pr-4 w-24 text-center">
                  <AdminSortHeader field="order" currentSortBy={sortBy} currentSortOrder={sortOrder} className="w-full justify-center">
                    Thứ Tự
                  </AdminSortHeader>
                </th>
                <th className="pb-3 pr-4 w-20">Hình Ảnh</th>
                <th className="pb-3 pr-4">
                  <AdminSortHeader field="title" currentSortBy={sortBy} currentSortOrder={sortOrder}>
                    Tên Dịch Vụ
                  </AdminSortHeader>
                </th>
                <th className="pb-3 pr-4">Đường Dẫn (Slug)</th>
                <th className="pb-3 pr-4">
                  <AdminSortHeader field="price_min" currentSortBy={sortBy} currentSortOrder={sortOrder}>
                    Mức Giá
                  </AdminSortHeader>
                </th>
                <th className="pb-3 pr-4 w-32 text-center">
                  <AdminSortHeader field="is_active" currentSortBy={sortBy} currentSortOrder={sortOrder} className="w-full justify-center">
                    Trạng Thái
                  </AdminSortHeader>
                </th>
                <th className="pb-3 w-28 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300 font-light">
              {services.length > 0 ? (
                services.map((service: any) => (
                  <tr key={service.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 pr-4 text-center font-bold text-white whitespace-nowrap">
                      <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                        {service.order}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-12 h-10 object-cover rounded-lg bg-secondary-dark border border-white/5"
                        />
                      ) : (
                        <div className="w-12 h-10 bg-secondary-dark border border-white/5 rounded-lg flex items-center justify-center text-gray-500">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-4 pr-4 font-bold text-white whitespace-nowrap">
                      {service.title}
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap text-gray-400">
                      /dich-vu/{service.slug}
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap font-mono">
                      {service.price_min ? (
                        <>
                          {formatPrice(service.price_min)} - {formatPrice(service.price_max)} / {service.price_unit || 'tháng'}
                        </>
                      ) : (
                        <span className="text-gray-500">Liên hệ báo giá</span>
                      )}
                    </td>
                    <td className="py-4 pr-4 text-center whitespace-nowrap">
                      {service.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-500 bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/10 uppercase tracking-wider">
                          <Check className="w-3 h-3" /> Hoạt Động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-gray-500 bg-gray-500/5 px-2.5 py-0.5 rounded-full border border-gray-500/10 uppercase tracking-wider">
                          <X className="w-3 h-3" /> Tạm Ngưng
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/services/${service.id}`}
                          className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all cursor-pointer"
                          title="Chỉnh Sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <DeleteButton
                          onConfirm={async () => {
                            'use server'
                            await deleteService(service.id)
                          }}
                          confirmMessage="Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không thể hoàn tác."
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-light">
                    Chưa có dịch vụ nào phù hợp với bộ lọc tìm kiếm.
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
