'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'

interface AdminSortHeaderProps {
  field: string
  currentSortBy: string
  currentSortOrder: string
  children: React.ReactNode
  className?: string
}

export function AdminSortHeader({
  field,
  currentSortBy,
  currentSortOrder,
  children,
  className = '',
}: AdminSortHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const isActive = currentSortBy === field

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', field)
    if (isActive) {
      params.set('sortOrder', currentSortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      params.set('sortOrder', 'asc')
    }
    params.set('page', '1') // Reset to page 1 on sort change
    router.push(`?${params.toString()}`)
  }

  return (
    <button
      onClick={handleSort}
      className={`inline-flex items-center gap-1 hover:text-white transition-colors uppercase tracking-widest font-extrabold cursor-pointer focus:outline-none text-[10px] ${
        isActive ? 'text-primary' : 'text-gray-400'
      } ${className}`}
    >
      <span>{children}</span>
      {isActive ? (
        currentSortOrder === 'asc' ? (
          <ArrowUp className="w-3 h-3 text-primary shrink-0" />
        ) : (
          <ArrowDown className="w-3 h-3 text-primary shrink-0" />
        )
      ) : (
        <ArrowUpDown className="w-3 h-3 text-gray-500 hover:text-gray-400 shrink-0" />
      )}
    </button>
  )
}
