import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { ContactSchema } from '@/lib/validations'
import { sendLeadNotification, sendLeadConfirmation } from '@/lib/email'

// reCAPTCHA verification helper
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  
  // Bypass in development if not configured
  if (!secretKey || secretKey === 'recaptcha_secret_key_here') {
    console.log('🤖 reCAPTCHA verification bypassed (no valid secret key configured).')
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
    const body = await request.json()

    // 1. Validate data using Zod
    const validationResult = ContactSchema.safeParse(body)
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

    // 2. Verify reCAPTCHA token
    const isCaptchaValid = await verifyRecaptcha(data.recaptcha_token)
    if (!isCaptchaValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'RECAPTCHA_FAILED',
        },
        { status: 422 }
      )
    }

    // 3. Save to database using Prisma client
    const newContact = await prisma.contact.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        province: data.province || null,
        service_type: data.service_type || null,
        title: data.title || null,
        message: data.message,
        source: data.source,
      },
    })

    // 3.5 Broadcast real-time notification to admin panel using shared global event emitter
    try {
      const { notificationEmitter } = await import('@/lib/events')
      notificationEmitter.emit('new-lead', {
        id: newContact.id,
        type: 'NEW_CONTACT',
        name: newContact.name,
        phone: newContact.phone,
        service_type: newContact.service_type || 'Liên hệ chung',
        message: newContact.message,
        created_at: newContact.created_at.toISOString(),
      })
    } catch (broadcastErr) {
      console.error('⚠️ Real-time broadcast failed:', broadcastErr)
    }

    // 4. Send background notifications (failure does not block the response)
    try {
      await sendLeadNotification(newContact)
      if (newContact.email) {
        await sendLeadConfirmation(newContact)
      }
    } catch (err) {
      console.error('❌ Background notification failed:', err)
    }

    // 5. Return success response
    return NextResponse.json(
      {
        success: true,
        data: {
          id: newContact.id,
          message: 'Yêu cầu của bạn đã được gửi thành công.',
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ POST /api/contacts internal server error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }
}
