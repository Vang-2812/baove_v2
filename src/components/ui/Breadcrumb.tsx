import * as React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className={`flex items-center text-xs md:text-sm font-medium ${className}`}>
      <ol className="flex items-center flex-wrap gap-1.5 md:gap-2">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-white/70 hover:text-primary flex items-center gap-1 transition-colors duration-150"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Trang Chủ</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-1.5 md:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-white/40 shrink-0" />
              {isLast || !item.href ? (
                <span
                  aria-current="page"
                  className="text-primary font-semibold select-none"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-white/70 hover:text-primary transition-colors duration-150"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
