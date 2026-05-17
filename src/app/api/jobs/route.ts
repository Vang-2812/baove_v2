import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const revalidate = 1800 // Cache for 30 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')
    const type = searchParams.get('type')

    const whereClause: any = {
      status: 'OPEN',
    }

    if (location && location !== 'all') {
      whereClause.location = {
        contains: location,
        mode: 'insensitive',
      }
    }

    if (type && type !== 'all') {
      whereClause.type = type
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: jobs,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ GET /api/jobs internal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }
}
