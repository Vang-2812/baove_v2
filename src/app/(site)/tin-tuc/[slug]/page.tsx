import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DOMPurify from 'isomorphic-dompurify'
import { Metadata } from 'next'
import prisma from '@/lib/db'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { SocialShare } from '@/components/ui/SocialShare'
import { QuoteFormCard } from '@/components/forms/QuoteFormCard'
import { Calendar, Eye, User, Clock, ArrowRight, ArrowLeft } from 'lucide-react'

export const revalidate = 3600 // ISR cache for 1 hour

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true } },
    },
  })

  if (!post || post.status !== 'PUBLISHED') {
    return {}
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baovelongviet.vn'
  const postUrl = `${baseUrl}/tin-tuc/${post.slug}`
  const imageUrl = post.thumbnail || `${baseUrl}/og-default.jpg`

  return {
    title: `${post.title} | Long Việt Security`,
    description: post.excerpt || post.meta_desc || undefined,
    alternates: {
      canonical: `/tin-tuc/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Long Việt Security`,
      description: post.excerpt || post.meta_desc || undefined,
      url: postUrl,
      type: 'article',
      publishedTime: post.published_at?.toISOString(),
      authors: post.author ? [post.author.name] : ['Long Việt Security'],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  }
}

// Pre-render static paths at build time
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      type: 'BLOG',
    },
    select: {
      slug: true,
    },
  })

  return posts.map((post: any) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params

  // 1. Fetch Post Detail
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!post || post.status !== 'PUBLISHED' || post.type !== 'BLOG') {
    return notFound()
  }

  // 2. Increment view count using prisma update
  await prisma.post.update({
    where: { id: post.id },
    data: {
      view_count: {
        increment: 1,
      },
    },
  })

  // 3. Fetch 3 related blog posts
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      type: 'BLOG',
      id: { not: post.id },
      category_id: post.category_id || undefined,
    },
    include: {
      category: { select: { name: true, slug: true } },
    },
    orderBy: {
      published_at: 'desc',
    },
    take: 3,
  })

  // 4. Fetch 4 recent blogs for sidebar
  const recentPosts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      type: 'BLOG',
      id: { not: post.id },
    },
    orderBy: {
      published_at: 'desc',
    },
    take: 4,
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baovelongviet.vn'
  const currentUrl = `${baseUrl}/tin-tuc/${post.slug}`
  const publishedDateStr = post.published_at ? post.published_at.toISOString() : ''

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tin tức', href: '/tin-tuc' },
    { label: post.title, href: `/tin-tuc/${post.slug}` },
  ]

  // Schema structured JSON-LD data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': post.title,
    'description': post.excerpt || post.meta_desc,
    'image': post.thumbnail || `${baseUrl}/og-default.jpg`,
    'datePublished': publishedDateStr,
    'dateModified': post.updated_at.toISOString(),
    'author': {
      '@type': 'Organization',
      'name': post.author?.name || 'Ban Biên Tập Long Việt',
      'url': baseUrl,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Long Việt Security',
      'logo': {
        '@type': 'ImageObject',
        'url': `${baseUrl}/logo.png`,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': `${baseUrl}${item.href === '/' ? '' : item.href}`,
    })),
  }

  return (
    <main className="bg-secondary-dark min-h-screen text-left py-12 md:py-16">
      {/* Dynamic JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb row */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 mt-6">
          
          {/* LEFT: ARTICLE BODY */}
          <article className="space-y-6">
            
            {/* Header info */}
            <header className="space-y-4 border-b border-white/5 pb-6">
              {post.category && (
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary/20 text-primary border border-primary/20 px-3 py-1 rounded-full">
                  {post.category.name}
                </span>
              )}
              <h1 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight leading-tight">
                {post.title}
              </h1>

              {/* Meta tags */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-400 font-light pt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'Chưa xuất bản'}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-primary" />
                  <span>{post.view_count + 1} lượt xem</span>
                </span>
                {post.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-primary" />
                    <span>Người viết: {post.author.name}</span>
                  </span>
                )}
              </div>
            </header>

            {/* Thumbnail Banner Image */}
            {post.thumbnail && (
              <div className="relative w-full h-[280px] md:h-[450px] rounded-2xl overflow-hidden bg-secondary-light/30 shadow-xl shadow-black/30 border border-white/10">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Main content body with HTML parser styling */}
            <div 
              className="prose prose-invert prose-sm md:prose-base max-w-none 
                prose-headings:text-white prose-headings:font-heading prose-headings:font-bold
                prose-h2:text-lg md:prose-h2:text-xl prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-3 prose-h2:mt-10
                prose-h3:text-base md:prose-h3:text-lg prose-h3:mt-8
                prose-p:text-gray-300 prose-p:font-light prose-p:leading-relaxed prose-p:my-5
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-li:text-gray-300 prose-li:font-light
                prose-img:rounded-xl prose-img:border prose-img:border-white/10"
              dangerouslySetInnerHTML={{ 
                __html: DOMPurify.sanitize(post.content, {
                  ALLOWED_TAGS: ['p','h1','h2','h3','h4','ul','ol','li','strong','em','a','img','table','tr','td','th','blockquote','code','pre'],
                  ALLOWED_ATTR: ['href','src','alt','class','target','rel'],
                }) 
              }}
            />

            {/* Share action buttons */}
            <SocialShare url={currentUrl} title={post.title} />

            {/* Bottom Nav: Back to news index */}
            <div className="pt-6 border-t border-white/10 flex">
              <Link
                href="/tin-tuc"
                className="text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Quay lại Trang Tin Tức</span>
              </Link>
            </div>

            {/* Related posts list */}
            {relatedPosts.length > 0 && (
              <div className="pt-12 space-y-6">
                <h3 className="font-heading font-bold text-lg text-white border-l-2 border-primary pl-2 uppercase tracking-wider">
                  Bài Viết Liên Quan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((rp: any) => (
                    <div
                      key={rp.id}
                      className="group bg-secondary-light/30 border border-white/10 p-4 rounded-xl space-y-3 hover:border-primary/30 hover:bg-secondary-light/50 transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/10"
                    >
                      <div className="space-y-2">
                        {rp.thumbnail && (
                          <div className="relative w-full h-28 rounded-lg overflow-hidden bg-secondary-dark mb-1">
                            <Image
                              src={rp.thumbnail}
                              alt={rp.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        {rp.category && (
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary block">
                            {rp.category.name}
                          </span>
                        )}
                        <h4 className="font-bold text-xs md:text-sm text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          <Link href={`/tin-tuc/${rp.slug}`}>{rp.title}</Link>
                        </h4>
                      </div>
                      <Link
                        href={`/tin-tuc/${rp.slug}`}
                        className="text-[10px] font-extrabold text-primary flex items-center gap-1 mt-2 hover:underline"
                      >
                        <span>Đọc tiếp</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </article>

          {/* RIGHT: SIDEBAR */}
          <aside className="space-y-8">
            
            {/* Action booking widget form */}
            <div className="lg:sticky lg:top-24 space-y-8">
              
              <QuoteFormCard serviceType="Tư Vấn An Ninh Tin Tức" />

              {/* Sidebar Recent blogs */}
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

            </div>

          </aside>

        </div>
      </div>
    </main>
  )
}
