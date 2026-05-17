import * as React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ApplyFormCard } from '@/components/forms/ApplyFormCard'
import { JobCard } from '@/components/ui/JobCard'
import { MapPin, Banknote, Clock, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react'

interface JobPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const jobs = await prisma.job.findMany({
    where: {
      status: {
        in: ['OPEN', 'PAUSED'],
      },
    },
    select: { slug: true },
  })
  return jobs.map((j: any) => ({ slug: j.slug }))
}

export async function generateMetadata(
  { params }: JobPageProps
): Promise<Metadata> {
  const { slug } = await params
  const job = await prisma.job.findUnique({
    where: { slug },
  })

  if (!job || job.status === 'CLOSED') return {}

  const description =
    job.meta_desc ||
    `Tuyển dụng ${job.title} tại ${job.location}. Mức lương ${
      job.salary_range || 'hấp dẫn'
    }. Nhấp để ứng tuyển trực tuyến nhanh chóng.`

  return {
    title: job.meta_title || `Tuyển ${job.title} Lương Cao | Long Việt Security`,
    description: description || undefined,
    alternates: {
      canonical: `https://baovelongviet.vn/tuyen-dung/${job.slug}`,
    },
  }
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params
  
  // 1. Fetch current job
  const job = await prisma.job.findUnique({
    where: { slug },
  })

  if (!job || job.status === 'CLOSED') {
    notFound()
  }

  // 2. Fetch other related jobs (active, open, excluding current)
  const otherJobs = await prisma.job.findMany({
    where: {
      status: 'OPEN',
      id: { not: job.id },
    },
    take: 3,
    orderBy: {
      created_at: 'desc',
    },
  })

  const typeLabel =
    job.type === 'FULLTIME'
      ? 'Toàn thời gian'
      : job.type === 'PARTTIME'
      ? 'Bán thời gian'
      : 'Hợp đồng'

  const breadcrumbItems = [
    { label: 'Trang Chủ', href: '/' },
    { label: 'Tuyển Dụng', href: '/tuyen-dung' },
    { label: job.title },
  ]

  // Clean HTML from description for Google JobPosting schema
  const cleanDescription = (htmlText: string): string => {
    return htmlText
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Schema: JobPosting & BreadcrumbList
  const jobPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    'title': job.title,
    'description': cleanDescription(job.description + ' ' + job.requirements + ' ' + job.benefits),
    'datePosted': job.created_at.toISOString(),
    'validThrough': new Date(job.created_at.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days out
    'employmentType': job.type === 'FULLTIME' ? 'FULL_TIME' : job.type === 'PARTTIME' ? 'PART_TIME' : 'OTHER',
    'hiringOrganization': {
      '@type': 'Organization',
      'name': 'Công Ty Dịch Vụ Bảo Vệ Long Việt',
      'sameAs': 'https://baovelongviet.vn',
      'logo': 'https://baovelongviet.vn/images/logo.png',
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': job.location,
        'addressCountry': 'VN',
      },
    },
    'baseSalary': job.salary_range
      ? {
          '@type': 'MonetaryAmount',
          'currency': 'VND',
          'value': {
            '@type': 'QuantitativeValue',
            'value': job.salary_range,
            'unitText': 'MONTH',
          },
        }
      : undefined,
  }

  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.label,
      'item': item.href ? `https://baovelongviet.vn${item.href}` : undefined,
    })),
  }

  return (
    <main className="bg-secondary-dark min-h-screen text-left">
      {/* 1. Schema JSON-LD Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />

      {/* 2. Breadcrumbs section */}
      <section className="bg-secondary-light/5 border-b border-white/5 py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </section>

      {/* 3. Main Details grid */}
      <section className="py-12 relative overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
            
            {/* Main Content Area */}
            <article className="space-y-8">
              {/* Job Header Info */}
              <div className="bg-secondary-light/10 border border-white/5 p-8 rounded-3xl backdrop-blur-md space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                    {job.status === 'OPEN' ? 'Đang tuyển dụng' : 'Tạm dừng nhận hồ sơ'}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {typeLabel}
                  </span>
                </div>

                <h1 className="font-heading font-extrabold text-2xl md:text-3.5xl text-white tracking-tight leading-tight">
                  {job.title}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-white/5 text-gray-300 text-xs md:text-sm font-sans font-light">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Khu vực làm việc</p>
                      <p className="font-semibold text-white">{job.location}</p>
                    </div>
                  </div>

                  {job.salary_range && (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Mức lương đề xuất</p>
                        <p className="font-semibold text-white">{job.salary_range}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Richtext Descriptions */}
              <div className="bg-secondary-light/10 border border-white/5 p-8 rounded-3xl backdrop-blur-md space-y-8 font-sans">
                {/* 1. Job Description */}
                <div className="space-y-4">
                  <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span>Mô Tả Công Việc</span>
                  </h3>
                  <div
                    className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed font-light font-sans space-y-2
                               [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>

                {/* 2. Job Requirements */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span>Yêu Cầu Ứng Viên</span>
                  </h3>
                  <div
                    className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed font-light font-sans space-y-2
                               [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </div>

                {/* 3. Job Benefits */}
                <div className="space-y-4 pt-6 border-t border-white/5">
                  <h3 className="font-heading font-extrabold text-lg text-white flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" />
                    <span>Quyền Lợi Được Hưởng</span>
                  </h3>
                  <div
                    className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed font-light font-sans space-y-2
                               [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-1"
                    dangerouslySetInnerHTML={{ __html: job.benefits }}
                  />
                </div>
              </div>

              {/* General Static Requirements Box */}
              <div className="bg-secondary-light/10 border border-white/5 p-8 rounded-3xl backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <h4 className="font-heading font-extrabold text-base text-white">
                    Tiêu Chuẩn Tuyển Dụng Lực Lượng Vệ Sĩ Long Việt
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs md:text-sm text-gray-400 font-light font-sans">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Chiều cao: Nam ≥ 1m65, Nữ ≥ 1m55.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Lý lịch: Tư pháp rõ ràng, không tiền án tiền sự.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Vết xăm: Không có hình xăm phản cảm, lộ vùng hở.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Sức khỏe: Thể chất tốt, không dị tật, không cận nặng.</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar form Card */}
            <aside className="lg:sticky lg:top-28 space-y-6">
              <ApplyFormCard job={job} />
            </aside>
          </div>
        </div>
      </section>

      {/* 4. Related jobs section */}
      {otherJobs.length > 0 && (
        <section className="py-16 md:py-24 bg-secondary-light/5 border-t border-white/5 relative">
          <div className="container mx-auto px-4 max-w-7xl space-y-12">
            <div className="text-left space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-primary block" />
                <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Cơ Hội Việc Làm Khác</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl md:text-2xl text-white tracking-tight">
                Vị Trí Tuyển Dụng Tương Tự
              </h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                Khám phá thêm các mục tiêu bảo vệ đang tuyển dụng khẩn cấp với thu nhập cực kỳ hấp dẫn tại các khu vực lân cận.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherJobs.map((j: any) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
