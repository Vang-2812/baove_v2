import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { PageHero } from '@/components/ui/PageHero'
import { FileText, ArrowRight, ShieldCheck, Flame, HeartPulse, LifeBuoy } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Kho Tài Liệu Nghiệp Vụ Bảo Vệ | Long Việt Security',
  description: 'Kho lưu trữ tài liệu huấn luyện nghiệp vụ an ninh bảo vệ, sổ tay phòng cháy chữa cháy, cẩm nang sơ cấp cứu và kỹ thuật cứu hộ cứu nạn chuyên nghiệp.',
  alternates: {
    canonical: '/tai-lieu',
  },
}

// Map slug to Lucide Icon for premium representation
function getCategoryIcon(slug: string) {
  switch (slug) {
    case 'phong-chay-chua-chay':
      return <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
    case 'so-cap-cuu':
      return <HeartPulse className="w-6 h-6 text-rose-500" />
    case 'cuu-ho-cuu-nan':
      return <LifeBuoy className="w-6 h-6 text-sky-500" />
    default:
      return <ShieldCheck className="w-6 h-6 text-primary" />
  }
}

export default async function DocumentsPage() {
  // Fetch document categories
  const categories = await prisma.category.findMany({
    where: { type: 'DOCUMENT' },
    orderBy: { order: 'asc' },
  })

  // Fetch active published document posts
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      type: 'DOCUMENT',
    },
    include: {
      category: { select: { name: true, slug: true } },
    },
    orderBy: { published_at: 'desc' },
  })

  // Group posts by category slug
  const groupedPosts = categories.map((cat: any) => {
    return {
      category: cat,
      posts: posts.filter((p: any) => p.category_id === cat.id),
    }
  })

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      <PageHero
        title="Kho Tài Liệu Nghiệp Vụ"
        subtitle="Hệ thống quy chuẩn huấn luyện, sổ tay kỹ năng an toàn và phòng chống rủi ro"
      />

      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Glow blur bubbles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-16">
          
          {/* Loop over each Document Category */}
          {groupedPosts.map(({ category, posts: catPosts }: any) => {
            const IconComponent = getCategoryIcon(category.slug)

            return (
              <div key={category.id} id={category.slug} className="space-y-6 scroll-mt-24">
                
                {/* Category Section Header Card */}
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-12 h-12 bg-secondary-light/30 border border-white/5 rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 shrink-0">
                    {IconComponent}
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-heading font-extrabold text-lg md:text-2xl text-white tracking-tight leading-none">
                      {category.name}
                    </h2>
                    <p className="text-xs text-gray-400 font-light mt-1.5 leading-none">
                      Tổng số: {catPosts.length} tài liệu hướng dẫn
                    </p>
                  </div>
                </div>

                {/* Documents Grid */}
                {catPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catPosts.map((post: any) => (
                      <div
                        key={post.id}
                        className="group relative bg-secondary-light/10 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/20 hover:bg-secondary-light/20 transition-all duration-300 backdrop-blur-md"
                      >
                        <div className="space-y-4">
                          {/* File logo & metadata */}
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                              PDF / DOC
                            </span>
                          </div>

                          {/* Title and summary */}
                          <div className="space-y-2">
                            <h3 className="font-heading font-bold text-sm md:text-base text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                              <Link href={`/tai-lieu/${post.slug}`}>{post.title}</Link>
                            </h3>
                            {post.excerpt && (
                              <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Read link */}
                        <div className="pt-5 mt-5 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 font-light">
                            Lượt xem: {post.view_count}
                          </span>
                          <Link
                            href={`/tai-lieu/${post.slug}`}
                            className="text-xs font-bold text-primary group-hover:text-primary-dark transition-colors flex items-center gap-1 border-b border-primary/10 group-hover:border-primary pb-0.5"
                          >
                            <span>Xem tài liệu</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 bg-secondary-light/5 border border-white/5 rounded-2xl text-center">
                    <p className="text-xs text-gray-500 font-light">Chưa có tài liệu nào thuộc chuyên mục này.</p>
                  </div>
                )}

              </div>
            )
          })}

        </div>
      </section>
    </main>
  )
}
