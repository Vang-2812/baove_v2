import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAccessToken, verifyRefreshToken, signAccessToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    // 1. Get access token from Authorization header
    const authHeader = request.headers.get('Authorization')
    let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

    let decoded = token ? verifyAccessToken(token) : null
    let newAccessToken: string | null = null

    // 2. If access token is invalid or missing, try refresh token cookie
    if (!decoded) {
      const cookieStore = await cookies()
      const refreshToken = cookieStore.get('refreshToken')?.value
      
      if (refreshToken) {
        const refreshDecoded = verifyRefreshToken(refreshToken)
        if (refreshDecoded) {
          decoded = {
            userId: refreshDecoded.userId,
            email: refreshDecoded.email,
            role: refreshDecoded.role,
          }
          newAccessToken = signAccessToken(decoded)
        }
      }
    }

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Không thể xác thực danh tính.' },
        { status: 401 }
      )
    }

    // 3. Load user info from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true,
      },
    })

    if (!user || !user.is_active) {
      return NextResponse.json(
        { success: false, error: 'Tài khoản không tồn tại hoặc đã bị khóa.' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        user,
        ...(newAccessToken ? { accessToken: newAccessToken } : {}),
      }
    )
  } catch (error) {
    console.error('❌ GET /api/admin/me error:', error)
    return NextResponse.json(
      { success: false, error: 'Lỗi xác thực hệ thống.' },
      { status: 500 }
    )
  }
}
