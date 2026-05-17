# PHASE 2 – DỊCH VỤ & BẢNG GIÁ (Tuần 4–5)

> **Mục tiêu:** 12 trang dịch vụ chi tiết + bảng giá + mega menu + SEO cơ bản.  
> **Deploy:** Cuối tuần 5.  
> **Đọc thêm:** `05-pages-spec.md`, `03-database-schema.md`, `08-seo-and-meta.md`, `02-design-system.md`

---

## Tổng Quan Deliverable

```
✅ Trang chủ: nâng cấp thêm sections 4, 5, 8, 9 (dịch vụ, bảng giá, quy trình, lợi ích)
✅ Mega menu cho mục Dịch Vụ
✅ Trang danh mục dịch vụ /dich-vu
✅ 12 trang dịch vụ chi tiết /dich-vu/[slug]
✅ Trang bảng giá /bang-gia
✅ SEO: meta tags + schema Service + breadcrumb
✅ DB: bảng services + seed data
```

---

## TASK 1 – Database & Seed

**Files:** `prisma/schema.prisma`, `prisma/seed.ts`

```typescript
// 1. Chạy migration tạo bảng Service (xem 03-database-schema.md)
// 2. Seed 12 services với đầy đủ:
//    - title, slug, description, icon, image
//    - price_min, price_max, price_unit
//    - scope (markdown text)
//    - process (JSON: [{step, title, description}])
//    - benefits (markdown text)
//    - faq (JSON: [{q, a}] – 5 câu mỗi service)
//    - order (1-12), is_active=true

// Nội dung mẫu cho service "bao-ve-nha-may":
{
  title: 'Bảo Vệ Nhà Máy',
  slug: 'bao-ve-nha-may',
  description: `Dịch vụ bảo vệ nhà máy chuyên nghiệp của Long Việt...`,
  scope: `- Kiểm soát người ra vào cổng\n- Tuần tra định kỳ trong khuôn viên\n- Giám sát camera an ninh\n- Xử lý sự cố an ninh\n- Báo cáo ca làm việc`,
  process: JSON.stringify([
    { step: 1, title: 'Khảo sát thực tế',       description: 'Đội ngũ đến khảo sát mặt bằng, đánh giá rủi ro' },
    { step: 2, title: 'Lên phương án',           description: 'Đề xuất phương án bảo vệ phù hợp với quy mô nhà máy' },
    { step: 3, title: 'Báo giá & Ký hợp đồng',  description: 'Báo giá minh bạch, ký hợp đồng theo đúng quy định' },
    { step: 4, title: 'Tuyển chọn nhân sự',     description: 'Tuyển nhân viên phù hợp, ưu tiên người có kinh nghiệm' },
    { step: 5, title: 'Triển khai',              description: 'Bố trí nhân sự đúng vị trí, bàn giao đầy đủ' },
  ]),
  benefits: `- **Tiết kiệm chi phí** so với tự tuyển dụng và đào tạo\n- **Nhân sự đã được đào tạo** bài bản, có nghiệp vụ\n- **Bảo hiểm đầy đủ** cho nhân viên bảo vệ\n- **Hỗ trợ pháp lý** khi xảy ra sự cố\n- **Giám sát 24/7** qua hệ thống camera`,
  faq: JSON.stringify([
    { q: 'Chi phí bảo vệ nhà máy là bao nhiêu?', a: 'Chi phí từ 15 đến 27 triệu VNĐ/tháng/vị trí tùy quy mô và ca làm việc.' },
    { q: 'Thời gian triển khai bao lâu?', a: 'Thông thường từ 3-7 ngày kể từ khi ký hợp đồng.' },
    // ...
  ]),
  price_min: 15000000,
  price_max: 27000000,
  price_unit: 'tháng',
  order: 1,
}
```

---

## TASK 2 – API Endpoints Services

**File:** `src/app/api/services/route.ts`, `src/app/api/services/[slug]/route.ts`

```typescript
// GET /api/services → danh sách (chỉ is_active=true, sort by order)
// GET /api/services/:slug → chi tiết, parse JSON fields (process, faq)
// Response format theo 04-api-contracts.md

// Caching: revalidate=3600 (1 giờ)
export const revalidate = 3600
```

---

## TASK 3 – Nâng Cấp Header: Mega Menu

**File:** `src/components/layout/Header.tsx` (update)

```tsx
// Mega menu cho mục "Dịch Vụ":
// - Hover/focus → dropdown panel full-width
// - Layout: 3 cột, 4 dịch vụ/cột
// - Mỗi item: icon (lucide nhỏ) + tên + mô tả 1 dòng
// - Footer dropdown: link "Xem tất cả dịch vụ →"
// - Mobile: accordion (click để mở rộng, không hover)
// - Đóng khi: click ngoài, press Escape, click link

// Mega menu cho mục "Tài Liệu" (chuẩn bị cho phase 3):
// - 4 chuyên mục: PCCC, Nghiệp vụ, Sơ cấp cứu, Cứu hộ
```

---

## TASK 4 – Trang Danh Mục Dịch Vụ `/dich-vu`

**File:** `src/app/(site)/dich-vu/page.tsx`

```tsx
// Data: fetch tất cả services (is_active=true)
// Layout:
<PageHero
  title="Dịch Vụ Bảo Vệ"
  subtitle="Giải pháp bảo vệ toàn diện cho mọi nhu cầu"
  breadcrumb={[{ label: 'Trang Chủ', href: '/' }, { label: 'Dịch Vụ' }]}
/>
<section className="py-section container">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {services.map(s => <ServiceCard key={s.id} service={s} />)}
  </div>
</section>
<QuoteSection />   {/* Reuse từ homepage */}

// Meta:
title: "Dịch Vụ Bảo Vệ Chuyên Nghiệp | Long Việt Security"
description: "12 loại dịch vụ bảo vệ chuyên nghiệp: nhà máy, tòa nhà, ngân hàng, sự kiện... Báo giá miễn phí: 0923 840 999"
```

---

## TASK 5 – Trang Chi Tiết Dịch Vụ `/dich-vu/[slug]`

**File:** `src/app/(site)/dich-vu/[slug]/page.tsx`

```tsx
// generateStaticParams → fetch tất cả slugs
// generateMetadata → dynamic meta từ service data

// Layout (theo thứ tự):

// 1. ServiceHero
<section className="relative h-64 md:h-80">
  <Image src={service.image} fill object-cover priority />
  <div className="overlay absolute inset-0 bg-black/60" />
  <div className="relative z-10 container h-full flex flex-col justify-end pb-8">
    <Breadcrumb items={breadcrumb} className="text-white/70" />
    <h1 className="text-h1 text-white font-bold mt-2">{service.title}</h1>
  </div>
</section>

// 2. Main content + Sidebar layout (lg:grid-cols-[1fr_340px])
<div className="container py-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
  <main>
    // 2a. Mô tả tổng quan
    <ServiceDescription html={service.description} />

    // 2b. Phạm vi cung cấp
    <ServiceScope markdown={service.scope} />
    // Render: tiêu đề "Phạm Vi Cung Cấp" + danh sách với icon CheckCircle

    // 2c. Quy trình thực hiện
    <ServiceProcess steps={JSON.parse(service.process)} />
    // Render: numbered timeline, mỗi step có số, tiêu đề, mô tả

    // 2d. Lợi ích
    <ServiceBenefits markdown={service.benefits} />
    // Render: grid 2 cột, icon Shield màu primary

    // 2e. Bảng giá
    <ServicePricing
      min={service.price_min}
      max={service.price_max}
      unit={service.price_unit}
    />

    // 2f. FAQ
    <ServiceFAQ items={JSON.parse(service.faq)} />
    // Render: Accordion component
  </main>

  <aside className="space-y-6">
    // Sidebar sticky
    <div className="lg:sticky lg:top-24 space-y-6">
      <QuoteFormCard serviceType={service.title} />
      <ContactCard />   // hotline + zalo + địa chỉ
    </div>
  </aside>
</div>

// 3. Related Services
<RelatedServices currentSlug={service.slug} services={allServices} />
// Hiện 3 dịch vụ khác (random hoặc theo order)
```

**Schema Markup:**
```tsx
// Thêm vào <head> của trang:
<JsonLd data={serviceSchema(service)} />
<JsonLd data={breadcrumbSchema(breadcrumb)} />
<JsonLd data={faqSchema(JSON.parse(service.faq))} />
```

---

## TASK 6 – Components Mới Cần Tạo

### 6.1 Breadcrumb
**File:** `src/components/ui/Breadcrumb.tsx`
```tsx
// Props: items: { label: string, href?: string }[]
// Render: Home > Dịch Vụ > Bảo Vệ Nhà Máy
// Icon ChevronRight giữa các item
// Item cuối không có link (current page)
// aria-label="breadcrumb", aria-current="page" cho item cuối
```

### 6.2 Accordion (FAQ)
**File:** `src/components/ui/Accordion.tsx`
```tsx
// Props: items: { question: string, answer: string }[]
// State: openIndex (null | number)
// Click header: toggle openIndex
// Animation: max-height transition (CSS)
// Icon: ChevronDown, rotate 180deg khi open
// ARIA: aria-expanded, aria-controls
```

### 6.3 ServiceCard
**File:** `src/components/ui/ServiceCard.tsx`
```tsx
// Props: service: ServiceSummary
// Layout: Card với ảnh trên, content dưới
// Ảnh: h-48 object-cover, hover scale 1.05
// Content: p-5
//   - title: text-h4 font-semibold
//   - price: text-sm text-primary (nếu có price_min)
//   - CTA: "Xem Chi Tiết →" link
```

### 6.4 PageHero
**File:** `src/components/ui/PageHero.tsx`
```tsx
// Props: title, subtitle?, breadcrumb?
// Dùng cho tất cả trang cấp 2 (không phải trang chủ)
// Layout: bg-secondary py-12 text-white
// Breadcrumb trên, title to, subtitle nhỏ hơn
```

---

## TASK 7 – Trang Bảng Giá `/bang-gia`

**File:** `src/app/(site)/bang-gia/page.tsx`

```tsx
// Data: hardcode (không cần DB, giá ít thay đổi)

<PageHero title="Bảng Giá Dịch Vụ Bảo Vệ" subtitle="Giá tham khảo – Liên hệ để được báo giá chính xác nhất" />

<section className="container py-12 space-y-16">
  <PriceNote />   // disclaimer box màu vàng

  <PriceGroup title="Dịch Vụ Bảo Vệ 24/24" data={priceData24h} />
  <PriceGroup title="Dịch Vụ Bảo Vệ Theo Ca" data={priceDataShift} />
  <PriceGroup title="Dịch Vụ Bảo Vệ Sự Kiện" data={priceDataEvent} />
</section>

<QuoteSection />
```

**PriceGroup Component:**
```tsx
// Props: title, data: { name, min, max, unit }[]
// Render: Table với header bg-secondary text-white
// Cột: Loại Dịch Vụ | Phí Tối Thiểu | Phí Tối Đa
// Format số: Intl.NumberFormat('vi-VN') → "15.000.000 VNĐ"
// Responsive: horizontal scroll trên mobile (overflow-x-auto)
// Cuối bảng: Button "Yêu Cầu Báo Giá" (primary, center)
```

---

## TASK 8 – Nâng Cấp Trang Chủ (thêm sections 4,5,8,9)

**File:** `src/app/(site)/page.tsx` (update)

```
Thêm sau Section 3 (Stats):
  Section 4: ServiceGridSection (danh mục 12 dịch vụ)
  Section 5: PricePreviewSection (bảng giá tóm tắt với tab 24h/Ca/Sự kiện)

Thêm sau Section 6 (Form):
  Section 8: ProcessSection (timeline 8 bước)
  Section 9: BenefitsSection (tab 3 nhóm lợi ích)
```

---

## TASK 9 – SEO Cơ Bản

```typescript
// Implement generateMetadata cho:
// - /dich-vu → static meta
// - /dich-vu/[slug] → dynamic từ DB
// - /bang-gia → static meta

// robots meta: index, follow (tất cả trang public)

// Canonical URL: mỗi trang có canonical chính xác

// Schema:
// - /dich-vu/[slug]: Service + BreadcrumbList + FAQPage
// - /bang-gia: WebPage + BreadcrumbList
```

---

## Definition of Done ✅

- [ ] 12 trang dịch vụ accessible (không 404)
- [ ] Mỗi trang dịch vụ có đủ: hero, mô tả, quy trình, lợi ích, bảng giá, FAQ, form
- [ ] Mega menu Dịch Vụ hoạt động trên desktop và mobile
- [ ] Trang /bang-gia hiển thị đầy đủ 3 nhóm giá, responsive
- [ ] Form báo giá trên trang dịch vụ hoạt động (gửi đúng service_type)
- [ ] Meta title + description có mặt trên mọi trang
- [ ] Schema Service valid (test: https://search.google.com/test/rich-results)
- [ ] Breadcrumb hiển thị đúng + Schema BreadcrumbList
- [ ] generateStaticParams build thành công (12 pages pre-rendered)
- [ ] Lighthouse Mobile ≥ 78
