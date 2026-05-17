import * as React from 'react'
import Link from 'next/link'
import { MapPin, Banknote, Clock, ArrowRight } from 'lucide-react'

export interface JobCardProps {
  job: {
    id: string
    title: string
    slug: string
    location: string
    salary_range: string | null
    type: 'FULLTIME' | 'PARTTIME' | 'CONTRACT'
    status: 'OPEN' | 'PAUSED' | 'CLOSED'
  }
}

export function JobCard({ job }: JobCardProps) {
  const typeLabel =
    job.type === 'FULLTIME'
      ? 'Toàn thời gian'
      : job.type === 'PARTTIME'
      ? 'Bán thời gian'
      : 'Hợp đồng'

  return (
    <div className="group bg-secondary-light/30 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-primary/30 hover:bg-secondary-light/50 transition-all duration-300 relative text-left shadow-xl shadow-black/10">
      <div className="space-y-4">
        {/* Badges */}
        <div className="flex justify-between items-center">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-full border border-emerald-500/10">
            Đang Tuyển
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
            Tuyển Gấp
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading font-extrabold text-base md:text-lg text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {job.title}
        </h3>

        {/* Info Tags */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
          {job.salary_range && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
              <Banknote className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{job.salary_range}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400 font-light">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{typeLabel}</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6 mt-4 flex items-center justify-between border-t border-white/10">
        <Link
          href={`/tuyen-dung/${job.slug}`}
          className="text-xs font-bold text-primary group-hover:text-primary-dark transition-colors flex items-center gap-1 border-b border-primary/10 group-hover:border-primary pb-0.5"
        >
          <span>Xem chi tiết & Nộp đơn</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
