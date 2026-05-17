# 04 – API CONTRACTS

> **Dùng khi:** Implement API routes, viết fetch functions, xử lý validation.

---

## Base URL & Convention

```
Base URL (prod)   : https://yourdomain.vn/api
Base URL (staging): https://staging.yourdomain.vn/api
Content-Type      : application/json
Auth              : Bearer JWT (admin endpoints)
```

**Response Format:**
```typescript
// Success
{ success: true, data: T, meta?: { total, page, limit } }

// Error
{ success: false, error: string, details?: Record<string, string[]> }
```

---

## Public Endpoints

### GET `/api/services`
Danh sách dịch vụ đang active.
```typescript
// Response
{ success: true, data: ServiceSummary[] }

// ServiceSummary
{ id, title, slug, image, icon, price_min, price_max, price_unit }
```

### GET `/api/services/:slug`
Chi tiết một dịch vụ.
```typescript
// Response
{ success: true, data: Service } // full Service object
// 404 nếu không tìm thấy hoặc is_active = false
```

### GET `/api/posts`
Danh sách bài viết (có filter & paginate).
```typescript
// Query params
?type=BLOG|DOCUMENT      // mặc định: BLOG
&category=slug           // lọc theo danh mục
&page=1                  // mặc định: 1
&limit=10                // mặc định: 10
&q=keyword               // full-text search

// Response
{
  success: true,
  data: PostCard[],
  meta: { total: number, page: number, limit: number, totalPages: number }
}
```

### GET `/api/posts/:slug`
Chi tiết bài viết + tăng view_count.
```typescript
// Response
{ success: true, data: Post & { category: Category, related: PostCard[] } }
```

### GET `/api/jobs`
Danh sách vị trí tuyển dụng đang mở.
```typescript
// Query params (optional)
?location=tphcm&type=FULLTIME

// Response
{ success: true, data: JobCard[] }
```

### GET `/api/jobs/:slug`
Chi tiết vị trí tuyển dụng.
```typescript
{ success: true, data: Job }
```

### GET `/api/partners`
Danh sách đối tác active, theo thứ tự.
```typescript
{ success: true, data: Partner[] }
```

### GET `/api/testimonials`
Danh sách cảm nhận khách hàng active.
```typescript
{ success: true, data: Testimonial[] }
```

### GET `/api/branches`
Danh sách chi nhánh.
```typescript
{ success: true, data: Branch[] }
```

### GET `/api/settings`
Lấy cài đặt website (public fields only).
```typescript
{ success: true, data: { company_name, hotline, stat_years, stat_employees, stat_projects, stat_branches, facebook_url, zalo_url } }
```

---

## Form Endpoints (Public, Protected by reCAPTCHA)

### POST `/api/contacts`
Gửi form liên hệ hoặc báo giá.
```typescript
// Request body
{
  name         : string  // required, min 2
  phone        : string  // required, regex VN phone
  email        : string? // optional, valid email
  province     : string? // tỉnh/thành phố
  service_type : string? // loại dịch vụ
  title        : string? // tiêu đề
  message      : string  // required, min 10
  source       : string  // "homepage" | "service_page" | "contact_page"
  recaptcha_token: string // required
}

// Response (success)
{ success: true, data: { id: string, message: "Yêu cầu của bạn đã được gửi thành công." } }

// Side effects:
// 1. Lưu vào DB (Contact)
// 2. Gửi email thông báo tới admin
// 3. Gửi email xác nhận tới user (nếu có email)
```

### POST `/api/applications`
Nộp hồ sơ ứng tuyển (multipart/form-data vì có file).
```typescript
// Request (FormData)
{
  job_id             : string  // required
  name               : string  // required
  phone              : string  // required, VN phone
  email              : string  // required, valid email
  experience_years   : number? // 0-30
  preferred_location : string? // tỉnh/thành phố muốn làm
  note               : string? // max 500 chars
  cv_file            : File?   // PDF, max 5MB
  recaptcha_token    : string
}

// Response
{ success: true, data: { id: string, message: "Hồ sơ đã được ghi nhận. Chúng tôi sẽ liên hệ bạn sớm nhất." } }

// Side effects:
// 1. Upload CV lên storage (R2/S3) → lưu URL
// 2. Lưu Application vào DB
// 3. Email thông báo HR
// 4. Email xác nhận ứng viên
```

---

## Admin Endpoints (Require Auth: Bearer JWT)

### Auth
```
POST /api/admin/login          { email, password } → { token, user }
POST /api/admin/logout         → 200 OK
POST /api/admin/refresh        → { token }
GET  /api/admin/me             → { user }
```

### Services
```
GET    /api/admin/services           → ServiceSummary[] (bao gồm inactive)
GET    /api/admin/services/:id       → Service
POST   /api/admin/services           body: CreateServiceInput
PUT    /api/admin/services/:id       body: UpdateServiceInput
DELETE /api/admin/services/:id       → 204
PATCH  /api/admin/services/reorder   body: { ids: string[] }
```

### Posts
```
GET    /api/admin/posts              ?type&status&category&page&limit&q
POST   /api/admin/posts              body: CreatePostInput
GET    /api/admin/posts/:id          → Post
PUT    /api/admin/posts/:id          body: UpdatePostInput
DELETE /api/admin/posts/:id          → 204
```

### Jobs & Applications
```
GET    /api/admin/jobs               → Job[]
POST   /api/admin/jobs               body: CreateJobInput
PUT    /api/admin/jobs/:id
DELETE /api/admin/jobs/:id
GET    /api/admin/jobs/:id/applications  → Application[]
GET    /api/admin/applications/:id       → Application (full detail)
PATCH  /api/admin/applications/:id/status body: { status: AppStatus }
GET    /api/admin/applications/export    → Excel file (blob)
```

### Contacts (Leads)
```
GET    /api/admin/contacts           ?status&page&limit&q&from&to
GET    /api/admin/contacts/:id
PATCH  /api/admin/contacts/:id/status body: { status, note }
GET    /api/admin/contacts/export    → Excel file
```

### Settings
```
GET    /api/admin/settings           → Setting[]
PATCH  /api/admin/settings           body: { key: string, value: any }[]
```

### Media
```
POST   /api/admin/media/upload       FormData: { file, alt_text? }
GET    /api/admin/media              ?type=image|pdf&page&limit
DELETE /api/admin/media/:id
```

---

## Validation Schemas (Zod)

```typescript
// lib/validations.ts
import { z } from 'zod'

const vnPhone = /^(0|\+84)(3[2-9]|5[6-9]|7[06-9]|8[0-9]|9[0-9])[0-9]{7}$/

export const ContactSchema = z.object({
  name        : z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone       : z.string().regex(vnPhone, 'Số điện thoại không hợp lệ'),
  email       : z.string().email().optional().or(z.literal('')),
  province    : z.string().optional(),
  service_type: z.string().optional(),
  title       : z.string().optional(),
  message     : z.string().min(10, 'Nội dung tối thiểu 10 ký tự'),
  source      : z.string(),
  recaptcha_token: z.string().min(1),
})

export const ApplicationSchema = z.object({
  job_id            : z.string().min(1),
  name              : z.string().min(2),
  phone             : z.string().regex(vnPhone, 'Số điện thoại không hợp lệ'),
  email             : z.string().email('Email không hợp lệ'),
  experience_years  : z.number().min(0).max(30).optional(),
  preferred_location: z.string().optional(),
  note              : z.string().max(500).optional(),
})

export const LoginSchema = z.object({
  email   : z.string().email(),
  password: z.string().min(8),
})
```

---

## Rate Limiting

```typescript
// Áp dụng cho form endpoints
// lib/rate-limit.ts
const limits = {
  '/api/contacts'    : { requests: 5,  window: 60 },  // 5 req/phút/IP
  '/api/applications': { requests: 3,  window: 60 },  // 3 req/phút/IP
  '/api/admin/login' : { requests: 10, window: 60 },  // 10 req/phút/IP
}
```

---

## Error Codes

| HTTP | Code | Mô tả |
|------|------|-------|
| 400 | VALIDATION_ERROR | Dữ liệu đầu vào không hợp lệ |
| 401 | UNAUTHORIZED | Chưa đăng nhập |
| 403 | FORBIDDEN | Không có quyền |
| 404 | NOT_FOUND | Không tìm thấy resource |
| 422 | RECAPTCHA_FAILED | reCAPTCHA verification thất bại |
| 429 | RATE_LIMITED | Quá nhiều request |
| 500 | INTERNAL_ERROR | Lỗi server |
