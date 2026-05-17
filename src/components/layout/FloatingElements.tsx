'use client'

import * as React from 'react'
import { Phone, ArrowUp } from 'lucide-react'
import { clsx } from 'clsx'

// Custom sleek Zalo Icon SVG
function ZaloIconSvg({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.28 13.88c-.36.72-.96 1.2-1.8 1.44-.6.18-2.64.18-4.8-.54-2.16-.72-3.84-2.16-4.92-4.2-.6-.96-.72-2.16-.36-2.88.36-.72 1.2-1.2 2.04-1.2.36 0 .72.06 1.02.24.42.24.66.72.78 1.2.24.9.48 1.62.78 2.22-.36.36-.54.78-.54 1.2 0 .42.18.84.42 1.2.66 1.02 1.68 1.8 2.76 2.16.42.12.78.12 1.08-.06.3-.18.42-.48.42-.84 0-.48-.12-.96-.3-1.44.18-.3.42-.54.78-.72.36-.18.78-.24 1.14-.12.84.24 1.56.54 2.1.84.48.3.72.78.6 1.32-.06.42-.24.78-.48 1.08z" />
    </svg>
  )
}

export function FloatingElements() {
  const [showBackToTop, setShowBackToTop] = React.useState(false)
  const [isZaloLoaded, setIsZaloLoaded] = React.useState(false)

  // Track scrolling to show/hide Back to Top button
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true)
      } else {
        setShowBackToTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lazy load Zalo widget after onload to prevent LCP degradation
  React.useEffect(() => {
    const handleLoad = () => {
      setIsZaloLoaded(true)
    }

    if (document.readyState === 'complete') {
      const timer = setTimeout(() => setIsZaloLoaded(true), 0)
      return () => clearTimeout(timer)
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <>
      {/* 1. Bouncing Floating Phone Button (Mobile Only, md:hidden) */}
      <a
        href="tel:0923840999"
        className="md:hidden fixed bottom-20 right-4 z-50 bg-primary text-white rounded-full p-4 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-150 animate-bounce"
        aria-label="Call Hotline"
      >
        <Phone className="w-6 h-6" />
      </a>

      {/* 2. Zalo Chat Widget (Lazy loaded, both desktop and mobile) */}
      {isZaloLoaded && (
        <a
          href="https://zalo.me/0923840999"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-[#0068ff] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
          aria-label="Chat Zalo"
        >
          <div className="absolute inset-0 bg-[#0068ff] rounded-full animate-ping opacity-25 pointer-events-none" />
          <ZaloIconSvg className="w-8 h-8 relative z-10" />
        </a>
      )}

      {/* 3. Smooth Back To Top Button (Desktop only) */}
      <button
        onClick={scrollToTop}
        className={clsx(
          'hidden md:flex fixed bottom-20 right-4 z-40 bg-secondary text-white rounded-full p-3 shadow-lg flex items-center justify-center hover:bg-primary active:scale-95 transition-all duration-300',
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        aria-label="Back to Top"
      >
        <ArrowUp className="w-5.5 h-5.5" />
      </button>
    </>
  )
}
