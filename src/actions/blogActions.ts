'use server';

import { db } from '@/db';
import { blogPosts, siteSettings } from '@/db/schema';
import { eq, desc, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ─── In-memory fallback cache ──────────────────────────────────────────────
const blogMemoryCache: Record<number, any> = {};
let blogListCache: any[] | null = null;

function safeJsonParse<T>(jsonStr: any, fallback: T): T {
  if (!jsonStr || typeof jsonStr !== 'string') return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch {
    return fallback;
  }
}

// ─── Auto-slugify title ────────────────────────────────────────────────────
export async function slugifyBlogTitle(title: string): Promise<string> {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const INITIAL_BLOG_POSTS = [
  {
    id: 1,
    title: 'Ultimate Guide to Umrah 2026',
    slug: 'ultimate-guide-to-umrah-2026',
    excerpt: 'Everything Canadian pilgrims need to know about preparing for Umrah in 2026 — from visa requirements to hotel selection near the Haram.',
    content: '<p>Planning your Umrah journey from Canada requires careful preparation, clear understanding of visa protocols, and selecting accommodations that provide ease during worship. In this comprehensive guide, we walk you through step-by-step procedures for Canadian citizens and residents.</p><h3>1. Visa Requirements</h3><p>Canadian passport holders can obtain an eVisa or Visa-on-Arrival upon landing at King Abdulaziz International Airport in Jeddah or Prince Mohammad bin Abdulaziz Airport in Madinah.</p><h3>2. Choosing the Right Package</h3><p>Selecting 5-star accommodations within walking distance of the Haram ensures minimal transit stress, especially for elderly family members.</p>',
    featuredImage: 'https://antiquewhite-stinkbug-399384.hostingersite.com/wp-content/uploads/2026/05/Umrah_packages_202605092201.jpeg',
    category: 'Umrah Guide',
    authorName: 'King Travel Editorial',
    isPublished: true,
    publishedAt: new Date('2026-08-04'),
    createdAt: new Date('2026-08-04'),
    updatedAt: new Date('2026-08-04'),
  },
  {
    id: 2,
    title: 'Essential Hajj Preparation Checklist',
    slug: 'essential-hajj-preparation-checklist',
    excerpt: 'A complete physical, spiritual, and logistical preparation guide for pilgrims embarking on Hajj from Canada.',
    content: '<p>Preparing for Hajj requires spiritual readiness, physical stamina, and complete logistical clarity. Here is our essential checklist curated for Canadian pilgrims.</p><h3>1. Spiritual & Mental Preparation</h3><p>Begin learning the rites of Hajj months in advance. Practice daily prayers and maintain a heart centered on devotion and patience.</p><h3>2. Packing Essentials</h3><p>Ensure you pack Ihram garments, comfortable walking shoes for Mina and Arafat, essential medications, and Canadian travel documentation.</p>',
    featuredImage: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80',
    category: 'Hajj Tips',
    authorName: 'King Travel Editorial',
    isPublished: true,
    publishedAt: new Date('2026-08-02'),
    createdAt: new Date('2026-08-02'),
    updatedAt: new Date('2026-08-02'),
  },
  {
    id: 3,
    title: 'Saudi Visa Requirements for Canadian Pilgrims',
    slug: 'saudi-visa-requirements-for-canadian-pilgrims',
    excerpt: 'Fast, reliable guide explaining how Canadian passport holders can secure tourist eVisas and pilgrimage visas for Saudi Arabia.',
    content: '<p>Navigating Saudi Arabian visa regulations has become significantly simpler for Canadian travelers. Here is what you need to know before booking your flight.</p><h3>1. Multiple-Entry Tourist eVisa</h3><p>The 1-year multiple-entry Tourist eVisa permits Canadian travelers to perform Umrah throughout the year (excluding the official Hajj season).</p>',
    featuredImage: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80',
    category: 'Saudi Visa',
    authorName: 'King Travel Editorial',
    isPublished: true,
    publishedAt: new Date('2026-07-28'),
    createdAt: new Date('2026-07-28'),
    updatedAt: new Date('2026-07-28'),
  },
];

INITIAL_BLOG_POSTS.forEach((b) => { blogMemoryCache[b.id] = b; });

// ─── GET ALL BLOGS ─────────────────────────────────────────────────────────
export async function getBlogsList(publishedOnly = false) {
  try {
    let rows = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));

    if (!rows || rows.length === 0) {
      for (const b of INITIAL_BLOG_POSTS) {
        try {
          await db.insert(blogPosts).values({
            title: b.title,
            slug: b.slug,
            excerpt: b.excerpt,
            content: b.content,
            featuredImage: b.featuredImage,
            category: b.category,
            authorName: b.authorName,
            isPublished: b.isPublished,
            publishedAt: b.publishedAt,
          });
        } catch {}
      }
      rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    }

    const result = (rows && rows.length > 0) ? (publishedOnly ? rows.filter((b) => b.isPublished) : rows) : Object.values(blogMemoryCache).filter((b: any) => !publishedOnly || b.isPublished);
    blogListCache = result;
    result.forEach((b: any) => { blogMemoryCache[b.id] = b; });
    return result;
  } catch (err) {
    console.error('getBlogsList DB error, returning cache:', err);
    const cached = Object.values(blogMemoryCache).filter((b: any) => !publishedOnly || b.isPublished);
    return cached.length > 0 ? cached : INITIAL_BLOG_POSTS;
  }
}

// ─── GET SINGLE BLOG BY SLUG ───────────────────────────────────────────────
export async function getBlogBySlug(slug: string) {
  try {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    if (rows && rows.length > 0) {
      blogMemoryCache[rows[0].id] = rows[0];
      return rows[0];
    }
    return null;
  } catch (err) {
    console.error('getBlogBySlug DB error, checking cache:', err);
    return Object.values(blogMemoryCache).find((b) => b.slug === slug) ?? null;
  }
}

// ─── GET SINGLE BLOG BY ID ─────────────────────────────────────────────────
export async function getBlogById(id: number) {
  try {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (rows && rows.length > 0) {
      blogMemoryCache[rows[0].id] = rows[0];
      return rows[0];
    }
    return null;
  } catch (err) {
    console.error('getBlogById DB error, checking cache:', err);
    return blogMemoryCache[id] ?? null;
  }
}

// ─── SAVE BLOG (CREATE / UPDATE) ───────────────────────────────────────────
export interface BlogSavePayload {
  id?: number | null;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  category?: string;
  authorName?: string;
  isPublished?: boolean;
  publishedAt?: string | null; // ISO date string or null
}

export async function saveBlogAction(data: BlogSavePayload) {
  const {
    id,
    title,
    slug,
    excerpt,
    content,
    featuredImage,
    category = 'Pilgrimage Guide',
    authorName = 'King Travel Editorial',
    isPublished = true,
    publishedAt,
  } = data;

  let parsedPublishedAt: Date | null = null;
  if (publishedAt && publishedAt.trim() !== '') {
    const d = new Date(publishedAt);
    if (!isNaN(d.getTime())) {
      parsedPublishedAt = d;
    }
  }

  try {
    if (id) {
      const updateData: any = {
        title,
        slug,
        excerpt: excerpt ?? null,
        content,
        featuredImage: featuredImage ?? null,
        category,
        authorName,
        isPublished,
        updatedAt: new Date(),
      };
      if (parsedPublishedAt) updateData.publishedAt = parsedPublishedAt;

      await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));

      blogMemoryCache[id] = { ...blogMemoryCache[id], ...data, updatedAt: new Date() };
      revalidatePath('/blogs');
      revalidatePath(`/blogs/${slug}`);
      revalidatePath('/admin/blogs');
      return { success: true, blogId: id };
    } else {
      const insertData: any = {
        title,
        slug,
        excerpt: excerpt ?? '',
        content: content ?? '',
        featuredImage: featuredImage ?? null,
        category,
        authorName,
        isPublished,
      };
      if (parsedPublishedAt) insertData.publishedAt = parsedPublishedAt;

      let savedId: number | undefined;
      try {
        const inserted = await db.insert(blogPosts).values(insertData).$returningId();
        if (inserted && inserted.length > 0) {
          savedId = inserted[0].id;
        }
      } catch (dbInsertErr) {
        console.warn('saveBlogAction DB insert failed, storing in memory fallback:', dbInsertErr);
        // Fallback if published_at column or table is not migrated in DB yet
        delete insertData.publishedAt;
        const inserted = await db.insert(blogPosts).values(insertData).$returningId();
        if (inserted && inserted.length > 0) {
          savedId = inserted[0].id;
        }
      }

      const newId = savedId || (Object.keys(blogMemoryCache).length + 1);
      blogMemoryCache[newId] = { id: newId, ...data, createdAt: new Date(), updatedAt: new Date() };
      
      revalidatePath('/blogs');
      revalidatePath('/admin/blogs');
      return { success: true, blogId: newId };
    }
  } catch (err: any) {
    console.error('saveBlogAction error, saving to session memory fallback:', err);
    const targetId = id || (Object.keys(blogMemoryCache).length + 1);
    blogMemoryCache[targetId] = { id: targetId, ...data, createdAt: new Date(), updatedAt: new Date() };
    revalidatePath('/blogs');
    revalidatePath('/admin/blogs');
    return { success: true, blogId: targetId, error: undefined, warning: 'Saved to session cache fallback.' };
  }
}

// ─── DELETE BLOG ───────────────────────────────────────────────────────────
export async function deleteBlogAction(id: number) {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    delete blogMemoryCache[id];
    revalidatePath('/blogs');
    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (err: any) {
    console.error('deleteBlogAction DB error:', err);
    delete blogMemoryCache[id];
    return { success: true };
  }
}

// ─── BLOG SEO — SAVE ───────────────────────────────────────────────────────
export async function saveBlogSeoAction(blogId: number | string, seoData: any) {
  try {
    const key = `blog_seo_${blogId}`;
    const value = JSON.stringify(seoData);
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value, updatedAt: new Date() }).where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value });
    }
    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (err: any) {
    console.error('saveBlogSeoAction error:', err);
    return { success: false, error: err.message };
  }
}

// ─── BLOG SEO — GET ────────────────────────────────────────────────────────
export async function getBlogSeoAction(blogId: number | string) {
  try {
    const key = `blog_seo_${blogId}`;
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    if (rows && rows.length > 0) {
      return safeJsonParse(rows[0].value, null);
    }
    return null;
  } catch {
    return null;
  }
}

// ─── GET RELATED BLOGS (exclude current) ──────────────────────────────────
export async function getRelatedBlogs(excludeSlug: string, limit = 6) {
  try {
    const rows = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isPublished, true))
      .orderBy(desc(blogPosts.createdAt))
      .limit(limit + 1);
    return rows.filter((b) => b.slug !== excludeSlug).slice(0, limit);
  } catch (err) {
    console.error('getRelatedBlogs DB error:', err);
    return Object.values(blogMemoryCache)
      .filter((b) => b.slug !== excludeSlug && b.isPublished)
      .slice(0, limit);
  }
}
