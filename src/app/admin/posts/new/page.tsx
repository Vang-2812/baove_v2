import * as React from 'react'
import prisma from '@/lib/db'
import { PostForm } from '../form'

export const dynamic = 'force-dynamic'

export default async function AdminNewPostPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      order: 'asc',
    },
  })

  return <PostForm id={null} categories={categories} />
}
