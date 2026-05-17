import * as React from 'react'
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb'

export interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumb?: BreadcrumbItem[]
  className?: string
}

export function PageHero({ title, subtitle, breadcrumb, className = '' }: PageHeroProps) {
  return (
    <section className={`relative bg-secondary-dark py-16 md:py-20 border-b border-white/5 overflow-hidden flex items-center ${className}`}>
      {/* Decorative glow elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col gap-3.5 max-w-3xl">
          {/* Breadcrumb Integration */}
          {breadcrumb && (
            <Breadcrumb items={breadcrumb} className="text-white/60 mb-2" />
          )}
          
          <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
