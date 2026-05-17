# 08 – SEO & META

> **Dùng khi:** Implement metadata, Schema markup, sitemap, robots.txt, Open Graph.

---

## Meta Tags Pattern (Next.js)

```typescript
// app/(site)/dich-vu/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const service = await getService(params.slug)
  if (!service) return {}

  const title = service.meta_title
    || `${service.title} | Long Việt Security`
  const description = service.meta_desc
    || `Dịch vụ ${service.title.toLowerCase()} chuyên nghiệp, uy tín. Cam kết an toàn tuyệt đối. Báo giá miễn phí: 0923 840 999.`

  return {
    title,
    description,
    alternates: { canonical: `https://yourdomain.vn/dich-vu/${service.slug}` },
    openGraph: {
      title,
      description,
      url: `https://yourdomain.vn/dich-vu/${service.slug}`,
      siteName: 'Long Việt Security',
      images: [{ url: service.image || '/og-default.jpg', width: 1200, height: 630 }],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [service.image || '/og-default.jpg'],
    },
  }
}
```

---

## Meta Title Patterns

| Trang | Pattern | Ví dụ |
|-------|---------|-------|
| Trang chủ | `{Tagline} \| {Company}` | `Bảo Vệ Chuyên Nghiệp – An Toàn Tuyệt Đối \| Long Việt Security` |
| Dịch vụ | `{Tên DV} \| {Company}` | `Bảo Vệ Nhà Máy Chuyên Nghiệp \| Long Việt Security` |
| Blog | `{Tiêu đề bài} \| {Company}` | `Quy Trình Bảo Vệ Nhà Máy \| Long Việt Security` |
| Tuyển dụng | `Tuyển {Vị trí} \| {Company}` | `Tuyển Nhân Viên Bảo Vệ Nhà Máy \| Long Việt Security` |
| SEO địa phương | `Dịch Vụ Bảo Vệ {Tỉnh} \| {Company}` | `Dịch Vụ Bảo Vệ TP.HCM \| Long Việt Security` |

**Quy tắc:**
- Max 60 ký tự (title), 160 ký tự (description)
- Từ khóa chính ở đầu title
- Description có CTA và số hotline

---

## Schema Markup

### LocalBusiness (Homepage + Contact page)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://yourdomain.vn/#organization",
  "name": "Công Ty Dịch Vụ Bảo Vệ Long Việt",
  "url": "https://yourdomain.vn",
  "logo": "https://yourdomain.vn/images/logo.png",
  "image": "https://yourdomain.vn/images/hero.jpg",
  "telephone": "+84923840999",
  "email": "info@yourdomain.vn",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "B23 Khu Dân Cư Nam Long, Đường Phú Thuận",
    "addressLocality": "Phú Thuận, Quận 7",
    "addressRegion": "TP. Hồ Chí Minh",
    "addressCountry": "VN"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": 10.7326, "longitude": 106.7225 },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00", "closes": "23:59"
  }],
  "sameAs": [
    "https://facebook.com/baovelongviet",
    "https://zalo.me/baovelongviet"
  ],
  "priceRange": "$$"
}
```

### Service Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Bảo Vệ Nhà Máy",
  "provider": { "@id": "https://yourdomain.vn/#organization" },
  "description": "...",
  "areaServed": {
    "@type": "State",
    "name": "Việt Nam"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "VND",
    "price": "15000000",
    "description": "Giá từ 15.000.000 VNĐ/tháng"
  }
}
```

### FAQPage Schema (trang dịch vụ)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Chi phí thuê bảo vệ nhà máy là bao nhiêu?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Chi phí từ 15.000.000 đến 27.000.000 VNĐ/tháng tùy quy mô và ca làm việc."
      }
    }
  ]
}
```

### Article Schema (Blog)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{post.title}",
  "image": "{post.thumbnail}",
  "datePublished": "{post.published_at}",
  "dateModified": "{post.updated_at}",
  "author": { "@type": "Person", "name": "{post.author.name}" },
  "publisher": {
    "@type": "Organization",
    "name": "Long Việt Security",
    "logo": { "@type": "ImageObject", "url": "https://yourdomain.vn/images/logo.png" }
  }
}
```

### JobPosting Schema
```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Nhân Viên Bảo Vệ Nhà Máy",
  "description": "{job.description}",
  "datePosted": "{job.created_at}",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Công Ty Dịch Vụ Bảo Vệ Long Việt",
    "sameAs": "https://yourdomain.vn"
  },
  "jobLocation": {
    "@type": "Place",
    "address": { "@type": "PostalAddress", "addressLocality": "TP. Hồ Chí Minh", "addressCountry": "VN" }
  },
  "employmentType": "FULL_TIME",
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "VND",
    "value": { "@type": "QuantitativeValue", "minValue": 8000000, "maxValue": 12000000, "unitText": "MONTH" }
  }
}
```

### BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Trang Chủ", "item": "https://yourdomain.vn" },
    { "@type": "ListItem", "position": 2, "name": "Dịch Vụ",   "item": "https://yourdomain.vn/dich-vu" },
    { "@type": "ListItem", "position": 3, "name": "Bảo Vệ Nhà Máy" }
  ]
}
```

---

## Schema Component (Next.js)

```tsx
// components/seo/JsonLd.tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Sử dụng trong page:
// <JsonLd data={serviceSchema} />
// <JsonLd data={breadcrumbSchema} />
// <JsonLd data={faqSchema} />
```

---

## robots.txt

```
User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /404

Sitemap: https://yourdomain.vn/sitemap.xml
```

---

## Từ Khóa Mục Tiêu

### Dịch vụ (Priority 1)
```
dịch vụ bảo vệ nhà máy
dịch vụ bảo vệ sự kiện
dịch vụ bảo vệ tòa nhà văn phòng
thuê bảo vệ chuyên nghiệp
công ty bảo vệ uy tín
dịch vụ vệ sĩ
```

### Địa phương (Priority 1)
```
công ty bảo vệ tphcm
công ty bảo vệ hà nội
công ty bảo vệ đà nẵng
dịch vụ bảo vệ [tên quận] tphcm
top công ty bảo vệ [tỉnh]
```

### Tuyển dụng (Priority 2)
```
tuyển bảo vệ nhà máy
tuyển nhân viên bảo vệ
việc làm bảo vệ lương cao
tuyển bảo vệ không cần kinh nghiệm
bảo vệ bộ đội xuất ngũ
```

### Long-tail (Priority 3)
```
chi phí thuê bảo vệ nhà máy bao nhiêu
bảng giá dịch vụ bảo vệ
thuê bảo vệ sự kiện giá rẻ
công ty bảo vệ có giấy phép
```

---

## Core Web Vitals Targets

| Metric | Target | Cách đạt |
|--------|--------|---------|
| LCP | < 2.5s | Preload hero image, Next/Image, CDN |
| FID | < 100ms | Defer non-critical JS, code split |
| CLS | < 0.1 | img có width/height, font-display: swap |
| TTFB | < 600ms | SSG/ISR, Edge caching |

```tsx
// Tất cả ảnh dùng Next/Image:
import Image from 'next/image'
<Image
  src={src}
  alt={alt}
  width={800}
  height={450}
  priority={isHero}      // true cho hero image
  loading={isHero ? 'eager' : 'lazy'}
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Preload hero image trong <head>:
// <link rel="preload" as="image" href="/images/hero-1.jpg" />
```

---

## TypeScript Type-Safety Patterns (Common Mismatches)

### 1. Nullable Fields in Next.js Metadata
Next.js strict typing expects the `description` or `openGraph.description` parameters to be `string | undefined`. However, database schema fields (via Prisma) are often nullable (`string | null`).
- **❌ WRONG:**
  ```typescript
  description: post.excerpt || post.meta_desc // Type error: string | null is not assignable to string | undefined
  ```
- **✅ RIGHT:**
  ```typescript
  description: post.excerpt || post.meta_desc || undefined
  ```

### 2. Map & Filter Parameters in Dynamic Pages & Sitemaps
Under strict `noImplicitAny` compilation rules, mapping over dynamically fetched databases arrays (e.g. branch locations, partners, active services, blog posts) will fail if parameter types are not resolved.
- **❌ WRONG:**
  ```typescript
  services.map((s) => s.slug) // Parameter 's' implicitly has an 'any' type
  ```
- **✅ RIGHT:**
  ```typescript
  services.map((s: any) => s.slug) // Explicit type parameters prevent compilation errors
  ```
