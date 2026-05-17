import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        order: 'asc',
      },
    })
    return NextResponse.json(partners)
  } catch (error: any) {
    console.error('Error fetching partners API:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
