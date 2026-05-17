'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { mainNav } from '@/lib/navigation'
import { Button } from '@/components/ui/Button'
import * as Icons from 'lucide-react'
import { clsx } from 'clsx'

const serviceMeta: Record<string, { desc: string; icon: string }> = {
  'Bảo Vệ Nhà Máy': { desc: 'Kiểm soát an ninh kho bãi & phân xưởng', icon: 'Factory' },
  'Bảo Vệ Sự Kiện': { desc: 'An ninh lễ hội, liveshow & VIP', icon: 'Shield' },
  'Bảo Vệ Tòa Nhà': { desc: 'Kiểm soát cao ốc, chung cư & văn phòng', icon: 'Building' },
  'Bảo Vệ Ngân Hàng': { desc: 'Phương án bảo vệ quầy giao dịch & ATM', icon: 'Landmark' },
  'Bảo Vệ Bệnh Viện': { desc: 'Ngăn bạo lực y tế, bảo vệ bác sĩ', icon: 'Hospital' },
  'Bảo Vệ Nhà Hàng / Siêu Thị': { desc: 'Trông xe thực khách, lịch sự chu đáo', icon: 'Utensils' },
  'Bảo Vệ Trường Học': { desc: 'An ninh học đường mầm non & đại học', icon: 'GraduationCap' },
  'Bảo Vệ Ngày Tết': { desc: 'Trông giữ nhà riêng, biệt thự dịp Tết', icon: 'Sparkles' },
  'Bảo Vệ Công Trường': { desc: 'Kiểm soát vật tư xây dựng & kho bãi', icon: 'HardHat' },
  'Bảo Vệ Khu Công Nghiệp': { desc: 'Đội tuần tra cơ động vòng ngoài KCN', icon: 'Warehouse' },
  'Bảo Vệ Áp Tải Tiền': { desc: 'Xe chuyên dụng vận chuyển tiền & vàng', icon: 'Coins' },
  'Bảo Vệ Yếu Nhân / VIP': { desc: 'Cận vệ trung thành, võ thuật tinh nhuệ', icon: 'UserCheck' }
}

function ServiceNavIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name]
  if (IconComponent) {
    return <IconComponent className={className} />
  }
  return <Icons.Shield className={className} />
}

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({})
  const pathname = usePathname()

  // Track scrolling to apply shadow
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Toggle expanded submenus on mobile
  const toggleMobileSubmenu = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const [prevPathname, setPrevPathname] = React.useState(pathname)

  // Close mobile menu on path changes using official React render synchronization
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header
        className={clsx(
          'sticky top-0 z-40 w-full transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-md py-3 text-secondary'
            : 'bg-white py-4 text-secondary'
        )}
      >
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <Icons.Shield className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg md:text-xl leading-none text-secondary tracking-tight">
                LONG VIỆT
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary mt-0.5 leading-none">
                Security
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {mainNav.map((item) => (
              <div key={item.label} className="relative group/nav">
                <Link
                  href={item.href}
                  className={clsx(
                    'font-medium text-sm hover:text-primary transition-colors duration-150 py-2 flex items-center gap-1.5',
                    pathname === item.href || (item.children?.some(child => pathname === child.href))
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-secondary'
                  )}
                >
                  {item.label}
                  {item.children && <Icons.ChevronDown className="w-4 h-4 text-gray-400 group-hover/nav:rotate-180 transition-transform duration-200" />}
                </Link>

                {/* Submenu Dropdown or Mega Menu */}
                {item.children && (
                  item.label === 'Dịch Vụ' ? (
                    // BEAUTIFUL 3-COLUMN MEGA MENU FOR DỊCH VỤ
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[900px] bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                      <div className="grid grid-cols-3 gap-6 text-left">
                        {/* Column 1 */}
                        <div className="flex flex-col gap-3">
                          {item.children.slice(0, 4).map((child) => {
                            const meta = serviceMeta[child.label] || { desc: '', icon: 'Shield' }
                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                className="group/item flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-150"
                              >
                                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-150 shrink-0">
                                  <ServiceNavIcon name={meta.icon} className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm text-secondary group-hover/item:text-primary transition-colors line-clamp-1">
                                    {child.label}
                                  </span>
                                  <span className="text-[11px] text-gray-400 font-light mt-0.5 line-clamp-1">
                                    {meta.desc}
                                  </span>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                        {/* Column 2 */}
                        <div className="flex flex-col gap-3">
                          {item.children.slice(4, 8).map((child) => {
                            const meta = serviceMeta[child.label] || { desc: '', icon: 'Shield' }
                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                className="group/item flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-150"
                              >
                                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-150 shrink-0">
                                  <ServiceNavIcon name={meta.icon} className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm text-secondary group-hover/item:text-primary transition-colors line-clamp-1">
                                    {child.label}
                                  </span>
                                  <span className="text-[11px] text-gray-400 font-light mt-0.5 line-clamp-1">
                                    {meta.desc}
                                  </span>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                        {/* Column 3 */}
                        <div className="flex flex-col gap-3">
                          {item.children.slice(8, 12).map((child) => {
                            const meta = serviceMeta[child.label] || { desc: '', icon: 'Shield' }
                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                className="group/item flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-150"
                              >
                                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all duration-150 shrink-0">
                                  <ServiceNavIcon name={meta.icon} className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm text-secondary group-hover/item:text-primary transition-colors line-clamp-1">
                                    {child.label}
                                  </span>
                                  <span className="text-[11px] text-gray-400 font-light mt-0.5 line-clamp-1">
                                    {meta.desc}
                                  </span>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                      
                      {/* Footer Section in Mega Menu */}
                      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                        <span className="text-xs text-gray-500 font-medium">Bảo vệ Long Việt - Đối tác tin cậy vững bước tương lai</span>
                        <Link
                          href="/dich-vu"
                          className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                        >
                          <span>Xem tất cả dịch vụ</span>
                          <Icons.ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    // STANDARD SUBMENU DROPDOWN FOR OTHER ITEMS
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-white border border-gray-100 rounded-xl shadow-xl py-3 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                      <div className="grid gap-1 px-2 text-left">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={clsx(
                              'px-4 py-2 text-sm rounded-lg hover:bg-gray-50 hover:text-primary transition-all',
                              pathname === child.href
                                ? 'text-primary bg-primary/5 font-semibold'
                                : 'text-secondary'
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
          </nav>

          {/* Right Action Widgets */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:0923840999"
              className="flex items-center gap-2 text-primary hover:text-primary-dark font-bold transition-all duration-150"
            >
              <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <Icons.Phone className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted leading-none font-medium text-left">Hotline 24/7</span>
                <span className="text-sm font-bold tracking-tight">0923 840 999</span>
              </div>
            </a>

            <Link href="/#quote-form" scroll={true}>
              <Button variant="primary" size="sm" className="shadow-md shadow-primary/20">
                Báo Giá Ngay
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburguer Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-secondary hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open mobile menu"
          >
            <Icons.Menu className="w-6 h-6" />
          </button>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={clsx(
          'fixed inset-0 z-50 lg:hidden transition-all duration-300 pointer-events-none',
          isMobileMenuOpen ? 'pointer-events-auto' : ''
        )}
      >
        {/* Dark Backdrop */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className={clsx(
            'absolute inset-0 bg-black/60 transition-opacity duration-300',
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        />

        {/* Sliding Panel */}
        <div
          className={clsx(
            'absolute top-0 right-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          {/* Panel Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Icons.Shield className="w-4.5 h-4.5" />
              </div>
              <span className="font-heading font-bold text-base leading-none text-secondary">
                LONG VIỆT SECURITY
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Icons.X className="w-5.5 h-5.5" />
            </button>
          </div>

          {/* Panel Links */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {mainNav.map((item) => (
              <div key={item.label} className="border-b border-gray-50 pb-2 mb-2 last:border-0 last:pb-0 last:mb-0">
                {item.children ? (
                  <div>
                    <button
                      onClick={() => toggleMobileSubmenu(item.label)}
                      className="w-full flex items-center justify-between font-semibold py-2 text-secondary hover:text-primary transition-all text-left"
                    >
                      {item.label}
                      <Icons.ChevronDown
                        className={clsx(
                          'w-4 h-4 text-gray-400 transition-transform duration-200',
                          expandedItems[item.label] ? 'rotate-180 text-primary' : ''
                        )}
                      />
                    </button>
                    <div
                      className={clsx(
                        'pl-4 grid gap-1 overflow-hidden transition-all duration-200',
                        expandedItems[item.label] ? 'max-h-[420px] py-2' : 'max-h-0'
                      )}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={clsx(
                            'py-2 text-sm hover:text-primary transition-all block text-left',
                            pathname === child.href ? 'text-primary font-bold' : 'text-gray-600'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      'font-semibold py-2 hover:text-primary transition-all block text-left',
                      pathname === item.href ? 'text-primary font-bold' : 'text-secondary'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Panel Footer */}
          <div className="p-4 border-t border-gray-100 flex flex-col gap-4 bg-gray-50">
            <a
              href="tel:0923840999"
              className="flex items-center justify-center gap-2.5 bg-primary/5 hover:bg-primary/10 text-primary py-3 rounded-xl font-bold transition-all"
            >
              <Icons.Phone className="w-4.5 h-4.5" />
              <span>Gọi Hotline: 0923 840 999</span>
            </a>
            <Link href="/#quote-form" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" size="md" className="w-full shadow-lg shadow-primary/25">
                Báo Giá Ngay
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </>
  )
}
