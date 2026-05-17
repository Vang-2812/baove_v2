import * as React from 'react'
import prisma from '@/lib/db'
import { ApplicationsList } from './applications-list'

export const dynamic = 'force-dynamic'

export default async function AdminApplicationsPage() {
  const [applications, jobs] = await Promise.all([
    prisma.application.findMany({
      orderBy: {
        created_at: 'desc',
      },
      include: {
        job: true,
      },
    }),
    prisma.job.findMany({
      orderBy: {
        title: 'asc',
      },
      select: {
        id: true,
        title: true,
      },
    }),
  ])

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
          Hồ Sơ Ứng Tuyển
        </h1>
        <p className="text-xs text-gray-400 font-light mt-1">
          Duyệt danh sách ứng viên nộp hồ sơ ứng tuyển trực tuyến toàn quốc, tải CV hoặc xuất file Excel.
        </p>
      </div>

      {/* Main client-side rendering with filters */}
      <ApplicationsList initialApplications={applications} jobs={jobs} />
    </div>
  )
}
