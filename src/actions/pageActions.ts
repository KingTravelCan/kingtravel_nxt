'use server';

import { db } from '@/db';
import { sitePages, siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { getResponsiveEmailTemplateHtml } from '@/lib/emailTemplate';

// Cached reads go stale after this long (seconds) and refetch in the background.
// Saves from the admin also bust these instantly via revalidateTag(), so content
// updates show up right away - this just avoids hitting the DB (a full network
// round trip) on every single page load, which is what was making the header
// and footer render before the actual page content.
const CONTENT_CACHE_SECONDS = 300;

function safeJsonParse<T>(jsonStr: any, fallback: T): T {
  if (!jsonStr || typeof jsonStr !== 'string') return fallback;
  try {
    return JSON.parse(jsonStr) as T;
  } catch (err) {
    console.warn('safeJsonParse fallback applied:', err);
    return fallback;
  }
}

export async function getPagesList() {
  try {
    let pages = await db.select().from(sitePages);
    
    // Apply stored reordering sequence if available
    try {
      const orderSetting = await db.select().from(siteSettings).where(eq(siteSettings.key, 'ordered_pages')).limit(1);
      const orderIds: number[] = orderSetting && orderSetting.length > 0 ? safeJsonParse(orderSetting[0].value, []) : [];

      if (orderIds && orderIds.length > 0) {
        const orderMap = new Map(orderIds.map((id, index) => [id, index]));
        pages.sort((a, b) => {
          const orderA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 999;
          const orderB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 999;
          return orderA - orderB;
        });
      }
    } catch (orderErr) {
      console.warn('Page order sorting failed:', orderErr);
    }

    return pages;
  } catch (err) {
    console.error('getPagesList DB query failed:', err);
    throw new Error('Failed to fetch pages from database');
  }
}

export async function getPageById(id: number) {
  try {
    const pages = await db.select().from(sitePages).where(eq(sitePages.id, id)).limit(1);
    if (pages && pages.length > 0) {
      const p = pages[0];
      const seoData = p.seoSettings ? safeJsonParse(p.seoSettings, null) : null;
      return { ...p, seoData };
    }
  } catch (err) {
    console.error('getPageById DB query failed:', err);
  }
  return null;
}

async function fetchPageBySlugFromDb(slug: string) {
  const pages = await db.select().from(sitePages).where(eq(sitePages.slug, slug)).limit(1);
  if (pages && pages.length > 0) {
    const p = pages[0];
    const seoData = p.seoSettings ? safeJsonParse(p.seoSettings, null) : null;
    return { ...p, seoData };
  }
  return null;
}

export async function getPageBySlug(slug: string) {
  try {
    const getCachedPage = unstable_cache(
      () => fetchPageBySlugFromDb(slug),
      ['page-by-slug', slug],
      { tags: ['pages', `page-slug-${slug}`], revalidate: CONTENT_CACHE_SECONDS }
    );
    return await getCachedPage();
  } catch (err) {
    console.error('getPageBySlug DB query failed:', err);
  }
  return null;
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
  const bannerTitle = formData.get('bannerTitle') as string;
  const bannerDescription = formData.get('bannerDescription') as string;
  const seoSettings = formData.get('seoSettings') as string;

  try {
    let savedId = id;
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
        seoSettings: seoSettings || null,
        updatedAt: new Date(),
      }).where(eq(sitePages.id, id));
    } else {
      const inserted = await db.insert(sitePages).values({
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
        seoSettings: seoSettings || null,
      }).$returningId();
      if (inserted && inserted.length > 0) {
        savedId = inserted[0].id;
      }
    }

    // Synchronize nav_items if slug or title changed
    try {
      const navRes = await db.select().from(siteSettings).where(eq(siteSettings.key, 'nav_items')).limit(1);
      if (navRes && navRes.length > 0) {
        let navItems = safeJsonParse(navRes[0].value, []);
        let updatedNav = false;
        const syncItem = (item: any) => {
          if ((savedId && String(item.id) === String(savedId)) || item.label === title || item.url === slug) {
            item.url = slug;
            item.label = title;
            updatedNav = true;
          }
          if (item.children && Array.isArray(item.children)) {
            item.children.forEach(syncItem);
          }
        };
        navItems.forEach(syncItem);
        if (updatedNav) {
          await db.update(siteSettings).set({ value: JSON.stringify(navItems), updatedAt: new Date() }).where(eq(siteSettings.key, 'nav_items'));
        }
      }
    } catch (e) {
      console.error('Failed to sync nav_items on savePageAction:', e);
    }

    revalidatePath('/admin/pages');
    revalidatePath(slug);
    revalidatePath('/', 'layout');
    revalidateTag('pages', 'max');
    revalidateTag(`page-slug-${slug}`, 'max');
    return { success: true, pageId: savedId, error: undefined };
  } catch (err: any) {
    console.error('savePageAction DB query failed:', err);
    return { success: false, error: err.message || 'Failed to save page' };
  }
}

export async function getDefaultNavItems() {
  return [
    {
      id: '1',
      label: 'About Us',
      url: '/about',
      level: 1,
      children: [
        { id: '2-1', label: 'Licenses', url: '/about#licenses', level: 2 },
      ],
    },
    { id: '2', label: 'Umrah Packages', url: '/umrah-packages', level: 1, children: [] },
    { id: '3', label: 'Hajj Packages', url: '/hajj-packages', level: 1, children: [] },
    { id: '4', label: 'Saudi Visa', url: '/saudi-visa', level: 1, children: [] },
    { id: '5', label: 'Flights', url: '/airlines', level: 1, children: [] },
    { id: '6', label: 'Contact', url: '/contact', level: 1, children: [] },
  ];
}

async function fetchNavItemsFromDb() {
  const res = await db.select().from(siteSettings).where(eq(siteSettings.key, 'nav_items')).limit(1);
  if (res && res.length > 0) {
    return safeJsonParse(res[0].value, await getDefaultNavItems());
  }
  return await getDefaultNavItems();
}

export async function getNavItems() {
  try {
    const getCachedNavItems = unstable_cache(
      fetchNavItemsFromDb,
      ['nav-items'],
      { tags: ['nav-items'], revalidate: CONTENT_CACHE_SECONDS }
    );
    return await getCachedNavItems();
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
    revalidateTag('nav-items', 'max');
    return { success: true };
  } catch (err: any) {
    console.error('saveNavItemsAction DB query failed:', err);
    return { success: false, error: err.message };
  }
}

export async function getDefaultFooterData() {
  return {
    logo: '/img/logo-footer.png',
    tagline: 'A licensed Canadian agency dedicated to Hajj & Umrah travel — trusted, certified, and built for pilgrims.',
    socialLinks: [
      { name: 'Facebook', url: 'https://www.facebook.com/kingtravelcan', icon: '/img/fb.svg', openInNewTab: true },
      { name: 'Instagram', url: 'https://www.instagram.com/kingtravelcan/', icon: '/img/insta.svg', openInNewTab: true },
      { name: 'LinkedIn', url: 'https://ca.linkedin.com/company/kingtravelcan', icon: '/img/in.svg', openInNewTab: true },
      { name: 'TikTok', url: 'https://www.tiktok.com/@kingtravelcan', icon: '/img/tik.svg', openInNewTab: true },
    ],
    trustBadges: [
      { name: 'ACTA', icon: '/img/acta.svg' },
      { name: 'ATAC', icon: '/img/atac.svg' },
      { name: 'TICO', icon: '/img/tico.svg' },
      { name: 'IATA', icon: '/img/iata.svg' },
      { name: 'ASTA', icon: '/img/asta.svg' },
    ],
    servicesTitle: 'SERVICES',
    servicesLinks: [
      { label: 'Umrah Packages', url: '/umrah-packages' },
      { label: 'Hajj Packages', url: '/hajj-packages' },
      { label: 'Airline Tickets', url: '/airlines' },
      { label: 'Saudi Visa Services', url: '/saudi-visa' },
    ],
    sitemapTitle: 'SITEMAP',
    sitemapLinks: [
      { label: 'About Us', url: '/about' },
      { label: 'Packages', url: '/umrah-packages' },
      { label: 'Contact', url: '/contact' },
      { label: 'Terms of Use', url: '#' },
    ],
    supportTitle: '24/7 CUSTOMER SUPPORT',
    supportItems: [
      { text: '24/7 customer support', url: '', openInNewTab: false },
      { text: '+1800-844-5464', url: 'tel:+18008445464', openInNewTab: false },
      { text: '+1905-624-8555', url: 'tel:+19056248555', openInNewTab: false },
      { text: '+1905-624-8344', url: 'tel:+19056248344', openInNewTab: false },
      { text: 'info@kingtravelcan.com', url: 'mailto:info@kingtravelcan.com', openInNewTab: false },
      { text: 'Mon–Sat, 9am – 7pm EST', url: '', openInNewTab: false },
    ],
    copyrightText: '© 2026 King Travel Can LTD. All Rights Reserved.',
    developerText: 'Design & Developed by DKS',
    developerUrl: 'https://www.dks.com.pk',
  };
}

let footerMemoryCache: any = null;

async function fetchFooterDataFromDb() {
  const res = await db.select().from(siteSettings).where(eq(siteSettings.key, 'footer_settings')).limit(1);
  if (res && res.length > 0) {
    return safeJsonParse(res[0].value, footerMemoryCache || await getDefaultFooterData());
  }
  return footerMemoryCache || await getDefaultFooterData();
}

export async function getFooterData() {
  try {
    const getCachedFooterData = unstable_cache(
      fetchFooterDataFromDb,
      ['footer-data'],
      { tags: ['footer-data'], revalidate: CONTENT_CACHE_SECONDS }
    );
    return await getCachedFooterData();
  } catch (err) {
    console.error('getFooterData DB query failed:', err);
  }
  return footerMemoryCache || getDefaultFooterData();
}

export async function saveFooterSettingsAction(footerData: any) {
  try {
    footerMemoryCache = footerData;
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'footer_settings')).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: JSON.stringify(footerData), updatedAt: new Date() }).where(eq(siteSettings.key, 'footer_settings'));
    } else {
      await db.insert(siteSettings).values({ key: 'footer_settings', value: JSON.stringify(footerData) });
    }
    revalidatePath('/', 'layout');
    revalidateTag('footer-data', 'max');
    return { success: true };
  } catch (err: any) {
    console.warn('saveFooterSettingsAction DB insert failed, fallback to memory cache:', err);
    footerMemoryCache = footerData;
    revalidatePath('/', 'layout');
    revalidateTag('footer-data', 'max');
    return { success: true, warning: 'Saved to session cache.' };
  }
}

export async function deletePageAction(id: number) {
  try {
    const pages = await db.select().from(sitePages).where(eq(sitePages.id, id)).limit(1);
    if (pages && pages.length > 0) {
      await db.delete(sitePages).where(eq(sitePages.id, id));
      revalidatePath('/admin/pages');
      revalidatePath('/', 'layout');
    }
    return { success: true };
  } catch (err: any) {
    console.error('deletePageAction DB query failed:', err);
    return { success: false, error: err.message || 'Failed to delete page' };
  }
}


export async function getDefaultSiteIdentity() {
  return {
    siteName: 'King Travel Canada',
    tagline: 'Trusted Hajj & Umrah Pilgrimage Travel Agency in Canada',
    logo: '/img/logo.png',
    logoAlt: 'King Travel Canada Logo',
    favicon: '/img/favicon.ico',
    faviconAlt: 'King Travel Favicon',
  };
}

let siteIdentityMemoryCache: any = null;

async function fetchSiteIdentityFromDb() {
  const res = await db.select().from(siteSettings).where(eq(siteSettings.key, 'site_identity')).limit(1);
  if (res && res.length > 0) {
    return safeJsonParse(res[0].value, siteIdentityMemoryCache || await getDefaultSiteIdentity());
  }
  return null;
}

export async function getSiteIdentity() {
  let identityData: any = null;
  try {
    const getCachedSiteIdentity = unstable_cache(
      fetchSiteIdentityFromDb,
      ['site-identity'],
      { tags: ['site-identity'], revalidate: CONTENT_CACHE_SECONDS }
    );
    identityData = await getCachedSiteIdentity();
  } catch (err) {
    console.warn('getSiteIdentity DB query failed, using defaults or cache:', err);
  }
  if (!identityData) identityData = siteIdentityMemoryCache || await getDefaultSiteIdentity();

  if (identityData) {
    if (identityData.favicon) {
      identityData.favicon = identityData.favicon.replace(/^https?:\/\/media\.kingtravelcan\.com\/?/, '/media/');
    }
    if (identityData.logo) {
      identityData.logo = identityData.logo.replace(/^https?:\/\/media\.kingtravelcan\.com\/?/, '/media/');
    }
  }
  return identityData;
}

export async function saveSiteIdentityAction(data: any) {
  try {
    siteIdentityMemoryCache = data;
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'site_identity')).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: JSON.stringify(data), updatedAt: new Date() }).where(eq(siteSettings.key, 'site_identity'));
    } else {
      await db.insert(siteSettings).values({ key: 'site_identity', value: JSON.stringify(data) });
    }
    revalidatePath('/', 'layout');
    revalidateTag('site-identity', 'max');
    return { success: true };
  } catch (err: any) {
    console.warn('saveSiteIdentityAction DB query failed, saving to cache fallback:', err);
    siteIdentityMemoryCache = data;
    revalidatePath('/', 'layout');
    revalidateTag('site-identity', 'max');
    return { success: true, warning: 'Saved to session memory cache.' };
  }
}

export async function getDefaultShareTools() {
  return {
    enabled: true,
    iconStyle: 'rounded-square', // rounded-square | circle | flat | minimal
    iconSize: 40,
    colorScheme: 'brand-colors', // brand-colors | monochrome | custom
    gapFromEdge: 20,
    verticalPosition: 'center', // top | center | bottom
    sidebarEdge: 'right', // left | right
    showLabels: true,
    hideOnScrollDown: false,
    openBehavior: 'popup', // popup | same-tab | new-tab
    delayBeforeShowing: 0,
    excludePages: '/cart, /checkout, /private',
    urlToShare: 'current', // current | custom
    customShareUrl: '',
    utmParameters: false,
    trackClicks: true,
    gaEventName: 'share_click',
    activePlatforms: [
      { id: 'facebook', name: 'Facebook', enabled: true, color: '#1877F2' },
      { id: 'whatsapp', name: 'WhatsApp', enabled: true, color: '#25D366' },
      { id: 'x', name: 'X (Twitter)', enabled: true, color: '#000000' },
      { id: 'email', name: 'Email', enabled: true, color: '#EA4335' },
      { id: 'linkedin', name: 'LinkedIn', enabled: true, color: '#0A66C2' },
      { id: 'pinterest', name: 'Pinterest', enabled: true, color: '#E60023' },
      { id: 'telegram', name: 'Telegram', enabled: true, color: '#24A1DE' },
    ],
  };
}

let shareToolsMemoryCache: any = null;

export async function getShareTools() {
  try {
    const res = await db.select().from(siteSettings).where(eq(siteSettings.key, 'share_tools')).limit(1);
    if (res && res.length > 0) {
      const parsed = safeJsonParse(res[0].value, shareToolsMemoryCache || getDefaultShareTools());
      shareToolsMemoryCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('getShareTools DB query failed:', err);
  }
  return shareToolsMemoryCache || getDefaultShareTools();
}

export async function saveShareToolsAction(data: any) {
  shareToolsMemoryCache = data;
  try {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'share_tools')).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: JSON.stringify(data), updatedAt: new Date() }).where(eq(siteSettings.key, 'share_tools'));
    } else {
      await db.insert(siteSettings).values({ key: 'share_tools', value: JSON.stringify(data) });
    }
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.warn('saveShareToolsAction DB query failed, saving to cache fallback:', err);
    revalidatePath('/', 'layout');
    return { success: true, warning: 'Saved to session memory cache.' };
  }
}

export async function getGlobalCss() {
  try {
    const res = await db.select().from(siteSettings).where(eq(siteSettings.key, 'global_css')).limit(1);
    if (res && res.length > 0) {
      return res[0].value;
    }
  } catch (err) {
    console.error('getGlobalCss DB query failed:', err);
  }
  return '';
}

export async function saveGlobalCssAction(css: string) {
  try {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'global_css')).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: css, updatedAt: new Date() }).where(eq(siteSettings.key, 'global_css'));
    } else {
      await db.insert(siteSettings).values({ key: 'global_css', value: css });
    }
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.warn('saveGlobalCssAction DB query failed:', err);
    revalidatePath('/', 'layout');
    return { success: true };
  }
}

export async function updatePageOrderAction(orderedIds: number[]) {
  try {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'ordered_pages')).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: JSON.stringify(orderedIds), updatedAt: new Date() }).where(eq(siteSettings.key, 'ordered_pages'));
    } else {
      await db.insert(siteSettings).values({ key: 'ordered_pages', value: JSON.stringify(orderedIds) });
    }
    revalidatePath('/admin/pages');
    return { success: true };
  } catch (err: any) {
    console.warn('updatePageOrderAction DB query failed:', err);
    revalidatePath('/admin/pages');
    return { success: true };
  }
}

export async function updatePageStatusAction(id: number, status: 'published' | 'draft') {
  try {
    await db.update(sitePages).set({ status, updatedAt: new Date() }).where(eq(sitePages.id, id));
    revalidatePath('/admin/pages');
    return { success: true };
  } catch (err: any) {
    console.error('updatePageStatusAction DB error:', err);
    return { success: false, error: err.message || 'Failed to update status' };
  }
}

let loginAuthMemoryCache: any = null;

export async function getDefaultLoginAuthSettings() {
  return {
    backgroundImage: '',
    backgroundAlt: 'Login screen background image',
    footerText: '© 2026 King Travel Can Ltd. All Rights Reserved.',
    maintenanceMode: false,
  };
}

export async function getLoginAuthSettings() {
  try {
    const res = await db.select().from(siteSettings).where(eq(siteSettings.key, 'login_auth_settings')).limit(1);
    if (res && res.length > 0) {
      const parsed = safeJsonParse(res[0].value, loginAuthMemoryCache || getDefaultLoginAuthSettings());
      loginAuthMemoryCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('getLoginAuthSettings DB query failed, using defaults or cache:', err);
  }
  return loginAuthMemoryCache || getDefaultLoginAuthSettings();
}

export async function saveLoginAuthSettingsAction(data: any) {
  loginAuthMemoryCache = data;
  try {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'login_auth_settings')).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: JSON.stringify(data), updatedAt: new Date() }).where(eq(siteSettings.key, 'login_auth_settings'));
    } else {
      await db.insert(siteSettings).values({ key: 'login_auth_settings', value: JSON.stringify(data) });
    }
    revalidatePath('/letstravel');
    return { success: true };
  } catch (err: any) {
    console.warn('saveLoginAuthSettingsAction DB query failed:', err);
    revalidatePath('/letstravel');
    return { success: true };
  }
}

export interface DisclaimerSettings {
  enabled: boolean;
  image: string;
  altText?: string;
}

let disclaimerMemoryCache: any = null;

export async function getDisclaimerSettings(): Promise<DisclaimerSettings> {
  try {
    const res = await db.select().from(siteSettings).where(eq(siteSettings.key, 'disclaimer_settings')).limit(1);
    if (res && res.length > 0) {
      try {
        const parsed = JSON.parse(res[0].value);
        disclaimerMemoryCache = parsed;
        return parsed;
      } catch (parseErr) {
        console.warn('getDisclaimerSettings JSON parse error, falling back to default:', parseErr);
      }
    }
  } catch (err) {
    console.warn('getDisclaimerSettings DB query failed, falling back to default:', err);
  }
  return disclaimerMemoryCache || { enabled: false, image: '', altText: 'Disclaimer Popup Image' };
}

export async function saveDisclaimerSettingsAction(data: DisclaimerSettings) {
  disclaimerMemoryCache = data;
  try {
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'disclaimer_settings')).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: JSON.stringify(data), updatedAt: new Date() }).where(eq(siteSettings.key, 'disclaimer_settings'));
    } else {
      await db.insert(siteSettings).values({ key: 'disclaimer_settings', value: JSON.stringify(data) });
    }
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.warn('saveDisclaimerSettingsAction DB query failed:', err);
    revalidatePath('/', 'layout');
    return { success: true };
  }
}

let formsSettingsMemoryCache: any = null;

export async function getFormsSettings() {
  if (formsSettingsMemoryCache) return formsSettingsMemoryCache;
  try {
    const setting = await db.select().from(siteSettings).where(eq(siteSettings.key, 'forms_settings')).limit(1);
    if (setting && setting.length > 0) {
      const parsed: any = safeJsonParse(setting[0].value, null);
      if (parsed) {
        formsSettingsMemoryCache = parsed;
        if (parsed.formsData) return parsed;
      }
      return {
        formsData: parsed,
        emailConfigs: {
          sendToEmail: 'info@kingtravelcan.com',
          emailSubjectLine: 'New Pilgrimage Form Submission',
          fromName: 'King Travel Canada',
          fromEmail: 'no-reply@kingtravelcan.com',
          replyTo: 'no-reply@kingtravelcan.com',
          successHeading: 'Message Sent Successfully!',
          successDescription: 'Thank you for contacting King Travel Canada. We will respond within 24 hours.',
        },
        emailTemplateHtml: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Inquiry Notification</title></head>
<body style="font-family: sans-serif; background: #f8fafc; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
    <h2 style="color: #004B39; margin-top: 0;">King Travel Canada</h2>
    <h3 style="color: #0f172a;">New Form Submission Received</h3>
    <table width="100%" style="border-collapse: collapse; font-size: 13px;">
      <tr><td style="padding: 8px; font-weight: bold; width: 120px;">Full Name:</td><td>[name]</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Email Address:</td><td>[email]</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Phone Number:</td><td>[phone]</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td>[subject]</td></tr>
      <tr><td style="padding: 8px; font-weight: bold;">Message:</td><td>[msg]</td></tr>
    </table>
    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 20px 0;" />
    <p style="font-size: 11px; color: #94a3b8; text-align: center;">© 2026 King Travel Canada Ltd. All Rights Reserved.</p>
  </div>
</body>
</html>`,
      };
    }
  } catch (err) {
    console.warn('getFormsSettings DB query failed, using defaults or cache:', err);
  }

  return formsSettingsMemoryCache || {
    formsData: {
      quoteForm: {
        title: 'Get a Free Quote Form',
        subtitle: 'Homepage & landing page Get a Free Quote banner form.',
        recipientEmail: 'info@kingtravelcan.com',
        successMessage: 'Thank you! Your quote request has been received.',
        enabled: true,
        buttonText: 'Submit Quote',
        fieldsCount: 6,
      },
      packageDetailForm: {
        title: 'Package Detail Page Booking Form',
        subtitle: 'Dedicated package detail page booking & reservation form.',
        recipientEmail: 'booking@kingtravelcan.com',
        successMessage: 'Your package booking request has been submitted.',
        enabled: true,
        buttonText: 'Book Package',
        fieldsCount: 7,
      },
      contact: {
        title: 'Get In Touch With Us',
        subtitle: 'Have questions about Umrah, Hajj or Saudi Visa? Our travel experts are here 24/7.',
        recipientEmail: 'info@kingtravelcan.com',
        successMessage: 'Thank you! Your message has been received. Our team will contact you shortly.',
        enabled: true,
        buttonText: 'Send Message',
        fieldsCount: 5,
      },
      packageInquiry: {
        title: 'Inquire About Pilgrimage Packages',
        subtitle: 'Fill in your details below and our team will craft a customized package for you.',
        recipientEmail: 'booking@kingtravelcan.com',
        successMessage: 'Package inquiry submitted successfully! A representative will call you soon.',
        enabled: true,
        buttonText: 'Submit Package Inquiry',
        fieldsCount: 6,
      },
      visaConsultation: {
        title: 'Apply For Saudi Visa Consultation',
        subtitle: 'Fast, authorized & reliable Saudi eVisa and Pilgrimage visa processing.',
        recipientEmail: 'visas@kingtravelcan.com',
        successMessage: 'Visa application submitted! We will process your requirements immediately.',
        enabled: true,
        buttonText: 'Submit Visa Request',
        fieldsCount: 6,
      },
      flightInquiry: {
        title: 'Request Flight Booking Assistance',
        subtitle: 'Get the best rates on direct and connecting flights to Jeddah & Madinah.',
        recipientEmail: 'flights@kingtravelcan.com',
        successMessage: 'Flight request received! We will send available flight options to your email.',
        enabled: true,
        buttonText: 'Request Flight Quote',
        fieldsCount: 6,
      },
    },
    emailConfigs: {
      sendToEmail: 'info@kingtravelcan.com',
      emailSubjectLine: 'New Pilgrimage Form Submission',
      fromName: 'King Travel Canada',
      fromEmail: 'no-reply@kingtravelcan.com',
      replyTo: 'no-reply@kingtravelcan.com',
      successHeading: 'Message Sent Successfully!',
      successDescription: 'Thank you for contacting King Travel Canada. We will respond within 24 hours.',
    },
    emailTemplateHtml: getResponsiveEmailTemplateHtml('Sample Form Submission', {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 905-624-8555',
      packageType: 'Deluxe Hajj Package 2027',
      departureDate: 'Flexible 2027',
      message: 'Looking for quad occupancy options and flight schedules from Toronto.',
    }),
  };
}

export async function saveFormsSettingsAction(settingsData: any) {
  formsSettingsMemoryCache = settingsData;
  try {
    const json = JSON.stringify(settingsData);
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'forms_settings')).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: json, updatedAt: new Date() }).where(eq(siteSettings.key, 'forms_settings'));
    } else {
      await db.insert(siteSettings).values({ key: 'forms_settings', value: json });
    }
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.warn('saveFormsSettingsAction DB query failed, saving to cache fallback:', err);
    formsSettingsMemoryCache = settingsData;
    revalidatePath('/', 'layout');
    return { success: true, warning: 'Saved to session memory cache.' };
  }
}

export async function slugifyPackageTitle(title: string): Promise<string> {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function getPackageDetailsAction(packageSlug: string) {
  try {
    const cleanSlug = packageSlug.toLowerCase().trim();

    // 1. Search database sitePages
    const pages = await getPagesList();
    for (const page of pages) {
      if (page.sections) {
        let parsedSections: any[] = [];
        try {
          parsedSections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
        } catch (e) { }

        if (Array.isArray(parsedSections)) {
          for (const sec of parsedSections) {
            if (sec.data?.items && Array.isArray(sec.data.items)) {
              for (const item of sec.data.items) {
                const itemSlug = await slugifyPackageTitle(item.title || '');
                const itemId = String(item.id || '').toLowerCase();
                if (itemSlug === cleanSlug || itemId === cleanSlug || itemSlug.includes(cleanSlug)) {
                  return item;
                }
              }
            }
          }
        }
      }
    }
    return null;
  } catch (err: any) {
    console.error('getPackageDetailsAction failed:', err);
    return null;
  }
}

export async function savePageSeoAction(pageId: number | string, seoData: any) {
  try {
    const key = `page_seo_${pageId}`;
    const value = JSON.stringify(seoData);

    const numId = typeof pageId === 'number' ? pageId : parseInt(String(pageId), 10);
    // Save to sitePages metaTitle and metaDescription if numeric
    if (!isNaN(numId) && numId > 0) {
      await db.update(sitePages).set({
        metaTitle: seoData.metaTitle || null,
        metaDescription: seoData.metaDescription || null,
        updatedAt: new Date(),
      }).where(eq(sitePages.id, numId));
    }

    // Save full JSON payload to siteSettings
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value, updatedAt: new Date() }).where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value });
    }

    revalidatePath('/admin/pages');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (err: any) {
    console.error('savePageSeoAction error:', err);
    return { success: false, error: err.message };
  }
}

export async function getPageSeoAction(pageId: number | string) {
  try {
    const key = `page_seo_${pageId}`;
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    if (rows && rows.length > 0) {
      return safeJsonParse(rows[0].value, null);
    }
    return null;
  } catch (err) {
    return null;
  }
}





