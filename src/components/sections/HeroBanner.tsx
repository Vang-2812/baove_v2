'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import { clsx } from 'clsx'

export interface Slide {
  image: string
  headline: string
  subline: string
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
}

interface Props {
  slides?: Slide[]
  settings?: Record<string, any>
}

const defaultSlides: Slide[] = []

export function HeroBanner({ slides, settings = {} }: Props) {
  const siteName = settings.site_name || 'Long Việt'
  const heroTitle = settings.home_hero_title || 'Dịch Vụ Bảo Vệ Chuyên Nghiệp'
  const heroSubtitle = settings.home_hero_subtitle || 'An Toàn Tuyệt Đối – Kỷ Luật Thép – Phản Ứng Nhanh'

  const dynamicSlides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=1600&auto=format&fit=crop',
      headline: heroTitle,
      subline: heroSubtitle,
      ctaPrimary: { label: 'Nhận Báo Giá Ngay', href: '#quote-form' },
      ctaSecondary: { label: 'Tìm Hiểu Dịch Vụ', href: '/dich-vu' },
    },
    {
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
      headline: 'An Toàn Tài Sản – Bình Yên Cuộc Sống',
      subline: `Hơn 15 năm uy tín đồng hành cùng hàng nghìn dự án lớn của Bảo Vệ ${siteName} trên khắp cả nước.`,
      ctaPrimary: { label: 'Liên Hệ Báo Giá', href: '#quote-form' },
      ctaSecondary: { label: 'Tuyển Dụng Nhân Sự', href: '/tuyen-dung' },
    },
  ]

  const activeSlides = slides && slides.length > 0 ? slides : dynamicSlides

  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [isMobile, setIsMobile] = React.useState(true)

  // Detect mobile to disable carousel/autoplay
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Desktop Autoplay
  React.useEffect(() => {
    if (isMobile) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isMobile, activeSlides.length])

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
  }

  return (
    <section className="relative h-[85vh] md:h-[90vh] lg:h-screen w-full bg-secondary-dark overflow-hidden select-none">
      
      {/* Slides Wrapper */}
      {activeSlides.map((slide, idx) => (
        <div
          key={idx}
          className={clsx(
            'absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out',
            isMobile
              ? idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
              : idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          {/* Slide Background Image */}
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.headline}
              fill
              priority={idx === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
          </div>

          {/* Slide Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center text-white z-20 px-4">
            <div className="max-w-4xl w-full flex flex-col items-center">
              
              {/* Shield Icon Badge */}
              <div className="w-14 h-14 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center text-primary-light mb-6 animate-pulse">
                <Shield className="w-7 h-7" />
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight tracking-tight mb-4 drop-shadow-md">
                {slide.headline}
              </h1>

              {/* Subline */}
              <p className="text-base md:text-lg lg:text-xl text-gray-200 mt-2 max-w-2xl leading-relaxed drop-shadow">
                {slide.subline}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 w-full sm:w-auto">
                <Link href={slide.ctaPrimary.href} className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full shadow-lg shadow-primary/30">
                    {slide.ctaPrimary.label}
                  </Button>
                </Link>
                <Link href={slide.ctaSecondary.href} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full text-white border-white hover:bg-white hover:text-secondary-dark">
                    {slide.ctaSecondary.label}
                  </Button>
                </Link>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls (Desktop Only) */}
      {!isMobile && activeSlides.length > 1 && (
        <>
          {/* Arrow Left */}
          <button
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 hover:bg-primary/85 text-white border border-white/10 hover:border-transparent rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Arrow Right */}
          <button
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/5 hover:bg-primary/85 text-white border border-white/10 hover:border-transparent rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={clsx(
                  'h-2.5 rounded-full transition-all duration-300',
                  idx === currentSlide ? 'w-8 bg-primary shadow-sm' : 'w-2.5 bg-white/40 hover:bg-white/70'
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}

    </section>
  )
}
