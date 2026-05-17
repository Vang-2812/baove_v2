import { z } from 'zod'

// Vietnamese phone number regex format: 10 digits starting with 0 or +84
const isValidVnPhone = (phone: string) => {
  const clean = phone.replace(/[\s.-]/g, '')
  return /^(0|\+84)(3[2-9]|5[6-9]|7[06-9]|8[0-9]|9[0-9])[0-9]{7}$/.test(clean)
}

export const ContactSchema = z.object({
  name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone: z.string().refine(isValidVnPhone, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  province: z.string().optional(),
  service_type: z.string().optional(),
  title: z.string().optional(),
  message: z.string().min(10, 'Nội dung tối thiểu 10 ký tự'),
  source: z.string(),
  recaptcha_token: z.string().min(1, 'reCAPTCHA token is required'),
})

export const ApplicationSchema = z.object({
  job_id: z.string().min(1, 'Vui lòng chọn vị trí ứng tuyển'),
  name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone: z.string().refine(isValidVnPhone, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  experience_years: z.number().min(0, 'Kinh nghiệm không hợp lệ').max(30, 'Kinh nghiệm không hợp lệ').optional(),
  preferred_location: z.string().optional(),
  note: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
})

export const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
})

export type ContactInput = z.infer<typeof ContactSchema>
export type ApplicationInput = z.infer<typeof ApplicationSchema>
export type LoginInput = z.infer<typeof LoginSchema>

