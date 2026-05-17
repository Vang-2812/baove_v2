'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  totalRecords: number
  limit: number
}

export function AdminPagination({ currentPage, totalPages, totalRecords, limit }: AdminPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const startRecord = (currentPage - 1) * limit + 1
  const endRecord = Math.min(currentPage * limit, totalRecords)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5 font-sans">
      <span className="text-xs text-gray-400 font-light">
        Hiển thị từ <strong className="text-white font-bold">{startRecord}</strong> đến{' '}
        <strong className="text-white font-bold">{endRecord}</strong> trong tổng số{' '}
        <strong className="text-white font-bold">{totalRecords}</strong> bản ghi
      </span>
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {Array.from({ length: totalPages }, (_, idx) => {
          const pageNum = idx + 1
          const shouldShow =
            pageNum === 1 ||
            pageNum === totalPages ||
            Math.abs(pageNum - currentPage) <= 1

          if (!shouldShow) {
            if (pageNum === 2 || pageNum === totalPages - 1) {
              return (
                <span key={`ellipse-${pageNum}`} className="text-gray-500 text-xs px-1 select-none">
                  ...
                </span>
              )
            }
            return null
          }

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              {pageNum}
            </button>
          )
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
