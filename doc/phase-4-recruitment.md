# PHASE 4 – TUYỂN DỤNG (Tuần 8)

> **Mục tiêu:** Hệ thống tuyển dụng hoàn chỉnh – đăng tin, ứng tuyển online, nhận email, lưu hồ sơ.  
> **Deploy:** Cuối tuần 8.  
> **Đọc thêm:** `06-forms-and-lead.md`, `03-database-schema.md`, `04-api-contracts.md`, `08-seo-and-meta.md`

---

## Tổng Quan Deliverable

```
✅ DB: bảng jobs, applications
✅ API: GET /api/jobs, GET /api/jobs/[slug], POST /api/applications
✅ File upload CV (PDF → R2/S3)
✅ Trang /tuyen-dung (danh sách)
✅ Trang /tuyen-dung/[slug] (chi tiết + form ứng tuyển)
✅ Email: xác nhận ứng viên + thông báo HR
✅ Schema JobPosting cho SEO
✅ Seed 10 vị trí tuyển dụng
```

---

## TASK 1 – Database & Seed

```typescript
// Migration: bảng Job và Application (xem 03-database-schema.md)

// Seed 10 jobs (status=OPEN):
const jobs = [
  {
    title: 'Nhân Viên Bảo Vệ Nhà Máy',
    slug: 'nhan-vien-bao-ve-nha-may',
    location: 'TP.HCM, Đồng Nai, Bình Dương',
    salary_range: '8 - 12 triệu VNĐ/tháng',
    type: 'FULLTIME',
    status: 'OPEN',
    description: `
      <h3>Mô Tả Công Việc</h3>
      <ul>
        <li>Kiểm soát người và phương tiện ra vào cổng nhà máy</li>
        <li>Tuần tra định kỳ bên trong khuôn viên theo lịch ca</li>
        <li>Giám sát hệ thống camera an ninh</li>
        <li>Xử lý và báo cáo kịp thời các tình huống bất thường</li>
        <li>Lập biên bản và báo cáo ca làm việc</li>
        <li>Hỗ trợ phòng chống cháy nổ khi cần thiết</li>
      </ul>
    `,
    requirements: `
      <ul>
        <li>Nam giới, tuổi từ 20 – 45</li>
        <li>Chiều cao từ 1m65 trở lên</li>
        <li>Thể lực tốt, không mắc bệnh mãn tính</li>
        <li>Không có tiền án tiền sự</li>
        <li>Ưu tiên: bộ đội/công an xuất ngũ, đã có kinh nghiệm bảo vệ</li>
        <li>Có thể làm ca đêm, ngày lễ</li>
      </ul>
    `,
    benefits: `
      <ul>
        <li>Lương từ 8 – 12 triệu VNĐ/tháng tùy kinh nghiệm và địa bàn</li>
        <li>Thưởng tháng 13 + thưởng hiệu quả công việc</li>
        <li>Đóng BHXH, BHYT, BHTN đầy đủ theo quy định</li>
        <li>Bảo hiểm tai nạn 24/7</li>
        <li>Đồng phục + trang bị nghiệp vụ</li>
        <li>Cơ hội thăng tiến lên quản lý</li>
        <li>Môi trường làm việc chuyên nghiệp, kỷ luật</li>
      </ul>
    `,
  },
  // 9 vị trí còn lại tương tự...
]

// Danh sách 10 vị trí:
// 1. nhan-vien-bao-ve-nha-may
// 2. nhan-vien-bao-ve-toa-nha
// 3. nhan-vien-bao-ve-ngan-hang
// 4. nhan-vien-bao-ve-benh-vien
// 5. nhan-vien-bao-ve-truong-hoc
// 6. nhan-vien-bao-ve-sieu-thi
// 7. nhan-vien-giu-xe
// 8. bao-ve-giu-kho
// 9. ve-si-chuyen-nghiep-vip
// 10. bao-ve-khach-san
```

---

## TASK 2 – API: Jobs

**File:** `src/app/api/jobs/route.ts`
```typescript
// GET /api/jobs
// Filter optional: ?location=tphcm&type=FULLTIME&status=OPEN
// Mặc định: status=OPEN, sort: created_at DESC
// Return: JobCard[] (id, title, slug, location, salary_range, status, type)
// Cache: revalidate=1800 (30 phút)
```

**File:** `src/app/api/jobs/[slug]/route.ts`
```typescript
// GET /api/jobs/:slug
// Return: Job full (bao gồm description, requirements, benefits đã HTML-sanitize)
// 404 nếu slug không tồn tại hoặc status=CLOSED
```

---

## TASK 3 – API: Applications (File Upload)

**File:** `src/app/api/applications/route.ts`

```typescript
// POST /api/applications (multipart/form-data)

export async function POST(req: Request) {
  // 1. Parse FormData
  const formData = await req.formData()
  const body = Object.fromEntries(formData)
  const cvFile = formData.get('cv_file') as File | null

  // 2. Validate text fields (ApplicationSchema từ Zod)
  const parsed = ApplicationSchema.safeParse({
    job_id            : body.job_id,
    name              : body.name,
    phone             : body.phone,
    email             : body.email,
    experience_years  : body.experience_years ? Number(body.experience_years) : undefined,
    preferred_location: body.preferred_location,
    note              : body.note,
  })
  if (!parsed.success) return validationError(parsed.error)

  // 3. Validate CV file
  if (cvFile) {
    if (cvFile.type !== 'application/pdf')
      return error(400, 'Chỉ chấp nhận file PDF')
    if (cvFile.size > 5 * 1024 * 1024)
      return error(400, 'File CV không được vượt quá 5MB')
  }

  // 4. Verify reCAPTCHA
  const recaptchaToken = body.recaptcha_token as string
  const isValid = await verifyRecaptcha(recaptchaToken)
  if (!isValid) return error(422, 'Xác thực thất bại. Vui lòng thử lại.')

  // 5. Tạo Application record để lấy ID
  const application = await prisma.application.create({
    data: { ...parsed.data, status: 'NEW' }
  })

  // 6. Upload CV (nếu có)
  let cvUrl: string | null = null
  if (cvFile) {
    cvUrl = await uploadCV(cvFile, application.id)
    await prisma.application.update({
      where: { id: application.id },
      data: { cv_file: cvUrl }
    })
  }

  // 7. Fetch job info cho email
  const job = await prisma.job.findUnique({ where: { id: parsed.data.job_id } })

  // 8. Gửi email
  await Promise.allSettled([
    sendApplicationNotification({ ...application, cv_file: cvUrl }, job!),
    sendApplicationConfirmation({ ...application }, job!),
  ])

  return success({
    id     : application.id,
    message: 'Hồ sơ đã được ghi nhận. Chúng tôi sẽ liên hệ bạn trong 3-5 ngày làm việc.',
  })
}
```

---

## TASK 4 – File Upload Helper

**File:** `src/lib/storage.ts`

```typescript
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region    : 'auto',
  endpoint  : process.env.R2_ENDPOINT,   // https://{account}.r2.cloudflarestorage.com
  credentials: {
    accessKeyId    : process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadCV(file: File, applicationId: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const key    = `cvs/${applicationId}.pdf`

  await s3.send(new PutObjectCommand({
    Bucket     : process.env.R2_BUCKET!,
    Key        : key,
    Body       : buffer,
    ContentType: 'application/pdf',
    Metadata   : { applicationId },
  }))

  return `${process.env.R2_PUBLIC_URL}/${key}`
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext    = file.type.split('/')[1] || 'jpg'
  const key    = `${folder}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  await s3.send(new PutObjectCommand({
    Bucket     : process.env.R2_BUCKET!,
    Key        : key,
    Body       : buffer,
    ContentType: file.type,
  }))

  return `${process.env.R2_PUBLIC_URL}/${key}`
}
```

---

## TASK 5 – Trang Danh Sách Tuyển Dụng `/tuyen-dung`

**File:** `src/app/(site)/tuyen-dung/page.tsx`

```tsx
// Data: jobs (status=OPEN, sort by created_at DESC)

<PageHero
  title="Tuyển Dụng"
  subtitle="Cơ hội nghề nghiệp ổn định, thu nhập hấp dẫn tại Long Việt Security"
/>

{/* Filter bar */}
<div className="container mb-8 flex flex-wrap gap-3">
  <LocationFilter />    // TP.HCM | Hà Nội | Đà Nẵng | Đồng Nai | Long An | Tất cả
  <TypeFilter />        // Toàn thời gian | Bán thời gian
</div>

{/* Job grid */}
<div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {jobs.map(j => <JobCard key={j.id} job={j} />)}
</div>

{/* CTA section */}
<GeneralRequirementsSection />  // Yêu cầu chung + hotline liên hệ

// Meta:
// title: "Tuyển Dụng Nhân Viên Bảo Vệ | Long Việt Security"
// description: "Tuyển nhân viên bảo vệ toàn quốc. Lương 8-25 triệu. BHXH đầy đủ. Ưu tiên bộ đội xuất ngũ."
```

**JobCard Component:**
```tsx
// File: src/components/ui/JobCard.tsx
// Props: job: JobCard

// Layout:
// - Border card, hover:border-primary transition
// - Header: badge "Đang Tuyển" (green) + title
// - Info tags: icon MapPin (location) | icon Banknote (salary) | icon Clock (type)
// - CTA: Button "Xem Chi Tiết" → /tuyen-dung/[slug]
// - Mobile-friendly touch target
```

---

## TASK 6 – Trang Chi Tiết Tuyển Dụng `/tuyen-dung/[slug]`

**File:** `src/app/(site)/tuyen-dung/[slug]/page.tsx`

```tsx
// generateStaticParams: tất cả job slugs (OPEN + PAUSED)
// generateMetadata: dynamic từ job data

<Breadcrumb items={[{ label: 'Trang Chủ', href: '/' }, { label: 'Tuyển Dụng', href: '/tuyen-dung' }, { label: job.title }]} />

<div className="container py-12 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

  {/* Main content */}
  <main>
    {/* Job header */}
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <JobStatusBadge status={job.status} />
        <span className="text-sm text-text-muted">{job.type === 'FULLTIME' ? 'Toàn thời gian' : 'Bán thời gian'}</span>
      </div>
      <h1 className="text-h1 font-bold text-secondary">{job.title}</h1>
      <div className="flex flex-wrap gap-4 text-sm mt-4">
        <span className="flex gap-1 items-center"><MapPin size={16} className="text-primary" />{job.location}</span>
        {job.salary_range && <span className="flex gap-1 items-center"><Banknote size={16} className="text-primary" />{job.salary_range}</span>}
      </div>
    </div>

    {/* Job sections */}
    <JobSection title="Mô Tả Công Việc"    html={job.description} />
    <JobSection title="Yêu Cầu Ứng Viên"  html={job.requirements} />
    <JobSection title="Quyền Lợi & Phúc Lợi" html={job.benefits} />
    <GeneralRequirementsBox />  {/* Box cố định: nam, cao 1m65+, không tiền án */}
  </main>

  {/* Sidebar: Apply Form */}
  <aside>
    <div className="lg:sticky lg:top-24">
      <ApplyFormCard job={job} />
    </div>
  </aside>

</div>

{/* Related jobs */}
<RelatedJobs currentSlug={job.slug} jobs={otherJobs} />

// Schema: JobPosting (xem 08-seo-and-meta.md)
// Schema: BreadcrumbList
```

---

## TASK 7 – ApplyForm Component

**File:** `src/components/forms/ApplyFormCard.tsx`

```tsx
// Props: job: { id, title, slug }

// Card wrapper: bg-white rounded-2xl p-6 shadow-card border border-border

// Header:
//   h3: "Ứng Tuyển Ngay"
//   text: job.title (text-primary)

// Fields (react-hook-form + Zod):
//   name*              : text input
//   phone*             : tel input (validate VN regex)
//   email*             : email input
//   experience_years   : number select (0,1,2,3,5,10+ năm)
//   preferred_location : select (TP.HCM | Hà Nội | Đà Nẵng | Đồng Nai | Long An | Khác)
//   note               : textarea (optional, max 300 chars, hiện character counter)
//   cv_file            : FileDropzone component

// FileDropzone:
//   - Drag & drop zone hoặc click
//   - accept: { 'application/pdf': ['.pdf'] }
//   - maxSize: 5MB
//   - State: idle | selected (hiện tên file + size) | error
//   - UI: dashed border, icon Upload, text "Kéo thả hoặc click để chọn CV (PDF, tối đa 5MB)"

// Submit flow:
//   1. Validate form
//   2. Get reCAPTCHA token (action: 'apply')
//   3. Create FormData, append all fields + file
//   4. POST /api/applications
//   5. Success: ẩn form, hiện SuccessMessage component
//   6. Error: hiện toast error, giữ nguyên form

// Submit button: "Nộp Hồ Sơ" (primary, full-width, loading state)
// Hoặc: "Gọi Ngay: 0923 840 999" (outline, full-width, bên dưới)
```

---

## TASK 8 – SEO Tuyển Dụng

```typescript
// generateMetadata /tuyen-dung/[slug]:
{
  title: `Tuyển ${job.title} | Long Việt Security`,
  description: `Tuyển dụng ${job.title} làm việc tại ${job.location}. Lương ${job.salary_range}. Ứng tuyển ngay!`,
}

// JobPosting Schema:
{
  "@type": "JobPosting",
  "title": job.title,
  "description": stripHtml(job.description),
  "datePosted": job.created_at,
  "validThrough": addMonths(job.created_at, 3),  // 3 tháng từ ngày đăng
  "employmentType": job.type === 'FULLTIME' ? 'FULL_TIME' : 'PART_TIME',
  "hiringOrganization": { "@type": "Organization", "name": "Công Ty Dịch Vụ Bảo Vệ Long Việt" },
  "jobLocation": {
    "@type": "Place",
    "address": { "addressLocality": job.location, "addressCountry": "VN" }
  },
  "baseSalary": parseSalaryRange(job.salary_range),
  "jobBenefits": "BHXH, BHYT, bảo hiểm tai nạn, đồng phục",
}
```

---

## Definition of Done ✅

- [ ] 10 vị trí tuyển dụng hiển thị trên /tuyen-dung
- [ ] Filter theo địa bàn hoạt động (client-side)
- [ ] Trang chi tiết vị trí có đủ: mô tả, yêu cầu, quyền lợi, form ứng tuyển
- [ ] Form ứng tuyển: validation đúng (phone, email, file type, file size)
- [ ] Upload CV PDF lên R2 thành công (test với file thực tế)
- [ ] Email thông báo đến HR inbox (test thực tế)
- [ ] Email xác nhận đến ứng viên (test thực tế)
- [ ] Application lưu vào DB với cv_file URL
- [ ] Schema JobPosting valid (Rich Results Test)
- [ ] Mobile: form ứng tuyển dùng được tốt trên 375px
- [ ] Lighthouse Mobile ≥ 80
