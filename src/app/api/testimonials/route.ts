import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        order: 'asc',
      },
    })
    return NextResponse.json(testimonials)
  } catch (error: any) {
    console.error('Error fetching testimonials API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
