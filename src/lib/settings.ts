import prisma from './db'

export async function getSystemSettings() {
  try {
    const raw = await prisma.setting.findMany()
    const settings: Record<string, any> = {}
    raw.forEach((s) => {
      try {
        settings[s.key] = JSON.parse(s.value)
      } catch {
        settings[s.key] = s.value
      }
    })
    return settings
  } catch (error) {
    console.error('Error fetching system settings:', error)
    return {}
  }
}
