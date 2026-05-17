'use client'

import * as React from 'react'
import { Share2, Link2, Check } from 'lucide-react'

interface SocialShareProps {
  url: string
  title: string
}

export function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = React.useState(false)

  const shareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const shareZalo = () => {
    window.open(
      `https://sp.zalo.me/share_to_zalo?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  return (
    <div className="py-6 border-t border-b border-white/5 flex flex-wrap items-center justify-between gap-4 mt-12 bg-secondary-light/5 px-6 rounded-2xl">
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold text-white uppercase tracking-wider">Chia sẻ bài viết:</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Facebook Share Button */}
        <button
          onClick={shareFacebook}
          className="flex items-center gap-2 px-4 py-2 bg-[#1877F2]/10 hover:bg-[#1877F2] border border-[#1877F2]/20 hover:border-[#1877F2] text-[#1877F2] hover:text-white rounded-xl text-xs font-semibold transition-all duration-200"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span>Facebook</span>
        </button>

        {/* Zalo Share Button */}
        <button
          onClick={shareZalo}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary border border-primary/20 hover:border-primary text-primary hover:text-white rounded-xl text-xs font-semibold transition-all duration-200"
        >
          <span className="font-extrabold text-[10px] uppercase leading-none">Zalo</span>
        </button>

        {/* Copy Link Button */}
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-semibold transition-all duration-200 ${
            copied
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-secondary-light/10 border-white/5 hover:border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Đã sao chép</span>
            </>
          ) : (
            <>
              <Link2 className="w-3.5 h-3.5" />
              <span>Sao chép liên kết</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
