import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'BLOG' or 'DOCUMENT'
    const category = searchParams.get('category') // slug of category
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '6', 10)
    const q = searchParams.get('q')

    const where: any = { status: 'PUBLISHED' }

    if (type === 'BLOG' || type === 'DOCUMENT') {
      where.type = type
    }

    if (category) {
      where.category = { slug: category }
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
      ]
    }

    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          category: {
            select: {
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
        orderBy: {
          published_at: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching posts API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
