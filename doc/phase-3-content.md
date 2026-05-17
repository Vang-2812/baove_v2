# PHASE 3 – NỘI DUNG & BLOG (Tuần 6–7)

> **Mục tiêu:** Blog, kho tài liệu, trang giới thiệu, đối tác, testimonial – đủ nội dung SEO.  
> **Deploy:** Cuối tuần 7.  
> **Đọc thêm:** `05-pages-spec.md`, `03-database-schema.md`, `08-seo-and-meta.md`

---

## Tổng Quan Deliverable

```
✅ DB: bảng posts, categories, partners, testimonials
✅ Trang chủ: thêm sections 10 (đối tác), 11 (testimonial), 12 (tin tức)
✅ Trang /gioi-thieu và 4 sub-pages
✅ Blog /tin-tuc (danh sách + chi tiết)
✅ Kho tài liệu /tai-lieu (4 chuyên mục)
✅ Trang /hop-tac
✅ Schema Article + full SEO cho blog
✅ Partner logo carousel + Testimonial carousel
```

---

## TASK 1 – Database & Seed

```typescript
// Migration: tạo bảng posts, categories, partners, testimonials
// (xem 03-database-schema.md)

// Seed categories (8 records):
const categories = [
  { name: 'Tin Công Ty',   slug: 'tin-cong-ty',           type: 'BLOG',     order: 1 },
  { name: 'Nghiệp Vụ',    slug: 'nghiep-vu',             type: 'BLOG',     order: 2 },
  { name: 'Tuyển Dụng',   slug: 'tuyen-dung-blog',       type: 'BLOG',     order: 3 },
  { name: 'Kiến Thức',    slug: 'kien-thuc',             type: 'BLOG',     order: 4 },
  { name: 'PCCC',          slug: 'phong-chay-chua-chay',  type: 'DOCUMENT', order: 1 },
  { name: 'Nghiệp Vụ BV', slug: 'nghiep-vu-bao-ve',     type: 'DOCUMENT', order: 2 },
  { name: 'Sơ Cấp Cứu',  slug: 'so-cap-cuu',            type: 'DOCUMENT', order: 3 },
  { name: 'Cứu Hộ Cứu Nạn', slug: 'cuu-ho-cuu-nan',    type: 'DOCUMENT', order: 4 },
]

// Seed posts: 12 bài BLOG + 8 bài DOCUMENT (status=PUBLISHED)
// Mỗi bài có: title, slug, content (HTML), excerpt, thumbnail, published_at

// Seed partners: 10 đối tác (logo placeholder, tên công ty thực hoặc generic)
// Seed testimonials: 5 cảm nhận khách hàng
```

---

## TASK 2 – API Endpoints

**Files:** `src/app/api/posts/route.ts`, `src/app/api/posts/[slug]/route.ts`

```typescript
// GET /api/posts
// Query: type, category, page, limit, q (full-text search)
// Full-text search PostgreSQL:
//   WHERE to_tsvector('english', title || ' ' || excerpt) @@ plainto_tsquery(q)
// Hoặc dùng Prisma raw: prisma.$queryRaw

// GET /api/posts/:slug
// Tăng view_count: prisma.post.update({ where: { slug }, data: { view_count: { increment: 1 } } })
// Include: category, author (select: name only)
// Related posts: cùng category, limit 3, exclude current

// GET /api/partners → partners sorted by order, is_active=true
// GET /api/testimonials → testimonials sorted by order, is_active=true
```

---

## TASK 3 – Blog: Trang Danh Sách `/tin-tuc`

**File:** `src/app/(site)/tin-tuc/page.tsx`

```tsx
// Server Component với searchParams
// Data: posts (type=BLOG, status=PUBLISHED), categories (type=BLOG)

// Layout:
<PageHero title="Tin Tức & Chia Sẻ" />

<section className="container py-12">
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">

    {/* Main content */}
    <main>
      <div className="flex flex-wrap gap-3 mb-8">
        <CategoryFilter categories={categories} active={params.category} />
      </div>
      <SearchBar defaultValue={params.q} placeholder="Tìm kiếm bài viết..." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {posts.map(p => <NewsCard key={p.id} post={p} />)}
      </div>
      {posts.length === 0 && <EmptyState />}
      <Pagination meta={meta} className="mt-10" />
    </main>

    {/* Sidebar */}
    <aside className="space-y-8">
      <RecentPostsWidget posts={recentPosts} />
      <CategoryListWidget categories={categories} />
      <ContactWidget />   // Hotline + form liên hệ mini
    </aside>

  </div>
</section>

// Meta: "Tin Tức Bảo Vệ | Long Việt Security"
```

**NewsCard Component:**
```tsx
// File: src/components/ui/NewsCard.tsx
// Props: post: PostCard (id, title, slug, excerpt, thumbnail, published_at, category)
// Layout:
//   - Ảnh: w-full h-44 object-cover, group-hover:scale-105 transition-transform duration-300
//   - Category badge: text-xs bg-primary/10 text-primary rounded px-2 py-0.5
//   - Title: text-h4 font-semibold hover:text-primary transition-colors line-clamp-2
//   - Excerpt: text-sm text-text-muted line-clamp-3 mt-2
//   - Footer: icon Calendar + ngày đăng (format: DD/MM/YYYY)
```

---

## TASK 4 – Blog: Trang Chi Tiết `/tin-tuc/[slug]`

**File:** `src/app/(site)/tin-tuc/[slug]/page.tsx`

```tsx
// generateStaticParams: fetch tất cả slugs PUBLISHED
// generateMetadata: dynamic từ post data
// Revalidate: ISR với revalidate=3600

// Layout:
<article className="container py-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
  <main>
    <Breadcrumb items={breadcrumb} />
    <header className="mb-8">
      <CategoryBadge category={post.category} />
      <h1 className="text-h1 font-bold text-secondary mt-3">{post.title}</h1>
      <div className="flex gap-4 text-sm text-text-muted mt-3">
        <span>{formatDate(post.published_at)}</span>
        <span>{post.view_count} lượt xem</span>
        {post.author && <span>Bởi {post.author.name}</span>}
      </div>
      {post.thumbnail && (
        <Image src={post.thumbnail} alt={post.title} width={800} height={450}
          className="w-full rounded-xl mt-6" priority />
      )}
    </header>

    {/* Nội dung bài viết */}
    <div
      className="prose prose-lg max-w-none
        prose-headings:text-secondary prose-headings:font-bold
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-xl"
      dangerouslySetInnerHTML={{ __html: post.content }}
    />

    <SocialShare url={canonicalUrl} title={post.title} />
    <RelatedPosts posts={post.related} />
  </main>

  <aside className="space-y-8">
    <div className="lg:sticky lg:top-24">
      <RecentPostsWidget />
      <CategoryListWidget />
      <QuoteFormCard compact />
    </div>
  </aside>
</article>

// Schema: Article + BreadcrumbList
```

**SocialShare Component:**
```tsx
// File: src/components/ui/SocialShare.tsx
// Buttons: Facebook share, Zalo share, Copy link
// Facebook: window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
// Zalo: window.open(`https://zalo.me/share/oa/...`)
// Copy: navigator.clipboard.writeText(url) → toast "Đã sao chép"
```

---

## TASK 5 – Tài Liệu `/tai-lieu`

**File:** `src/app/(site)/tai-lieu/page.tsx`

```tsx
// Layout tương tự blog nhưng 4 chuyên mục cố định + style "chuyên môn"
// Mỗi chuyên mục hiện dưới dạng Section riêng với ảnh banner nhỏ

<PageHero title="Kho Tài Liệu Bảo Vệ" subtitle="Tài liệu nghiệp vụ, PCCC, sơ cấp cứu" />

{documentCategories.map(cat => (
  <DocumentCategorySection key={cat.slug} category={cat} posts={postsByCategory[cat.slug]} />
))}
```

**Trang tài liệu chi tiết:** `/tai-lieu/[slug]`
```tsx
// Dùng chung component với blog /tin-tuc/[slug]
// Thêm: sidebar "Tài Liệu Cùng Chuyên Mục"
// Schema: Article với dateModified
```

---

## TASK 6 – Trang Giới Thiệu (5 trang)

### 6.1 `/gioi-thieu`
**File:** `src/app/(site)/gioi-thieu/page.tsx`

```tsx
<PageHero title="Về Chúng Tôi" subtitle="15 năm xây dựng niềm tin – Triệu khách hàng an tâm" />

{/* Section: Tổng quan */}
<section className="container py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
  <div>{/* 3 đoạn giới thiệu */}</div>
  <div>{/* Ảnh + badge thành tích */}</div>
</section>

{/* Section: Thông tin nhanh (4 cột) */}
<StatsSection />  {/* Reuse từ homepage */}

{/* Section: Bằng khen & Chứng nhận */}
<section>
  <h2>Bằng Khen & Chứng Nhận</h2>
  {/* Grid ảnh bằng khen */}
</section>

{/* Section: Chi nhánh */}
<BranchesSection branches={branches} />

{/* Sub-nav links */}
<section>{/* 4 nút link đến sub-pages */}</section>
```

### 6.2 `/gioi-thieu/qua-trinh-hinh-thanh`
```tsx
// Timeline dọc (vertical)
// Mỗi mốc: { year, title, description, image? }
const milestones = [
  { year: 2009, title: 'Thành Lập Công Ty',   description: 'Long Việt Security được thành lập tại TP.HCM với đội ngũ 50 nhân viên.' },
  { year: 2012, title: 'Mở Chi Nhánh Long An', description: '...' },
  { year: 2015, title: 'Mở Chi Nhánh Đồng Nai',description: '...' },
  { year: 2018, title: 'Đạt Chứng Nhận ISO',   description: '...' },
  { year: 2020, title: 'Mở Chi Nhánh Đà Nẵng', description: '...' },
  { year: 2022, title: 'Mở Chi Nhánh Hà Nội',  description: '...' },
  { year: 2024, title: '2000+ Nhân Viên',       description: '...' },
]

// Layout Timeline:
// Line dọc giữa (border-l-2 border-primary ml-4)
// Mỗi item: dot (w-4 h-4 bg-primary rounded-full -ml-2) + content bên phải
// Alternate sides trên desktop
```

### 6.3 `/gioi-thieu/co-cau-to-chuc`
```tsx
// Org chart dạng cây, dùng SVG hoặc ảnh tĩnh
// Cấu trúc:
//   Ban Giám Đốc
//   ├── Phòng Kinh Doanh
//   ├── Phòng Điều Hành
//   ├── Phòng Đào Tạo
//   ├── Phòng Kế Toán
//   └── Phòng Nhân Sự
// Option 1: export ảnh từ Figma/Draw.io → next/image
// Option 2: dùng thư viện react-org-chart
```

### 6.4 `/gioi-thieu/tam-nhin-su-menh`
```tsx
// 3 section riêng biệt:
// 1. Tầm nhìn – bg trắng, icon Target lớn, text lớn
// 2. Sứ mệnh – bg-light, icon Heart, text
// 3. Giá trị cốt lõi – bg-secondary text-white
//    4 cards: Uy tín | Tận tâm | An toàn | Chuyên nghiệp
```

### 6.5 `/gioi-thieu/su-khac-biet`
```tsx
// Bảng so sánh: Tự tuyển bảo vệ vs Thuê Long Việt
const comparison = [
  { aspect: 'Chi phí',          self: 'Cao (lương, BHXH, trang bị)', us: 'Tiết kiệm 20-30%' },
  { aspect: 'Đào tạo',          self: 'Tốn thời gian, chi phí',      us: 'Đào tạo bài bản sẵn' },
  { aspect: 'Pháp lý',          self: 'Rủi ro khi xảy ra sự cố',    us: 'Hỗ trợ pháp lý đầy đủ' },
  { aspect: 'Thay thế nhân sự', self: 'Mất thời gian tuyển mới',    us: 'Thay thế trong 24h' },
  { aspect: 'Giám sát',         self: 'Khó kiểm soát',              us: 'Báo cáo định kỳ, camera' },
]
// Column "Long Việt": màu primary, icon Check màu green
// Column "Tự tuyển": màu gray, icon X màu red
```

---

## TASK 7 – Trang Hợp Tác `/hop-tac`

**File:** `src/app/(site)/hop-tac/page.tsx`

```tsx
<PageHero title="Hợp Tác Cùng Long Việt" subtitle="Cùng nhau xây dựng môi trường an toàn" />

{/* Lợi ích đối tác */}
<section>
  <h2>Lợi Ích Khi Hợp Tác</h2>
  {/* 3 benefits cards */}
</section>

{/* Form đăng ký hợp tác */}
<section>
  <h2>Đăng Ký Hợp Tác</h2>
  <ContactFormFull
    source="partner_page"
    title="Tên đại diện"
    extraFields={[
      { name: 'company', label: 'Tên Công Ty', type: 'text', required: true },
    ]}
  />
</section>

{/* Partner logos */}
<section>
  <h2>Đối Tác Đã Hợp Tác</h2>
  <PartnerGrid partners={partners} />
</section>
```

---

## TASK 8 – Carousel Components (Trang Chủ)

### 8.1 Partner Logo Carousel (Section 10)
```tsx
// File: src/components/sections/PartnersSection.tsx
// Dùng: CSS infinite scroll animation (không cần JS library)
// Technique: duplicate logos, animation: scroll infinite linear

.partners-track {
  display: flex;
  animation: scroll 30s linear infinite;
  width: max-content;
}
@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }  // 50% vì đã duplicate
}
// Pause on hover: animation-play-state: paused

// Mỗi logo: w-32 h-16 object-contain grayscale hover:grayscale-0 transition
```

### 8.2 Testimonial Carousel (Section 11)
```tsx
// File: src/components/sections/TestimonialsSection.tsx
// State: currentIndex, autoplay 4s
// Background: bg-secondary text-white

// Card:
// - Logo công ty: w-16 h-16 object-contain rounded-full bg-white p-2
// - Stars: 5 icon Star màu yellow-400
// - Content: text-lg italic mb-4 (trích dẫn)
// - Name: font-bold + position, company

// Controls: prev/next arrows + dot indicators
// Dots: click để navigate
```

### 8.3 Tin Tức Section (Section 12)
```tsx
// File: src/components/sections/LatestNewsSection.tsx
// Data: 3 posts mới nhất (fetch server-side, revalidate=3600)
// Layout: grid 3 cột
// Dùng NewsCard component
// CTA: "Xem Tất Cả Tin Tức →"
```

---

## TASK 9 – SEO Blog & Article

```typescript
// generateMetadata cho /tin-tuc/[slug]:
{
  title: `${post.title} | Long Việt Security`,
  description: post.excerpt || post.meta_desc,
  openGraph: {
    type: 'article',
    publishedTime: post.published_at,
    authors: [post.author?.name],
    tags: post.tags,
    images: [{ url: post.thumbnail }],
  }
}

// Schema Article cho mỗi bài viết
// Schema BreadcrumbList
// Tags: post.tags → <meta name="keywords" content={post.tags.join(',')} />
// Open Graph image fallback: /og-default.jpg nếu không có thumbnail
```

---

## Definition of Done ✅

- [ ] Blog có 12+ bài viết PUBLISHED, phân trang hoạt động
- [ ] Search bài viết trả kết quả đúng
- [ ] Trang chi tiết bài viết: nội dung đúng, schema Article valid
- [ ] Tài liệu có 4 chuyên mục, mỗi chuyên mục ≥ 2 bài
- [ ] 5 trang giới thiệu accessible, nội dung đầy đủ
- [ ] Partner carousel tự động cuộn mượt, không nhấp nháy
- [ ] Testimonial carousel hoạt động, responsive
- [ ] Section 10, 11, 12 xuất hiện trên trang chủ
- [ ] Trang hợp tác có form gửi được
- [ ] Lighthouse Mobile ≥ 80
