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
import { Calendar, Eye, User, FileText, ArrowRight, ArrowLeft } from 'lucide-react'

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
  const postUrl = `${baseUrl}/tai-lieu/${post.slug}`
  const imageUrl = post.thumbnail || `${baseUrl}/og-default.jpg`

  return {
    title: `${post.title} | Long Việt Security`,
    description: post.excerpt || post.meta_desc || undefined,
    alternates: {
      canonical: `/tai-lieu/${post.slug}`,
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
      type: 'DOCUMENT',
    },
    select: {
      slug: true,
    },
  })

  return posts.map((post: any) => ({
    slug: post.slug,
  }))
}

export default async function DocumentDetailPage({ params }: PageProps) {
  const { slug } = await params

  // 1. Fetch Post Detail
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          id: true,
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

  if (!post || post.status !== 'PUBLISHED' || post.type !== 'DOCUMENT') {
    return notFound()
  }

  // 2. Increment view count
  await prisma.post.update({
    where: { id: post.id },
    data: {
      view_count: {
        increment: 1,
      },
    },
  })

  // 3. Fetch related documents in the same category
  const relatedDocs = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      type: 'DOCUMENT',
      id: { not: post.id },
      category_id: post.category_id || undefined,
    },
    orderBy: {
      published_at: 'desc',
    },
    take: 5,
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baovelongviet.vn'
  const currentUrl = `${baseUrl}/tai-lieu/${post.slug}`
  const publishedDateStr = post.published_at ? post.published_at.toISOString() : ''

  // Breadcrumbs items
  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Tài liệu', href: '/tai-lieu' },
    { label: post.title, href: `/tai-lieu/${post.slug}` },
  ]

  // Schema structured JSON-LD data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': post.title,
    'description': post.excerpt || post.meta_desc,
    'image': post.thumbnail || `${baseUrl}/og-default.jpg`,
    'datePublished': publishedDateStr,
    'dateModified': post.updated_at.toISOString(),
    'author': {
      '@type': 'Organization',
      'name': post.author?.name || 'Ban Nghiệp Vụ Long Việt',
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
          
          {/* LEFT: DOCUMENT BODY */}
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
                    <span>Biên soạn: {post.author.name}</span>
                  </span>
                )}
              </div>
            </header>

            {/* Document Frame Banner */}
            <div className="bg-secondary-light/20 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-center md:text-left flex-grow">
                <h4 className="font-bold text-white text-sm md:text-base">Sổ Tay Kỹ Năng & Nghiệp Vụ Bảo Vệ</h4>
                <p className="text-xs text-gray-400 font-light">Tài liệu học tập nội bộ và tài nguyên mở cung cấp kiến thức thực tiễn cao cấp.</p>
              </div>
              <a
                href="#quote"
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-primary/25 text-center shrink-0 w-full md:w-auto"
              >
                Nhận Bản In Đầy Đủ
              </a>
            </div>

            {/* Main content body */}
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

            {/* Bottom Nav */}
            <div className="pt-6 border-t border-white/10 flex">
              <Link
                href="/tai-lieu"
                className="text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Quay lại Kho Tài Liệu</span>
              </Link>
            </div>

          </article>

          {/* RIGHT: SIDEBAR */}
          <aside className="space-y-8" id="quote">
            
            <div className="lg:sticky lg:top-24 space-y-8">
              
              <QuoteFormCard serviceType="Yêu Cầu In Tài Liệu Nghiệp Vụ" />

              {/* Related Documents Widget */}
              {relatedDocs.length > 0 && (
                <div className="bg-secondary-light/30 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl shadow-black/10">
                  <h3 className="font-heading font-bold text-sm text-white border-l-2 border-primary pl-2 uppercase tracking-wider">
                    Cùng Chuyên Mục
                  </h3>
                  <div className="flex flex-col gap-3">
                    {relatedDocs.map((doc: any) => (
                      <Link
                        key={doc.id}
                        href={`/tai-lieu/${doc.slug}`}
                        className="text-xs text-gray-400 hover:text-primary flex items-start gap-2 py-1 transition-colors group"
                      >
                        <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-2 group-hover:text-primary leading-snug">{doc.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </aside>

        </div>
      </div>
    </main>
  )
}
