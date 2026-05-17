## Thông Tin Dự Án

| Thuộc tính | Giá trị |
|-----------|---------|
| **Loại dự án** | Website công ty dịch vụ bảo vệ chuyên nghiệp |
| **Tham khảo** | baovelongviet.vn |
| **Stack khuyến nghị** | Next.js 14 (frontend) + Strapi (CMS) + PostgreSQL |
| **Phiên bản** | 1.0 – Tháng 5/2026 |

---

## Danh Sách File & Mục Đích

| File | Dùng khi nào |
|------|-------------|
| `00-project-overview.md` | Hiểu bức tranh tổng thể: mục tiêu, user, phạm vi |
| `01-sitemap-and-routes.md` | Tạo routing, navigation, menu, URL config |
| `02-design-system.md` | Viết CSS, Tailwind config, component UI |
| `03-database-schema.md` | Tạo migration, model, seed data |
| `04-api-contracts.md` | Implement API endpoints, validation, type |
| `05-pages-spec.md` | Build từng trang: layout, section, props |
| `06-forms-and-lead.md` | Implement form, email, validation, file upload |
| `07-cms-admin.md` | Build trang quản trị / CMS |
| `08-seo-and-meta.md` | SEO, Schema, sitemap, robots.txt |
| `09-non-functional.md` | Performance, security, accessibility, testing |
| `phase-0-infra.md` | Checklist hạ tầng & thiết lập môi trường |
| `phase-1-mvp.md` | Sprint tasks: Landing page + form đầu tiên |
| `phase-2-services.md` | Sprint tasks: 12 trang dịch vụ + bảng giá |
| `phase-3-content.md` | Sprint tasks: Blog, giới thiệu, đối tác |
| `phase-4-recruitment.md` | Sprint tasks: Tuyển dụng + ứng tuyển online |
| `phase-5-cms.md` | Sprint tasks: CMS quản trị toàn bộ |
| `phase-6-go-live.md` | Sprint tasks: SEO, tối ưu, go-live |

---

## Hướng Dẫn Cho AI Agent

### Khi bắt đầu feature mới:
1. Đọc `00-project-overview.md` để nắm context
2. Đọc file phase tương ứng (vd: `phase-1-mvp.md`) để biết task cần làm
3. Đọc spec file liên quan (vd: `05-pages-spec.md` khi build page)

### Khi implement cụ thể:
- **Tạo component UI** → đọc `02-design-system.md`
- **Tạo API/Model** → đọc `03-database-schema.md` + `04-api-contracts.md`
- **Build page** → đọc `05-pages-spec.md`
- **Implement form** → đọc `06-forms-and-lead.md`
- **Thêm SEO** → đọc `08-seo-and-meta.md`

### Quy ước code:
- Ngôn ngữ: **TypeScript** cho toàn bộ codebase
- Component: **React functional component** + hooks
- Style: **Tailwind CSS** + CSS variables từ design system
- API: **REST** (hoặc tRPC nếu dùng Next.js fullstack)
- Tên file: `kebab-case`, tên component: `PascalCase`
- Commit message: `feat:`, `fix:`, `chore:`, `docs:` theo Conventional Commits
