'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface AdminSearchProps {
  placeholder?: string
}

export function AdminSearch({ placeholder = 'Tìm kiếm...' }: AdminSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = React.useState(searchParams.get('q') || '')

  React.useEffect(() => {
    setValue(searchParams.get('q') || '')
  }, [searchParams])

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (val) {
      params.set('q', val)
    } else {
      params.delete('q')
    }
    params.set('page', '1') // Reset page to 1 on search
    router.push(`?${params.toString()}`)
  }

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== (searchParams.get('q') || '')) {
        handleSearch(value)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-secondary-dark border border-white/5 rounded-xl pl-10 pr-9 py-2.5 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all font-light"
      />
      {value && (
        <button
          onClick={() => {
            setValue('')
            handleSearch('')
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5 rounded-md hover:bg-white/5 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
