import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const revalidate = 1800 // Cache for 30 minutes

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const job = await prisma.job.findUnique({
      where: {
        slug: slug,
      },
    })

    if (!job || job.status === 'CLOSED') {
      return NextResponse.json(
        {
          success: false,
          error: 'JOB_NOT_FOUND',
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: job,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ GET /api/jobs/[slug] internal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }
}
