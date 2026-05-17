# 06 – FORMS & LEAD MANAGEMENT

> **Dùng khi:** Implement form components, validation, email templates, file upload.

---

## Danh Sách Forms

| Form | Trang | Fields | Action |
|------|-------|--------|--------|
| `QuoteFormInline` | Homepage, Service pages, Price page | name, phone, email, service_type, message | POST /api/contacts |
| `ContactFormFull` | /lien-he | name, phone, email, province, service_type, title, message | POST /api/contacts |
| `ApplyForm` | /tuyen-dung/[slug] | name, phone, email, exp_years, preferred_location, note, cv_file | POST /api/applications |
| `PartnerForm` | /hop-tac | name, company, phone, email, message | POST /api/contacts (source: partner) |

---

## QuoteFormInline Component

```tsx
// components/forms/QuoteFormInline.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface Props {
  source: string
  serviceType?: string  // pre-fill nếu trên trang dịch vụ
  className?: string
}

// Fields:
// 1. name        : text input, required
// 2. phone       : tel input, required, validate VN phone
// 3. email       : email input, optional
// 4. service_type: select (dropdown 12 dịch vụ), default = serviceType prop
// 5. message     : textarea, required, min 10 chars, placeholder: "Mô tả nhu cầu..."

// Submit flow:
// 1. Validate với Zod schema
// 2. Execute reCAPTCHA v3 → get token
// 3. POST /api/contacts
// 4. Show toast: success "Cảm ơn! Chúng tôi sẽ liên hệ bạn trong 24h."
//              | error   "Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline."
// 5. Reset form sau khi success

// Service type options:
const serviceOptions = [
  { value: '', label: 'Chọn dịch vụ...' },
  { value: 'bao-ve-nha-may',         label: 'Bảo vệ nhà máy' },
  { value: 'bao-ve-su-kien',          label: 'Bảo vệ sự kiện' },
  { value: 'bao-ve-toa-nha',         label: 'Bảo vệ tòa nhà / văn phòng' },
  { value: 'bao-ve-ngan-hang',        label: 'Bảo vệ ngân hàng' },
  { value: 'bao-ve-benh-vien',        label: 'Bảo vệ bệnh viện' },
  { value: 'bao-ve-nha-hang',        label: 'Bảo vệ nhà hàng / siêu thị' },
  { value: 'bao-ve-truong-hoc',       label: 'Bảo vệ trường học' },
  { value: 'bao-ve-ngay-tet',         label: 'Bảo vệ ngày Tết' },
  { value: 'bao-ve-cong-truong',      label: 'Bảo vệ công trường' },
  { value: 'bao-ve-khu-cong-nghiep', label: 'Bảo vệ khu công nghiệp' },
  { value: 'bao-ve-ap-tai-tien',     label: 'Bảo vệ áp tải tiền' },
  { value: 'bao-ve-yeu-nhan',        label: 'Bảo vệ yếu nhân / VIP' },
  { value: 'khac',                    label: 'Dịch vụ khác' },
]
```

---

## ApplyForm Component

```tsx
// components/forms/ApplyForm.tsx
// Dùng FormData (multipart) vì có file upload

// Fields:
// 1. name               : text, required
// 2. phone              : tel, required
// 3. email              : email, required
// 4. experience_years   : number input (0-30), optional, label: "Số năm kinh nghiệm"
// 5. preferred_location : select (TP.HCM | Hà Nội | Đà Nẵng | Đồng Nai | Long An | Khác)
// 6. note               : textarea, optional, max 500 chars
// 7. cv_file            : file input, accept=".pdf", max 5MB

// File upload UI:
// - Drop zone: "Kéo thả CV vào đây hoặc click để chọn file"
// - Accepted formats: PDF only
// - Max size: 5MB
// - Preview: filename + size khi đã chọn
// - Remove button để chọn lại

// Submit flow:
// 1. Validate
// 2. Create FormData object
// 3. Execute reCAPTCHA
// 4. POST /api/applications (Content-Type: multipart/form-data)
// 5. Success message: "Hồ sơ đã được ghi nhận. Chúng tôi sẽ liên hệ bạn sớm nhất!"
```

---

## File Upload Handler

```typescript
// app/api/applications/route.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({ /* Cloudflare R2 config */ })

async function uploadCV(file: File, applicationId: string): Promise<string> {
  const buffer  = Buffer.from(await file.arrayBuffer())
  const ext     = 'pdf'
  const key     = `cvs/${applicationId}.${ext}`

  await s3.send(new PutObjectCommand({
    Bucket     : process.env.R2_BUCKET!,
    Key        : key,
    Body       : buffer,
    ContentType: 'application/pdf',
  }))

  return `${process.env.R2_PUBLIC_URL}/${key}`
}

// Validation:
// - File type: application/pdf only
// - Max size: 5 * 1024 * 1024 (5MB)
```

---

## Email Templates

### Template 1: Thông báo admin – Lead mới

```html
<!-- Gửi tới: admin email -->
Subject: [Báo Giá] Yêu cầu mới từ {name} – {service_type}

<h2>Có yêu cầu báo giá mới!</h2>
<table>
  <tr><td>Họ tên:</td><td>{name}</td></tr>
  <tr><td>SĐT:</td><td>{phone}</td></tr>
  <tr><td>Email:</td><td>{email}</td></tr>
  <tr><td>Dịch vụ:</td><td>{service_type}</td></tr>
  <tr><td>Tỉnh/Thành:</td><td>{province}</td></tr>
  <tr><td>Nội dung:</td><td>{message}</td></tr>
  <tr><td>Nguồn:</td><td>{source}</td></tr>
  <tr><td>Thời gian:</td><td>{created_at}</td></tr>
</table>
<a href="{admin_url}/contacts/{id}">Xem chi tiết trong Admin</a>
```

### Template 2: Xác nhận – Gửi khách hàng

```html
<!-- Gửi tới: customer email (nếu có) -->
Subject: Đã nhận yêu cầu của bạn – Long Việt Security

<p>Xin chào <strong>{name}</strong>,</p>
<p>Chúng tôi đã nhận được yêu cầu của bạn về dịch vụ <strong>{service_type}</strong>.</p>
<p>Đội ngũ tư vấn sẽ liên hệ với bạn trong vòng <strong>24 giờ làm việc</strong>.</p>
<p>Nếu cần hỗ trợ gấp, vui lòng gọi hotline: <strong>0923 840 999</strong></p>
```

### Template 3: Thông báo HR – Hồ sơ ứng tuyển mới

```html
Subject: [Ứng tuyển] {name} – {job_title}

<h2>Hồ sơ ứng tuyển mới</h2>
<table>
  <tr><td>Vị trí:</td><td>{job_title}</td></tr>
  <tr><td>Họ tên:</td><td>{name}</td></tr>
  <tr><td>SĐT:</td><td>{phone}</td></tr>
  <tr><td>Email:</td><td>{email}</td></tr>
  <tr><td>Kinh nghiệm:</td><td>{experience_years} năm</td></tr>
  <tr><td>Nơi muốn làm:</td><td>{preferred_location}</td></tr>
  <tr><td>Ghi chú:</td><td>{note}</td></tr>
</table>
<a href="{cv_url}">📄 Tải CV ứng viên</a>
<a href="{admin_url}/applications/{id}">Xem trong Admin</a>
```

### Template 4: Xác nhận – Gửi ứng viên

```html
Subject: Hồ sơ ứng tuyển đã được nhận – Long Việt Security

<p>Xin chào <strong>{name}</strong>,</p>
<p>Hồ sơ ứng tuyển vị trí <strong>{job_title}</strong> của bạn đã được ghi nhận.</p>
<p>Chúng tôi sẽ xem xét và liên hệ bạn trong vòng <strong>3–5 ngày làm việc</strong>.</p>
```

---

## Email Service Helper

```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM = { email: 'no-reply@yourdomain.vn', name: 'Long Việt Security' }
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!

export async function sendLeadNotification(contact: Contact) {
  await sgMail.send({
    to     : ADMIN_EMAIL,
    from   : FROM,
    subject: `[Báo Giá] Yêu cầu mới từ ${contact.name}`,
    html   : renderLeadNotification(contact),
  })
}

export async function sendLeadConfirmation(contact: Contact) {
  if (!contact.email) return
  await sgMail.send({
    to     : contact.email,
    from   : FROM,
    subject: 'Đã nhận yêu cầu của bạn – Long Việt Security',
    html   : renderLeadConfirmation(contact),
  })
}

export async function sendApplicationNotification(app: Application, job: Job) { /* ... */ }
export async function sendApplicationConfirmation(app: Application, job: Job) { /* ... */ }
```

---

## reCAPTCHA v3 Integration

```typescript
// Client side – execute trước khi submit
declare global { interface Window { grecaptcha: any } }

async function getRecaptchaToken(action: string): Promise<string> {
  return new Promise(resolve => {
    window.grecaptcha.ready(async () => {
      const token = await window.grecaptcha.execute(
        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        { action }
      )
      resolve(token)
    })
  })
}

// Server side – verify token
async function verifyRecaptcha(token: string): Promise<boolean> {
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    body  : new URLSearchParams({
      secret  : process.env.RECAPTCHA_SECRET_KEY!,
      response: token,
    }),
  })
  const data = await res.json()
  return data.success && data.score >= 0.5  // score 0-1, >= 0.5 là OK
}
```

---

## Form UX States

```
idle      → form hiển thị bình thường
loading   → submit button disabled + spinner + "Đang gửi..."
success   → form ẩn, hiện success message (xanh lá)
error     → hiện error message (đỏ) + form giữ nguyên data để sửa
```

**Inline validation:** Hiện lỗi ngay khi blur (onBlur), xóa lỗi khi user bắt đầu gõ lại (onChange).

**Phone format:** Tự động format `0923840999` → `0923 840 999` khi hiển thị.
