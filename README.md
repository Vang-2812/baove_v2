# 🛡️ Website Công Ty Dịch Vụ Bảo Vệ Long Việt - Phase 0 Complete

Chào mừng đến với hệ thống mã nguồn của **Website Bảo Vệ Long Việt** (phiên bản 2.0). Đây là dự án website doanh nghiệp kết hợp tuyển dụng trực tuyến, được phát triển theo mô hình B2B hiện đại, tối ưu hóa SEO và hiệu năng vượt trội.

---

## ⚡ Tech Stack & Kiến Trúc Hệ Thống

| Phân hệ | Công nghệ tích hợp |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) / Next.js 16 (Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + CSS Variables (Design Tokens) |
| **Database ORM** | Prisma 7.8.0 |
| **Database Driver** | PostgreSQL 15 + node-postgres (`pg` Pool adapter) |
| **Validations** | Zod + React Hook Form |
| **UI Icons** | Lucide React |

---

## 📂 Cấu Trúc Thư Mục Dự Án

```text
/
├── .github/workflows/          # CI/CD GitHub Actions Pipeline
├── doc/                        # Tài liệu đặc tả kỹ thuật chi tiết (Markdown)
├── prisma/
│   └── schema.prisma           # Cấu trúc Database Schema (PostgreSQL)
├── src/
│   ├── app/                    # Next.js App Router (Layouts & Pages)
│   │   ├── globals.css         # Custom Design Tokens & Tailwind CSS Imports
│   │   ├── layout.tsx          # Root Layout & Google Font Config
│   │   ├── page.tsx            # Trang chủ chào mừng (Infrastructure Status)
│   │   └── robots.ts           # Dynamic Robots.txt
│   ├── components/
│   │   ├── ui/                 # Reusable UI Components
│   │   │   └── Button.tsx      # Button Component (Design System)
│   │   └── seo/
│   │       └── JsonLd.tsx      # JSON-LD Schema markup component
│   └── lib/
│       └── db.ts               # Database client helper (Prisma 7 compatible)
├── .env.example                # Bản mẫu cấu hình biến môi trường
├── tailwind.config.ts          # Tailwind config (optional, styled via CSS V4)
└── tsconfig.json               # Cấu hình TypeScript
```

---

## 🚀 Hướng Dẫn Thiết Lập Môi Trường Local

### 1. Cài đặt Dependencies
Chạy lệnh sau tại thư mục gốc để tải toàn bộ thư viện:
```bash
npm install
```

### 2. Thiết lập Biến Môi Trường (.env)
1. Copy file `.env.example` thành `.env`:
   ```bash
   cp .env.example .env
   ```
2. Mở file `.env` và cập nhật thông số kết nối cơ sở dữ liệu PostgreSQL của bạn:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/baove_longviet?schema=public"
   ```

### 3. Đồng bộ Database & Sinh Prisma Client
Sau khi đã thiết lập connection string trong `.env` và đảm bảo PostgreSQL đã khởi chạy, tiến hành tạo cấu trúc bảng:
```bash
# Đồng bộ schema lên database local
npx prisma db push

# Hoặc tạo lịch sử migration
npx prisma migrate dev --name init
```

### 4. Chạy Dự Án Môi Trường Development
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) trên trình duyệt để kiểm tra trang Welcome của Phase 0.

### 5. Kiểm tra & Build Production
Để kiểm tra lỗi cú pháp và đóng gói ứng dụng:
```bash
# Kiểm tra lỗi linter
npm run lint

# Đóng gói ứng dụng (Production Build)
npm run build
```

---

## 🤝 Các Quy Ước Phát Triển (Conventional Commits)
Khi tiến hành commits, vui lòng tuân thủ:
- `feat:` Thêm một tính năng mới (Ví dụ: `feat: add ContactForm component`)
- `fix:` Sửa lỗi (Ví dụ: `fix: button layout shift on mobile`)
- `docs:` Thay đổi tài liệu (Ví dụ: `docs: update deployment instructions`)
- `style:` Thay đổi format/style không ảnh hưởng logic code
- `chore:` Thay đổi công cụ cấu hình hệ thống (Ví dụ: `chore: update dependencies`)

---

🛡️ **Long Việt Security** - *Bảo Vệ Chuyên Nghiệp – An Toàn Tuyệt Đối*
