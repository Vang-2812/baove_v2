import * as React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { PageHero } from '@/components/ui/PageHero'
import { FileText, ArrowRight, ShieldCheck, Flame, HeartPulse, LifeBuoy, MapPin, Building, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sơ Đồ Trang Website | Long Việt Security',
  description: 'Khám phá toàn bộ cấu trúc và sơ đồ liên kết của Website Bảo Vệ Long Việt, giúp truy cập nhanh chóng tới dịch vụ an ninh và kho tài liệu nghiệp vụ.',
  alternates: {
    canonical: '/sitemap',
  },
}

export default async function SitemapPage() {
  // Fetch active services
  const services = await prisma.service.findMany({
    where: { is_active: true },
    orderBy: { order: 'asc' },
  })

  // Fetch active categories
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  })

  // Fetch posts
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { id: true, title: true, slug: true, type: true, category_id: true },
  })

  const blogCategories = categories.filter((c: any) => c.type === 'BLOG')
  const docCategories = categories.filter((c: any) => c.type === 'DOCUMENT')

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Sơ Đồ Website (Sitemap)"
        subtitle="Hệ thống liên kết trực quan toàn bộ tài nguyên an ninh và cẩm nang kỹ năng của Long Việt"
      />

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="bg-secondary-light/10 border border-white/5 p-8 md:p-12 rounded-3xl backdrop-blur-md space-y-12">
            
            {/* 1. Static Pages Group */}
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-base md:text-lg text-white border-l-2 border-primary pl-3 uppercase tracking-wider">
                Trang Chính & Giới Thiệu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-4 border-l border-white/10">
                <Link href="/" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Trang chủ</span>
                </Link>
                <Link href="/gioi-thieu" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Giới thiệu tổng quan</span>
                </Link>
                <Link href="/gioi-thieu/qua-trinh-hinh-thanh" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Quá trình hình thành</span>
                </Link>
                <Link href="/gioi-thieu/co-cau-to-chuc" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Cơ cấu tổ chức</span>
                </Link>
                <Link href="/gioi-thieu/tam-nhin-su-menh" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Tầm nhìn sứ mệnh</span>
                </Link>
                <Link href="/gioi-thieu/su-khac-biet" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Sự khác biệt vượt trội</span>
                </Link>
                <Link href="/hop-tac" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Đăng ký hợp tác</span>
                </Link>
                <Link href="/tuyen-dung" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Cơ hội tuyển dụng</span>
                </Link>
                <Link href="/lien-he" className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Liên hệ hotline</span>
                </Link>
              </div>
            </div>

            {/* 2. Services Group */}
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-base md:text-lg text-white border-l-2 border-primary pl-3 uppercase tracking-wider">
                Dịch Vụ An Ninh Chuyên Nghiệp
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pl-4 border-l border-white/10">
                {services.map((s: any) => (
                  <Link
                    key={s.id}
                    href={`/dich-vu/${s.slug}`}
                    className="text-xs text-gray-400 hover:text-primary transition-colors flex items-center gap-1.5 py-1"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-primary/70" />
                    <span className="line-clamp-1">{s.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. News Categories & Posts Group */}
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-base md:text-lg text-white border-l-2 border-primary pl-3 uppercase tracking-wider">
                Chuyên Mục Tin Tức & Bài Viết
              </h3>
              <div className="space-y-6 pl-4 border-l border-white/10">
                {blogCategories.map((cat: any) => {
                  const catPosts = posts.filter((p: any) => p.category_id === cat.id && p.type === 'BLOG')
                  return (
                    <div key={cat.id} className="space-y-2">
                      <Link href={`/tin-tuc?category=${cat.slug}`} className="text-xs font-bold text-white hover:text-primary transition-colors block">
                        Chuyên mục: {cat.name} ({catPosts.length})
                      </Link>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 border-l border-white/5">
                        {catPosts.map((post: any) => (
                          <Link
                            key={post.id}
                            href={`/tin-tuc/${post.slug}`}
                            className="text-xs text-gray-400 hover:text-primary transition-colors line-clamp-1 py-0.5"
                          >
                            - {post.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 4. Document Categories & Documents Group */}
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-base md:text-lg text-white border-l-2 border-primary pl-3 uppercase tracking-wider">
                Thư Viện Tài Liệu Nghiệp Vụ
              </h3>
              <div className="space-y-6 pl-4 border-l border-white/10">
                {docCategories.map((cat: any) => {
                  const catPosts = posts.filter((p: any) => p.category_id === cat.id && p.type === 'DOCUMENT')
                  return (
                    <div key={cat.id} className="space-y-2">
                      <Link href="/tai-lieu" className="text-xs font-bold text-white hover:text-primary transition-colors block">
                        Tài liệu: {cat.name} ({catPosts.length})
                      </Link>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 border-l border-white/5">
                        {catPosts.map((post: any) => (
                          <Link
                            key={post.id}
                            href={`/tai-lieu/${post.slug}`}
                            className="text-xs text-gray-400 hover:text-primary transition-colors line-clamp-1 py-0.5"
                          >
                            - {post.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
