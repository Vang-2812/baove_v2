import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { verifyRefreshToken } from '@/lib/jwt'
import { AdminShell } from '@/components/layout/AdminShell'
import * as React from 'react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // If it's the login page, just render its content (don't wrap with AdminShell, don't redirect)
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) {
    redirect('/admin/login')
  }

  const decoded = verifyRefreshToken(refreshToken)
  if (!decoded) {
    redirect('/admin/login')
  }

  // Fetch verified user profile
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      name: true,
      email: true,
      role: true,
    },
  })

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <AdminShell initialUser={user}>
      {children}
    </AdminShell>
  )
}
