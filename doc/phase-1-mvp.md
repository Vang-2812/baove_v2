# PHASE 1 – MVP LANDING PAGE (Tuần 2–3)

> **Mục tiêu:** Website "có mặt" trên internet, thu được lead đầu tiên.  
> **Deploy:** Cuối tuần 3 → production live.  
> **Đọc thêm:** `02-design-system.md`, `05-pages-spec.md`, `06-forms-and-lead.md`, `04-api-contracts.md`

---

## Tổng Quan Deliverable

```
✅ Header + Footer (global layout)
✅ Trang chủ – 5 section đầu (Hero, Về CT, Số liệu, Form báo giá, Lý do chọn)
✅ Form báo giá hoạt động (gửi email + lưu DB)
✅ Floating hotline + Zalo widget
✅ Google Analytics 4 tracking
✅ Responsive mobile
```

---

## TASK 1 – Global Layout

### 1.1 Header Component
**File:** `src/components/layout/Header.tsx`

```
Yêu cầu:
- Logo bên trái (SVG + text)
- Navigation desktop: menu phẳng (chưa cần mega menu ở phase này)
- Hotline nổi bật bên phải: icon Phone + số "0923 840 999"
- CTA button "Báo Giá Ngay" → scroll to #quote-form
- Sticky khi scroll (shadow xuất hiện)
- Mobile: ẩn nav, hiện hamburger icon

Props: none (data từ settings hoặc hardcode tạm)

Behavior:
- useScrollY hook → thêm class shadow-sm khi y > 0
- Mobile menu: slide-in từ phải, overlay backdrop
- Active link: underline hoặc màu primary
```

**Acceptance:** Header hiển thị đúng trên mobile 375px và desktop 1440px.

---

### 1.2 Footer Component
**File:** `src/components/layout/Footer.tsx`

```
Layout: 4 cột trên desktop, stack trên mobile

Cột 1 – Về Chúng Tôi:
  Logo + mô tả ngắn công ty (2 dòng)
  Social icons: Facebook, Zalo, YouTube

Cột 2 – Dịch Vụ:
  Danh sách 6 dịch vụ chính (link /dich-vu/slug)

Cột 3 – Liên Kết:
  Giới thiệu, Bảng giá, Tuyển dụng, Tin tức, Liên hệ

Cột 4 – Liên Hệ:
  Địa chỉ trụ sở (icon MapPin)
  Hotline (icon Phone, màu primary)
  Email (icon Mail)

Bottom bar: copyright + "Thiết kế bởi..."

Data: hardcode tạm, sau phase 5 lấy từ settings API
```

---

### 1.3 Floating Elements
**File:** `src/components/layout/FloatingElements.tsx`

```
1. FloatingPhone (mobile only, md:hidden):
   - Position: fixed bottom-20 right-4 z-50
   - Style: bg-primary rounded-full p-4 shadow-lg
   - Icon: Phone (lucide), màu white, size 24
   - href: tel:0923840999
   - Animation: animate-bounce (CSS)

2. ZaloWidget:
   - Position: fixed bottom-4 right-4 z-50
   - Ảnh icon Zalo (public/icons/zalo.png), w-14 h-14 rounded-full shadow-lg
   - href: https://zalo.me/0923840999 (target _blank)
   - Load lazy: chỉ render sau window.onload (tránh ảnh hưởng LCP)

3. BackToTop:
   - Position: fixed bottom-20 right-4 z-40 (desktop only)
   - Hiện khi scrollY > 400
   - Icon: ArrowUp, bg-secondary text-white rounded-full p-3
   - onClick: window.scrollTo({ top: 0, behavior: 'smooth' })
```

---

## TASK 2 – Trang Chủ (5 sections đầu)

**File:** `src/app/(site)/page.tsx`

### 2.1 Section Hero Banner
**File:** `src/components/sections/HeroBanner.tsx`

```
Props:
  slides: Array<{
    image: string       // URL ảnh full
    headline: string
    subline: string
    ctaPrimary:  { label: string, href: string }
    ctaSecondary: { label: string, href: string }
  }>

Layout:
  - Container: relative, h-[85vh] md:h-screen, overflow-hidden
  - Ảnh: next/image fill, object-cover, priority=true (slide đầu)
  - Overlay: absolute inset-0 bg-black/50
  - Content: absolute inset-0 flex items-center justify-center text-center text-white
  - Headline: text-3xl md:text-5xl lg:text-6xl font-bold
  - Subline: text-lg md:text-xl mt-4 max-w-2xl
  - CTAs: flex gap-4 justify-center mt-8

Mobile: Chỉ hiện slide đầu tiên, không autoplay, ảnh tĩnh
Desktop: Carousel tự động 5s, prev/next arrows, dot indicators

Hardcode slides (tạm):
  slide 1: image=/images/hero-1.jpg, headline="Dịch Vụ Bảo Vệ Chuyên Nghiệp"
  slide 2: image=/images/hero-2.jpg, headline="An Toàn Tài Sản – Bình Yên Cuộc Sống"
```

---

### 2.2 Section Về Công Ty
**File:** `src/components/sections/AboutSection.tsx`

```
Layout: grid grid-cols-1 lg:grid-cols-2 gap-12 items-center
Background: white

Left (text):
  - Eyebrow: "VỀ CHÚNG TÔI" (text-primary, uppercase, tracking-widest)
  - H2: "Công Ty Bảo Vệ Long Việt – 15 Năm Uy Tín"
  - 3 đoạn văn mô tả công ty (~100 từ mỗi đoạn)
  - Danh sách 4 bullet điểm nổi bật (icon CheckCircle màu primary)
  - Button "Xem Thêm Về Chúng Tôi" variant=outline → /gioi-thieu

Right (visual):
  - Ảnh đội ngũ/trụ sở: rounded-2xl shadow-xl
  - Badge floating: "15+ Năm Kinh Nghiệm"
    (absolute -bottom-4 -left-4 bg-primary text-white px-6 py-3 rounded-xl font-bold)
```

---

### 2.3 Section Con Số Nổi Bật
**File:** `src/components/sections/StatsSection.tsx`

```
Background: bg-secondary (xanh đậm), text-white
Layout: grid grid-cols-2 lg:grid-cols-4 gap-8 py-16

Data (hardcode từ settings):
  [
    { icon: 'Clock',    value: 15,   suffix: '+', label: 'Năm Kinh Nghiệm'  },
    { icon: 'Users',    value: 2000, suffix: '+', label: 'Nhân Viên Bảo Vệ' },
    { icon: 'Award',    value: 1000, suffix: '+', label: 'Dự Án Hoàn Thành' },
    { icon: 'MapPin',   value: 5,    suffix: '',  label: 'Chi Nhánh Toàn Quốc' },
  ]

Animation:
  - useIntersectionObserver hook
  - Khi section vào viewport: count từ 0 → value trong 2s (easeOut)
  - Chỉ chạy 1 lần

Item layout:
  - Icon: w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4
  - Number: text-4xl md:text-5xl font-bold
  - Label: text-sm text-white/70 mt-2
```

---

### 2.4 Section Form Báo Giá Nhanh
**File:** `src/components/sections/QuoteSection.tsx`

```
id="quote-form" (anchor target từ header CTA)
Background: bg-primary (đỏ)
Layout: grid grid-cols-1 lg:grid-cols-2 gap-12 items-start py-section

Left (value props):
  H2: "Nhận Báo Giá Miễn Phí" (text-white)
  Subtext: "Liên hệ ngay để được tư vấn và báo giá trong 24h"
  List (icon CheckCircle white):
    - Khảo sát miễn phí tại địa điểm
    - Báo giá chi tiết, minh bạch
    - Hợp đồng rõ ràng, đúng quy định pháp luật
    - Cam kết đúng tiến độ, đúng nhân sự

Right:
  QuoteFormInline component (xem 06-forms-and-lead.md)
  Card: bg-white rounded-2xl p-8 shadow-2xl

Fields: name*, phone*, email, service_type (select), message*
Submit: POST /api/contacts (source: "homepage")
```

---

### 2.5 Section Lý Do Chọn Chúng Tôi
**File:** `src/components/sections/WhyUsSection.tsx`

```
Background: white
Layout: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8

Items:
  [
    { icon: 'Target',   title: 'Tầm Nhìn Dài Hạn',   desc: 'Định hướng phát triển bền vững, xây dựng dịch vụ bảo vệ chuẩn quốc tế.' },
    { icon: 'Heart',    title: 'Tận Tâm Phục Vụ',    desc: 'Đặt lợi ích khách hàng lên hàng đầu, hỗ trợ 24/7 không ngừng nghỉ.' },
    { icon: 'Shield',   title: 'An Toàn Tuyệt Đối',  desc: 'Nhân sự được đào tạo bài bản, trang bị đầy đủ, cam kết an toàn 100%.' },
    { icon: 'Star',     title: 'Cam Kết Chất Lượng',  desc: 'Giám sát chặt chẽ, báo cáo định kỳ, luôn đảm bảo chất lượng dịch vụ.' },
  ]

Item layout:
  - Card: text-center p-6 rounded-2xl border border-gray-100 hover:shadow-card-hover transition
  - Icon wrapper: w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4
  - Icon: color primary, size 32
  - Title: text-h4 font-semibold text-secondary mt-2
  - Desc: text-sm text-text-muted mt-2 leading-relaxed
```

---

## TASK 3 – Backend: API Contacts

**File:** `src/app/api/contacts/route.ts`

```typescript
// Implement theo 04-api-contracts.md → POST /api/contacts
// Steps:
// 1. Parse & validate body với ContactSchema (Zod)
// 2. Verify reCAPTCHA token
// 3. Lưu vào DB: prisma.contact.create()
// 4. Gửi email admin: sendLeadNotification()
// 5. Gửi email confirm user: sendLeadConfirmation() (nếu có email)
// 6. Return { success: true, data: { id, message } }

// Error handling:
// - ZodError → 400 + details
// - reCAPTCHA fail → 422
// - DB error → 500 + log to Sentry
// - Rate limit → 429 (middleware)
```

---

## TASK 4 – Analytics & Third-party

### 4.1 Google Analytics 4
**File:** `src/components/Analytics.tsx`

```tsx
// Dùng next/script, strategy="afterInteractive"
// Tracking events:
//   - phone_click: khi click hotline
//   - form_submit: khi submit form thành công
//   - cta_click: khi click CTA button

// Thêm vào app/layout.tsx:
// <Analytics gaId={process.env.NEXT_PUBLIC_GA4_ID} />
```

### 4.2 reCAPTCHA v3
```tsx
// public/index.html: load script từ google
// <script src="https://www.google.com/recaptcha/api.js?render=SITE_KEY" async defer />
// Thêm vào app/(site)/layout.tsx
```

---

## TASK 5 – Trang Lỗi 404

**File:** `src/app/not-found.tsx`

```
Layout đơn giản:
  Header (shared)
  Content center:
    - Số "404" lớn (text-8xl, màu primary/20)
    - H1: "Trang Không Tìm Thấy"
    - Text: "Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa."
    - Button "Về Trang Chủ" (primary) + Button "Liên Hệ" (outline)
  Footer (shared)
```

---

## TASK 6 – Responsive & Cross-browser Test

```
Test các breakpoint:
  - 375px (iPhone SE)
  - 414px (iPhone XR)
  - 768px (iPad)
  - 1024px (iPad Pro / Laptop)
  - 1440px (Desktop)

Test trình duyệt:
  - Chrome (latest)
  - Safari (iOS)
  - Firefox

Checklist:
  ☐ Header không bị tràn trên 375px
  ☐ Form không bị cắt trên mobile
  ☐ CTA buttons đủ 44px touch target
  ☐ Hotline floating button không che nội dung
  ☐ Hero image load nhanh (< 2.5s trên 4G)
```

---

## Definition of Done ✅

- [ ] Header + Footer hiển thị đúng mọi viewport
- [ ] 5 sections trang chủ live trên production
- [ ] Form báo giá submit → email đến admin inbox (test thực tế)
- [ ] Form báo giá submit → lead lưu vào DB
- [ ] Floating hotline + Zalo widget hoạt động
- [ ] GA4 tracking: page view ghi nhận
- [ ] Lighthouse Mobile score ≥ 75 (phase 1, chưa cần optimize sâu)
- [ ] Không có console error trên production
- [ ] URL production accessible, SSL xanh
