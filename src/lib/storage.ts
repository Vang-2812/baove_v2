import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as fs from 'fs'
import * as path from 'path'

const hasR2 = !!(
  process.env.R2_ENDPOINT &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_BUCKET &&
  process.env.R2_PUBLIC_URL
)

let s3: S3Client | null = null

if (hasR2) {
  s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  })
}

export async function uploadCV(file: File, applicationId: string): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const key = `cvs/${applicationId}.pdf`

  if (hasR2 && s3) {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: 'application/pdf',
          Metadata: { applicationId },
        })
      )
      return `${process.env.R2_PUBLIC_URL}/${key}`
    } catch (e) {
      console.error('❌ Failed to upload CV to R2, falling back to local storage:', e)
    }
  }

  // Graceful Fallback: Local storage in public/uploads/cvs/
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    const filePath = path.join(uploadDir, `${applicationId}.pdf`)
    fs.writeFileSync(filePath, buffer)
    return `/uploads/cvs/${applicationId}.pdf`
  } catch (err) {
    console.error('❌ Failed to save CV to local storage:', err)
    throw new Error('FAILED_TO_STORE_CV')
  }
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.type.split('/')[1] || 'jpg'
  const key = `${folder}/${Date.now()}.${ext}`
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (hasR2 && s3) {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      )
      return `${process.env.R2_PUBLIC_URL}/${key}`
    } catch (e) {
      console.error('❌ Failed to upload image to R2, falling back to local storage:', e)
    }
  }

  // Graceful Fallback: Local storage in public/uploads/{folder}/
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    const fileName = `${Date.now()}.${ext}`
    const filePath = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, buffer)
    return `/uploads/${folder}/${fileName}`
  } catch (err) {
    console.error('❌ Failed to save image to local storage:', err)
    throw new Error('FAILED_TO_STORE_IMAGE')
  }
}
