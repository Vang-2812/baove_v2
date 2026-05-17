# 01 – SITEMAP & ROUTES

> **Dùng khi:** Cấu hình routing Next.js, tạo menu navigation, generate sitemap.xml.

---

## Sitemap Đầy Đủ

```
/                                    # Trang chủ
├── /gioi-thieu                      # Giới thiệu tổng quan
│   ├── /qua-trinh-hinh-thanh        # Timeline lịch sử
│   ├── /co-cau-to-chuc              # Org chart
│   ├── /tam-nhin-su-menh            # Vision & Mission
│   └── /su-khac-biet                # Điểm khác biệt
├── /dich-vu                         # Danh mục dịch vụ
│   ├── /dich-vu/bao-ve-nha-may
│   ├── /dich-vu/bao-ve-su-kien
│   ├── /dich-vu/bao-ve-toa-nha
│   ├── /dich-vu/bao-ve-ngan-hang
│   ├── /dich-vu/bao-ve-benh-vien
│   ├── /dich-vu/bao-ve-nha-hang
│   ├── /dich-vu/bao-ve-truong-hoc
│   ├── /dich-vu/bao-ve-ngay-tet
│   ├── /dich-vu/bao-ve-cong-truong
│   ├── /dich-vu/bao-ve-khu-cong-nghiep
│   ├── /dich-vu/bao-ve-ap-tai-tien
│   └── /dich-vu/bao-ve-yeu-nhan
├── /bang-gia                        # Bảng giá tham khảo
├── /tuyen-dung                      # Danh sách vị trí tuyển
│   └── /tuyen-dung/[slug]           # Chi tiết vị trí
├── /tin-tuc                         # Danh sách bài viết
│   └── /tin-tuc/[slug]              # Chi tiết bài viết
├── /tai-lieu                        # Kho tài liệu
│   ├── /tai-lieu/phong-chay-chua-chay
│   ├── /tai-lieu/nghiep-vu-bao-ve
│   ├── /tai-lieu/so-cap-cuu
│   └── /tai-lieu/cuu-ho-cuu-nan
├── /hop-tac                         # Hợp tác đối tác
├── /lien-he                         # Liên hệ
├── /cong-ty-bao-ve-tphcm            # SEO địa phương
├── /cong-ty-bao-ve-ha-noi
├── /cong-ty-bao-ve-da-nang
├── /cong-ty-bao-ve-dong-nai
├── /cong-ty-bao-ve-long-an
└── /404                             # Trang lỗi tùy chỉnh
```

---

## Next.js App Router – Cấu Trúc Thư Mục

```
app/(site)/
├── layout.tsx                  # Root layout (Header + Footer)
├── page.tsx                    # /
├── gioi-thieu/
│   ├── page.tsx                # /gioi-thieu
│   ├── qua-trinh-hinh-thanh/page.tsx
│   ├── co-cau-to-chuc/page.tsx
│   ├── tam-nhin-su-menh/page.tsx
│   └── su-khac-biet/page.tsx
├── dich-vu/
│   ├── page.tsx                # /dich-vu (danh mục)
│   └── [slug]/page.tsx         # /dich-vu/[slug]
├── bang-gia/page.tsx
├── tuyen-dung/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── tin-tuc/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── tai-lieu/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── hop-tac/page.tsx
├── lien-he/page.tsx
├── cong-ty-bao-ve-[tinh]/page.tsx   # Catch slug cho SEO địa phương
└── not-found.tsx
```

---

## Menu Chính (Header Navigation)

```typescript
// lib/navigation.ts
export const mainNav = [
  { label: 'Trang Chủ', href: '/' },
  {
    label: 'Giới Thiệu',
    href: '/gioi-thieu',
    children: [
      { label: 'Quá Trình Hình Thành', href: '/gioi-thieu/qua-trinh-hinh-thanh' },
      { label: 'Cơ Cấu Tổ Chức', href: '/gioi-thieu/co-cau-to-chuc' },
      { label: 'Tầm Nhìn – Sứ Mệnh', href: '/gioi-thieu/tam-nhin-su-menh' },
      { label: 'Sự Khác Biệt', href: '/gioi-thieu/su-khac-biet' },
    ],
  },
  {
    label: 'Dịch Vụ',
    href: '/dich-vu',
    children: [
      { label: 'Bảo Vệ Nhà Máy', href: '/dich-vu/bao-ve-nha-may' },
      { label: 'Bảo Vệ Sự Kiện', href: '/dich-vu/bao-ve-su-kien' },
      { label: 'Bảo Vệ Tòa Nhà', href: '/dich-vu/bao-ve-toa-nha' },
      { label: 'Bảo Vệ Ngân Hàng', href: '/dich-vu/bao-ve-ngan-hang' },
      { label: 'Bảo Vệ Bệnh Viện', href: '/dich-vu/bao-ve-benh-vien' },
      { label: 'Bảo Vệ Nhà Hàng / Siêu Thị', href: '/dich-vu/bao-ve-nha-hang' },
      { label: 'Bảo Vệ Trường Học', href: '/dich-vu/bao-ve-truong-hoc' },
      { label: 'Bảo Vệ Ngày Tết', href: '/dich-vu/bao-ve-ngay-tet' },
      { label: 'Bảo Vệ Công Trường', href: '/dich-vu/bao-ve-cong-truong' },
      { label: 'Bảo Vệ Khu Công Nghiệp', href: '/dich-vu/bao-ve-khu-cong-nghiep' },
      { label: 'Bảo Vệ Áp Tải Tiền', href: '/dich-vu/bao-ve-ap-tai-tien' },
      { label: 'Bảo Vệ Yếu Nhân / VIP', href: '/dich-vu/bao-ve-yeu-nhan' },
    ],
  },
  { label: 'Bảng Giá', href: '/bang-gia' },
  { label: 'Tuyển Dụng', href: '/tuyen-dung' },
  { label: 'Tin Tức', href: '/tin-tuc' },
  {
    label: 'Tài Liệu',
    href: '/tai-lieu',
    children: [
      { label: 'Phòng Cháy Chữa Cháy', href: '/tai-lieu/phong-chay-chua-chay' },
      { label: 'Nghiệp Vụ Bảo Vệ', href: '/tai-lieu/nghiep-vu-bao-ve' },
      { label: 'Sơ Cấp Cứu', href: '/tai-lieu/so-cap-cuu' },
      { label: 'Cứu Hộ Cứu Nạn', href: '/tai-lieu/cuu-ho-cuu-nan' },
    ],
  },
  { label: 'Hợp Tác', href: '/hop-tac' },
  { label: 'Liên Hệ', href: '/lien-he' },
]
```

---

## Breadcrumb Logic

```typescript
// Ví dụ breadcrumb cho /dich-vu/bao-ve-nha-may
[
  { label: 'Trang Chủ', href: '/' },
  { label: 'Dịch Vụ', href: '/dich-vu' },
  { label: 'Bảo Vệ Nhà Máy', href: null }, // trang hiện tại
]

// Ví dụ breadcrumb cho /tin-tuc/quy-trinh-bao-ve
[
  { label: 'Trang Chủ', href: '/' },
  { label: 'Tin Tức', href: '/tin-tuc' },
  { label: 'Quy Trình Bảo Vệ', href: null },
]
```

---

## URL Rules

| Rule | Đúng ✅ | Sai ❌ |
|------|--------|-------|
| Viết thường | `/bao-ve-nha-may` | `/BaoVeNhaMay` |
| Dùng dấu gạch ngang | `/bao-ve-nha-may` | `/bao_ve_nha_may` |
| Không dấu tiếng Việt | `/bao-ve-nha-may` | `/bảo-vệ-nhà-máy` |
| Không tham số động | `/dich-vu/bao-ve-nha-may` | `/dich-vu?id=1` |
| Trailing slash nhất quán | `/dich-vu` | `/dich-vu/` |

---

## Sitemap.xml Config (Next.js)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourdomain.vn'

  // Static routes
  const staticRoutes = [
    '', '/gioi-thieu', '/gioi-thieu/qua-trinh-hinh-thanh',
    '/gioi-thieu/co-cau-to-chuc', '/gioi-thieu/tam-nhin-su-menh',
    '/bang-gia', '/hop-tac', '/lien-he',
    '/cong-ty-bao-ve-tphcm', '/cong-ty-bao-ve-ha-noi',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic routes - fetch từ DB/API
  const services = await getServices()   // slug từ DB
  const posts    = await getPosts()
  const jobs     = await getJobs()

  const dynamicRoutes = [
    ...services.map(s => ({ url: `${baseUrl}/dich-vu/${s.slug}`, priority: 0.9, changeFrequency: 'monthly' as const })),
    ...posts.map(p => ({ url: `${baseUrl}/tin-tuc/${p.slug}`, priority: 0.7, changeFrequency: 'weekly' as const })),
    ...jobs.map(j => ({ url: `${baseUrl}/tuyen-dung/${j.slug}`, priority: 0.8, changeFrequency: 'weekly' as const })),
  ]

  return [...staticRoutes, ...dynamicRoutes]
}
```
