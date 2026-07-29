'use server';

import { db } from '@/db';
import { visaServices } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getVisaServicesList() {
  try {
    return await db.select().from(visaServices).orderBy(asc(visaServices.displayOrder));
  } catch {
    return [];
  }
}

export async function getVisaServiceBySlug(slug: string) {
  try {
    const list = await db.select().from(visaServices).where(eq(visaServices.slug, slug)).limit(1);
    return list.length ? list[0] : null;
  } catch {
    return null;
  }
}

export async function createVisaService(formData: FormData): Promise<void> {
  try {
    const title = formData.get('title') as string;
    const shortDescription = formData.get('shortDescription') as string;
    const fullDescription = formData.get('fullDescription') as string;
    const processingTime = formData.get('processingTime') as string || '3-5 Business Days';

    if (!title) return;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await db.insert(visaServices).values({
      title,
      slug,
      shortDescription,
      fullDescription,
      processingTime,
      imageUrl: '/img/saudi-visa-1.webp',
      isPublished: true,
    });

    revalidatePath('/admin/visas');
    revalidatePath('/saudi-visa');
  } catch (error) {
    console.error('Error creating visa service:', error);
  }
}
