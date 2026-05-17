# 00 – PROJECT OVERVIEW

> **Context cho AI agent:** File này mô tả toàn bộ bức tranh dự án. Đọc trước khi làm bất kỳ task nào.

---

## Tóm Tắt Dự Án

Website cho **công ty dịch vụ bảo vệ chuyên nghiệp** (mô hình B2B). Phục vụ 3 mục tiêu song song:

| Mục tiêu | Đối tượng | Hành động mong muốn |
|---------|----------|-------------------|
| **Thương mại** | Doanh nghiệp cần thuê bảo vệ | Gọi hotline / gửi form báo giá |
| **Tuyển dụng** | Người tìm việc bảo vệ | Nộp hồ sơ online |
| **Thương hiệu** | Cả hai nhóm trên | Đọc nội dung, tin tưởng, quay lại |

---

## Stack Kỹ Thuật

```
Frontend : Next.js 14 (App Router) + TypeScript + Tailwind CSS
CMS/API  : Strapi v4 (Headless) HOẶC WordPress + WP REST API
Database : PostgreSQL 15
Email    : SendGrid (transactional)
Storage  : Cloudflare R2 hoặc AWS S3 (file CV, ảnh)
CDN      : Cloudflare
Deploy   : Vercel (frontend) + VPS Ubuntu 22.04 (backend)
CI/CD    : GitHub Actions
```

> **Lưu ý:** Nếu khách hàng ưu tiên tốc độ & đơn giản → dùng **WordPress + ACF Pro**. Nếu ưu tiên hiệu năng & scale → dùng **Next.js + Strapi**.

---

## Người Dùng & Quyền

| Role | Mô tả | Quyền hạn |
|------|-------|----------|
| `visitor` | Khách truy cập website | Xem nội dung, gửi form |
| `applicant` | Ứng viên bảo vệ | Nộp hồ sơ, upload CV |
| `viewer` | Admin nội bộ (xem) | Xem lead, hồ sơ |
| `editor` | Biên tập viên | CRUD bài viết, dịch vụ, tuyển dụng |
| `admin` | Quản trị toàn quyền | Toàn bộ quyền + cài đặt hệ thống |

---

## KPI Cần Đạt

- ≥ 50 lead/tháng qua form & hotline
- ≥ 20 hồ sơ ứng tuyển/tháng
- Lighthouse Score Mobile ≥ 85
- Top 5 Google cho keyword `[dịch vụ bảo vệ] + [tỉnh]`
- Uptime ≥ 99.9%

---

## Thông Tin Công Ty (Seed Data Mẫu)

```json
{
  "company": {
    "name": "Công Ty Dịch Vụ Bảo Vệ Long Việt",
    "founded": 2009,
    "employees": 2000,
    "projects_completed": 1000,
    "tagline": "Bảo Vệ Chuyên Nghiệp – An Toàn Tuyệt Đối",
    "email": "info@baovelongviet.vn",
    "hotline": "0923 840 999"
  },
  "branches": [
    { "name": "TP. Hồ Chí Minh", "address": "B23 Khu Dân Cư Nam Long, P. Phú Thuận, Q7", "phone": "0923 840 999", "is_main": true },
    { "name": "Long An", "address": "KCN Thuận Đạo, Cần Đước, Long An", "phone": "0923 317 999" },
    { "name": "Đồng Nai", "address": "52/3 Võ Thị Sáu, Biên Hòa, Đồng Nai", "phone": "0926 792 666" },
    { "name": "Đà Nẵng", "address": "43 Trung Nghĩa 8, Hòa Minh, Liên Chiểu", "phone": "0926 770 999" },
    { "name": "Hà Nội", "address": "30B Phố Bà Triệu, P. Cửa Nam, Hoàn Kiếm", "phone": "0909 163 789" }
  ],
  "social": {
    "facebook": "https://facebook.com/baovelongviet",
    "zalo_oa": "https://zalo.me/baovelongviet",
    "youtube": "https://youtube.com/@baovelongviet"
  }
}
```

---

## Màu Sắc & Font (Quick Reference)

```css
--color-primary   : #C0392B;  /* Đỏ đậm - CTA, tiêu đề nổi */
--color-secondary : #2C3E50;  /* Xanh đậm - Header, footer */
--color-accent    : #E74C3C;  /* Đỏ nhạt - Hover, badge */
--color-bg-light  : #F2F2F2;  /* Nền section */
--color-text      : #333333;  /* Văn bản chính */
--color-text-muted: #777777;  /* Caption, label */

font-family: 'Be Vietnam Pro', 'Roboto', sans-serif;
```

---

## Cấu Trúc Thư Mục Dự Án (Next.js)

```
/
├── app/                        # Next.js App Router
│   ├── (site)/                 # Public site layout
│   │   ├── page.tsx            # Trang chủ
│   │   ├── gioi-thieu/
│   │   ├── dich-vu/
│   │   │   └── [slug]/
│   │   ├── bang-gia/
│   │   ├── tuyen-dung/
│   │   │   └── [slug]/
│   │   ├── tin-tuc/
│   │   │   └── [slug]/
│   │   ├── tai-lieu/
│   │   │   └── [slug]/
│   │   ├── hop-tac/
│   │   └── lien-he/
│   ├── (admin)/                # Admin dashboard layout
│   │   ├── dashboard/
│   │   ├── services/
│   │   ├── posts/
│   │   ├── jobs/
│   │   ├── contacts/
│   │   └── settings/
│   └── api/                    # API Routes
│       ├── contacts/route.ts
│       ├── applications/route.ts
│       └── ...
├── components/
│   ├── ui/                     # Base UI (Button, Input, Card...)
│   ├── layout/                 # Header, Footer, Breadcrumb
│   ├── sections/               # Homepage sections
│   ├── forms/                  # ContactForm, QuoteForm, ApplyForm
│   └── admin/                  # Admin-specific components
├── lib/
│   ├── db.ts                   # Database client (Prisma/Drizzle)
│   ├── email.ts                # SendGrid helper
│   ├── storage.ts              # File upload helper
│   └── validations.ts          # Zod schemas
├── types/
│   └── index.ts                # Shared TypeScript types
├── public/
│   └── images/
└── prisma/
    └── schema.prisma           # Database schema
```
