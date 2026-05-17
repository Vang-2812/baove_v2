# 09 – NON-FUNCTIONAL REQUIREMENTS

> **Dùng khi:** Performance optimization, security hardening, testing, deployment.

---

## Performance

### Targets
| Metric | Mobile | Desktop |
|--------|--------|---------|
| Lighthouse Performance | ≥ 85 | ≥ 90 |
| LCP | < 2.5s | < 2.0s |
| TTI | < 3.5s | < 2.5s |
| CLS | < 0.1 | < 0.1 |

### Checklist
```
IMAGE
☐ Dùng Next/Image cho mọi ảnh (auto WebP, lazy load, srcset)
☐ Hero image: priority=true + preload link
☐ Ảnh service/news: width/height explicit (tránh CLS)
☐ Compress ảnh trước upload: max 200KB cho thumbnail, max 500KB cho banner

JAVASCRIPT
☐ Không import toàn bộ lodash/moment → dùng named imports
☐ Third-party scripts (GA4, reCAPTCHA) load sau onLoad
☐ Zalo/FB widget load với IntersectionObserver (lazy)
☐ Dynamic import cho heavy components (carousel, rich text editor)

CSS
☐ Tailwind purge config đúng (không ship unused classes)
☐ Critical CSS inline (Next.js tự xử lý)
☐ Font preload: <link rel="preload" as="font" crossorigin>

CACHING
☐ Static pages: ISR với revalidate=3600 (1 giờ)
☐ API routes: Cache-Control header cho public endpoints
☐ Cloudflare cache rules: assets (1 năm), HTML (5 phút)

SERVER
☐ Gzip/Brotli compression bật trên Nginx
☐ HTTP/2 enabled
☐ Keep-alive connections
```

---

## Security

### Checklist
```
TRANSPORT
☐ HTTPS bắt buộc, redirect 301 từ HTTP
☐ HSTS header: Strict-Transport-Security: max-age=31536000; includeSubDomains
☐ TLS 1.2+ only

HEADERS
☐ Content-Security-Policy (CSP)
☐ X-Frame-Options: DENY
☐ X-Content-Type-Options: nosniff
☐ Referrer-Policy: strict-origin-when-cross-origin
☐ Permissions-Policy: camera=(), microphone=()

INPUT VALIDATION
☐ Validate + sanitize tất cả đầu vào server-side (Zod)
☐ Parameterized queries (Prisma tự xử lý)
☐ HTML encode output để tránh XSS
☐ File upload: validate MIME type thực sự (không chỉ extension)

AUTH (Admin)
☐ Password hash: bcrypt, saltRounds=12
☐ JWT: HS256, expiry 8h, refresh token 30d
☐ 2FA TOTP bắt buộc cho ADMIN role
☐ Brute force protection: lock sau 5 lần sai/15 phút
☐ Session invalidation khi đổi mật khẩu

RATE LIMITING
☐ /api/contacts: 5 req/min/IP
☐ /api/applications: 3 req/min/IP
☐ /api/admin/login: 10 req/min/IP
☐ Global: 100 req/s/IP (Cloudflare WAF)

BACKUP
☐ Database: pg_dump daily → upload R2/S3, giữ 30 ngày
☐ Media files: rsync daily → R2/S3
☐ Test restore quy trình mỗi tháng
```

### Next.js Security Headers
```typescript
// next.config.ts
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',  value: 'on' },
  { key: 'X-XSS-Protection',       value: '1; mode=block' },
  { key: 'X-Frame-Options',        value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
]

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

### XSS Sanitization & TypeScript Strict Rules

1. **XSS Prevention on Rich HTML Content**
   Khi hiển thị nội dung HTML động được lưu từ CMS bằng `dangerouslySetInnerHTML`, bắt buộc phải lọc sạch thẻ độc hại bằng `isomorphic-dompurify` để ngăn ngừa tấn công Cross-Site Scripting (XSS):
   ```typescript
   import DOMPurify from 'isomorphic-dompurify'

   const cleanContent = DOMPurify.sanitize(post.content, {
     ALLOWED_TAGS: ['p','h1','h2','h3','h4','ul','ol','li','strong','em','a','img','table','tr','td','th','blockquote','code','pre'],
     ALLOWED_ATTR: ['href','src','alt','class','target','rel'],
   })

   // Trong TSX:
   dangerouslySetInnerHTML={{ __html: cleanContent }}
   ```

2. **TypeScript Strict Type Checks (Implicit Any)**
   Khi sử dụng cơ chế kiểm tra kiểu nghiêm ngặt (Strict Checks), các hàm ánh xạ `.map()`, lọc `.filter()` hoặc duyệt mảng `.forEach()` từ mảng dữ liệu (đặc biệt là dữ liệu truy vấn từ Prisma hoặc các hàm xử lý chuỗi cắt `.split(',')`) bắt buộc phải định kiểu tham số tường minh để tránh lỗi biên dịch `implicit any type` trên môi trường Production:
   ```typescript
   // Sai (Gây lỗi biên dịch):
   recentContacts.map((lead) => ...)
   tagsInput.split(',').map((t) => t.trim())
   settingsRaw.forEach((s) => ...)

   // Đúng:
   recentContacts.map((lead: any) => ...)
   posts.map((post: any) => ...)
   tagsInput.split(',').map((t: string) => t.trim())
   settingsRaw.forEach((s: any) => ...)
   ```

---

## Testing

### Unit Tests (Vitest)
```
lib/validations.ts  → test ContactSchema, ApplicationSchema
lib/email.ts        → mock SendGrid, assert email content
lib/storage.ts      → mock S3, assert upload params
```

### Integration Tests (Playwright hoặc Supertest)
```
POST /api/contacts  → valid payload → 200, DB record, email sent
POST /api/contacts  → invalid phone → 400, error details
POST /api/contacts  → spam (no recaptcha) → 422
POST /api/applications → with PDF → 200, CV uploaded
GET  /api/services  → 200, array
GET  /api/services/bao-ve-nha-may → 200, correct data
GET  /api/services/not-exist → 404
```

### E2E Tests (Playwright)
```typescript
// Scenario 1: Submit quote form
test('Homepage form submission', async ({ page }) => {
  await page.goto('/')
  await page.fill('[name=name]', 'Nguyễn Văn A')
  await page.fill('[name=phone]', '0901234567')
  await page.selectOption('[name=service_type]', 'bao-ve-nha-may')
  await page.fill('[name=message]', 'Cần thuê 2 bảo vệ cho nhà máy 500m2')
  await page.click('button[type=submit]')
  await expect(page.locator('.toast-success')).toBeVisible()
})

// Scenario 2: Job application
test('Apply for job', async ({ page }) => {
  await page.goto('/tuyen-dung/bao-ve-nha-may')
  await page.fill('[name=name]', 'Trần Văn B')
  await page.fill('[name=phone]', '0912345678')
  await page.fill('[name=email]', 'b@example.com')
  await page.setInputFiles('[name=cv_file]', 'tests/fixtures/cv-sample.pdf')
  await page.click('button[type=submit]')
  await expect(page.locator('.success-message')).toBeVisible()
})

// Scenario 3: Navigation
test('Service page navigation', async ({ page }) => {
  await page.goto('/')
  await page.hover('text=Dịch Vụ')        // mega menu
  await page.click('text=Bảo Vệ Nhà Máy')
  await expect(page).toHaveURL('/dich-vu/bao-ve-nha-may')
  await expect(page.locator('h1')).toContainText('Bảo Vệ Nhà Máy')
})
```

---

## Monitoring & Observability

```
Uptime monitoring : UptimeRobot (free) hoặc Better Uptime
  → Alert email/SMS khi down > 1 phút
  → Check every: 1 phút

Error tracking    : Sentry (Next.js SDK)
  → Capture unhandled exceptions
  → Source maps upload khi deploy
  → Alert khi error rate tăng đột biến

Analytics         : Google Analytics 4
  → Events tracking:
    - form_submit (contact, apply)
    - phone_click (hotline)
    - zalo_click
    - service_view
    - job_view
  → Conversion goals:
    - form_submit = macro conversion
    - phone_click = micro conversion

Performance       : Vercel Analytics hoặc Cloudflare Analytics
```

---

## Deployment (CI/CD)

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Environment Variables
```bash
# .env.production
DATABASE_URL=postgresql://user:pass@host:5432/db
SENDGRID_API_KEY=SG.xxxxx
ADMIN_EMAIL=admin@yourdomain.vn
RECAPTCHA_SECRET_KEY=xxxxx
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxxxx
NEXT_PUBLIC_GA4_ID=G-XXXXXXXX
R2_BUCKET=yourbucket
R2_PUBLIC_URL=https://assets.yourdomain.vn
JWT_SECRET=very-long-random-string-here
NEXTAUTH_SECRET=another-random-string
NEXTAUTH_URL=https://yourdomain.vn
```

---

## Accessibility (WCAG 2.1 AA)

```
☐ Alt text cho mọi ảnh (descriptive, không phải "image" hay tên file)
☐ Form labels liên kết với input bằng htmlFor/id
☐ Error messages liên kết với input bằng aria-describedby
☐ Focus states visible (outline không bị ẩn bởi CSS)
☐ Tab order hợp lý (không skip, không bẫy focus)
☐ Skip to main content link (ẩn nhưng hiện khi focus)
☐ Contrast ratio ≥ 4.5:1 cho text thường, 3:1 cho text lớn
☐ Mobile touch targets ≥ 44x44px
☐ ARIA roles cho interactive elements (menu, dialog, tab)
☐ Screen reader test với NVDA (Windows) hoặc VoiceOver (Mac)
```
