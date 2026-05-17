# PHASE 5 – CMS & QUẢN TRỊ (Tuần 9–10)

> **Mục tiêu:** Admin có thể tự CRUD toàn bộ nội dung, xem lead, quản lý hồ sơ – không cần dev.  
> **Deploy:** Cuối tuần 10 (staging), production sau khi test.  
> **Đọc thêm:** `07-cms-admin.md`, `04-api-contracts.md`, `03-database-schema.md`

---

## Tổng Quan Deliverable

```
✅ Auth: đăng nhập JWT + phân quyền (admin/editor/viewer)
✅ Admin layout: sidebar nav + header
✅ Dashboard: stats + recent leads
✅ CRUD: Dịch vụ (kéo thả thứ tự)
✅ CRUD: Bài viết + tài liệu (rich text editor)
✅ CRUD: Tuyển dụng + xem danh sách hồ sơ
✅ CRUD: Đối tác + Testimonial
✅ Lead management: xem, cập nhật status, xuất Excel
✅ Media library: upload, xem, xóa ảnh/PDF
✅ Settings: thông tin công ty, social, con số
```

---

## TASK 1 – Auth System

### 1.1 User Model & Seed
```typescript
// Seed user admin mặc định:
await prisma.user.create({
  data: {
    email   : 'admin@yourdomain.vn',
    password: await bcrypt.hash('ChangeMe@2026', 12),
    name    : 'Admin',
    role    : 'ADMIN',
  }
})
```

### 1.2 API Auth Endpoints
**Files:**
- `src/app/api/admin/login/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/me/route.ts`

```typescript
// POST /api/admin/login
// 1. Validate email + password (LoginSchema)
// 2. prisma.user.findUnique({ where: { email } })
// 3. bcrypt.compare(password, user.password)
// 4. Nếu sai ≥ 5 lần trong 15 phút → lock (Redis hoặc in-memory cache)
// 5. Tạo accessToken (JWT, 8h) + refreshToken (JWT, 30d)
// 6. refreshToken → httpOnly cookie (SameSite=Strict)
// 7. Return: { user: {id, name, email, role}, accessToken }

// POST /api/admin/logout
// Clear refreshToken cookie

// GET /api/admin/me
// Verify Bearer token → return user info
```

### 1.3 Auth Middleware
**File:** `src/middleware.ts`
```typescript
// Protect tất cả routes /admin/* trừ /admin/login
// Verify JWT từ Authorization header hoặc session cookie
// Redirect → /admin/login nếu invalid
```

### 1.4 Login Page
**File:** `src/app/(admin)/login/page.tsx`
```tsx
// Layout: centered card, bg-secondary
// Fields: email, password (show/hide toggle)
// Submit: POST /api/admin/login → redirect /admin/dashboard
// Error: "Email hoặc mật khẩu không chính xác"
// Branding: Logo + "Hệ Thống Quản Trị"
```

---

## TASK 2 – Admin Shell Layout

**File:** `src/app/(admin)/layout.tsx`

```tsx
// Layout: sidebar (260px) + main content
// Sidebar:
//   - Logo + "Admin Panel"
//   - NavItem list (xem 07-cms-admin.md)
//   - Active item: bg-primary/10 text-primary border-l-2 border-primary
//   - User info + logout ở bottom
// Header (top bar):
//   - Page title (dynamic)
//   - User avatar + dropdown (profile, đổi mật khẩu, logout)
// Responsive: sidebar collapse thành icon-only trên laptop, drawer trên mobile
```

**AdminNavItem Component:**
```tsx
// Props: icon, label, href, badge? (số count)
// Active detection: usePathname()
// Badge: vd số lead chưa xử lý (fetch từ API)
```

---

## TASK 3 – Dashboard `/admin/dashboard`

**File:** `src/app/(admin)/dashboard/page.tsx`

```tsx
// Data (parallel fetch):
const [leadsToday, leadsWeek, newApplications, publishedPosts, recentLeads] =
  await Promise.all([
    countContacts({ createdAfter: startOfDay }),
    countContacts({ createdAfter: startOfWeek }),
    countApplications({ status: 'NEW' }),
    countPosts({ status: 'PUBLISHED' }),
    getRecentContacts({ limit: 7 }),
  ])

// Layout:
// Row 1: 4 StatsCard
<StatsCard icon="MessageSquare" label="Lead hôm nay"    value={leadsToday}     color="red"    />
<StatsCard icon="TrendingUp"    label="Lead tuần này"   value={leadsWeek}      color="blue"   />
<StatsCard icon="Users"         label="Hồ sơ mới"      value={newApplications} color="green"  />
<StatsCard icon="FileText"      label="Bài đã đăng"    value={publishedPosts}  color="purple" />

// Row 2: RecentLeads table (7 rows) | QuickActions panel
// RecentLeads columns: Thời gian | Họ tên | SĐT | Dịch vụ | Nguồn | Status | [Xem]
// QuickActions: 4 buttons (tạo bài viết, tạo vị trí tuyển, xem lead mới, cài đặt)
```

---

## TASK 4 – CRUD: Dịch Vụ

**Files:**
- `src/app/(admin)/services/page.tsx` – List
- `src/app/(admin)/services/new/page.tsx` – Create
- `src/app/(admin)/services/[id]/page.tsx` – Edit

```tsx
// LIST PAGE:
// DataTable với drag-and-drop reorder (dnd-kit)
// Columns: Thứ tự (drag handle) | Ảnh | Tên | Giá | Status | Actions
// Toggle active: switch inline
// Actions: Edit (pencil) | Delete (trash, confirm dialog)

// FORM PAGE (Create/Edit):
// Tabs: Thông Tin | Nội Dung | FAQ | SEO
// Tab Thông Tin: title*, slug*, icon, image (media picker), price_min, price_max, price_unit, is_active
// Tab Nội Dung: description (TinyMCE), scope (TinyMCE), process (dynamic list builder), benefits (TinyMCE)
// Tab FAQ: dynamic list [{question, answer}], nút "Thêm câu hỏi"
// Tab SEO: meta_title (60 chars), meta_desc (160 chars), SEO preview

// API calls:
// GET  /api/admin/services     → list
// POST /api/admin/services     → create
// PUT  /api/admin/services/:id → update
// DEL  /api/admin/services/:id → delete
// PATCH /api/admin/services/reorder → { ids: string[] }
```

---

## TASK 5 – CRUD: Bài Viết

**Files:**
- `src/app/(admin)/posts/page.tsx`
- `src/app/(admin)/posts/new/page.tsx`
- `src/app/(admin)/posts/[id]/page.tsx`

```tsx
// LIST PAGE:
// Filter: type (BLOG/DOCUMENT) | status | category | search
// Table: Ảnh nhỏ | Tiêu đề | Danh mục | Trạng thái | Ngày đăng | Lượt xem | Actions
// Status badges: DRAFT (xám) | PUBLISHED (xanh) | SCHEDULED (xanh dương)
// Bulk actions: delete, publish, unpublish

// FORM PAGE (2 cột):
// Editor (left 65%):
//   title* (large input)
//   slug* (auto-generate, editable)
//   content* (TinyMCE 6 với full toolbar)
//   excerpt (textarea, auto-generate từ content nếu bỏ trống)
//
// Sidebar (right 35%):
//   [Publish box]
//     status: Draft | Published | Scheduled
//     published_at: datetime picker nếu Scheduled
//     "Lưu Nháp" | "Đăng Ngay"
//   [Ảnh đại diện]
//     media picker → preview
//   [Phân loại]
//     type: BLOG | DOCUMENT
//     category: select (load theo type)
//     tags: chip input (enter hoặc comma để thêm)
//   [SEO]
//     meta_title (60 chars counter)
//     meta_desc (160 chars counter)

// TinyMCE config:
// plugins: advlist autolink lists link image charmap preview anchor
//          searchreplace visualblocks code fullscreen insertdatetime
//          media table code help wordcount
// toolbar: undo redo | blocks | bold italic underline | alignleft aligncenter
//          alignright | bullist numlist | link image | code
// images_upload_handler: upload lên /api/admin/media/upload → trả URL
```

---

## TASK 6 – CRUD: Tuyển Dụng & Hồ Sơ

```tsx
// /admin/jobs – list tuyển dụng
// Columns: Tiêu đề | Địa bàn | Lương | Status | Hồ sơ (count) | Ngày tạo | Actions
// Nút "Xem Hồ Sơ" → /admin/jobs/:id/applications

// /admin/jobs/new & /admin/jobs/:id – form tuyển dụng
// Fields: title, slug, location, salary_range, type, status, description, requirements, benefits, meta_*

// /admin/jobs/:id/applications – danh sách hồ sơ
// Filter: status (NEW | REVIEWING | ACCEPTED | REJECTED)
// Table: Họ tên | SĐT | Email | Kinh nghiệm | Địa bàn | Ngày nộp | Status | CV | Actions
// Status dropdown inline per row
// Download CV: icon FileText → open PDF in new tab
// Export: "Xuất Excel" button → download .xlsx
//         Dùng thư viện: xlsx (SheetJS)
//         Columns: STT, Họ tên, SĐT, Email, Vị trí, Kinh nghiệm, Địa bàn, Ngày nộp, Trạng thái
```

---

## TASK 7 – Lead Management

**File:** `src/app/(admin)/contacts/page.tsx`

```tsx
// Filter bar:
//   status: Tất cả | Mới | Đang xử lý | Hoàn thành | Từ chối
//   date range: from - to (date picker)
//   service_type: select
//   search: (name hoặc phone)
//
// Table:
//   Thời gian | Họ tên | SĐT (link tel:) | Dịch vụ | Tỉnh | Nguồn | Status | [Xem]
//   Sort: created_at DESC mặc định
//   Pagination: 20 records/trang
//
// Detail modal (khi click "Xem"):
//   Tất cả thông tin lead
//   Nội dung message đầy đủ
//   Dropdown đổi status
//   Textarea "Ghi chú nội bộ"
//   Button "Gọi Ngay" + "Gửi Email"
//
// Export Excel:
//   Dùng SheetJS
//   Áp dụng filter hiện tại
//   Columns: STT, Thời gian, Họ tên, SĐT, Email, Dịch vụ, Tỉnh, Nguồn, Nội dung, Status

// API:
// GET  /api/admin/contacts?status&from&to&service_type&q&page&limit
// GET  /api/admin/contacts/:id
// PATCH /api/admin/contacts/:id/status   body: { status, note }
// GET  /api/admin/contacts/export        → blob xlsx
```

---

## TASK 8 – Media Library

**File:** `src/app/(admin)/media/page.tsx`

```tsx
// Layout: grid 4-6 cột, infinite scroll hoặc pagination
// Upload zone: drag-and-drop hoặc click (top of page)
//   accept: image/*, application/pdf
//   maxSize: 10MB per file, multiple files
//   Upload progress bar per file
//
// Media item card:
//   - Ảnh: preview thumbnail (image) hoặc icon PDF
//   - Hover: overlay với: Copy URL | Delete
//   - Click: preview modal (ảnh full size hoặc PDF viewer)
//
// Filter: type (image | pdf) | search filename
// Sort: newest first
//
// Copy URL: navigator.clipboard.writeText(url) → toast "Đã sao chép"
// Delete: confirm dialog → DELETE /api/admin/media/:id → xóa cả trên R2

// API:
// POST /api/admin/media/upload  FormData: { files: File[] }
// GET  /api/admin/media         ?type&q&page&limit
// DELETE /api/admin/media/:id
```

---

## TASK 9 – Settings

**File:** `src/app/(admin)/settings/page.tsx`

```tsx
// Tabs: Thông Tin | Thống Kê | Mạng Xã Hội | Chi Nhánh

// Tab Thông Tin:
//   company_name, company_hotline, company_email
//   → PATCH /api/admin/settings

// Tab Thống Kê (hiện trên homepage):
//   stat_years, stat_employees, stat_projects, stat_branches
//   (number inputs)

// Tab Mạng Xã Hội:
//   facebook_url, zalo_url, youtube_url

// Tab Chi Nhánh:
//   DataTable 5 chi nhánh
//   Edit từng chi nhánh: name, address, phone, email, map_embed_url, is_main
//   (Không cần thêm/xóa chi nhánh trong phase này)

// Save: tất cả tabs đều có "Lưu Thay Đổi" button
// Toast: "Đã lưu thành công" | "Lỗi, vui lòng thử lại"
```

---

## TASK 10 – Shared Admin Components

```tsx
// DataTable: sortable, filterable, pagination, row actions
// ConfirmDialog: modal xác nhận trước khi xóa
// MediaPicker: modal chọn ảnh từ thư viện hoặc upload mới
// RichTextEditor: wrapper TinyMCE với config chuẩn
// DragDropList: dùng @dnd-kit/sortable cho reorder
// StatusBadge: badge màu theo status enum
// ExcelExport: hook dùng SheetJS

// Thư viện cần install:
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install @tinymce/tinymce-react
npm install xlsx            // SheetJS cho export Excel
npm install react-datepicker
npm install @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-switch
```

---

## Definition of Done ✅

- [ ] Login hoạt động, JWT được lưu, redirect đúng
- [ ] Sai mật khẩu 5 lần → bị khóa 15 phút
- [ ] Phân quyền: editor không thấy Settings menu
- [ ] CRUD dịch vụ: tạo, sửa, xóa, kéo thả thứ tự → cập nhật ngay trên site
- [ ] CRUD bài viết: draft/publish hoạt động, rich text editor upload ảnh được
- [ ] CRUD tuyển dụng: tạo vị trí mới → xuất hiện trên /tuyen-dung
- [ ] Danh sách hồ sơ: xem được, đổi status, download CV thực tế
- [ ] Lead list: filter hoạt động, export Excel đúng dữ liệu
- [ ] Media library: upload ảnh, copy URL, xóa thành công
- [ ] Settings: lưu thay đổi → cập nhật trên site (sau revalidate)
- [ ] Admin accessible trên desktop 1280px trở lên (không cần responsive mobile)
