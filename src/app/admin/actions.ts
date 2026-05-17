'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'


// ─────────────────────────────────────────────────────────────────────────────
// SERVICES ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertService(id: string | null, data: any) {
  try {
    const payload = {
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      scope: data.scope || '',
      process: data.process ? JSON.stringify(data.process) : '[]',
      benefits: data.benefits || '',
      icon: data.icon || 'Shield',
      image: data.image || '',
      price_min: data.price_min ? parseFloat(data.price_min) : null,
      price_max: data.price_max ? parseFloat(data.price_max) : null,
      price_unit: data.price_unit || 'tháng',
      faq: data.faq ? JSON.stringify(data.faq) : '[]',
      order: data.order ? parseInt(data.order) : 0,
      is_active: data.is_active === true || data.is_active === 'true',
      meta_title: data.meta_title || '',
      meta_desc: data.meta_desc || '',
    }

    if (id) {
      await prisma.service.update({
        where: { id },
        data: payload,
      })
    } else {
      await prisma.service.create({
        data: payload,
      })
    }

    revalidatePath('/')
    revalidatePath('/dich-vu')
    revalidatePath(`/dich-vu/${data.slug}`)
    revalidatePath('/admin/services')
    return { success: true }
  } catch (error: any) {
    console.error('Error upserting service:', error)
    return { success: false, error: error.message || 'Lỗi lưu thông tin dịch vụ.' }
  }
}

export async function deleteService(id: string) {
  try {
    const service = await prisma.service.findUnique({ where: { id } })
    await prisma.service.delete({ where: { id } })
    
    revalidatePath('/')
    revalidatePath('/dich-vu')
    if (service) revalidatePath(`/dich-vu/${service.slug}`)
    revalidatePath('/admin/services')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting service:', error)
    return { success: false, error: error.message || 'Lỗi xóa dịch vụ.' }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertPost(id: string | null, data: any) {
  try {
    // Get an author from the db
    const firstUser = await prisma.user.findFirst()

    const payload = {
      title: data.title,
      slug: data.slug,
      content: data.content || '',
      excerpt: data.excerpt || '',
      thumbnail: data.thumbnail || '',
      type: data.type || 'BLOG',
      status: data.status || 'DRAFT',
      category_id: data.category_id || null,
      meta_title: data.meta_title || '',
      meta_desc: data.meta_desc || '',
      tags: data.tags || [],
      author_id: firstUser?.id || null,
      published_at: data.status === 'PUBLISHED' ? new Date() : null,
    }

    if (id) {
      await prisma.post.update({
        where: { id },
        data: payload,
      })
    } else {
      await prisma.post.create({
        data: payload,
      })
    }

    revalidatePath('/')
    revalidatePath('/tin-tuc')
    revalidatePath('/tai-lieu')
    revalidatePath(`/tin-tuc/${data.slug}`)
    revalidatePath(`/tai-lieu/${data.slug}`)
    revalidatePath('/admin/posts')
    return { success: true }
  } catch (error: any) {
    console.error('Error upserting post:', error)
    return { success: false, error: error.message || 'Lỗi lưu bài viết.' }
  }
}

export async function deletePost(id: string) {
  try {
    const post = await prisma.post.findUnique({ where: { id } })
    await prisma.post.delete({ where: { id } })
    
    revalidatePath('/')
    revalidatePath('/tin-tuc')
    revalidatePath('/tai-lieu')
    if (post) {
      revalidatePath(`/tin-tuc/${post.slug}`)
      revalidatePath(`/tai-lieu/${post.slug}`)
    }
    revalidatePath('/admin/posts')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return { success: false, error: error.message || 'Lỗi xóa bài viết.' }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// JOBS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function upsertJob(id: string | null, data: any) {
  try {
    const payload = {
      title: data.title,
      slug: data.slug,
      description: data.description || '',
      requirements: data.requirements || '',
      benefits: data.benefits || '',
      location: data.location || '',
      salary_range: data.salary_range || '',
      type: data.type || 'FULLTIME',
      status: data.status || 'OPEN',
      meta_title: data.meta_title || '',
      meta_desc: data.meta_desc || '',
    }

    if (id) {
      await prisma.job.update({
        where: { id },
        data: payload,
      })
    } else {
      await prisma.job.create({
        data: payload,
      })
    }

    revalidatePath('/')
    revalidatePath('/tuyen-dung')
    revalidatePath(`/tuyen-dung/${data.slug}`)
    revalidatePath('/admin/jobs')
    return { success: true }
  } catch (error: any) {
    console.error('Error upserting job:', error)
    return { success: false, error: error.message || 'Lỗi lưu tin tuyển dụng.' }
  }
}

export async function deleteJob(id: string) {
  try {
    const job = await prisma.job.findUnique({ where: { id } })
    
    // Delete applications related to the job first
    await prisma.application.deleteMany({ where: { job_id: id } })
    await prisma.job.delete({ where: { id } })
    
    revalidatePath('/')
    revalidatePath('/tuyen-dung')
    if (job) revalidatePath(`/tuyen-dung/${job.slug}`)
    revalidatePath('/admin/jobs')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting job:', error)
    return { success: false, error: error.message || 'Lỗi xóa tin tuyển dụng.' }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATIONS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function updateApplicationStatus(id: string, status: string) {
  try {
    await prisma.application.update({
      where: { id },
      data: { status: status as any },
    })
    revalidatePath('/admin/applications')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating application status:', error)
    return { success: false, error: error.message || 'Lỗi cập nhật trạng thái hồ sơ.' }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

export async function saveSettings(settings: Record<string, any>) {
  try {
    for (const [key, val] of Object.entries(settings)) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: JSON.stringify(val) },
        create: { key, value: JSON.stringify(val) },
      })
    }
    
    revalidatePath('/')
    revalidatePath('/lien-he')
    revalidatePath('/gioi-thieu')
    revalidatePath('/admin/settings')
    return { success: true }
  } catch (error: any) {
    console.error('Error saving settings:', error)
    return { success: false, error: error.message || 'Lỗi lưu cấu hình.' }
  }
}

// Update single regional branch
export async function updateBranch(id: string, data: any) {
  try {
    await prisma.branch.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email || '',
        map_embed_url: data.map_embed_url || '',
      },
    })
    revalidatePath('/')
    revalidatePath('/lien-he')
    revalidatePath('/admin/settings')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating branch:', error)
    return { success: false, error: error.message || 'Lỗi cập nhật chi nhánh.' }
  }
}
