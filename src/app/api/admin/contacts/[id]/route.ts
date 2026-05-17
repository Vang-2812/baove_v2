import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAccessToken } from '@/lib/jwt'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify token
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const decoded = token ? verifyAccessToken(token) : null

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Không thể xác thực danh tính.' },
        { status: 401 }
      )
    }

    const { id } = await params

    const contact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Yêu cầu tư vấn không tồn tại.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      contact,
    })
  } catch (error) {
    console.error('❌ GET /api/admin/contacts/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ nội bộ.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify token
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const decoded = token ? verifyAccessToken(token) : null

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Không thể xác thực danh tính.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { status, note } = await request.json()

    // Find the contact
    const contact = await prisma.contact.findUnique({
      where: { id },
    })

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Yêu cầu tư vấn không tồn tại.' },
        { status: 404 }
      )
    }

    // Update contact status
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        status,
        note: note !== undefined ? note : contact.note,
        handled_by: decoded.email,
        handled_at: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      contact: updatedContact,
    })
  } catch (error) {
    console.error('❌ PATCH /api/admin/contacts/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Lỗi máy chủ nội bộ.' },
      { status: 500 }
    )
  }
}
