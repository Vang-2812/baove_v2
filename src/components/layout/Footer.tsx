import * as React from 'react'
import Link from 'next/link'
import { Shield, MapPin, Phone, Mail } from 'lucide-react'

// Custom SVG Zalo Icon to bypass FontAwesome dependencies
function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.28 13.88c-.36.72-.96 1.2-1.8 1.44-.6.18-2.64.18-4.8-.54-2.16-.72-3.84-2.16-4.92-4.2-.6-.96-.72-2.16-.36-2.88.36-.72 1.2-1.2 2.04-1.2.36 0 .72.06 1.02.24.42.24.66.72.78 1.2.24.9.48 1.62.78 2.22-.36.36-.54.78-.54 1.2 0 .42.18.84.42 1.2.66 1.02 1.68 1.8 2.76 2.16.42.12.78.12 1.08-.06.3-.18.42-.48.42-.84 0-.48-.12-.96-.3-1.44.18-.3.42-.54.78-.72.36-.18.78-.24 1.14-.12.84.24 1.56.54 2.1.84.48.3.72.78.6 1.32-.06.42-.24.78-.48 1.08z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
    </svg>
  )
}

export interface FooterProps {
  settings?: Record<string, any>
}

export function Footer({ settings = {} }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const siteName = settings.site_name || 'Long Việt Security'
  const siteNameFirst = siteName.split(' ')[0] || 'LONG VIỆT'
  const siteNameRest = siteName.split(' ').slice(1).join(' ') || 'Security'
  const hotline = settings.company_hotline || '0923 840 999'
  const hotlineTel = hotline.replace(/\s+/g, '')
  const email = settings.company_email || 'info@baovelongviet.vn'
  const address = settings.company_address || 'B23 Khu Dân Cư Nam Long, P. Phú Thuận, Quận 7, TP. Hồ Chí Minh'
  
  const facebookUrl = settings.facebook_url || 'https://facebook.com/baovelongviet'
  const zaloUrl = settings.zalo_url || 'https://zalo.me/0923840999'
  const youtubeUrl = settings.youtube_url || 'https://youtube.com/baovelongviet'

  const services = [
    { label: 'Bảo Vệ Nhà Máy', href: '/dich-vu/bao-ve-nha-may' },
    { label: 'Bảo Vệ Sự Kiện', href: '/dich-vu/bao-ve-su-kien' },
    { label: 'Bảo Vệ Tòa Nhà', href: '/dich-vu/bao-ve-toa-nha' },
    { label: 'Bảo Vệ Ngân Hàng', href: '/dich-vu/bao-ve-ngan-hang' },
    { label: 'Bảo Vệ Bệnh Viện', href: '/dich-vu/bao-ve-benh-vien' },
    { label: 'Bảo Vệ Nhà Hàng / Siêu Thị', href: '/dich-vu/bao-ve-nha-hang' },
  ]

  const links = [
    { label: 'Giới Thiệu', href: '/gioi-thieu' },
    { label: 'Bảng Giá Dịch Vụ', href: '/bang-gia' },
    { label: 'Tuyển Dụng Mới', href: '/tuyen-dung' },
    { label: 'Tin Tức & Sự Kiện', href: '/tin-tuc' },
    { label: 'Liên Hệ Trực Tiếp', href: '/lien-he' },
  ]

  return (
    <footer className="bg-secondary-dark text-gray-300 pt-16 pb-8 border-t border-white/5">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg md:text-xl leading-none text-white tracking-tight">
                  {siteNameFirst}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary mt-0.5 leading-none">
                  {siteNameRest}
                </span>
              </div>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Bảo Vệ {siteNameFirst} tự hào là đơn vị uy tín cung cấp dịch vụ bảo vệ chuyên nghiệp toàn quốc với đội ngũ nhân sự tinh nhuệ, an toàn tuyệt đối.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-primary rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                aria-label="Facebook Page"
              >
                <FacebookIcon className="w-4.5 h-4.5" />
              </a>
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-primary rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                aria-label="Zalo OA"
              >
                <ZaloIcon className="w-5 h-5" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/5 hover:bg-primary rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                aria-label="YouTube Channel"
              >
                <YoutubeIcon className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div>
            <h3 className="text-white font-heading font-bold text-base uppercase tracking-wider mb-6 border-l-4 border-primary pl-3">
              Dịch Vụ Chính
            </h3>
            <ul className="grid gap-3 text-sm">
              {services.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-primary hover:translate-x-1.5 transition-all duration-150 inline-block text-gray-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div>
            <h3 className="text-white font-heading font-bold text-base uppercase tracking-wider mb-6 border-l-4 border-primary pl-3">
              Liên Kết
            </h3>
            <ul className="grid gap-3 text-sm">
              {links.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-primary hover:translate-x-1.5 transition-all duration-150 inline-block text-gray-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-white font-heading font-bold text-base uppercase tracking-wider mb-6 border-l-4 border-primary pl-3">
              Liên Hệ
            </h3>
            <div className="flex flex-col gap-4 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  {address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href={`tel:${hotlineTel}`} className="hover:text-primary font-bold text-white transition-colors">
                  {hotline}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <span>
            © {currentYear} Công Ty Dịch Vụ Bảo Vệ {siteNameFirst}. Bảo lưu mọi quyền.
          </span>
          <span>
            Thiết kế bởi <a href="/" className="hover:text-primary transition-colors font-medium">{siteName}</a>
          </span>
        </div>

      </div>
    </footer>
  )
}
