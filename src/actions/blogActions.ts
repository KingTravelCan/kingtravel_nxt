'use server';

import { db } from '@/db';
import { blogPosts } from '@/db/schema';
import { eq, desc, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// ─── Auto-slugify title ────────────────────────────────────────────────────
export async function slugifyBlogTitle(title: string): Promise<string> {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── GET ALL BLOGS ─────────────────────────────────────────────────────────
export async function getBlogsList(publishedOnly = false) {
  try {
    const rows = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.createdAt));

    if (publishedOnly) {
      return rows.filter((b) => b.isPublished);
    }
    return rows;
  } catch (err) {
    console.error('getBlogsList DB error:', err);
    throw new Error('Failed to fetch blogs from database');
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
    
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('getBlogBySlug DB error:', err);
    throw new Error('Failed to fetch blog by slug');
  }
}

// ─── GET SINGLE BLOG BY ID ─────────────────────────────────────────────────
export async function getBlogById(id: number) {
  try {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error('getBlogById DB error:', err);
    throw new Error('Failed to fetch blog by ID');
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
      const inserted = await db.insert(blogPosts).values(insertData).$returningId();
      if (inserted && inserted.length > 0) {
        savedId = inserted[0].id;
      }
      
      revalidatePath('/blogs');
      revalidatePath('/admin/blogs');
      return { success: true, blogId: savedId };
    }
  } catch (err: any) {
    console.error('saveBlogAction error:', err);
    return { success: false, error: err.message || 'Failed to save blog post' };
  }
}

// ─── DELETE BLOG ───────────────────────────────────────────────────────────
export async function deleteBlogAction(id: number) {
  try {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    revalidatePath('/blogs');
    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (err: any) {
    console.error('deleteBlogAction DB error:', err);
    return { success: false, error: err.message || 'Failed to delete blog' };
  }
}

// ─── BLOG SEO — SAVE ───────────────────────────────────────────────────────
export async function saveBlogSeoAction(blogId: number, seoData: any) {
  try {
    await db.update(blogPosts).set({
      seoSettings: seoData,
      updatedAt: new Date(),
    }).where(eq(blogPosts.id, blogId));
    
    revalidatePath('/admin/blogs');
    return { success: true };
  } catch (err: any) {
    console.error('saveBlogSeoAction error:', err);
    return { success: false, error: err.message || 'Failed to save SEO settings' };
  }
}

// ─── BLOG SEO — GET ────────────────────────────────────────────────────────
export async function getBlogSeoAction(blogId: number) {
  try {
    const rows = await db.select({ seoSettings: blogPosts.seoSettings }).from(blogPosts).where(eq(blogPosts.id, blogId)).limit(1);
    if (rows && rows.length > 0) {
      return rows[0].seoSettings || null;
    }
    return null;
  } catch (err) {
    console.error('getBlogSeoAction error:', err);
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
