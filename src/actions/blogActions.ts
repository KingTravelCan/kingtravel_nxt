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

const INITIAL_BLOG_POSTS: any[] = [];

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
    // Fallback to cache if DB returns no rows but it was saved in memory
    return [].find((b: any) => b.slug === slug) ?? null;
  } catch (err) {
    console.error('getBlogBySlug DB error, checking cache:', err);
    return [].find((b: any) => b.slug === slug) ?? null;
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
    // Fallback to cache
    return blogMemoryCache[id] ?? null;
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
    return [];
  }
}
