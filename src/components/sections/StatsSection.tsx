'use client'

import * as React from 'react'
import { Calendar, Users, Building, ShieldCheck } from 'lucide-react'

interface StatItemProps {
  icon: React.ReactNode
  targetValue: number
  suffix?: string
  label: string
}

function CounterItem({ icon, targetValue, suffix = '', label }: StatItemProps) {
  const [count, setCount] = React.useState(0)
  const elementRef = React.useRef<HTMLDivElement>(null)
  const [hasStarted, setHasStarted] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = elementRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasStarted])

  React.useEffect(() => {
    if (!hasStarted) return

    const duration = 2000 // 2 seconds
    const frameRate = 1000 / 60 // 60fps
    const totalFrames = Math.round(duration / frameRate)
    let frame = 0

    const counter = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      // Ease out quadratic progress formula
      const currentCount = Math.round(targetValue * (progress * (2 - progress)))
      
      if (frame >= totalFrames) {
        setCount(targetValue)
        clearInterval(counter)
      } else {
        setCount(currentCount)
      }
    }, frameRate)

    return () => clearInterval(counter)
  }, [hasStarted, targetValue])

  return (
    <div
      ref={elementRef}
      className="flex flex-col items-center text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-200"
    >
      <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center text-primary-light mb-4 shadow-inner">
        {icon}
      </div>
      <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
        {count.toLocaleString('vi-VN')}
        {suffix}
      </span>
      <span className="text-xs md:text-sm font-medium text-gray-300 mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

export interface StatsSectionProps {
  settings?: Record<string, any>
}

export function StatsSection({ settings = {} }: StatsSectionProps) {
  const statYears = parseInt(settings.stat_years) || 15
  const statEmployees = parseInt(settings.stat_employees) || 2000
  const statProjects = parseInt(settings.stat_projects) || 1500
  const statBranches = parseInt(settings.stat_branches) || 5

  const stats = [
    {
      icon: <Calendar className="w-6.5 h-6.5" />,
      targetValue: statYears,
      suffix: '+',
      label: 'Năm Kinh Nghiệm',
    },
    {
      icon: <Users className="w-6.5 h-6.5" />,
      targetValue: statEmployees,
      suffix: '+',
      label: 'Nhân Sự Vệ Sĩ',
    },
    {
      icon: <ShieldCheck className="w-6.5 h-6.5" />,
      targetValue: statProjects,
      suffix: '+',
      label: 'Dự Án Hoàn Thành',
    },
    {
      icon: <Building className="w-6.5 h-6.5" />,
      targetValue: statBranches,
      suffix: '+',
      label: 'Chi Nhánh Đại Diện',
    },
  ]

  return (
    <section className="relative py-20 bg-secondary-dark overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(192,57,43,0.1)_0,transparent_60%)] pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-light mb-3 block">
            Những Con Số Ấn Tượng
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white leading-tight">
            Sức Mạnh & Uy Tín Được Đo Bằng Thực Tế Trải Nghiệm
          </h2>
        </div>

        {/* Counter Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, idx) => (
            <CounterItem
              key={idx}
              icon={stat.icon}
              targetValue={stat.targetValue}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
