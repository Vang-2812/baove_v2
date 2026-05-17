import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { ApplicationSchema } from '@/lib/validations'
import { uploadCV } from '@/lib/storage'
import { sendApplicationNotification, sendApplicationConfirmation } from '@/lib/email'

// reCAPTCHA verification helper
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  
  if (!secretKey || secretKey === 'recaptcha_secret_key_here') {
    console.log('🤖 reCAPTCHA verification bypassed for job application.')
    return true
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })
    const data = await res.json()
    return data.success && data.score >= 0.5
  } catch (error) {
    console.error('❌ reCAPTCHA verification API error:', error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    // 1. Parse FormData
    const formData = await request.formData()
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const email = formData.get('email') as string
    const job_id = formData.get('job_id') as string
    const preferred_location = formData.get('preferred_location') as string | null
    const note = formData.get('note') as string | null
    const recaptcha_token = formData.get('recaptcha_token') as string
    const cvFile = formData.get('cv_file') as File | null

    const rawExp = formData.get('experience_years')
    const experience_years = rawExp ? Number(rawExp) : undefined

    // 2. Validate standard text fields using Zod ApplicationSchema
    const validationResult = ApplicationSchema.safeParse({
      job_id,
      name,
      phone,
      email,
      experience_years,
      preferred_location: preferred_location || undefined,
      note: note || undefined,
    })

    if (!validationResult.success) {
      const details: Record<string, string[]> = {}
      validationResult.error.issues.forEach((err) => {
        const path = err.path.join('.')
        if (!details[path]) details[path] = []
        details[path].push(err.message)
      })

      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          details,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // 3. Validate CV file if present
    if (cvFile && cvFile.size > 0) {
      if (cvFile.type !== 'application/pdf' && !cvFile.name.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json(
          {
            success: false,
            error: 'INVALID_FILE_TYPE',
            message: 'Chỉ chấp nhận tệp tin định dạng PDF.',
          },
          { status: 400 }
        )
      }

      // Max size: 5MB
      if (cvFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            error: 'FILE_TOO_LARGE',
            message: 'Kích thước tệp CV không được vượt quá 5MB.',
          },
          { status: 400 }
        )
      }
    }

    // 4. Verify reCAPTCHA token
    const isCaptchaValid = await verifyRecaptcha(recaptcha_token)
    if (!isCaptchaValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'RECAPTCHA_FAILED',
        },
        { status: 422 }
      )
    }

    // 5. Check if target job exists and is open
    const targetJob = await prisma.job.findUnique({
      where: { id: data.job_id },
    })

    if (!targetJob || targetJob.status === 'CLOSED') {
      return NextResponse.json(
        {
          success: false,
          error: 'JOB_NOT_FOUND',
          message: 'Vị trí công việc ứng tuyển không tồn tại hoặc đã dừng nhận hồ sơ.',
        },
        { status: 404 }
      )
    }

    // 6. Create Application record in DB
    const newApplication = await prisma.application.create({
      data: {
        job_id: data.job_id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        experience_years: data.experience_years !== undefined ? data.experience_years : null,
        preferred_location: data.preferred_location || null,
        note: data.note || null,
        status: 'NEW',
      },
    })

    // 7. Process file upload if present
    let finalCvUrl: string | null = null
    if (cvFile && cvFile.size > 0) {
      try {
        finalCvUrl = await uploadCV(cvFile, newApplication.id)
        
        // Update database with the uploaded URL
        await prisma.application.update({
          where: { id: newApplication.id },
          data: { cv_file: finalCvUrl },
        })
      } catch (uploadError) {
        console.error('❌ Failed to upload candidate CV:', uploadError)
        // We continue anyway, because the text details are already saved!
      }
    }

    // 8. Trigger emails in the background
    try {
      const emailAppData = {
        ...newApplication,
        cv_file: finalCvUrl,
        experience_years: newApplication.experience_years,
      }
      
      await Promise.allSettled([
        sendApplicationNotification(emailAppData, { title: targetJob.title }),
        sendApplicationConfirmation(emailAppData, { title: targetJob.title }),
      ])
    } catch (emailErr) {
      console.error('❌ Failed to trigger recruitment emails:', emailErr)
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newApplication.id,
          message: 'Hồ sơ ứng tuyển đã được ghi nhận. Ban nhân sự sẽ liên hệ với bạn trong 3-5 ngày làm việc.',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ POST /api/applications internal error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    )
  }
}
