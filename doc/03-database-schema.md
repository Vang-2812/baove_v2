# 03 – DATABASE SCHEMA

> **Dùng khi:** Tạo migration Prisma/Drizzle, viết seed data, implement repository/service layer.

---

## Prisma Schema (PostgreSQL)

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(VIEWER)
  is_active Boolean  @default(true)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  posts     Post[]
}

enum Role { ADMIN EDITOR VIEWER }

// ─────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────
model Service {
  id          String  @id @default(cuid())
  title       String
  slug        String  @unique
  description String  // markdown/richtext
  scope       String? // phạm vi cung cấp (markdown)
  process     String? // quy trình (JSON array of steps)
  benefits    String? // lợi ích (markdown)
  icon        String? // tên lucide icon hoặc URL ảnh icon
  image       String? // URL ảnh banner
  price_min   Float?
  price_max   Float?
  price_unit  String? @default("tháng")
  faq         String? // JSON array [{q, a}]
  order       Int     @default(0)
  is_active   Boolean @default(true)
  meta_title  String?
  meta_desc   String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
}

// ─────────────────────────────────────────
// POSTS (Blog & Tài liệu)
// ─────────────────────────────────────────
model Category {
  id        String  @id @default(cuid())
  name      String
  slug      String  @unique
  parent_id String?
  type      PostType @default(BLOG)
  order     Int     @default(0)
  posts     Post[]
}

enum PostType { BLOG DOCUMENT }

model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   // HTML hoặc markdown
  excerpt     String?
  thumbnail   String?
  type        PostType @default(BLOG)
  category_id String?
  category    Category? @relation(fields: [category_id], references: [id])
  author_id   String?
  author      User?    @relation(fields: [author_id], references: [id])
  status      PostStatus @default(DRAFT)
  published_at DateTime?
  view_count  Int      @default(0)
  meta_title  String?
  meta_desc   String?
  tags        String[] // array of tag strings
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt
}

enum PostStatus { DRAFT PUBLISHED SCHEDULED }

// ─────────────────────────────────────────
// RECRUITMENT
// ─────────────────────────────────────────
model Job {
  id           String  @id @default(cuid())
  title        String
  slug         String  @unique
  description  String  // mô tả công việc (richtext)
  requirements String  // yêu cầu ứng viên (richtext)
  benefits     String  // quyền lợi (richtext)
  location     String  // vd: "TP.HCM, Đồng Nai"
  salary_range String? // vd: "12-15 triệu"
  type         JobType @default(FULLTIME)
  status       JobStatus @default(OPEN)
  meta_title   String?
  meta_desc    String?
  created_at   DateTime @default(now())
  updated_at   DateTime @updatedAt
  applications Application[]
}

enum JobType   { FULLTIME PARTTIME CONTRACT }
enum JobStatus { OPEN PAUSED CLOSED }

model Application {
  id                 String   @id @default(cuid())
  job_id             String
  job                Job      @relation(fields: [job_id], references: [id])
  name               String
  phone              String
  email              String
  cv_file            String?  // URL file CV
  experience_years   Int?
  preferred_location String?
  note               String?
  status             AppStatus @default(NEW)
  created_at         DateTime @default(now())
}

enum AppStatus { NEW REVIEWING ACCEPTED REJECTED }

// ─────────────────────────────────────────
// LEADS (Form Liên Hệ & Báo Giá)
// ─────────────────────────────────────────
model Contact {
  id           String   @id @default(cuid())
  name         String
  phone        String
  email        String?
  province     String?  // tỉnh/thành phố
  service_type String?  // loại dịch vụ quan tâm
  title        String?  // tiêu đề / chủ đề
  message      String
  source       String?  // "homepage_form" | "service_page" | "contact_page"
  status       LeadStatus @default(NEW)
  handled_by   String?
  handled_at   DateTime?
  note         String?  // ghi chú nội bộ
  created_at   DateTime @default(now())
}

enum LeadStatus { NEW IN_PROGRESS DONE CANCELLED }

// ─────────────────────────────────────────
// PARTNERS & TESTIMONIALS
// ─────────────────────────────────────────
model Partner {
  id         String  @id @default(cuid())
  name       String
  logo       String  // URL ảnh logo
  website    String?
  order      Int     @default(0)
  is_active  Boolean @default(true)
  created_at DateTime @default(now())
}

model Testimonial {
  id           String  @id @default(cuid())
  client_name  String
  position     String? // chức vụ
  company      String? // tên công ty
  logo         String? // logo công ty
  content      String
  rating       Int?    @default(5) // 1-5
  order        Int     @default(0)
  is_active    Boolean @default(true)
  created_at   DateTime @default(now())
}

// ─────────────────────────────────────────
// BRANCHES
// ─────────────────────────────────────────
model Branch {
  id           String  @id @default(cuid())
  name         String
  address      String
  phone        String
  email        String?
  map_embed_url String? // Google Maps embed URL
  province     String  // vd: "tphcm" | "hanoi" | "danang"
  is_main      Boolean @default(false)
  order        Int     @default(0)
}

// ─────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────
model Setting {
  key   String @id
  value String // JSON string
}
```

---

## Seed Data

```typescript
// prisma/seed.ts

// Settings
const settings = [
  { key: 'company_name',    value: '"Công Ty Dịch Vụ Bảo Vệ Long Việt"' },
  { key: 'company_hotline', value: '"0923 840 999"' },
  { key: 'company_email',   value: '"info@baovelongviet.vn"' },
  { key: 'stat_years',      value: '15' },
  { key: 'stat_employees',  value: '2000' },
  { key: 'stat_projects',   value: '1000' },
  { key: 'stat_branches',   value: '5' },
  { key: 'facebook_url',    value: '"https://facebook.com/baovelongviet"' },
  { key: 'zalo_url',        value: '"https://zalo.me/baovelongviet"' },
  { key: 'youtube_url',     value: '"https://youtube.com/@baovelongviet"' },
]

// Services (12 records)
const services = [
  { title: 'Bảo Vệ Nhà Máy',            slug: 'bao-ve-nha-may',         order: 1, price_min: 15000000, price_max: 27000000 },
  { title: 'Bảo Vệ Sự Kiện',            slug: 'bao-ve-su-kien',          order: 2, price_min: 80000,    price_max: 200000, price_unit: 'giờ/vị trí' },
  { title: 'Bảo Vệ Tòa Nhà / Văn Phòng',slug: 'bao-ve-toa-nha',         order: 3, price_min: 16000000, price_max: 27000000 },
  { title: 'Bảo Vệ Ngân Hàng',          slug: 'bao-ve-ngan-hang',        order: 4, price_min: 16000000, price_max: 27000000 },
  { title: 'Bảo Vệ Bệnh Viện',          slug: 'bao-ve-benh-vien',        order: 5, price_min: 16000000, price_max: 27000000 },
  { title: 'Bảo Vệ Nhà Hàng / Siêu Thị',slug: 'bao-ve-nha-hang',        order: 6, price_min: 15000000, price_max: 26000000 },
  { title: 'Bảo Vệ Trường Học',         slug: 'bao-ve-truong-hoc',       order: 7, price_min: 14000000, price_max: 25000000 },
  { title: 'Bảo Vệ Ngày Tết',           slug: 'bao-ve-ngay-tet',         order: 8, price_min: 700000,   price_max: 2000000, price_unit: 'ngày' },
  { title: 'Bảo Vệ Công Trường',        slug: 'bao-ve-cong-truong',      order: 9, price_min: 15000000, price_max: 26000000 },
  { title: 'Bảo Vệ Khu Công Nghiệp',   slug: 'bao-ve-khu-cong-nghiep', order: 10, price_min: 15000000, price_max: 27000000 },
  { title: 'Bảo Vệ Áp Tải Tiền',       slug: 'bao-ve-ap-tai-tien',     order: 11 },
  { title: 'Bảo Vệ Yếu Nhân / VIP',    slug: 'bao-ve-yeu-nhan',        order: 12 },
]

// Jobs (10 records)
const jobs = [
  { title: 'Nhân Viên Bảo Vệ Nhà Máy',    slug: 'bao-ve-nha-may',    location: 'TP.HCM, Đồng Nai, Bình Dương', salary_range: '8-12 triệu' },
  { title: 'Nhân Viên Bảo Vệ Tòa Nhà',    slug: 'bao-ve-toa-nha',    location: 'TP.HCM', salary_range: '8-12 triệu' },
  { title: 'Nhân Viên Bảo Vệ Ngân Hàng',  slug: 'bao-ve-ngan-hang',  location: 'TP.HCM, Hà Nội', salary_range: '10-14 triệu' },
  { title: 'Nhân Viên Bảo Vệ Bệnh Viện',  slug: 'bao-ve-benh-vien',  location: 'TP.HCM, Đà Nẵng', salary_range: '8-12 triệu' },
  { title: 'Nhân Viên Bảo Vệ Trường Học', slug: 'bao-ve-truong-hoc', location: 'TP.HCM', salary_range: '7-10 triệu' },
  { title: 'Nhân Viên Bảo Vệ Siêu Thị',   slug: 'bao-ve-sieu-thi',   location: 'TP.HCM', salary_range: '8-11 triệu' },
  { title: 'Nhân Viên Giữ Xe',             slug: 'giu-xe',             location: 'TP.HCM', salary_range: '7-9 triệu' },
  { title: 'Bảo Vệ Giữ Kho',              slug: 'giu-kho',            location: 'TP.HCM, Long An', salary_range: '8-11 triệu' },
  { title: 'Vệ Sĩ Chuyên Nghiệp (VIP)',   slug: 've-si-vip',          location: 'TP.HCM, Hà Nội', salary_range: '15-25 triệu' },
  { title: 'Bảo Vệ Khách Sạn',            slug: 'bao-ve-khach-san',   location: 'Đà Nẵng, TP.HCM', salary_range: '9-13 triệu' },
]

// Branches (5 records) – xem file 00-project-overview.md

// Categories
const categories = [
  { name: 'Tin Công Ty',   slug: 'tin-cong-ty',   type: 'BLOG' },
  { name: 'Nghiệp Vụ',    slug: 'nghiep-vu',     type: 'BLOG' },
  { name: 'Tuyển Dụng',   slug: 'tuyen-dung',    type: 'BLOG' },
  { name: 'Kiến Thức',    slug: 'kien-thuc',     type: 'BLOG' },
  { name: 'PCCC',          slug: 'phong-chay-chua-chay', type: 'DOCUMENT' },
  { name: 'Nghiệp Vụ BV', slug: 'nghiep-vu-bao-ve',    type: 'DOCUMENT' },
  { name: 'Sơ Cấp Cứu',  slug: 'so-cap-cuu',           type: 'DOCUMENT' },
  { name: 'Cứu Hộ',       slug: 'cuu-ho-cuu-nan',       type: 'DOCUMENT' },
]
```

---

## Indexes (Performance)

```sql
-- Thêm vào migration
CREATE INDEX idx_posts_slug        ON "Post"(slug);
CREATE INDEX idx_posts_status      ON "Post"(status);
CREATE INDEX idx_posts_category    ON "Post"(category_id);
CREATE INDEX idx_services_slug     ON "Service"(slug);
CREATE INDEX idx_jobs_slug         ON "Job"(slug);
CREATE INDEX idx_jobs_status       ON "Job"(status);
CREATE INDEX idx_contacts_status   ON "Contact"(status);
CREATE INDEX idx_contacts_created  ON "Contact"(created_at DESC);
CREATE INDEX idx_applications_job  ON "Application"(job_id);
```

---

## Helper Types (TypeScript)

```typescript
// types/index.ts
export type ServiceSummary = Pick<Service, 'id' | 'title' | 'slug' | 'image' | 'icon' | 'price_min' | 'price_max' | 'price_unit'>
export type PostCard       = Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'thumbnail' | 'published_at'> & { category?: Pick<Category, 'name' | 'slug'> }
export type JobCard        = Pick<Job, 'id' | 'title' | 'slug' | 'location' | 'salary_range' | 'status'>
export type ContactInput   = Pick<Contact, 'name' | 'phone' | 'email' | 'province' | 'service_type' | 'title' | 'message' | 'source'>
export type AppInput       = Pick<Application, 'job_id' | 'name' | 'phone' | 'email' | 'experience_years' | 'preferred_location' | 'note'>
```
