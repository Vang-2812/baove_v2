import * as React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import prisma from '@/lib/db'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Accordion } from '@/components/ui/Accordion'
import { ServiceCard, ServiceIcon, formatPrice } from '@/components/ui/ServiceCard'
import { QuoteFormCard } from '@/components/forms/QuoteFormCard'
import * as Icons from 'lucide-react'

interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { is_active: true },
    select: { slug: true },
  })
  return services.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: ServicePageProps
): Promise<Metadata> {
  const { slug } = await params
  const service = await prisma.service.findUnique({
    where: { slug },
  })

  if (!service) return {}

  return {
    title: service.meta_title || `${service.title} | Long Việt Security`,
    description: service.meta_desc || service.description,
    alternates: {
      canonical: `https://baovelongviet.vn/dich-vu/${service.slug}`,
    },
  }
}

// Custom bullet list parser
function parseBulletPoints(text: string | null) {
  if (!text) return []
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => {
      const clean = line.substring(1).trim()
      let isBold = false
      let boldPart = ''
      let regularPart = clean
      
      if (clean.startsWith('**') && clean.includes('**:')) {
        const parts = clean.split('**:')
        boldPart = parts[0].replace(/\*\*/g, '').trim()
        regularPart = parts.slice(1).join('**:').trim()
        isBold = true
      } else if (clean.startsWith('**') && clean.includes('**')) {
        const match = clean.match(/^\*\*(.*?)\*\*(.*)/)
        if (match) {
          boldPart = match[1].trim()
          regularPart = match[2].trim()
          isBold = true
        }
      }
      
      return { boldPart, regularPart, isBold, fullText: clean }
    })
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params

  // Fetch current service
  const service = await prisma.service.findUnique({
    where: { slug },
  })

  if (!service || !service.is_active) {
    notFound()
  }

  // Fetch related services
  const relatedServices = await prisma.service.findMany({
    where: {
      is_active: true,
      NOT: { slug: service.slug },
    },
    take: 3,
    orderBy: { order: 'asc' },
  })

  // Parse JSON fields
  let processes: { step: number; title: string; description: string }[] = []
  let faqs: { question: string; answer: string }[] = []

  try {
    if (service.process) {
      processes = JSON.parse(service.process)
    }
  } catch (e) {
    console.error('Error parsing processes:', e)
  }

  try {
    if (service.faq) {
      const parsedFaq = JSON.parse(service.faq)
      faqs = parsedFaq.map((item: { q?: string; question?: string; a?: string; answer?: string }) => ({
        question: item.q || item.question || '',
        answer: item.a || item.answer || '',
      }))
    }
  } catch (e) {
    console.error('Error parsing faqs:', e)
  }

  const scopeItems = parseBulletPoints(service.scope)
  const benefitItems = parseBulletPoints(service.benefits)

  const breadcrumbItems = [
    { label: 'Dịch Vụ', href: '/dich-vu' },
    { label: service.title }
  ]

  // Dynamic Price Display
  const priceDisplay = service.price_min
    ? service.price_max
      ? `${formatPrice(service.price_min)} - ${formatPrice(service.price_max)} VNĐ/${service.price_unit || 'tháng'}`
      : `Từ ${formatPrice(service.price_min)} VNĐ/${service.price_unit || 'tháng'}`
    : 'Liên hệ báo giá'

  // JSON-LD Schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Trang Chủ',
        'item': 'https://baovelongviet.vn'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Dịch Vụ',
        'item': 'https://baovelongviet.vn/dich-vu'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': service.title,
        'item': `https://baovelongviet.vn/dich-vu/${service.slug}`
      }
    ]
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.title,
    'description': service.description,
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'Long Việt Security',
      'image': 'https://baovelongviet.vn/images/logo.png',
      'telephone': '0923840999',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'B23 Khu Dân Cư Nam Long, P. Phú Thuận',
        'addressLocality': 'Quận 7',
        'addressRegion': 'TP. Hồ Chí Minh',
        'addressCountry': 'VN'
      }
    },
    ...(service.price_min ? {
      'offers': {
        '@type': 'AggregateOffer',
        'priceCurrency': 'VND',
        'lowPrice': service.price_min,
        ...(service.price_max ? { 'highPrice': service.price_max } : {}),
        'priceValued': service.price_unit || 'tháng'
      }
    } : {})
  }

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  } : null

  return (
    <div className="bg-secondary-dark min-h-screen">
      {/* JSON-LD Injections */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Service Detail Banner */}
      <section className="relative h-[400px] md:h-[480px] w-full flex items-center border-b border-white/5 overflow-hidden">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
        {/* Modern dark gradient overlay matching site aesthetics */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark via-secondary-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent" />
        
        {/* Content */}
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="max-w-3xl space-y-4">
            <Breadcrumb items={breadcrumbItems} className="text-white/70 mb-3" />
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/25">
                <ServiceIcon name={service.icon} className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Dịch Vụ An Ninh</span>
            </div>

            <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight">
              {service.title}
            </h1>
            
            <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed max-w-2xl">
              Giải pháp vệ sĩ an ninh chuyên nghiệp được thiết kế tối ưu, kỷ luật sắt và cam kết đền bù bảo hiểm trọn gói.
            </p>
          </div>
        </div>
      </section>

      {/* Main Body Grid */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
            
            {/* Left Content Area */}
            <div className="space-y-12">
              
              {/* Overview Description */}
              <div className="space-y-4">
                <h2 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight border-l-4 border-primary pl-4">
                  Mô Tả Tổng Quan
                </h2>
                <p className="text-sm md:text-base text-gray-300 leading-relaxed font-light whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>

              {/* Scope of Service */}
              {scopeItems.length > 0 && (
                <div className="space-y-5">
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight border-l-4 border-primary pl-4">
                    Phạm Vi Cung Cấp & Vị Trí Trực Gác
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {scopeItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-secondary-light/20 border border-white/5 p-4 rounded-xl">
                        <Icons.CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm text-gray-300 font-light leading-relaxed">
                          {item.fullText}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline / Process */}
              {processes.length > 0 && (
                <div className="space-y-8">
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight border-l-4 border-primary pl-4">
                    Quy Trình Triển Khai Dịch Vụ
                  </h2>
                  <div className="relative border-l border-white/10 pl-6 md:pl-8 ml-4 md:ml-6 space-y-8">
                    {processes.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Bullet number badge */}
                        <span className="absolute -left-[45px] md:-left-[53px] top-0 w-8 h-8 md:w-9 md:h-9 bg-primary border-4 border-secondary-dark rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-primary/20">
                          {step.step || idx + 1}
                        </span>
                        <div className="space-y-1.5 text-left">
                          <h4 className="font-heading font-bold text-sm md:text-base text-white">
                            {step.title}
                          </h4>
                          <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Benefits */}
              {benefitItems.length > 0 && (
                <div className="space-y-5">
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight border-l-4 border-primary pl-4">
                    Lợi Ích Khi Chọn Long Việt
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {benefitItems.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-secondary-light/20 border border-white/5 text-left">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                          <Icons.Shield className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          {item.isBold ? (
                            <>
                              <h4 className="font-bold text-sm text-white">{item.boldPart}</h4>
                              <p className="text-xs text-gray-400 font-light leading-relaxed">{item.regularPart}</p>
                            </>
                          ) : (
                            <p className="text-xs md:text-sm text-gray-300 font-light leading-relaxed">{item.fullText}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing Blocks */}
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Giá Dịch Vụ Tham Khảo</span>
                  <h3 className="font-heading font-extrabold text-lg md:text-2xl text-white tracking-tight">{priceDisplay}</h3>
                  <p className="text-[11px] text-gray-400 font-light">Mức giá thực tế tùy thuộc vào vị trí, yêu cầu ca trực và tính chất tài sản.</p>
                </div>
                <a
                  href="#quote"
                  className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 shadow-md shadow-primary/20 text-center shrink-0 self-start sm:self-center"
                >
                  Yêu Cầu Khảo Sát Thử
                </a>
              </div>

              {/* FAQs */}
              {faqs.length > 0 && (
                <div className="space-y-5">
                  <h2 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight border-l-4 border-primary pl-4">
                    Câu Hỏi Thường Gặp (FAQ)
                  </h2>
                  <Accordion items={faqs} />
                </div>
              )}

            </div>

            {/* Right Sidebar */}
            <div id="quote" className="space-y-6 lg:sticky lg:top-24 self-start">
              {/* Quote Form Card */}
              <QuoteFormCard serviceType={service.title} />

              {/* Contact Card */}
              <div className="bg-secondary-light/20 border border-white/5 rounded-2xl p-6 backdrop-blur-md text-left space-y-4">
                <h4 className="font-heading font-bold text-sm md:text-base text-white">
                  Thông Tin Liên Hệ
                </h4>
                <div className="space-y-3">
                  <a
                    href="tel:0923840999"
                    className="flex items-center gap-3 text-xs md:text-sm text-gray-300 hover:text-primary transition-colors duration-150"
                  >
                    <Icons.Phone className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold">Hotline: 0923 840 999</span>
                  </a>
                  <a
                    href="https://zalo.me/0923840999"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-xs md:text-sm text-gray-300 hover:text-primary transition-colors duration-150"
                  >
                    <Icons.MessageSquare className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold">Hỗ trợ Zalo 24/7</span>
                  </a>
                  <div className="flex items-start gap-3 text-xs text-gray-400 leading-relaxed font-light">
                    <Icons.MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>B23 Khu Dân Cư Nam Long, Phường Phú Thuận, Quận 7, TP. Hồ Chí Minh</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="mt-20 pt-16 border-t border-white/5 space-y-10 text-left">
              <h2 className="font-heading font-bold text-xl md:text-2xl text-white tracking-tight border-l-4 border-primary pl-4">
                Dịch Vụ Liên Quan Khác
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedServices.map((rel) => (
                  <ServiceCard key={rel.id} service={rel} />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
