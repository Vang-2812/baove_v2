import * as React from 'react'
import prisma from '@/lib/db'
import Link from 'next/link'
import { Plus, Edit, FileText, BookOpen } from 'lucide-react'
import { deletePost } from '../actions'
import { DeleteButton } from '@/components/ui/DeleteButton'
import { AdminSearch } from '@/components/ui/AdminSearch'
import { AdminPagination } from '@/components/ui/AdminPagination'
import { AdminSortHeader } from '@/components/ui/AdminSortHeader'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminPostsPage({ searchParams }: PageProps) {
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
          { content: { contains: q, mode: 'insensitive' } },
        ],
      }
    : {}

  // Fetch count and posts in parallel
  const [posts, totalRecords] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        category: true,
      },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  const totalPages = Math.ceil(totalRecords / limit)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/5 px-2.5 py-0.5 rounded-full border border-emerald-500/10 uppercase tracking-wider">
            Đã đăng
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-extrabold text-gray-500 bg-gray-500/5 px-2.5 py-0.5 rounded-full border border-gray-500/10 uppercase tracking-wider">
            Nháp
          </span>
        )
    }
  }

  const getTypeBadge = (type: string) => {
    if (type === 'DOCUMENT') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-500 bg-blue-500/5 px-2.5 py-0.5 rounded-full border border-blue-500/10 uppercase tracking-wider">
          <BookOpen className="w-3 h-3 shrink-0" /> Tài Liệu
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-purple-500 bg-purple-500/5 px-2.5 py-0.5 rounded-full border border-purple-500/10 uppercase tracking-wider">
        <FileText className="w-3 h-3 shrink-0" /> Tin Tức
      </span>
    )
  }

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
            Quản Lý Bài Viết & Tài Liệu
          </h1>
          <p className="text-xs text-gray-400 font-light mt-1">
            Biên tập tin tức, sự kiện hoặc cẩm nang hướng dẫn nghiệp vụ vệ sĩ chuyên sâu.
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-4 rounded-xl transition-all text-xs md:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          <span>Viết Bài Mới</span>
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
            <span>Tổng cộng <strong className="text-white font-bold">{totalRecords}</strong> bài viết</span>
          )}
        </div>
        <AdminSearch placeholder="Tìm theo tiêu đề, slug, nội dung..." />
      </div>

      {/* Posts Table */}
      <div className="bg-secondary-light/10 border border-white/5 rounded-3xl p-6 backdrop-blur-md space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pb-3">
                <th className="pb-3 pr-4 w-20">Ảnh nhỏ</th>
                <th className="pb-3 pr-4">
                  <AdminSortHeader field="title" currentSortBy={sortBy} currentSortOrder={sortOrder}>
                    Tiêu đề bài viết
                  </AdminSortHeader>
                </th>
                <th className="pb-3 pr-4">
                  <AdminSortHeader field="type" currentSortBy={sortBy} currentSortOrder={sortOrder}>
                    Thể Loại
                  </AdminSortHeader>
                </th>
                <th className="pb-3 pr-4">Danh Mục</th>
                <th className="pb-3 pr-4 text-center">
                  <AdminSortHeader field="status" currentSortBy={sortBy} currentSortOrder={sortOrder} className="w-full justify-center">
                    Trạng Thái
                  </AdminSortHeader>
                </th>
                <th className="pb-3 pr-4 w-28 text-center">
                  <AdminSortHeader field="view_count" currentSortBy={sortBy} currentSortOrder={sortOrder} className="w-full justify-center">
                    Lượt xem
                  </AdminSortHeader>
                </th>
                <th className="pb-3 w-28 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-gray-300 font-light">
              {posts.length > 0 ? (
                posts.map((post: any) => (
                  <tr key={post.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 pr-4">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-12 h-10 object-cover rounded-lg bg-secondary-dark border border-white/5"
                        />
                      ) : (
                        <div className="w-12 h-10 bg-secondary-dark border border-white/5 rounded-lg flex items-center justify-center text-gray-500">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="max-w-[300px] md:max-w-[450px]">
                        <p className="font-bold text-white truncate">{post.title}</p>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">/tin-tuc-tai-lieu/{post.slug}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      {getTypeBadge(post.type)}
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap font-semibold text-white">
                      {post.category?.name || 'Chưa phân loại'}
                    </td>
                    <td className="py-4 pr-4 text-center whitespace-nowrap">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="py-4 pr-4 text-center font-mono text-gray-400 whitespace-nowrap">
                      {post.view_count} Lượt
                    </td>
                    <td className="py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/posts/${post.id}`}
                          className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all cursor-pointer"
                          title="Chỉnh Sửa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <DeleteButton
                          onConfirm={async () => {
                            'use server'
                            await deletePost(post.id)
                          }}
                          confirmMessage="Bạn có chắc chắn muốn xóa bài viết này không?"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-light">
                    Chưa có bài viết hay tài liệu nào phù hợp với bộ lọc tìm kiếm.
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
