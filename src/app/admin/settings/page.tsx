import * as React from 'react'
import prisma from '@/lib/db'
import { SettingsForm } from './settings-form'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const [settingsRaw, branches] = await Promise.all([
    prisma.setting.findMany(),
    prisma.branch.findMany({
      orderBy: {
        order: 'asc',
      },
    }),
  ])

  // Map settings into an object
  const settings: Record<string, any> = {}
  settingsRaw.forEach((s: any) => {
    try {
      settings[s.key] = JSON.parse(s.value)
    } catch {
      settings[s.key] = s.value
    }
  })

  return (
    <div className="space-y-8 font-sans text-left">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">
          Cấu Hình Hệ Thống
        </h1>
        <p className="text-xs text-gray-400 font-light mt-1">
          Quản lý thông tin liên hệ, hotline công ty, mạng xã hội, các chỉ số thống kê và hệ thống chi nhánh đại diện.
        </p>
      </div>

      {/* Main client form */}
      <SettingsForm initialSettings={settings} branches={branches} />
    </div>
  )
}
