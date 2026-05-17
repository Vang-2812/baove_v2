# PHASE 6 – SEO, TỐI ƯU & GO-LIVE (Tuần 11–12)

> **Mục tiêu:** Tối ưu toàn diện, SEO hoàn chỉnh, vượt qua pre-launch checklist, go-live chính thức.  
> **Output:** Website production hoàn chỉnh, bàn giao cho khách hàng.  
> **Đọc thêm:** `08-seo-and-meta.md`, `09-non-functional.md`

---

## Tổng Quan Deliverable

```
✅ Lighthouse Mobile ≥ 85 tất cả trang chính
✅ Toàn bộ Schema Markup hoàn chỉnh & validate sạch
✅ Sitemap XML đầy đủ, robots.txt đúng
✅ 5 trang SEO địa phương
✅ Google Business Profile 5 chi nhánh
✅ Security headers đầy đủ
✅ Monitoring uptime + Sentry error tracking
✅ Admin được đào tạo + tài liệu bàn giao
✅ 🚀 Go-live production
```

---

## TASK 1 – Performance Audit & Fix

### 1.1 Lighthouse Audit

```bash
# Chạy audit cho từng trang chính:
npx lighthouse https://staging.yourdomain.vn --view --output html
npx lighthouse https://staging.yourdomain.vn/dich-vu/bao-ve-nha-may --view
npx lighthouse https://staging.yourdomain.vn/tin-tuc --view
npx lighthouse https://staging.yourdomain.vn/tuyen-dung --view
npx lighthouse https://staging.yourdomain.vn/lien-he --view
```

**Target:** Performance ≥ 85 (mobile), ≥ 90 (desktop) cho mọi trang chính.

### 1.2 Image Optimization

```tsx
// Audit tất cả ảnh trên site:
// - Hero images: priority=true, sizes="100vw"
// - Card images: loading="lazy", sizes="(max-width:768px) 100vw, 33vw"
// - Partner logos: loading="lazy", sizes="128px"

// Compress ảnh upload (trước khi seed):
// - Dùng sharp (npm): resize, convert WebP, quality 80
// - Hero images: max 1920x1080, ~300KB
// - Thumbnails: max 800x450, ~150KB
// - Partner logos: max 256x128, ~20KB

// Thêm blur placeholder cho Next/Image:
import { getPlaiceholder } from 'plaiceholder'
// blurDataURL → hiển thị blur trong khi ảnh load
```

### 1.3 JavaScript Optimization

```tsx
// Dynamic import các component nặng:
const TinyMCEEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false })
const Carousel      = dynamic(() => import('@/components/ui/Carousel'))
const GoogleMaps    = dynamic(() => import('@/components/ui/GoogleMaps'))

// Zalo/Facebook widget: load sau 3 giây (defer)
useEffect(() => {
  const timer = setTimeout(() => setShowWidgets(true), 3000)
  return () => clearTimeout(timer)
}, [])

// Kiểm tra bundle size:
// npm run build → xem Output analysis
// Thêm @next/bundle-analyzer nếu cần
```

### 1.4 Font Optimization

```tsx
// next/font/google (tự host, không request external):
import { Be_Vietnam_Pro } from 'next/font/google'

const beVietnamPro = Be_Vietnam_Pro({
  subsets  : ['vietnamese', 'latin'],
  weight   : ['400', '500', '600', '700'],
  variable : '--font-sans',
  display  : 'swap',
})

// Xóa <link> Google Fonts trong <head>, dùng next/font thay thế
```

### 1.5 Caching & CDN

```typescript
// next.config.ts – Cache headers:
async headers() {
  return [
    {
      source: '/images/(.*)',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
    {
      source: '/api/services',
      headers: [{ key: 'Cache-Control', value: 'public, s-maxage=3600, stale-while-revalidate=86400' }],
    },
    {
      source: '/((?!api|admin).*)',
      headers: [{ key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=3600' }],
    },
  ]
},
```

---

## TASK 2 – SEO Hoàn Chỉnh

### 2.1 Audit Meta Tags

```typescript
// Checklist mỗi trang:
const pagesToAudit = [
  '/',
  '/gioi-thieu',
  '/dich-vu',
  '/dich-vu/bao-ve-nha-may',   // test 1 trang dịch vụ
  '/bang-gia',
  '/tuyen-dung',
  '/tuyen-dung/nhan-vien-bao-ve-nha-may',
  '/tin-tuc',
  '/lien-he',
]

// Dùng https://www.opengraph.xyz để preview OG
// Dùng https://metatags.io để preview meta
```

### 2.2 Hoàn Thiện Schema Markup

```typescript
// Trang chủ: LocalBusiness (5 chi nhánh) + WebSite (SearchAction)
// /dich-vu/[slug]: Service + FAQPage + BreadcrumbList
// /tin-tuc/[slug]: Article + BreadcrumbList
// /tuyen-dung/[slug]: JobPosting + BreadcrumbList
// /bang-gia: WebPage + BreadcrumbList
// /lien-he: LocalBusiness chi tiết + BreadcrumbList

// WebSite SearchAction schema (trang chủ):
{
  "@type": "WebSite",
  "url": "https://yourdomain.vn",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://yourdomain.vn/tin-tuc?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

// Test tất cả schemas:
// https://search.google.com/test/rich-results
// https://validator.schema.org
```

### 2.3 Sitemap & Robots

```typescript
// Verify sitemap.ts (xem 01-sitemap-and-routes.md) cover đủ:
// ✅ Static pages (12 trang)
// ✅ /dich-vu/[slug] x 12
// ✅ /tin-tuc/[slug] x tất cả published
// ✅ /tuyen-dung/[slug] x tất cả OPEN
// ✅ /tai-lieu/[slug] x tất cả published documents
// ✅ SEO địa phương x 5

// robots.txt: verify lại (xem 08-seo-and-meta.md)
// Submit sitemap lên Google Search Console

// robots.ts (Next.js):
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] }
    ],
    sitemap: 'https://yourdomain.vn/sitemap.xml',
  }
}
```

---

## TASK 3 – 5 Trang SEO Địa Phương

**File:** `src/app/(site)/cong-ty-bao-ve-[tinh]/page.tsx`

```typescript
// generateStaticParams:
const provinces = [
  { tinh: 'tphcm'   },
  { tinh: 'ha-noi'  },
  { tinh: 'da-nang' },
  { tinh: 'dong-nai'},
  { tinh: 'long-an' },
]

// Data map:
const provinceData: Record<string, ProvinceData> = {
  'tphcm': {
    displayName: 'TP. Hồ Chí Minh',
    branch     : branches.find(b => b.province === 'tphcm')!,
    h1         : 'Dịch Vụ Bảo Vệ Chuyên Nghiệp Tại TP. Hồ Chí Minh',
    description: 'Long Việt Security cung cấp dịch vụ bảo vệ chuyên nghiệp tại TP.HCM...',
    keywords   : ['công ty bảo vệ tphcm', 'dịch vụ bảo vệ tphcm', 'thuê bảo vệ tphcm'],
    localContent: '...',  // nội dung về hoạt động tại địa phương
  },
  // ... 4 tỉnh còn lại
}
```

```tsx
// Layout trang địa phương:
<PageHero title={data.h1} />

<section className="container py-12 grid lg:grid-cols-2 gap-12">
  <div>
    <h2>Dịch Vụ Bảo Vệ Tại {data.displayName}</h2>
    <p>{data.localContent}</p>
    <ServiceGrid services={services} compact />
  </div>
  <div>
    <h2>Chi Nhánh {data.displayName}</h2>
    <BranchCard branch={data.branch} />
    <GoogleMapEmbed url={data.branch.map_embed_url} />
  </div>
</section>

<QuoteSection />

// Meta:
title: `Dịch Vụ Bảo Vệ Tại ${displayName} | Long Việt Security`
description: `Công ty bảo vệ uy tín tại ${displayName}. 15 năm kinh nghiệm, nhân viên đào tạo bài bản...`

// Schema: LocalBusiness với địa chỉ chi nhánh tương ứng
```

---

## TASK 4 – Security Hardening

### 4.1 Security Headers

```typescript
// next.config.ts – bổ sung headers (xem 09-non-functional.md)
// Thêm HSTS, CSP, X-Frame-Options, etc.

// CSP (Content Security Policy):
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
    https://www.googletagmanager.com
    https://www.google.com/recaptcha/
    https://www.gstatic.com/recaptcha/
    https://sp.zalo.me;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob:
    https://assets.yourdomain.vn
    https://maps.googleapis.com
    https://maps.gstatic.com;
  connect-src 'self' https://vitals.vercel-insights.com;
  frame-src https://www.google.com https://maps.google.com;
`
```

### 4.2 Input Sanitization

```typescript
// Sanitize HTML content trước khi render (dangerouslySetInnerHTML):
import DOMPurify from 'isomorphic-dompurify'

// Trong Post detail page:
const cleanContent = DOMPurify.sanitize(post.content, {
  ALLOWED_TAGS: ['p','h1','h2','h3','h4','ul','ol','li','strong','em','a','img','table','tr','td','th','blockquote','code','pre'],
  ALLOWED_ATTR: ['href','src','alt','class','target','rel'],
})

// npm install isomorphic-dompurify
```

### 4.3 Admin Security

```typescript
// Rate limiting cho login endpoint:
// Dùng upstash/ratelimit hoặc custom in-memory Map
// Lock: 5 failed attempts → 15 phút
// Log failed attempts (Sentry)

// Password strength requirement:
// min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
// Enforce khi tạo user mới hoặc đổi mật khẩu
```

---

## TASK 5 – Testing Toàn Diện

### 5.1 Functional Test Checklist

```
FORMS:
☐ Form báo giá homepage → email đến admin ✓
☐ Form liên hệ /lien-he → email đến admin ✓
☐ Form ứng tuyển với CV → HR nhận email + CV link ✓
☐ Form validation: bỏ trống required field → hiện lỗi ✓
☐ Form validation: SĐT sai format → hiện lỗi ✓
☐ Form spam (không reCAPTCHA) → bị chặn ✓

NAVIGATION:
☐ Tất cả menu links → đúng trang ✓
☐ Mega menu desktop: hover → dropdown xuất hiện ✓
☐ Mobile menu: hamburger → slide-in → close ✓
☐ Back to top button: scroll > 400px → hiện ✓
☐ Breadcrumb: click → đúng trang ✓

CONTENT:
☐ 12 trang dịch vụ accessible, không 404 ✓
☐ Blog có bài, phân trang đúng ✓
☐ Tuyển dụng: form ứng tuyển nộp được ✓
☐ Trang admin: CRUD bài viết → xuất hiện trên site ✓

LINKS:
☐ Scan internal links: không có 404 (dùng Screaming Frog hoặc Ahrefs)
☐ External links: mở tab mới (target="_blank" rel="noopener")
☐ Tel links: click → gọi điện (test trên mobile)
```

### 5.2 Responsive Test

```
Device simulation (Chrome DevTools):
☐ iPhone SE (375px)
☐ iPhone 14 Pro (393px)
☐ Samsung Galaxy S21 (360px)
☐ iPad Air (820px)
☐ iPad Pro 12.9 (1024px)
☐ Desktop 1280px
☐ Desktop 1440px
☐ Wide 1920px

Kiểm tra:
☐ Không có horizontal scroll trên mobile
☐ Font size ≥ 14px (không nhỏ hơn)
☐ Touch targets ≥ 44px
☐ Form fields không bị zoom (font-size ≥ 16px trên iOS)
☐ Images không bị stretch hay cắt xấu
```

### 5.3 Cross-browser Test

```
☐ Chrome (latest)     – Mac + Windows
☐ Firefox (latest)    – Mac + Windows
☐ Safari (latest)     – Mac + iOS
☐ Edge (latest)       – Windows
☐ Chrome Mobile       – Android
☐ Safari Mobile       – iOS
```

### 5.4 Performance Test

```bash
# PageSpeed Insights (thực tế):
# https://pagespeed.web.dev/?url=https://yourdomain.vn
# Test tất cả trang chính, chụp screenshot kết quả

# WebPageTest (detailed):
# https://www.webpagetest.org

# Target:
# Homepage:  LCP < 2.0s, CLS < 0.1
# Service:   LCP < 2.5s
# Blog:      LCP < 2.5s
```

---

## TASK 6 – Monitoring Setup

```typescript
// 1. UptimeRobot (free plan):
//    - Monitor: https://yourdomain.vn (every 5 min)
//    - Alert: email khi down > 1 min
//    - Tạo status page: status.yourdomain.vn

// 2. Sentry (error tracking):
npm install @sentry/nextjs
// npx @sentry/wizard@latest -i nextjs
// Config: captureUnhandledErrors: true, tracesSampleRate: 0.1

// 3. Vercel Analytics:
npm install @vercel/analytics
// <Analytics /> trong app/layout.tsx

// 4. Google Search Console:
//    - Verify domain ownership
//    - Submit sitemap
//    - Check Core Web Vitals report
//    - Check Coverage report (đảm bảo tất cả pages indexed)
```

---

## TASK 7 – Pre-Launch Checklist

```
CƠ BẢN:
☐ SSL/HTTPS active, certificate valid ≥ 1 năm
☐ www → non-www redirect (hoặc ngược lại, nhất quán)
☐ Favicon: 16x16, 32x32, 180x180 (apple-touch-icon), manifest.json
☐ 404 page custom đã xong
☐ Không có console errors trên production
☐ Không có broken images

SEO:
☐ Google Analytics 4 tracking (test với GA Debugger)
☐ Sitemap submit lên Google Search Console
☐ robots.txt deploy đúng: https://yourdomain.vn/robots.txt
☐ Tất cả meta tags có mặt (kiểm tra 5 trang ngẫu nhiên)
☐ Schema validate sạch trên 3 loại trang (dịch vụ, blog, job)
☐ OG image hiển thị đúng khi share FB/Zalo

BẢO MẬT:
☐ Admin 2FA bật cho tài khoản ADMIN
☐ Mật khẩu admin mặc định đã đổi
☐ Security headers deploy (test: https://securityheaders.com)
☐ reCAPTCHA hoạt động trên tất cả forms

HIỆU NĂNG:
☐ Lighthouse Mobile ≥ 85 trên homepage
☐ Lighthouse Mobile ≥ 80 trên trang dịch vụ
☐ Ảnh: tất cả có alt text, không có ảnh > 500KB

BACKUP & MONITORING:
☐ Backup tự động chạy (test: restore 1 bản thử)
☐ UptimeRobot monitor active
☐ Sentry connected, test error xuất hiện
☐ Alert email setup xong (admin nhận được)

CONTENT:
☐ Thông tin công ty đúng (tên, SĐT, địa chỉ)
☐ 12 trang dịch vụ có đủ nội dung thực (không phải Lorem Ipsum)
☐ Blog có ≥ 10 bài viết thực
☐ Đối tác/testimonial có logo và nội dung thực
☐ Ảnh: không có ảnh có watermark hoặc không có bản quyền

PHÁP LÝ:
☐ Trang Privacy Policy (nếu thu thập email)
☐ Cookie notice (nếu cần theo GDPR)
```

---

## TASK 8 – Bàn Giao

### 8.1 Tài Liệu Hướng Dẫn Admin

Tạo file `HUONG_DAN_ADMIN.md` gồm:
```
1. Đăng nhập: URL + tài khoản
2. Tạo/chỉnh sửa bài viết
3. Thêm vị trí tuyển dụng
4. Xem và xử lý lead
5. Tải hồ sơ ứng viên
6. Thay đổi thông tin công ty
7. Liên hệ hỗ trợ kỹ thuật
```

### 8.2 Bàn Giao Tài Khoản

```
Website:
  URL production: https://yourdomain.vn
  URL admin:      https://yourdomain.vn/admin
  Email admin:    admin@yourdomain.vn
  Password:       [bàn giao qua LastPass/1Password]

Hosting (Vercel):
  Email: ...
  Project: ...

Database (PostgreSQL):
  Host: ...
  Database: ...
  User/Pass: [vault]

File Storage (Cloudflare R2):
  Dashboard: ...
  Bucket: ...

Email (SendGrid):
  API key: [vault]
  Verified domain: ...

Analytics:
  GA4 Property ID: G-XXXXXXXX
  Google Search Console: [invite to property]

Monitoring:
  UptimeRobot: [invite to account]
  Sentry: [invite to project]
```

---

## 🚀 Go-Live Steps

```bash
# 1. Merge develop → main
git checkout main && git merge develop

# 2. GitHub Actions deploy tự động → Vercel production

# 3. Verify DNS trỏ đúng
dig yourdomain.vn +short

# 4. Check HTTPS
curl -I https://yourdomain.vn

# 5. Warm up cache
curl https://yourdomain.vn
curl https://yourdomain.vn/dich-vu/bao-ve-nha-may
curl https://yourdomain.vn/tin-tuc
# ...repeat for all main pages

# 6. Smoke test (5 phút):
# - Mở trang chủ: ✓
# - Click 3 dịch vụ: ✓
# - Gửi form báo giá: ✓ (nhận email)
# - Mở blog: ✓
# - Mở /tuyen-dung: ✓
# - Mở /lien-he: ✓
# - Kiểm tra mobile: ✓

# 7. Submit sitemap lên GSC
# https://search.google.com/search-console

# 8. Thông báo nội bộ: "Website đã live! 🎉"
```

---

## Definition of Done ✅

- [ ] Lighthouse Mobile ≥ 85 tất cả trang chính (screenshot bằng chứng)
- [ ] Schema Markup: 0 lỗi trên Rich Results Test
- [ ] Sitemap XML live và submit lên GSC
- [ ] robots.txt đúng
- [ ] 5 trang SEO địa phương live
- [ ] Security headers ≥ A trên securityheaders.com
- [ ] UptimeRobot monitor active
- [ ] Sentry connected, bắt được errors
- [ ] Pre-launch checklist 100% ✓
- [ ] Admin được đào tạo (video/demo 30 phút)
- [ ] Tài liệu bàn giao hoàn chỉnh
- [ ] **Production live 🚀**
