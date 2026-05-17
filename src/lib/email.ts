import sgMail from '@sendgrid/mail'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@baovelongviet.vn'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@baovelongviet.vn'

if (SENDGRID_API_KEY && SENDGRID_API_KEY.startsWith('SG.')) {
  sgMail.setApiKey(SENDGRID_API_KEY)
} else {
  console.warn('⚠️ SendGrid API key is missing or invalid. Emails will be logged to console instead.')
}

const FROM = { email: FROM_EMAIL, name: 'Long Việt Security' }

// Helper to format Vietnamese Service Type slug into human-readable label
function formatServiceType(slug?: string | null): string {
  if (!slug) return 'Không xác định'
  const services: Record<string, string> = {
    'bao-ve-nha-may': 'Bảo vệ nhà máy',
    'bao-ve-su-kien': 'Bảo vệ sự kiện',
    'bao-ve-toa-nha': 'Bảo vệ tòa nhà / văn phòng',
    'bao-ve-ngan-hang': 'Bảo vệ ngân hàng',
    'bao-ve-benh-vien': 'Bảo vệ bệnh viện',
    'bao-ve-nha-hang': 'Bảo vệ nhà hàng / siêu thị',
    'bao-ve-truong-hoc': 'Bảo vệ trường học',
    'bao-ve-ngay-tet': 'Bảo vệ ngày Tết',
    'bao-ve-cong-truong': 'Bảo vệ công trường',
    'bao-ve-khu-cong-nghiep': 'Bảo vệ khu công nghiệp',
    'bao-ve-ap-tai-tien': 'Bảo vệ áp tải tiền',
    'bao-ve-yeu-nhan': 'Bảo vệ yếu nhân / VIP',
    'khac': 'Dịch vụ khác',
  }
  return services[slug] || slug
}

// ─────────────────────────────────────────
// TYPE & INTERFACE DEFINITIONS
// ─────────────────────────────────────────

export interface ContactEmailInput {
  id: string
  name: string
  phone: string
  email?: string | null
  province?: string | null
  service_type?: string | null
  message: string
  source?: string | null
  created_at: Date
}

// ─────────────────────────────────────────
// TEMPLATE RENDERS
// ─────────────────────────────────────────

function renderLeadNotification(contact: ContactEmailInput): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #C0392B; border-bottom: 2px solid #C0392B; padding-bottom: 10px; margin-top: 0;">Có yêu cầu báo giá mới!</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; width: 150px; border-bottom: 1px solid #eee;">Họ tên:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Số điện thoại:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${contact.phone}">${contact.phone}</a></td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.email || 'Không cung cấp'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Dịch vụ:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #2C3E50;">${formatServiceType(contact.service_type)}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Tỉnh/Thành:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${contact.province || 'Không cung cấp'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Nội dung:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${contact.message}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Nguồn gửi:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-transform: uppercase;">${contact.source || 'Trang chủ'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Thời gian:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(contact.created_at).toLocaleString('vi-VN')}</td>
        </tr>
      </table>
      <div style="margin-top: 30px; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://baovelongviet.vn'}/admin/contacts/${contact.id}" 
           style="background-color: #2C3E50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Xem chi tiết trong Admin
        </a>
      </div>
    </div>
  `
}

function renderLeadConfirmation(contact: ContactEmailInput): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; border-bottom: 2px solid #C0392B; padding-bottom: 15px;">
        <h2 style="color: #C0392B; margin: 0;">Long Việt Security</h2>
        <p style="color: #777; margin: 5px 0 0 0; font-size: 14px;">Bảo Vệ Chuyên Nghiệp – An Toàn Tuyệt Đối</p>
      </div>
      <p style="font-size: 16px; margin-top: 20px;">Xin chào <strong>${contact.name}</strong>,</p>
      <p>Chúng tôi đã nhận được yêu cầu báo giá của bạn về dịch vụ <strong>${formatServiceType(contact.service_type)}</strong>.</p>
      <p>Đội ngũ chuyên viên tư vấn của Long Việt Security đã tiếp nhận thông tin và sẽ chủ động liên hệ trực tiếp với bạn trong vòng <strong>24 giờ làm việc</strong> để khảo sát và báo giá chi tiết.</p>
      
      <div style="background-color: #f2f2f2; padding: 15px; border-radius: 6px; margin: 25px 0;">
        <h4 style="margin-top: 0; color: #2C3E50;">Thông tin yêu cầu đã gửi:</h4>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
          <li><strong>Dịch vụ:</strong> ${formatServiceType(contact.service_type)}</li>
          <li><strong>Số điện thoại:</strong> ${contact.phone}</li>
          <li><strong>Nội dung cần hỗ trợ:</strong> ${contact.message}</li>
        </ul>
      </div>

      <p>Nếu bạn cần hỗ trợ hoặc tư vấn phương án khẩn cấp, vui lòng liên hệ trực tiếp qua số Hotline của chúng tôi:</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="tel:0923840999" style="background-color: #C0392B; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 18px; display: inline-block;">
          📞 Gọi Hotline: 0923 840 999
        </a>
      </div>
      <p style="color: #777; font-size: 13px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px; text-align: center;">
        Trân trọng,<br/>
        <strong>Công Ty Dịch Vụ Bảo Vệ Long Việt</strong><br/>
        Địa chỉ: B23 Khu Dân Cư Nam Long, P. Phú Thuận, Q7, TP. HCM<br/>
        Website: <a href="https://baovelongviet.vn" style="color: #C0392B;">baovelongviet.vn</a>
      </p>
    </div>
  `
}

// ─────────────────────────────────────────
// EXPORTED EMAIL FUNCTIONS
// ─────────────────────────────────────────

export async function sendLeadNotification(contact: ContactEmailInput) {
  const html = renderLeadNotification(contact)
  const mailOptions = {
    to: ADMIN_EMAIL,
    from: FROM,
    subject: `[Báo Giá] Yêu cầu mới từ ${contact.name} – ${formatServiceType(contact.service_type)}`,
    html,
  }

  if (SENDGRID_API_KEY && SENDGRID_API_KEY.startsWith('SG.')) {
    try {
      await sgMail.send(mailOptions)
      console.log(`✉️ Admin notification email sent successfully for Lead ID: ${contact.id}`)
    } catch (error) {
      console.error('❌ Error sending admin email via SendGrid:', error)
    }
  } else {
    console.log('--- [MOCK EMAIL: ADMIN NOTIFICATION] ---')
    console.log(`To: ${ADMIN_EMAIL}`)
    console.log(`Subject: ${mailOptions.subject}`)
    console.log('Content (HTML Snippet):')
    console.log(html.substring(0, 500) + '...')
    console.log('----------------------------------------')
  }
}

export async function sendLeadConfirmation(contact: ContactEmailInput) {
  if (!contact.email) return

  const html = renderLeadConfirmation(contact)
  const mailOptions = {
    to: contact.email,
    from: FROM,
    subject: `Long Việt Security – Đã nhận yêu cầu báo giá của bạn`,
    html,
  }

  if (SENDGRID_API_KEY && SENDGRID_API_KEY.startsWith('SG.')) {
    try {
      await sgMail.send(mailOptions)
      console.log(`✉️ Confirmation email sent successfully to ${contact.email}`)
    } catch (error) {
      console.error('❌ Error sending confirmation email via SendGrid:', error)
    }
  } else {
    console.log('--- [MOCK EMAIL: USER CONFIRMATION] ---')
    console.log(`To: ${contact.email}`)
    console.log(`Subject: ${mailOptions.subject}`)
    console.log('Content (HTML Snippet):')
    console.log(html.substring(0, 500) + '...')
    console.log('----------------------------------------')
  }
}

// ─────────────────────────────────────────
// APPLICATIONS EMAIL FUNCTIONS
// ─────────────────────────────────────────

export interface ApplicationEmailInput {
  id: string
  name: string
  phone: string
  email: string
  experience_years?: number | null
  preferred_location?: string | null
  note?: string | null
  cv_file?: string | null
  created_at: Date
}

export interface JobEmailInput {
  title: string
}

function renderApplicationNotification(app: ApplicationEmailInput, job: JobEmailInput): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2C3E50; border-bottom: 2px solid #2C3E50; padding-bottom: 10px; margin-top: 0;">Hồ sơ ứng tuyển mới!</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; width: 180px; border-bottom: 1px solid #eee;">Họ tên:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${app.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Vị trí ứng tuyển:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #C0392B;">${job.title}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Số điện thoại:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${app.phone}">${app.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${app.email}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Kinh nghiệm:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${app.experience_years !== undefined && app.experience_years !== null ? `${app.experience_years} năm` : 'Không xác định'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Địa điểm mong muốn:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${app.preferred_location || 'Chưa cung cấp'}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">File CV ứng tuyển:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${app.cv_file ? `<a href="${app.cv_file}" target="_blank" style="color: #C0392B; font-weight: bold;">Tải về file CV (PDF)</a>` : 'Không tải lên CV'}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Ghi chú:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; white-space: pre-wrap;">${app.note || 'Không có'}</td>
        </tr>
        <tr style="background-color: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Thời gian:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${new Date(app.created_at).toLocaleString('vi-VN')}</td>
        </tr>
      </table>
      <div style="margin-top: 30px; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://baovelongviet.vn'}/admin/applications" 
           style="background-color: #2C3E50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
          Xem ứng viên trong Admin
        </a>
      </div>
    </div>
  `
}

function renderApplicationConfirmation(app: ApplicationEmailInput, job: JobEmailInput): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; border-bottom: 2px solid #C0392B; padding-bottom: 15px;">
        <h2 style="color: #C0392B; margin: 0;">Long Việt Security</h2>
        <p style="color: #777; margin: 5px 0 0 0; font-size: 14px;">Tuyển Dụng Lực Lượng Vệ Sĩ Tinh Nhuệ</p>
      </div>
      <p style="font-size: 16px; margin-top: 20px;">Kính gửi anh/chị <strong>${app.name}</strong>,</p>
      <p>Long Việt Security xin chân thành cảm ơn sự quan tâm của anh/chị đối với vị trí tuyển dụng <strong>${job.title}</strong>.</p>
      <p>Chúng tôi đã tiếp nhận thành công hồ sơ đăng ký ứng tuyển của anh/chị trên hệ thống Website. Bộ phận Nhân sự (HR) hiện đang tiến hành phân loại và xét duyệt hồ sơ.</p>
      
      <div style="background-color: #f2f2f2; padding: 15px; border-radius: 6px; margin: 25px 0;">
        <h4 style="margin-top: 0; color: #2C3E50;">Thông tin ứng tuyển của bạn:</h4>
        <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0; line-height: 1.6;">
          <li><strong>Vị trí:</strong> ${job.title}</li>
          <li><strong>Số điện thoại:</strong> ${app.phone}</li>
          <li><strong>Email:</strong> ${app.email}</li>
          <li><strong>Địa điểm mong muốn làm việc:</strong> ${app.preferred_location || 'Tự do phân phối'}</li>
        </ul>
      </div>

      <p>Quy trình xét duyệt hồ sơ của chúng tôi thường mất từ <strong>3 đến 5 ngày làm việc</strong>. Nếu hồ sơ của anh/chị đáp ứng các tiêu chuẩn nghiệp vụ an ninh của Long Việt, chuyên viên tuyển dụng sẽ chủ động liên hệ trực tiếp qua điện thoại để xếp lịch phỏng vấn.</p>
      
      <p>Nếu cần trao đổi hoặc có câu hỏi gấp, xin vui lòng liên hệ phòng nhân sự của chúng tôi qua Hotline Tuyển Dụng:</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="tel:0923840999" style="background-color: #C0392B; color: white; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 18px; display: inline-block;">
          📞 Hotline Tuyển Dụng: 0923 840 999
        </a>
      </div>

      <p style="color: #777; font-size: 13px; border-top: 1px solid #eee; padding-top: 15px; margin-top: 30px; text-align: center;">
        Trân trọng,<br/>
        <strong>Công Ty Dịch Vụ Bảo Vệ Long Việt - Phòng Nhân Sự</strong><br/>
        Địa chỉ: B23 Khu Dân Cư Nam Long, P. Phú Thuận, Q7, TP. HCM<br/>
        Website: <a href="https://baovelongviet.vn" style="color: #C0392B;">baovelongviet.vn</a>
      </p>
    </div>
  `
}

export async function sendApplicationNotification(app: ApplicationEmailInput, job: JobEmailInput) {
  const html = renderApplicationNotification(app, job)
  const mailOptions = {
    to: ADMIN_EMAIL,
    from: FROM,
    subject: `[Ứng Tuyển] Hồ sơ mới từ ${app.name} – Vị trí: ${job.title}`,
    html,
  }

  if (SENDGRID_API_KEY && SENDGRID_API_KEY.startsWith('SG.')) {
    try {
      await sgMail.send(mailOptions)
      console.log(`✉️ HR application notification email sent successfully for App ID: ${app.id}`)
    } catch (error) {
      console.error('❌ Error sending HR application email via SendGrid:', error)
    }
  } else {
    console.log('--- [MOCK EMAIL: HR NOTIFICATION] ---')
    console.log(`To: ${ADMIN_EMAIL}`)
    console.log(`Subject: ${mailOptions.subject}`)
    console.log('Content (HTML Snippet):')
    console.log(html.substring(0, 500) + '...')
    console.log('----------------------------------------')
  }
}

export async function sendApplicationConfirmation(app: ApplicationEmailInput, job: JobEmailInput) {
  const html = renderApplicationConfirmation(app, job)
  const mailOptions = {
    to: app.email,
    from: FROM,
    subject: `Long Việt Security – Xác nhận tiếp nhận hồ sơ ứng tuyển vị trí ${job.title}`,
    html,
  }

  if (SENDGRID_API_KEY && SENDGRID_API_KEY.startsWith('SG.')) {
    try {
      await sgMail.send(mailOptions)
      console.log(`✉️ Application confirmation email sent successfully to ${app.email}`)
    } catch (error) {
      console.error('❌ Error sending confirmation email via SendGrid:', error)
    }
  } else {
    console.log('--- [MOCK EMAIL: CANDIDATE CONFIRMATION] ---')
    console.log(`To: ${app.email}`)
    console.log(`Subject: ${mailOptions.subject}`)
    console.log('Content (HTML Snippet):')
    console.log(html.substring(0, 500) + '...')
    console.log('----------------------------------------')
  }
}
