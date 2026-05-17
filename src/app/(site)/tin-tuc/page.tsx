import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { PageHero } from '@/components/ui/PageHero'
import { NewsCard } from '@/components/ui/NewsCard'
import { Search, Calendar, Phone, ArrowRight, Eye } from 'lucide-react'

import { getSystemSettings } from '@/lib/settings'

export const metadata: Metadata = {
  title: 'Tin Tức & Sự Kiện An Ninh | Long Việt Security',
  description: 'Cập nhật tin tức mới nhất về hoạt động công ty, nghiệp vụ an ninh bảo vệ, cẩm nang phòng cháy chữa cháy và thông tin tuyển dụng của Long Việt Security.',
  alternates: {
    canonical: '/tin-tuc',
  },
}

interface PageProps {
  searchParams: Promise<{
    category?: string
    q?: string
    page?: string
  }>
}

export default async function NewsPage({ searchParams }: PageProps) {
  const settings = await getSystemSettings()
  const pageSubtitle = settings.sub_news || 'Cập nhật tin tức an ninh và cẩm nang huấn luyện thực chiến của Long Việt'

  const params = await searchParams
  const activeCategory = params.category || ''
  const query = params.q || ''
  const page = parseInt(params.page || '1', 10)
  const limit = 6

  // Fetch categories of type BLOG
  const categories = await prisma.category.findMany({
    where: { type: 'BLOG' },
    orderBy: { order: 'asc' },
  })

  // Build prisma query
  const where: any = {
    status: 'PUBLISHED',
    type: 'BLOG',
  }

  if (activeCategory) {
    where.category = { slug: activeCategory }
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { excerpt: { contains: query, mode: 'insensitive' } },
      { content: { contains: query, mode: 'insensitive' } },
    ]
  }

  const skip = (page - 1) * limit

  // Fetch posts and total count
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        author: { select: { name: true } },
      },
      orderBy: { published_at: 'desc' },
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  // Fetch 4 recent blog posts
  const recentPosts = await prisma.post.findMany({
    where: { status: 'PUBLISHED', type: 'BLOG' },
    orderBy: { published_at: 'desc' },
    take: 4,
  })

  const totalPages = Math.ceil(total / limit)

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      {/* Banner Page Hero */}
      <PageHero
        title="Tin Tức & Chia Sẻ Chuyên Môn"
        subtitle={pageSubtitle}
      />

      <section className="py-16 md:py-20 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14">
            
            {/* LEFT: MAIN POSTS CONTAINER */}
            <div className="space-y-10">
              
              {/* Filter controls row */}
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b border-white/5 pb-8">
                {/* Categories tab pills */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={query ? `/tin-tuc?q=${encodeURIComponent(query)}` : '/tin-tuc'}
                    className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all border ${
                      !activeCategory
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-secondary-light/10 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    TẤT CẢ
                  </Link>
                  {categories.map((cat: any) => {
                    const isActive = activeCategory === cat.slug
                    const url = `/tin-tuc?category=${cat.slug}${query ? `&q=${encodeURIComponent(query)}` : ''}`
                    return (
                      <Link
                        key={cat.id}
                        href={url}
                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all border ${
                          isActive
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                            : 'bg-secondary-light/10 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                        }`}
                      >
                        {cat.name.toUpperCase()}
                      </Link>
                    )
                  })}
                </div>

                {/* Native form Search bar */}
                <form method="GET" action="/tin-tuc" className="relative w-full md:w-80">
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Tìm kiếm bài viết..."
                    className="w-full bg-secondary-light/20 border border-white/5 rounded-xl pl-5 pr-11 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-white transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Posts list grid */}
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post: any) => (
                    <NewsCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-secondary-light/10 border border-dashed border-white/5 rounded-2xl">
                  <p className="text-gray-400 font-light">Không tìm thấy bài viết nào phù hợp.</p>
                  <Link
                    href="/tin-tuc"
                    className="text-primary font-bold text-xs mt-4 inline-block hover:underline"
                  >
                    Quay lại danh sách chính
                  </Link>
                </div>
              )}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-6">
                  {page > 1 && (
                    <Link
                      href={`/tin-tuc?page=${page - 1}${activeCategory ? `&category=${activeCategory}` : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                      className="px-4 py-2 bg-secondary-light/10 border border-white/5 hover:border-primary/30 rounded-xl text-xs font-bold text-white transition-colors"
                    >
                      Trang Trước
                    </Link>
                  )}
                  
                  <span className="text-xs text-gray-400 font-light px-4">
                    Trang {page} / {totalPages}
                  </span>

                  {page < totalPages && (
                    <Link
                      href={`/tin-tuc?page=${page + 1}${activeCategory ? `&category=${activeCategory}` : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                      className="px-4 py-2 bg-secondary-light/10 border border-white/5 hover:border-primary/30 rounded-xl text-xs font-bold text-white transition-colors"
                    >
                      Trang Sau
                    </Link>
                  )}
                </div>
              )}

            </div>

            {/* RIGHT: SIDEBAR */}
            <aside className="space-y-8">
              
              {/* Recent posts widget */}
              <div className="bg-secondary-light/30 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl shadow-black/10">
                <h3 className="font-heading font-bold text-sm text-white border-l-2 border-primary pl-2 uppercase tracking-wider">
                  Bài Viết Mới Nhất
                </h3>
                <div className="space-y-4 divide-y divide-white/10">
                  {recentPosts.map((rp: any, idx: number) => (
                    <div key={rp.id} className={`pt-4 first:pt-0 flex gap-3 ${idx === 0 ? '' : 'pt-4'}`}>
                      {rp.thumbnail && (
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-secondary-dark">
                          <Image
                            src={rp.thumbnail}
                            alt={rp.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0">
                        <Link
                          href={`/tin-tuc/${rp.slug}`}
                          className="font-bold text-xs text-white hover:text-primary transition-colors line-clamp-2 leading-snug"
                        >
                          {rp.title}
                        </Link>
                        <span className="text-[10px] text-gray-400 font-light block">
                          {rp.published_at ? new Date(rp.published_at).toLocaleDateString('vi-VN') : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories list widget */}
              <div className="bg-secondary-light/30 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl shadow-black/10">
                <h3 className="font-heading font-bold text-sm text-white border-l-2 border-primary pl-2 uppercase tracking-wider">
                  Chuyên Mục Tin Tức
                </h3>
                <div className="flex flex-col gap-2">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/tin-tuc?category=${cat.slug}`}
                      className="text-xs text-gray-400 hover:text-primary flex items-center justify-between py-1 transition-colors"
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact hotline widget */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 rounded-2xl p-6 space-y-4 text-center">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-primary/25">
                  <Phone className="w-6 h-6 animate-bounce" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-heading font-bold text-sm text-white">Bạn Cần Tư Vấn An Ninh?</h4>
                  <p className="text-[11px] text-gray-300 font-light leading-relaxed">
                    Đội ngũ chuyên gia của Long Việt luôn sẵn sàng giải đáp thắc mắc và khảo sát mặt bằng thực tế 24/7.
                  </p>
                </div>
                <a
                  href="tel:0923840999"
                  className="inline-block w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-primary/25"
                >
                  Hotline: 0923 840 999
                </a>
              </div>

            </aside>

          </div>
        </div>
      </section>
    </main>
  )
}
