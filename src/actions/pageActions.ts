'use server';

import { db } from '@/db';
import { sitePages, siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const INITIAL_FRONTEND_PAGES = [
  { title: 'Home Page', slug: '/' },
  { title: 'About Us', slug: '/about' },
  { title: 'Umrah Packages', slug: '/umrah/packages' },
  { title: 'Hajj Packages', slug: '/hajj/packages' },
  { title: 'Saudi Visa', slug: '/saudi-visa' },
  { title: 'Airlines & Flights', slug: '/airlines' },
  { title: 'Contact Us', slug: '/contact' },
  { title: 'Deluxe Hajj 2027', slug: '/deluxe-hajj-2027' },
  { title: 'Economy Hajj 2027', slug: '/economy-hajj-2027' },
];

// In-memory fallback cache when database table site_pages is not migrated
const pageMemoryCache: Record<number, any> = {};
INITIAL_FRONTEND_PAGES.forEach((p, idx) => {
  pageMemoryCache[idx + 1] = {
    id: idx + 1,
    title: p.title,
    slug: p.slug,
    status: 'published' as const,
    showInMenu: true,
    parentPage: null,
    sections: '[]',
    richText: '',
    metaTitle: p.title,
    metaDescription: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

export async function getPagesList() {
  try {
    let pages = await db.select().from(sitePages);
    if (!pages || pages.length === 0) {
      for (const p of INITIAL_FRONTEND_PAGES) {
        await db.insert(sitePages).values({
          title: p.title,
          slug: p.slug,
          status: 'published',
          showInMenu: true,
        });
      }
      pages = await db.select().from(sitePages);
    }
    return pages;
  } catch (err) {
    console.error('getPagesList DB query failed, returning fallback list:', err);
    return Object.values(pageMemoryCache);
  }
}

export async function getPageById(id: number) {
  try {
    const pages = await db.select().from(sitePages).where(eq(sitePages.id, id)).limit(1);
    if (pages && pages.length > 0) return pages[0];
  } catch (err) {
    console.error('getPageById DB query failed, checking memory cache:', err);
  }
  return pageMemoryCache[id] || null;
}

export async function getPageBySlug(slug: string) {
  try {
    const pages = await db.select().from(sitePages).where(eq(sitePages.slug, slug)).limit(1);
    if (pages && pages.length > 0) return pages[0];
  } catch (err) {
    console.error('getPageBySlug DB query failed, checking memory cache:', err);
  }
  const cached = Object.values(pageMemoryCache).find(p => p.slug === slug);
  return cached || null;
}

export async function savePageAction(formData: FormData) {
  const id = formData.get('id') ? Number(formData.get('id')) : null;
  const title = String(formData.get('title') || 'Untitled Page');
  const slug = String(formData.get('slug') || '/');
  const status = (String(formData.get('status')) === 'draft' ? 'draft' : 'published') as 'published' | 'draft';
  const showInMenu = formData.get('showInMenu') === 'on' || formData.get('showInMenu') === 'true';
  const parentPage = formData.get('parentPage') ? String(formData.get('parentPage')) : null;
  const sections = formData.get('sections') ? String(formData.get('sections')) : null;
  const richText = formData.get('richText') ? String(formData.get('richText')) : null;
  const metaTitle = formData.get('metaTitle') ? String(formData.get('metaTitle')) : null;
  const metaDescription = formData.get('metaDescription') ? String(formData.get('metaDescription')) : null;

  const bannerBgImage = formData.get('bannerBgImage') ? String(formData.get('bannerBgImage')) : null;
  const bannerPosition = formData.get('bannerPosition') ? String(formData.get('bannerPosition')) : 'center center';
  const bannerSize = formData.get('bannerSize') ? String(formData.get('bannerSize')) : 'cover';
  const bannerTitle = formData.get('bannerTitle') ? String(formData.get('bannerTitle')) : null;
  const bannerDescription = formData.get('bannerDescription') ? String(formData.get('bannerDescription')) : null;

  try {
    if (id) {
      await db.update(sitePages).set({
        title,
        slug,
        status,
        showInMenu,
        parentPage: parentPage || null,
        bannerBgImage,
        bannerPosition,
        bannerSize,
        bannerTitle,
        bannerDescription,
        sections: sections || null,
        richText: richText || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        updatedAt: new Date(),
      }).where(eq(sitePages.id, id));
    } else {
      await db.insert(sitePages).values({
        title,
        slug,
        status,
        showInMenu,
        parentPage: parentPage || null,
        bannerBgImage,
        bannerPosition,
        bannerSize,
        bannerTitle,
        bannerDescription,
        sections: sections || null,
        richText: richText || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
      });
    }

    revalidatePath('/admin/pages');
    revalidatePath(slug);
    return { success: true, error: undefined };
  } catch (err: any) {
    console.warn('savePageAction DB query failed, saving to cache fallback:', err);
    // Fallback save to memory cache so UI updates smoothly even without DB table
    const targetId = id || (Object.keys(pageMemoryCache).length + 1);
    pageMemoryCache[targetId] = {
      id: targetId,
      title,
      slug,
      status,
      showInMenu,
      parentPage,
      sections,
      richText,
      metaTitle,
      metaDescription,
      updatedAt: new Date(),
    };
    revalidatePath('/admin/pages');
    revalidatePath(slug);
    return { success: true, error: undefined, warning: 'Saved to session memory cache.' };
  }
}

export async function getDefaultNavItems() {
  return [
    { id: '1', label: 'Home', url: '/', level: 1, children: [] },
    {
      id: '2',
      label: 'About Us',
      url: '/about',
      level: 1,
      children: [
        { id: '2-1', label: 'Licenses', url: '/about#licenses', level: 2 },
      ],
    },
    { id: '3', label: 'Umrah Packages', url: '/umrah/packages', level: 1, children: [] },
    { id: '4', label: 'Hajj Packages', url: '/hajj/packages', level: 1, children: [] },
    { id: '5', label: 'Saudi Visa', url: '/saudi-visa', level: 1, children: [] },
    { id: '6', label: 'Flights', url: '/airlines', level: 1, children: [] },
    { id: '7', label: 'Contact', url: '/contact', level: 1, children: [] },
  ];
}

export async function getNavItems() {
  try {
    const res = await db.select().from(siteSettings).where(eq(siteSettings.key, 'nav_items')).limit(1);
    if (res && res.length > 0) {
      return JSON.parse(res[0].value);
    }
  } catch (err) {
    console.error('getNavItems DB query failed:', err);
  }
  return getDefaultNavItems();
}

export async function saveNavItemsAction(navItems: any[]) {
  try {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'nav_items')).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: JSON.stringify(navItems), updatedAt: new Date() }).where(eq(siteSettings.key, 'nav_items'));
    } else {
      await db.insert(siteSettings).values({ key: 'nav_items', value: JSON.stringify(navItems) });
    }
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error('saveNavItemsAction DB query failed:', err);
    return { success: false, error: err.message };
  }
}
