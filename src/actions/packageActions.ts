'use server';

import { db } from '@/db';
import { packages, packagePrices, packageHotels } from '@/db/schema';
import { eq, desc, and, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Fetch every non-draft package of a given type ('umrah' | 'hajj'), newest first.
 * Used by public-facing sections that should automatically show every package an
 * admin creates, without needing a separate manual "add to section" step.
 */
export async function getPackagesByType(type: 'umrah' | 'hajj'): Promise<any[]> {
  try {
    const rows = await db
      .select()
      .from(packages)
      .where(and(eq(packages.type, type), ne(packages.status, 'draft'), ne(packages.status, 'sold_out')))
      .orderBy(desc(packages.createdAt));
    return rows || [];
  } catch (err) {
    console.error('getPackagesByType DB error:', err);
    return [];
  }
}

export async function getAllPackages() {
  try {
    let list = await db.select().from(packages).orderBy(desc(packages.createdAt));
    return list || [];
  } catch (err) {
    console.error('getAllPackages DB error:', err);
    throw new Error('Failed to fetch packages from database');
  }
}

export async function getSoldOutPackages() {
  try {
    const rows = await db
      .select()
      .from(packages)
      .where(eq(packages.status, 'sold_out'))
      .orderBy(desc(packages.createdAt));
    return rows || [];
  } catch (err) {
    console.error('getSoldOutPackages DB error:', err);
    return [];
  }
}

/** Fetch packages by an ordered array of IDs (preserves the given order). */
export async function getPackagesByIds(ids: number[]): Promise<any[]> {
  if (!ids || ids.length === 0) return [];
  try {
    const { inArray } = await import('drizzle-orm');
    const rows = await db.select().from(packages).where(inArray(packages.id, ids));
    // Preserve the caller-specified order
    const map = new Map(rows.map((r) => [r.id, r]));
    return ids.map((id) => map.get(id)).filter(Boolean) as any[];
  } catch (err) {
    console.error('getPackagesByIds DB error:', err);
    return [];
  }
}



export async function getPackageBySlug(slug: string) {
  try {
    const pkgList = await db.select().from(packages).where(eq(packages.slug, slug)).limit(1);
    if (!pkgList.length) return null;

    const pkg = pkgList[0];
    const prices = await db.select().from(packagePrices).where(eq(packagePrices.packageId, pkg.id));
    const hotels = await db.select().from(packageHotels).where(eq(packageHotels.packageId, pkg.id));

    return { ...pkg, prices, hotels };
  } catch (err) {
    console.error('getPackageBySlug DB error:', err);
    return null;
  }
}


export async function createPackage(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const title = formData.get('title') as string;
    const customSlug = formData.get('slug') as string;
    const type = (formData.get('type') as 'umrah' | 'hajj') || 'umrah';
    const month = formData.get('month') as string || '';
    const startingPrice = (formData.get('startingPrice') as string) || '1995.00';
    const starRating = (formData.get('starRating') as string) || '5 Star';
    const status = (formData.get('status') as any) || 'available';
    const shortDescription = formData.get('shortDescription') as string || '';
    const fullDescription = formData.get('fullDescription') as string || '';
    const inclusions = formData.get('inclusions') as string || '[]';
    const cardDataStr = formData.get('cardData') as string || '';
    const cardData = cardDataStr ? JSON.parse(cardDataStr) : null;

    // Umrah-only gallery. Hajj creation does not read or write this field.
    const packagesGalleryStr = formData.get('packagesGallery') as string || '';
    const packagesGallery = packagesGalleryStr
      ? JSON.parse(packagesGalleryStr)
      : null;

    if (!title) return { success: false, error: 'Package title is required.' };

    const slug = customSlug ? customSlug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const insertData: any = {
      title,
      type,
      slug,
      month,
      startingPrice,
      starRating,
      status,
      shortDescription,
      fullDescription,
      inclusions,
      cardData,
    };

    // Keep Hajj inserts exactly as before.
    insertData.packagesGallery = packagesGallery;

    await db.insert(packages).values(insertData);

    revalidatePath('/admin/packages');
    revalidatePath('/hajj-packages');
    revalidatePath('/umrah-packages');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating package:', error);
    return { success: false, error: error.message || 'Failed to create package in database.' };
  }
}

export async function updatePackageAction(
  id: number,
  data: {
    title: string;
    slug?: string;
    type: 'umrah' | 'hajj';
    month?: string;
    startingPrice?: string;
    starRating?: string;
    status?: 'available' | 'sold_out' | 'coming_soon' | 'draft';
    shortDescription?: string;
    fullDescription?: string;
    featuredImage?: string;
    departureCity?: string;
    destination?: string;
    cardData?: any;
    detailPageData?: any;
    packagesGallery?: string[];
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = {
      title: data.title,
      slug: data.slug,
      type: data.type,
      month: data.month,
      startingPrice: data.startingPrice,
      starRating: data.starRating,
      status: data.status,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      featuredImage: data.featuredImage,
      departureCity: data.departureCity,
      destination: data.destination,
      cardData: data.cardData,
      detailPageData: data.detailPageData,
      updatedAt: new Date(),
    };

    // Umrah-only update. Hajj rows never have packages_gallery touched.
    if (data.packagesGallery !== undefined) {
      updateData.packagesGallery = data.packagesGallery;
    }

    await db.update(packages).set(updateData).where(eq(packages.id, id));

    revalidatePath('/admin/packages');
    revalidatePath('/hajj-packages');
    revalidatePath('/umrah-packages');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating package:', error);
    return { success: false, error: error.message || 'Failed to update package in database.' };
  }
}

export async function updatePackageStatus(id: number, status: 'available' | 'sold_out' | 'coming_soon' | 'draft'): Promise<void> {
  try {
    await db.update(packages).set({ status, updatedAt: new Date() }).where(eq(packages.id, id));
    revalidatePath('/admin/packages');
    revalidatePath('/');
    revalidatePath('/hajj-packages');
    revalidatePath('/umrah-packages');
  } catch (error) {
    console.error('Error updating package status:', error);
  }
}

export async function deletePackage(id: number): Promise<void> {
  try {
    await db.delete(packages).where(eq(packages.id, id));
    revalidatePath('/admin/packages');
    revalidatePath('/');
    revalidatePath('/hajj-packages');
    revalidatePath('/umrah-packages');
  } catch (error) {
    console.error('Error deleting package:', error);
  }
}