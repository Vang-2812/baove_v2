export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export const mainNav: NavItem[] = [
  { label: 'Trang Chủ', href: '/' },
  {
    label: 'Giới Thiệu',
    href: '/gioi-thieu',
    children: [
      { label: 'Quá Trình Hình Thành', href: '/gioi-thieu/qua-trinh-hinh-thanh' },
      { label: 'Cơ Cấu Tổ Chức', href: '/gioi-thieu/co-cau-to-chuc' },
      { label: 'Tầm Nhìn – Sứ Mệnh', href: '/gioi-thieu/tam-nhin-su-menh' },
      { label: 'Sự Khác Biệt', href: '/gioi-thieu/su-khac-biet' },
    ],
  },
  {
    label: 'Dịch Vụ',
    href: '/dich-vu',
    children: [
      { label: 'Bảo Vệ Nhà Máy', href: '/dich-vu/bao-ve-nha-may' },
      { label: 'Bảo Vệ Sự Kiện', href: '/dich-vu/bao-ve-su-kien' },
      { label: 'Bảo Vệ Tòa Nhà', href: '/dich-vu/bao-ve-toa-nha' },
      { label: 'Bảo Vệ Ngân Hàng', href: '/dich-vu/bao-ve-ngan-hang' },
      { label: 'Bảo Vệ Bệnh Viện', href: '/dich-vu/bao-ve-benh-vien' },
      { label: 'Bảo Vệ Nhà Hàng / Siêu Thị', href: '/dich-vu/bao-ve-nha-hang' },
      { label: 'Bảo Vệ Trường Học', href: '/dich-vu/bao-ve-truong-hoc' },
      { label: 'Bảo Vệ Ngày Tết', href: '/dich-vu/bao-ve-ngay-tet' },
      { label: 'Bảo Vệ Công Trường', href: '/dich-vu/bao-ve-cong-truong' },
      { label: 'Bảo Vệ Khu Công Nghiệp', href: '/dich-vu/bao-ve-khu-cong-nghiep' },
      { label: 'Bảo Vệ Áp Tải Tiền', href: '/dich-vu/bao-ve-ap-tai-tien' },
      { label: 'Bảo Vệ Yếu Nhân / VIP', href: '/dich-vu/bao-ve-yeu-nhan' },
    ],
  },
  { label: 'Bảng Giá', href: '/bang-gia' },
  { label: 'Tuyển Dụng', href: '/tuyen-dung' },
  { label: 'Tin Tức', href: '/tin-tuc' },
  {
    label: 'Tài Liệu',
    href: '/tai-lieu',
    children: [
      { label: 'Phòng Cháy Chữa Cháy', href: '/tai-lieu#phong-chay-chua-chay' },
      { label: 'Nghiệp Vụ Bảo Vệ', href: '/tai-lieu#nghiep-vu-bao-ve' },
      { label: 'Sơ Cấp Cứu', href: '/tai-lieu#so-cap-cuu' },
      { label: 'Cứu Hộ Cứu Nạn', href: '/tai-lieu#cuu-ho-cuu-nan' },
    ],
  },
  { label: 'Hợp Tác', href: '/hop-tac' },
  { label: 'Liên Hệ', href: '/lien-he' },
]
