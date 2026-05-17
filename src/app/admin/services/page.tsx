import * as React from 'react'
import prisma from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, Trash2, ArrowLeftRight, Check, X } from 'lucide-react'
import { deleteService } from '../actions'
import { DeleteButton } from '@/components/ui/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: {
      order: 'asc',
    },
  })

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

      {/* Services List Table */}
      <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-3">
                <th className="pb-3 pr-4 w-12 text-center">Thứ Tự</th>
                <th className="pb-3 pr-4 w-20">Hình Ảnh</th>
                <th className="pb-3 pr-4">Tên Dịch Vụ</th>
                <th className="pb-3 pr-4">Đường Dẫn (Slug)</th>
                <th className="pb-3 pr-4">Mức Giá</th>
                <th className="pb-3 pr-4 w-32 text-center">Trạng Thái</th>
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
                    Chưa có dịch vụ nào được cấu hình trong hệ thống.
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
