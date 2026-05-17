import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protect all /admin routes
  if (pathname.startsWith('/admin')) {
    const refreshToken = request.cookies.get('refreshToken')?.value

    // If trying to access admin screens without refresh token session, redirect to login
    if (pathname !== '/admin/login' && !refreshToken) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    // If already authenticated and hitting the login screen, redirect to dashboard
    if (pathname === '/admin/login' && refreshToken) {
      const dashboardUrl = new URL('/admin/dashboard', request.url)
      return NextResponse.redirect(dashboardUrl)
    }
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/admin/:path*'],
}
