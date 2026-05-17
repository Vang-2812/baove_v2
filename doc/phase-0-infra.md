# PHASE 0 – HẠ TẦNG & THIẾT LẬP (Tuần 1)

> **Mục tiêu:** Dựng xong môi trường dev/staging/prod. Không deploy ra public.  
> **Output:** Server chạy, repo sẵn, design được duyệt, dev có thể bắt đầu code.

---

## Tasks

### 🔧 Dev Environment
- [ ] Branch protection rules: require PR + 1 approval cho `main`
- [ ] `.gitignore`, `.env.example`, `README.md`
- [ ] Khởi tạo Next.js 14 project:
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] Cài dependencies:
  ```bash
  npm install prisma @prisma/client zod react-hook-form @hookform/resolvers
  npm install @sendgrid/mail @aws-sdk/client-s3 jsonwebtoken bcryptjs
  npm install lucide-react clsx tailwind-merge
  npm install -D @types/jsonwebtoken @types/bcryptjs vitest playwright
  ```
- [ ] Setup Prisma: `npx prisma init`
- [ ] Chạy migration đầu tiên
- [ ] Setup GitHub Actions (lint + test + deploy to Vercel)
- [ ] Cài Sentry SDK

### 🎨 Thiết Kế

- [ ] Wireframe low-fidelity (Figma): trang chủ, dịch vụ, liên hệ, tuyển dụng
- [ ] Mockup high-fidelity: trang chủ (desktop + mobile)
- [ ] Mockup: trang dịch vụ chi tiết
- [ ] Mockup: trang liên hệ
- [ ] Xác nhận: color palette, typography, spacing
- [ ] Chuẩn bị assets: logo (SVG + PNG), favicon set
- [ ] **Review & phê duyệt design với stakeholder** ← Gate trước khi code

### 📋 Cấu Hình Tailwind & Design Tokens

- [ ] Cập nhật `tailwind.config.ts` (theo `02-design-system.md`)
- [ ] Tạo `globals.css` với CSS variables
- [ ] Cài Google Fonts: `Be Vietnam Pro` (400, 500, 600, 700)
- [ ] Setup path alias: `@/` → `./src/`

---

## Definition of Done ✅

- [ ] `npm run dev` chạy không lỗi
- [ ] `npm run build` thành công
- [ ] Database connect được từ local
- [ ] Push lên GitHub, CI pipeline xanh
- [ ] Staging URL accessible (Vercel preview)
- [ ] Design file được phê duyệt
