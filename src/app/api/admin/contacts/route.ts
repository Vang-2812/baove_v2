import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAccessToken } from '@/lib/jwt'

export async function GET(request: Request) {
  try {
    // 1. Verify Authorization Token
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const decoded = token ? verifyAccessToken(token) : null

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Không thể xác thực danh tính.' },
        { status: 401 }
      )
    }

    // 2. Parse query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const serviceType = url.searchParams.get('service_type')
    const province = url.searchParams.get('province')
    const search = url.searchParams.get('search')
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '20', 10)
    const sortBy = url.searchParams.get('sortBy') || 'created_at'
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'
    const skip = (page - 1) * limit

    // 3. Build where query conditions
    const where: any = {}

    if (status && status !== 'ALL') {
      where.status = status
    }
    if (serviceType) {
      where.service_type = serviceType
    }
    if (province) {
      where.province = province
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    }

    // 4. Fetch contacts and count in parallel
    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('❌ GET /api/admin/contacts error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi hệ thống.' },
      { status: 500 }
    )
  }
}
