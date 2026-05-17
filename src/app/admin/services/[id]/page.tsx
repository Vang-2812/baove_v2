import * as React from 'react'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import { ServiceForm } from '../form'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function AdminEditServicePage({ params }: PageProps) {
  const { id } = await params
  
  const service = await prisma.service.findUnique({
    where: { id },
  })

  if (!service) {
    notFound()
  }

  return <ServiceForm id={id} initialData={service} />
}
