# 05 – PAGES SPECIFICATION

> **Dùng khi:** Build từng trang – layout, sections, props, data fetching.

---

## Trang Chủ `/`

```
Data fetch (server): services[], recentPosts[3], partners[], testimonials[], settings
```

### Section 1 – Hero Slider
```tsx
// Props: slides: { image, headline, subline, cta_primary, cta_secondary }[]
// Layout: relative h-[90vh] md:h-screen overflow-hidden
// Slide: full-width image, text-center, overlay gradient
// Controls: prev/next arrows + dot indicators
// Mobile: ảnh tĩnh (slide đầu tiên), không autoplay
// Autoplay: 5s, pause on hover
slides = [
  {
    image     : '/images/hero-1.jpg',
    headline  : 'Dịch Vụ Bảo Vệ Chuyên Nghiệp',
    subline   : 'Đảm bảo an ninh toàn diện – An toàn tài sản & con người',
    cta_primary  : { label: 'Yêu Cầu Báo Giá', href: '#quote-form' },
    cta_secondary: { label: 'Gọi Ngay: 0923 840 999', href: 'tel:0923840999' },
  },
  // ... thêm slides
]
```

### Section 2 – Về Công Ty
```tsx
// Layout: 2 cột (text | ảnh) trên desktop, stack trên mobile
// Left : eyebrow + h2 + 3 đoạn văn + Button "Xem Thêm" → /gioi-thieu
// Right: ảnh đội ngũ + badge "15+ Năm Kinh Nghiệm"
// Bg   : white
```

### Section 3 – Con Số Nổi Bật
```tsx
// Layout: 4 cột grid
// Bg    : bg-secondary (xanh đậm), text white
// Item  : { icon, value: number, label, suffix? }
stats = [
  { icon: 'Clock',   value: 15,   label: 'Năm Kinh Nghiệm',  suffix: '+' },
  { icon: 'Users',   value: 2000, label: 'Nhân Viên',         suffix: '+' },
  { icon: 'Award',   value: 1000, label: 'Dự Án Hoàn Thành',  suffix: '+' },
  { icon: 'MapPin',  value: 5,    label: 'Chi Nhánh',          suffix: '' },
]
// Animation: Intersection Observer → count from 0 to value over 2s
```

### Section 4 – Danh Mục Dịch Vụ
```tsx
// Data   : services[] từ API
// Layout : grid cols-1 sm:2 lg:3 xl:4, gap-6
// Card   : ServiceCard component (xem 02-design-system.md)
// Header : eyebrow + h2 + subtitle
// CTA    : Button "Xem Tất Cả Dịch Vụ" → /dich-vu (center, dưới grid)
// Bg     : bg-light
```

### Section 5 – Bảng Giá Tham Khảo
```tsx
// Layout: full-width table, responsive (horizontal scroll mobile)
// 3 tab  : "24/24" | "Theo Ca" | "Sự Kiện"
// Mỗi tab: bảng HTML với cột Loại, Tối Thiểu, Tối Đa
// CTA    : Button "Nhận Báo Giá Chính Xác" → #quote-form
// Note   : text-sm text-muted "* Giá có thể thay đổi theo địa bàn..."
```

### Section 6 – Form Báo Giá Nhanh
```tsx
// id     : "quote-form" (anchor target)
// Bg     : bg-primary (đỏ)
// Layout : 2 cột (text trái | form phải) trên lg, stack mobile
// Left   : h2 trắng + bullet points lý do liên hệ
// Right  : QuoteForm component (xem 06-forms-and-lead.md)
// Fields : name, phone, email, service_type (select), message
```

### Section 7 – Lý Do Chọn Chúng Tôi
```tsx
// Layout: 2x2 grid (hoặc 4 cột trên xl)
// Bg    : white
// Item  : { icon (lucide), title, description }
items = [
  { icon: 'Target',    title: 'Tầm Nhìn Dài Hạn',    description: '...' },
  { icon: 'Heart',     title: 'Tận Tâm Phục Vụ',     description: '...' },
  { icon: 'Shield',    title: 'An Toàn Tuyệt Đối',   description: '...' },
  { icon: 'ThumbsUp',  title: 'Cam Kết Chất Lượng',  description: '...' },
]
```

### Section 8 – Quy Trình Dịch Vụ
```tsx
// Bg    : bg-light
// Layout: horizontal timeline trên desktop, vertical trên mobile
// 8 bước:
steps = [
  'Tiếp nhận yêu cầu',
  'Khảo sát thực tế',
  'Lên phương án bảo vệ',
  'Báo giá & ký hợp đồng',
  'Tuyển chọn nhân sự',
  'Đào tạo chuyên biệt',
  'Triển khai thực tế',
  'Giám sát & báo cáo',
]
```

### Section 9 – Lợi Ích Khi Sử Dụng
```tsx
// Tab navigation: 3 tabs
tabs = [
  { label: 'Lợi Ích Chính',    items: ['...', '...', '...'] },
  { label: 'Lợi Ích Kinh Tế',  items: ['...', '...', '...'] },
  { label: 'Lợi Ích Pháp Lý',  items: ['...', '...', '...'] },
]
// Mỗi item: icon CheckCircle + text
```

### Section 10 – Đối Tác
```tsx
// Data   : partners[] từ API
// Layout : logo carousel, autoplay 3s, loop
// Logo   : grayscale → color on hover
// Bg     : white
// Hiển thị: 6 logo/lần trên desktop, 3 trên mobile
```

### Section 11 – Cảm Nhận Khách Hàng
```tsx
// Data  : testimonials[] từ API
// Layout: carousel, autoplay 4s
// Card  : logo công ty + tên + chức vụ + nội dung + rating stars
// Bg    : bg-secondary text-white
```

### Section 12 – Tin Tức Mới Nhất
```tsx
// Data  : posts[3] (type=BLOG, status=PUBLISHED, mới nhất)
// Layout: 3 cột grid
// Card  : NewsCard component
// CTA   : Button "Xem Tất Cả Tin Tức" → /tin-tuc
```

---

## Trang Chi Tiết Dịch Vụ `/dich-vu/[slug]`

```
Data fetch (server): service (by slug), relatedServices[3]
generateStaticParams: tất cả service slugs
```

```tsx
// Layout chuẩn từ trên xuống:
<HeroBanner title={service.title} image={service.image} breadcrumb />
<ServiceDescription content={service.description} />
<ServiceScope items={parse(service.scope)} />           // bullet list
<ServiceProcess steps={parse(service.process)} />       // mini timeline
<ServiceBenefits items={parse(service.benefits)} />     // icon grid
<PriceTable min={service.price_min} max={service.price_max} unit={service.price_unit} />
<QuoteFormInline source="service_page" serviceType={service.title} />
<ServiceFAQ items={parse(service.faq)} />               // accordion
<RelatedServices services={relatedServices} />           // 3 cards
```

---

## Trang Danh Sách Bài Viết `/tin-tuc`

```
Data fetch (server): posts (paginated), categories
URL params: ?category=slug&page=1&q=keyword
```

```tsx
<PageHero title="Tin Tức & Chia Sẻ" />
<div className="container grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
  <main>
    <CategoryFilter categories={categories} active={currentCategory} />
    <SearchBar defaultValue={q} />
    <PostGrid posts={posts} />       // NewsCard x N
    <Pagination meta={meta} />
  </main>
  <aside>
    <RecentPosts posts={recentPosts} />
    <CategoryList categories={categories} />
  </aside>
</div>
```

---

## Trang Chi Tiết Bài Viết `/tin-tuc/[slug]`

```tsx
<article>
  <Breadcrumb items={breadcrumb} />
  <header>
    <CategoryBadge />
    <h1>{post.title}</h1>
    <PostMeta date={post.published_at} author={post.author} views={post.view_count} />
    <img src={post.thumbnail} alt={post.title} />
  </header>
  <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
  <SocialShare url={currentUrl} title={post.title} />
  <RelatedPosts posts={relatedPosts} />
</article>
```

---

## Trang Tuyển Dụng `/tuyen-dung`

```tsx
<PageHero title="Tuyển Dụng" subtitle="Cơ hội nghề nghiệp tại Long Việt" />
<section>
  <div className="container">
    <JobFilter />    // filter theo địa bàn, loại
    <JobGrid jobs={jobs} />   // JobCard components
  </div>
</section>
<RecruitmentCTA />   // section khuyến khích ứng tuyển, highlight lợi ích
```

---

## Trang Chi Tiết Tuyển Dụng `/tuyen-dung/[slug]`

```tsx
<Breadcrumb />
<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
  <main>
    <JobHeader title job.title location={job.location} salary={job.salary_range} status={job.status} />
    <JobSection title="Mô Tả Công Việc"   content={job.description} />
    <JobSection title="Yêu Cầu Ứng Viên"  content={job.requirements} />
    <JobSection title="Quyền Lợi"          content={job.benefits} />
    <GeneralRequirements />   // component cố định: nam, cao 1m65+, không tiền án...
  </main>
  <aside className="lg:sticky lg:top-24">
    <ApplyFormCard jobId={job.id} jobTitle={job.title} />
  </aside>
</div>
```

---

## Trang Liên Hệ `/lien-he`

```tsx
<PageHero title="Liên Hệ" />
<section className="container grid grid-cols-1 lg:grid-cols-2 gap-12">
  <div>
    <h2>Thông Tin Liên Hệ</h2>
    <BranchTabs branches={branches} />   // tab chọn chi nhánh → map + info
  </div>
  <div>
    <h2>Gửi Yêu Cầu</h2>
    <ContactFormFull />
  </div>
</section>
<SocialSection />
```

---

## Trang Bảng Giá `/bang-gia`

```tsx
<PageHero title="Bảng Giá Dịch Vụ Bảo Vệ" subtitle="Giá tham khảo, liên hệ để được báo giá chính xác" />
<section className="container">
  <PriceNote />    // disclaimer về giá
  <h2>Dịch Vụ Bảo Vệ 24/24</h2>
  <PriceTable group="24h" />
  <h2>Dịch Vụ Bảo Vệ Theo Ca</h2>
  <PriceTable group="shift" />
  <h2>Dịch Vụ Bảo Vệ Sự Kiện</h2>
  <PriceTable group="event" />
  <QuoteFormInline source="price_page" className="mt-16" />
</section>
```

---

## Trang SEO Địa Phương `/cong-ty-bao-ve-[tinh]`

```typescript
// generateStaticParams
const provinces = ['tphcm', 'ha-noi', 'da-nang', 'dong-nai', 'long-an']

// Nội dung tùy chỉnh theo tỉnh (SEO focused)
// - H1: "Dịch Vụ Bảo Vệ Chuyên Nghiệp Tại {tỉnh}"
// - Nội dung local: địa bàn hoạt động, dự án đã thực hiện tại tỉnh
// - Địa chỉ chi nhánh tại tỉnh
// - LocalBusiness Schema với địa chỉ chi nhánh tương ứng
```

---

## Layout Components

```tsx
// app/(site)/layout.tsx
export default function SiteLayout({ children }) {
  return (
    <>
      <Header />           // sticky, mega menu, hotline
      <main>{children}</main>
      <Footer />           // links, branches, social, copyright
      <FloatingHotline />  // fixed mobile CTA
      <ZaloWidget />       // fixed bottom-right
      <BackToTop />        // fixed, hiện khi scroll > 400px
    </>
  )
}
```
