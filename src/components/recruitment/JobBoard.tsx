'use client'

import * as React from 'react'
import { JobCard } from '@/components/ui/JobCard'
import { MapPin, Clock, Search, X } from 'lucide-react'

interface Job {
  id: string
  title: string
  slug: string
  location: string
  salary_range: string | null
  type: 'FULLTIME' | 'PARTTIME' | 'CONTRACT'
  status: 'OPEN' | 'PAUSED' | 'CLOSED'
}

interface JobBoardProps {
  initialJobs: Job[]
}

export function JobBoard({ initialJobs }: JobBoardProps) {
  const [selectedLocation, setSelectedLocation] = React.useState<string>('all')
  const [selectedType, setSelectedType] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState<string>('')

  // Unique list of main locations extracted from jobs
  const locations = React.useMemo(() => {
    const locSet = new Set<string>()
    initialJobs.forEach((job) => {
      // Split location by comma or slash to get individual provinces
      const parts = job.location.split(/[,/]/)
      parts.forEach((p) => {
        const trimmed = p.trim()
        if (trimmed) {
          // Normalize names slightly
          if (trimmed.includes('TP.HCM') || trimmed.includes('Hồ Chí Minh') || trimmed.includes('Quận')) {
            locSet.add('TP.HCM')
          } else if (trimmed.includes('Hà Nội')) {
            locSet.add('Hà Nội')
          } else if (trimmed.includes('Đà Nẵng')) {
            locSet.add('Đà Nẵng')
          } else if (trimmed.includes('Đồng Nai')) {
            locSet.add('Đồng Nai')
          } else if (trimmed.includes('Bình Dương')) {
            locSet.add('Bình Dương')
          } else if (trimmed.includes('Phú Quốc') || trimmed.includes('Kiên Giang')) {
            locSet.add('Phú Quốc')
          } else {
            locSet.add(trimmed)
          }
        }
      })
    })
    return ['all', ...Array.from(locSet)]
  }, [initialJobs])

  const filteredJobs = React.useMemo(() => {
    return initialJobs.filter((job) => {
      // 1. Location filter
      let matchLocation = true
      if (selectedLocation !== 'all') {
        matchLocation = job.location.toLowerCase().includes(selectedLocation.toLowerCase())
      }

      // 2. Type filter
      let matchType = true
      if (selectedType !== 'all') {
        matchType = job.type === selectedType
      }

      // 3. Search query filter
      let matchSearch = true
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        matchSearch =
          job.title.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          !!(job.salary_range && job.salary_range.toLowerCase().includes(query))
      }

      return matchLocation && matchType && matchSearch
    })
  }, [initialJobs, selectedLocation, selectedType, searchQuery])

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="bg-secondary-light/10 border border-white/5 p-6 rounded-3xl backdrop-blur-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm vị trí tuyển dụng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary-dark border border-white/5 rounded-xl pl-11 pr-10 py-3 text-xs md:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-all font-light"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location filter dropdown */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-secondary-dark border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer font-light"
            >
              <option value="all">📍 Tất cả khu vực</option>
              {locations.filter(loc => loc !== 'all').map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type filter dropdown */}
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-secondary-dark border border-white/5 rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-primary appearance-none cursor-pointer font-light"
            >
              <option value="all">🕒 Tất cả hình thức</option>
              <option value="FULLTIME">Toàn thời gian</option>
              <option value="PARTTIME">Bán thời gian</option>
              <option value="CONTRACT">Hợp đồng</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex justify-between items-center text-xs text-gray-400 font-light px-1">
          <span>
            Tìm thấy <strong className="text-primary font-bold">{filteredJobs.length}</strong> cơ hội việc làm phù hợp
          </span>
          {(selectedLocation !== 'all' || selectedType !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedLocation('all')
                setSelectedType('all')
                setSearchQuery('')
              }}
              className="text-primary hover:text-primary-dark font-bold transition-colors"
            >
              Thiết lập lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Grid results */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="py-20 bg-secondary-light/5 border border-white/5 rounded-3xl text-center space-y-3">
          <p className="text-sm text-gray-400 font-light">Không tìm thấy vị trí tuyển dụng nào phù hợp với bộ lọc.</p>
          <button
            onClick={() => {
              setSelectedLocation('all')
              setSelectedType('all')
              setSearchQuery('')
            }}
            className="text-xs text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-xl transition-all font-bold"
          >
            Xem tất cả vị trí
          </button>
        </div>
      )}
    </div>
  )
}
