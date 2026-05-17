'use client'

import * as React from 'react'
import { ServiceCard } from '@/components/ui/ServiceCard'

interface ServiceItem {
  id: string
  title: string
  slug: string
  description: string
  image: string | null
  icon: string | null
  price_min: number | null
  price_max: number | null
  price_unit: string | null
  order: number
}

interface ServiceGridTabsProps {
  services: ServiceItem[]
}

type CategoryType = 'all' | 'co-dinh' | 'di-dong' | 'dac-biet'

export function ServiceGridTabs({ services }: ServiceGridTabsProps) {
  const [activeTab, setActiveTab] = React.useState<CategoryType>('all')

  const filteredServices = React.useMemo(() => {
    if (activeTab === 'all') return services.slice(0, 6) // limit to 6 premium services on home page

    return services.filter((s) => {
      const slug = s.slug
      if (activeTab === 'co-dinh') {
        return [
          'bao-ve-nha-may',
          'bao-ve-toa-nha',
          'bao-ve-ngan-hang',
          'bao-ve-benh-vien',
          'bao-ve-truong-hoc',
          'bao-ve-cong-truong',
          'bao-ve-khu-cong-nghiep',
        ].includes(slug)
      }
      if (activeTab === 'di-dong') {
        return ['bao-ve-su-kien', 'bao-ve-ngay-tet', 'bao-ve-ap-tai-tien'].includes(slug)
      }
      if (activeTab === 'dac-biet') {
        return ['bao-ve-yeu-nhan'].includes(slug)
      }
      return true
    })
  }, [services, activeTab])

  const tabs = [
    { id: 'all', label: 'Tất cả dịch vụ' },
    { id: 'co-dinh', label: 'Mục tiêu Cố Định' },
    { id: 'di-dong', label: 'Mục tiêu Di Động' },
    { id: 'dac-biet', label: 'Bảo vệ Đặc Biệt' },
  ]

  return (
    <div className="space-y-10">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CategoryType)}
            className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all duration-200 focus:outline-none ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <div key={service.id} className="h-full">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </div>
  )
}
