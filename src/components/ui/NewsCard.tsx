import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, Eye, ArrowRight } from 'lucide-react'

export interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    thumbnail: string | null
    published_at: string | Date | null
    view_count: number
    type: 'BLOG' | 'DOCUMENT'
    category?: {
      name: string
      slug: string
    } | null
    author?: {
      name: string
    } | null
  }
}

export function NewsCard({ post }: PostCardProps) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'Chưa xuất bản'

  const detailUrl = post.type === 'BLOG' 
    ? `/tin-tuc/${post.slug}` 
    : `/tai-lieu/${post.slug}`

  return (
    <article className="group relative bg-secondary-light/10 border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-primary/20 hover:bg-secondary-light/20 transition-all duration-300 backdrop-blur-md">
      {/* Decorative top border active gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div>
        {/* Thumbnail Wrapper */}
        <div className="relative w-full h-48 overflow-hidden bg-secondary-dark">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary-light/30 text-gray-500">
              No Image
            </div>
          )}

          {/* Category Badge on Thumbnail */}
          {post.category && (
            <div className="absolute top-4 left-4 z-10">
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-primary text-white px-2.5 py-1 rounded-full shadow-lg shadow-primary/20">
                {post.category.name}
              </span>
            </div>
          )}

          {/* Blur Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent opacity-40" />
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-3">
          {/* Meta Infos */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-light">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{publishedDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-primary" />
              <span>{post.view_count} lượt xem</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-base md:text-lg text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            <Link href={detailUrl}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Readmore Footer */}
      <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between">
        {post.author && (
          <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
            <User className="w-3.5 h-3.5 text-primary/70" />
            <span className="line-clamp-1">{post.author.name}</span>
          </div>
        )}
        <Link
          href={detailUrl}
          className="text-xs font-bold text-primary group-hover:text-primary-dark transition-colors flex items-center gap-1 border-b border-primary/10 group-hover:border-primary pb-0.5 ml-auto"
        >
          <span>Đọc thêm</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  )
}
