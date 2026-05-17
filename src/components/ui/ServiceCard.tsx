import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import * as Icons from 'lucide-react'

export interface ServiceSummary {
  id: string
  title: string
  slug: string
  description: string
  image: string | null
  icon: string | null
  price_min: number | null
  price_max: number | null
  price_unit: string | null
}

export function ServiceIcon({ name, className = 'w-6 h-6' }: { name: string | null; className?: string }) {
  if (!name) return <Icons.Shield className={className} />
  
  // Map string to Lucide icon component dynamically
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (IconComponent) {
    return <IconComponent className={className} />
  }
  
  return <Icons.Shield className={className} />
}

export function formatPrice(price: number | null) {
  if (!price) return null
  return new Intl.NumberFormat('vi-VN').format(price)
}

export function ServiceCard({ service }: { service: ServiceSummary }) {
  const priceDisplay = React.useMemo(() => {
    if (!service.price_min) return 'Liên hệ báo giá'
    const formattedMin = formatPrice(service.price_min)
    
    if (service.price_max) {
      const formattedMax = formatPrice(service.price_max)
      return `${formattedMin} - ${formattedMax} VNĐ/${service.price_unit || 'tháng'}`
    }
    
    return `Từ ${formattedMin} VNĐ/${service.price_unit || 'tháng'}`
  }, [service.price_min, service.price_max, service.price_unit])

  return (
    <div className="group relative bg-secondary-dark/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full">
      {/* Image Container with hover zoom */}
      <div className="relative h-48 md:h-52 w-full overflow-hidden">
        {service.image ? (
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-secondary-light flex items-center justify-center">
            <Icons.Shield className="w-12 h-12 text-primary" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark to-transparent opacity-60" />
        
        {/* Floating Icon badge */}
        <div className="absolute top-4 left-4 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 backdrop-blur-md">
          <ServiceIcon name={service.icon} className="w-5.5 h-5.5" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-lg md:text-xl text-white group-hover:text-primary transition-colors line-clamp-1">
            {service.title}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 line-clamp-3 leading-relaxed font-light">
            {service.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Giá tham khảo</span>
            <span className="text-sm font-bold text-white mt-0.5 tracking-tight">{priceDisplay}</span>
          </div>
          
          <Link
            href={`/dich-vu/${service.slug}`}
            className="w-full py-2.5 bg-white/5 hover:bg-primary text-gray-300 hover:text-white rounded-xl text-center text-xs md:text-sm font-semibold transition-all duration-200 border border-white/5 hover:border-primary/20 flex items-center justify-center gap-1.5"
          >
            <span>Xem Chi Tiết</span>
            <Icons.ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}
