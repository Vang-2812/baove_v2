import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        is_active: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        icon: true,
        price_min: true,
        price_max: true,
        price_unit: true,
        order: true,
      },
      orderBy: {
        order: 'asc',
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: services,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ GET /api/services internal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }
}
