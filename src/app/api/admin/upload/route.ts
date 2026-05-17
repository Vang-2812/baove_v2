import { NextResponse } from 'next/server'
import { verifyRefreshToken } from '@/lib/jwt'
import { uploadImage } from '@/lib/storage'

export async function POST(request: Request) {
  try {
    // 1. Authenticate user using refreshToken cookie
    const cookieHeader = request.headers.get('cookie') || ''
    const refreshToken = cookieHeader
      .split('; ')
      .find((row) => row.startsWith('refreshToken='))
      ?.split('=')[1]

    if (!refreshToken || !verifyRefreshToken(refreshToken)) {
      return NextResponse.json(
        { success: false, error: 'Bạn không có quyền truy cập tính năng này.' },
        { status: 401 }
      )
    }

    // 2. Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy tệp để tải lên.' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Chỉ hỗ trợ tải lên các tệp hình ảnh (JPG, PNG, GIF, WEBP, SVG).' },
        { status: 400 }
      )
    }

    // Validate size (max 5MB)
    const maxBytes = 5 * 1024 * 1024
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, error: 'Kích thước tệp vượt quá giới hạn cho phép (5MB).' },
        { status: 400 }
      )
    }

    // 3. Upload image via storage utility
    const url = await uploadImage(file, folder)

    return NextResponse.json({
      success: true,
      url,
    })
  } catch (error) {
    console.error('❌ POST /api/admin/upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Đã xảy ra lỗi khi xử lý tải tệp.' },
      { status: 500 }
    )
  }
}
