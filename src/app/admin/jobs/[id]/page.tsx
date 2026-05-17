import * as React from 'react'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import { JobForm } from '../form'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function AdminEditJobPage({ params }: PageProps) {
  const { id } = await params

  const job = await prisma.job.findUnique({
    where: { id },
  })

  if (!job) {
    notFound()
  }

  return <JobForm id={id} initialData={job} />
}
