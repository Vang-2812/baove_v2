# 02 – DESIGN SYSTEM

> **Dùng khi:** Viết CSS/Tailwind, tạo component UI, config theme.

---

## Color Tokens

```css
/* globals.css */
:root {
  --color-primary      : #C0392B;
  --color-primary-dark : #96281B;
  --color-primary-light: #E74C3C;
  --color-secondary    : #2C3E50;
  --color-secondary-dark: #1A252F;
  --color-accent       : #E74C3C;
  --color-bg           : #FFFFFF;
  --color-bg-light     : #F2F2F2;
  --color-bg-dark      : #1A252F;
  --color-text         : #333333;
  --color-text-muted   : #777777;
  --color-border       : #E0E0E0;
  --color-success      : #27AE60;
  --color-error        : #E74C3C;
  --color-warning      : #F39C12;
}
```

## Tailwind Config

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#C0392B', dark: '#96281B', light: '#E74C3C' },
        secondary: { DEFAULT: '#2C3E50', dark: '#1A252F' },
        accent: '#E74C3C',
        'bg-light': '#F2F2F2',
        'bg-dark': '#1A252F',
        'text-muted': '#777777',
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'Roboto', 'sans-serif'],
        heading: ['Be Vietnam Pro', 'sans-serif'],
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1'  : ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2'  : ['28px', { lineHeight: '1.4', fontWeight: '600' }],
        'h3'  : ['22px', { lineHeight: '1.5', fontWeight: '600' }],
        'h4'  : ['18px', { lineHeight: '1.5', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.7' }],
        'sm'  : ['14px', { lineHeight: '1.6' }],
      },
      spacing: {
        'section': '80px',
        'section-sm': '48px',
      },
      borderRadius: { card: '8px', btn: '4px' },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.15)',
      },
    },
  },
}
```

---

## Typography Scale

| Token | Size | Weight | Dùng cho |
|-------|------|--------|---------|
| `.text-hero` | 48px | 700 | Hero headline |
| `.text-h1` | 36px | 700 | Page title |
| `.text-h2` | 28px | 600 | Section heading |
| `.text-h3` | 22px | 600 | Subsection heading |
| `.text-h4` | 18px | 600 | Card title |
| `.text-body` | 16px | 400 | Nội dung chính |
| `.text-sm` | 14px | 400 | Caption, label, meta |

---

## Button Components

```tsx
// components/ui/Button.tsx
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size    = 'sm' | 'md' | 'lg'

// Variants (Tailwind classes):
const variants = {
  primary  : 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  outline  : 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  ghost    : 'text-primary hover:bg-primary/10',
}
const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-body',
  lg: 'px-8 py-4 text-h4',
}
// Base: rounded-btn font-semibold transition-all duration-200 inline-flex items-center gap-2
```

---

## Card Components

```tsx
// Service Card
// - Wrapper  : rounded-card shadow-card hover:shadow-card-hover transition-all overflow-hidden
// - Image    : w-full h-48 object-cover
// - Body     : p-5
// - Title    : text-h4 font-semibold text-secondary mb-2
// - Excerpt  : text-sm text-text-muted mb-4 line-clamp-2
// - CTA Link : text-primary font-semibold hover:underline flex items-center gap-1

// News Card
// - Wrapper  : rounded-card shadow-card overflow-hidden group
// - Image    : w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300
// - Meta     : text-sm text-text-muted mb-1 (ngày, danh mục)
// - Title    : text-h4 font-semibold text-secondary line-clamp-2 hover:text-primary
// - Excerpt  : text-sm text-text-muted line-clamp-3

// Job Card
// - Wrapper  : rounded-card border border-border p-5 hover:border-primary transition-colors
// - Title    : text-h4 font-semibold text-secondary
// - Tags     : flex gap-2 (địa bàn, loại)
// - Badge    : text-xs bg-green-100 text-green-700 rounded-full px-3 py-1 ("Đang tuyển")
// - CTA      : Button variant=outline size=sm
```

---

## Form Elements

```tsx
// Input base classes:
// w-full px-4 py-3 border border-border rounded-btn text-body
// focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
// placeholder:text-text-muted transition-colors

// Textarea: same + resize-y min-h-[120px]

// Select: same + appearance-none bg-[url('/icons/chevron.svg')] bg-no-repeat bg-right-3

// Label: block text-sm font-medium text-secondary mb-1

// Error message: text-sm text-error mt-1 flex items-center gap-1
// Success state: border-success focus:ring-success/30

// File upload zone:
// border-2 border-dashed border-border rounded-card p-8 text-center
// hover:border-primary cursor-pointer transition-colors
```

---

## Section Layout Pattern

```tsx
// Mọi section trang chủ dùng pattern này:
<section className="py-section bg-{color}">
  <div className="container mx-auto px-4 max-w-7xl">
    {/* Section Header */}
    <div className="text-center mb-12">
      <span className="text-primary text-sm font-semibold uppercase tracking-widest">
        {eyebrow}
      </span>
      <h2 className="text-h1 text-secondary mt-2">{title}</h2>
      <p className="text-body text-text-muted mt-3 max-w-2xl mx-auto">{subtitle}</p>
    </div>
    {/* Content */}
    {children}
  </div>
</section>
```

---

## Responsive Breakpoints

| Breakpoint | Class | Width |
|-----------|-------|-------|
| Mobile | (default) | < 640px |
| SM | `sm:` | ≥ 640px |
| MD | `md:` | ≥ 768px |
| LG | `lg:` | ≥ 1024px |
| XL | `xl:` | ≥ 1280px |
| 2XL | `2xl:` | ≥ 1440px |

**Grid patterns:**
- Service cards: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- News cards: `grid grid-cols-1 md:grid-cols-3`
- 2-column layout: `grid grid-cols-1 lg:grid-cols-2`

---

## Floating / Fixed Elements

```tsx
// Hotline button (mobile bottom-right)
// fixed bottom-20 right-4 z-50 bg-primary text-white rounded-full p-4 shadow-lg
// animate-bounce (hoặc pulse)

// Zalo widget
// fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full overflow-hidden shadow-lg

// Sticky header
// sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm transition-shadow

// Back to top
// fixed bottom-20 right-4 z-40 bg-secondary text-white rounded-full p-3
// opacity-0 translate-y-4 transition-all (hiện khi scroll > 400px)
```

---

## Animation Classes

```css
/* Counter animation – dùng với Intersection Observer */
.counter { transition: all 2s ease-out; }

/* Fade in up khi scroll */
.fade-in-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Card hover scale */
.card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.card-hover:hover { transform: translateY(-4px); }
```

---

## Icon Library

Dùng **Lucide React** (`lucide-react`) cho toàn bộ icon:

```tsx
import { Shield, Phone, Mail, MapPin, ChevronRight,
         Menu, X, Search, ArrowUp, CheckCircle,
         Users, Building, Award, Clock } from 'lucide-react'
```

Dùng **Font Awesome** (CDN) cho social icons nếu cần logo Facebook/Zalo/YouTube.

---

## Component Checklist

| Component | Mô tả | Priority |
|-----------|-------|---------|
| `Button` | Primary, secondary, outline, ghost, sizes | P0 |
| `Header` | Logo, nav, hotline, mobile menu | P0 |
| `Footer` | Links, address, social, copyright | P0 |
| `HeroBanner` | Slider hoặc tĩnh, headline, CTA | P0 |
| `ServiceCard` | Ảnh, title, excerpt, link | P0 |
| `QuoteForm` | Form báo giá inline | P0 |
| `ContactForm` | Form liên hệ đầy đủ | P0 |
| `StatCounter` | 4 số liệu + animation | P1 |
| `MegaMenu` | Dropdown multi-column | P1 |
| `Breadcrumb` | Điều hướng phân cấp | P1 |
| `NewsCard` | Ảnh, meta, title, excerpt | P1 |
| `PriceTable` | Bảng giá 3 nhóm | P1 |
| `Timeline` | Quy trình / lịch sử | P1 |
| `Accordion` | FAQ expand/collapse | P1 |
| `TabPanel` | Tab content switcher | P2 |
| `Carousel` | Partner logos, testimonials | P2 |
| `JobCard` | Vị trí tuyển dụng | P2 |
| `ApplyForm` | Form ứng tuyển + upload CV | P2 |
| `Toast` | Thông báo success/error | P1 |
| `Skeleton` | Loading placeholder | P2 |
