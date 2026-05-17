import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const revalidate = 3600 // Cache for 1 hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const service = await prisma.service.findUnique({
      where: {
        slug: slug,
      },
    })

    if (!service || !service.is_active) {
      return NextResponse.json(
        {
          success: false,
          error: 'SERVICE_NOT_FOUND',
        },
        { status: 404 }
      )
    }

    // Parse JSON fields
    let parsedProcess = null
    let parsedFaq = null

    try {
      if (service.process) {
        parsedProcess = JSON.parse(service.process)
      }
    } catch (e) {
      console.error('Error parsing service process:', e)
    }

    try {
      if (service.faq) {
        parsedFaq = JSON.parse(service.faq)
      }
    } catch (e) {
      console.error('Error parsing service faq:', e)
    }

    const responseData = {
      ...service,
      process: parsedProcess,
      faq: parsedFaq,
    }

    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ GET /api/services/[slug] internal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }
}
