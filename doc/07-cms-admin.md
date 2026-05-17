# 07 – CMS & ADMIN DASHBOARD

> **Dùng khi:** Build trang quản trị, implement CRUD, auth, dashboard.

---

## Auth Flow

```
POST /api/admin/login → JWT (access token, 8h) + Refresh token (30d, httpOnly cookie)
Mọi request admin → Header: Authorization: Bearer {token}
Token hết hạn → auto refresh bằng cookie
2FA: TOTP (Google Authenticator) – bắt buộc với role ADMIN
```

### Protected Route HOC
```tsx
// app/(admin)/layout.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/auth'

export default async function AdminLayout({ children }) {
  const session = await getServerSession()
  if (!session) redirect('/admin/login')
  return <AdminShell session={session}>{children}</AdminShell>
}
```

---

## Admin Navigation (Sidebar)

```
Dashboard       /admin/dashboard
─────────────────────────────
NỘI DUNG
  Dịch Vụ      /admin/services
  Bài Viết     /admin/posts
  Tài Liệu     /admin/documents
─────────────────────────────
NHÂN SỰ
  Tuyển Dụng   /admin/jobs
  Hồ Sơ        /admin/applications
─────────────────────────────
KHÁCH HÀNG
  Liên Hệ/Lead /admin/contacts
─────────────────────────────
WEBSITE
  Đối Tác      /admin/partners
  Testimonial  /admin/testimonials
  Media        /admin/media
  Cài Đặt      /admin/settings
─────────────────────────────
Đăng Xuất
```

---

## Dashboard Page `/admin/dashboard`

```tsx
// Stats cards (top row)
const statsCards = [
  { label: 'Lead hôm nay',      value: leadsToday,    icon: 'MessageSquare', color: 'primary' },
  { label: 'Lead tuần này',     value: leadsWeek,     icon: 'TrendingUp',    color: 'blue' },
  { label: 'Hồ sơ ứng tuyển',  value: applications,  icon: 'Users',         color: 'green' },
  { label: 'Bài viết đã đăng',  value: publishedPosts, icon: 'FileText',     color: 'purple' },
]

// Layout:
// Row 1: 4 stat cards
// Row 2: [Recent Leads Table (7 records)] | [Quick Actions]
// Row 3: [Application Status Chart] | [Monthly Leads Chart]

// Quick Actions panel:
// - Tạo bài viết mới    → /admin/posts/new
// - Tạo vị trí tuyển   → /admin/jobs/new
// - Xem lead chưa xử lý → /admin/contacts?status=NEW
```

---

## CRUD: Dịch Vụ `/admin/services`

### List Page
```tsx
<DataTable
  columns={[
    { key: 'order',     label: '#',          width: 60, draggable: true },
    { key: 'title',     label: 'Tên dịch vụ' },
    { key: 'price_min', label: 'Giá từ',     format: 'currency' },
    { key: 'price_max', label: 'Đến',        format: 'currency' },
    { key: 'is_active', label: 'Trạng thái', format: 'badge' },
    { key: 'actions',   label: '',           render: <EditDeleteButtons /> },
  ]}
  data={services}
  draggable={true}   // kéo thả để đổi thứ tự
  onReorder={handleReorder}
/>
```

### Form (Create/Edit)
```
Tab 1 – Thông Tin Chung:
  title*       : text input
  slug*        : auto-generate từ title, có thể sửa
  icon         : select lucide icon
  image        : media picker (upload hoặc chọn từ thư viện)
  price_min    : number input (VNĐ)
  price_max    : number input (VNĐ)
  price_unit   : text ("tháng" | "ngày" | "giờ/vị trí")
  is_active    : toggle switch

Tab 2 – Nội Dung:
  description  : Rich text editor (TinyMCE)
  scope        : Rich text (danh sách phạm vi)
  process      : JSON builder (danh sách bước: [{icon, title, description}])
  benefits     : Rich text (lợi ích)

Tab 3 – FAQ:
  faq          : Dynamic list builder [{question, answer}]
                 Nút "Thêm câu hỏi"

Tab 4 – SEO:
  meta_title   : text input (max 60 chars, counter)
  meta_desc    : textarea (max 160 chars, counter)
  Preview SEO  : Google search result preview
```

---

## CRUD: Bài Viết `/admin/posts`

### List Page
```tsx
// Filter bar: type (BLOG/DOCUMENT) | status | category | search
// Table columns: thumbnail, title, category, author, status, published_at, views, actions
// Status badges: DRAFT (gray) | PUBLISHED (green) | SCHEDULED (blue)
// Bulk actions: delete, change status
```

### Form (Create/Edit)
```
Layout: 2 cột [Editor 70%] | [Sidebar 30%]

Editor (left):
  title*       : large text input
  slug*        : auto-generate, editable
  content*     : Rich text editor (TinyMCE 6 với full toolbar)
                 Hỗ trợ: heading, bold/italic, lists, tables, images, links, code blocks

Sidebar (right):
  [Publish box]
    status     : Draft | Published | Scheduled
    published_at: datetime picker (nếu Scheduled)
    Button "Lưu Nháp" / "Đăng Ngay"

  [Ảnh đại diện]
    thumbnail  : media picker

  [Phân loại]
    type       : BLOG | DOCUMENT
    category   : select (filter theo type)
    tags       : tag input (comma separated)

  [SEO]
    meta_title : text (max 60)
    meta_desc  : textarea (max 160)
    excerpt    : textarea (auto-generate từ content nếu trống)
```

---

## CRUD: Tuyển Dụng `/admin/jobs`

### List Page
```tsx
// Table: title, location, salary_range, status (OPEN/PAUSED/CLOSED), applications_count, created_at, actions
// Status badges: OPEN (green), PAUSED (yellow), CLOSED (gray)
// Click vào row → detail page với danh sách hồ sơ
```

### Form
```
title*         : text
slug*          : auto-generate
location*      : text (vd: "TP.HCM, Đồng Nai")
salary_range   : text (vd: "8-12 triệu")
type           : FULLTIME | PARTTIME | CONTRACT
status         : OPEN | PAUSED | CLOSED
description*   : Rich text
requirements*  : Rich text
benefits*      : Rich text
meta_title     : text
meta_desc      : textarea
```

### Applications Sub-page `/admin/jobs/[id]/applications`
```tsx
<Table
  columns={['Họ tên', 'SĐT', 'Email', 'Kinh nghiệm', 'Nơi làm', 'Ngày nộp', 'Trạng thái', 'CV', 'Actions']}
  filters={['NEW', 'REVIEWING', 'ACCEPTED', 'REJECTED']}
  exportButton  // xuất Excel
/>
// Click CV icon → download/view PDF
// Status dropdown per row: NEW | REVIEWING | ACCEPTED | REJECTED
```

---

## Lead Management `/admin/contacts`

```tsx
// Filter: status | date range | service_type | province | search (name/phone)
// Sort: created_at DESC (mặc định)

<Table
  columns={[
    { key: 'created_at',  label: 'Thời gian', format: 'datetime' },
    { key: 'name',        label: 'Họ tên' },
    { key: 'phone',       label: 'SĐT', render: <PhoneLink /> },
    { key: 'service_type',label: 'Dịch vụ' },
    { key: 'province',    label: 'Tỉnh/Thành' },
    { key: 'source',      label: 'Nguồn' },
    { key: 'status',      label: 'Trạng thái', render: <StatusBadge /> },
    { key: 'actions',     label: '', render: <ViewButton /> },
  ]}
/>

// Detail modal/page:
// - Toàn bộ thông tin lead
// - Nội dung message đầy đủ
// - Dropdown đổi status: NEW → IN_PROGRESS → DONE | CANCELLED
// - Textarea ghi chú nội bộ
// - Button "Gọi ngay" (tel: link)
// - Button "Gửi email" (mailto: link)

// Export: Button "Xuất Excel" → download .xlsx với filter hiện tại
```

---

## Settings Page `/admin/settings`

```tsx
// Tabs: Thông Tin Công Ty | Mạng Xã Hội | Con Số Thống Kê | Tích Hợp

Tab "Thông Tin Công Ty":
  company_name    : text
  company_hotline : text
  company_email   : email
  company_address : textarea (chi nhánh chính)

Tab "Con Số Thống Kê" (hiện trên trang chủ):
  stat_years      : number
  stat_employees  : number
  stat_projects   : number
  stat_branches   : number

Tab "Mạng Xã Hội":
  facebook_url    : url
  zalo_url        : url
  youtube_url     : url

Tab "Tích Hợp":
  ga4_id          : text (G-XXXXXXXX)
  maps_api_key    : text
  recaptcha_key   : text (display only, set via env)
```

---

## Media Library `/admin/media`

```tsx
// Layout: grid view 4-6 cột
// Upload: drag-and-drop zone hoặc button, multiple files
// Filter: type (image | pdf) | search by filename
// Click ảnh: preview modal với copy URL button
// Delete: xác nhận trước khi xóa
// Accepted types: jpg, jpeg, png, webp, gif, pdf
// Max file size: 10MB per file
```

---

## Permissions Matrix

| Resource | ADMIN | EDITOR | VIEWER |
|----------|-------|--------|--------|
| Dashboard | ✅ | ✅ | ✅ |
| Services CRUD | ✅ | ✅ | 👁 |
| Posts CRUD | ✅ | ✅ | 👁 |
| Jobs CRUD | ✅ | ✅ | 👁 |
| Applications view | ✅ | ✅ | 👁 |
| Contacts view/update | ✅ | ✅ | 👁 |
| Export data | ✅ | ✅ | ❌ |
| Partners/Testimonials | ✅ | ✅ | 👁 |
| Media upload | ✅ | ✅ | ❌ |
| Settings | ✅ | ❌ | ❌ |
| User management | ✅ | ❌ | ❌ |
