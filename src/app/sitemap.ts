import { MetadataRoute } from 'next'
import prisma from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://baovelongviet.vn'

  // 1. Static site routes & Local SEO pages
  const routes = [
    '',
    '/gioi-thieu',
    '/gioi-thieu/qua-trinh-hinh-thanh',
    '/gioi-thieu/co-cau-to-chuc',
    '/gioi-thieu/tam-nhin-su-menh',
    '/gioi-thieu/su-khac-biet',
    '/tin-tuc',
    '/tai-lieu',
    '/hop-tac',
    '/tuyen-dung',
    '/lien-he',
    '/sitemap',
    '/cong-ty-bao-ve-tphcm',
    '/cong-ty-bao-ve-ha-noi',
    '/cong-ty-bao-ve-da-nang',
    '/cong-ty-bao-ve-dong-nai',
    '/cong-ty-bao-ve-long-an',
  ]

  const staticUrls = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route.startsWith('/gioi-thieu') ? 0.8 : 0.7,
  }))

  try {
    // 2. Fetch active services
    const services = await prisma.service.findMany({
      where: { is_active: true },
      select: { slug: true, updated_at: true },
    })

    const serviceUrls = services.map((s: any) => ({
      url: `${baseUrl}/dich-vu/${s.slug}`,
      lastModified: s.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

    // 3. Fetch published posts (blogs & documents)
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, type: true, updated_at: true },
    })

    const postUrls = posts.map((p: any) => {
      const typePath = p.type === 'BLOG' ? 'tin-tuc' : 'tai-lieu'
      return {
        url: `${baseUrl}/${typePath}/${p.slug}`,
        lastModified: p.updated_at,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }
    })

    // 4. Fetch open jobs
    const jobs = await prisma.job.findMany({
      where: { status: 'OPEN' },
      select: { slug: true, updated_at: true },
    })

    const jobUrls = jobs.map((j: any) => ({
      url: `${baseUrl}/tuyen-dung/${j.slug}`,
      lastModified: j.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticUrls, ...serviceUrls, ...postUrls, ...jobUrls]
  } catch (error) {
    console.error('Error compiling sitemap:', error)
    return staticUrls
  }
}
