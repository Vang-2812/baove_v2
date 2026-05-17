import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Fetch the post first to see if it exists
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    if (!post || post.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment view count asynchronously/synchronously
    const updatedPost = await prisma.post.update({
      where: { id: post.id },
      data: {
        view_count: {
          increment: 1,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            type: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
    })

    // Fetch 3 related posts of same type, preferably same category, excluding current post
    const relatedPosts = await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        type: post.type,
        id: { not: post.id },
        category_id: post.category_id || undefined,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        published_at: 'desc',
      },
      take: 3,
    })

    return NextResponse.json({
      post: updatedPost,
      related: relatedPosts,
    })
  } catch (error: any) {
    console.error('Error fetching post detail API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
