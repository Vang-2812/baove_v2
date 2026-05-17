import * as React from 'react'
import prisma from '@/lib/db'
import { notFound } from 'next/navigation'
import { PostForm } from '../form'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function AdminEditPostPage({ params }: PageProps) {
  const { id } = await params

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      orderBy: {
        order: 'asc',
      },
    }),
  ])

  if (!post) {
    notFound()
  }

  return <PostForm id={id} initialData={post} categories={categories} />
}
