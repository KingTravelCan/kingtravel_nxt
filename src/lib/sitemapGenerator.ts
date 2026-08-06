import { db } from '@/db';
import { sitePages, packages, blogPosts, visaServices, sitemapConfigs, sitemapLogs } from '@/db/schema';
import { eq, or, and, isNotNull } from 'drizzle-orm';

interface SitemapItem {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  images?: string[];
}

export async function generateSitemapXml(baseUrl: string): Promise<string> {
  const items = await gatherAllSitemapItems(baseUrl);
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
  
  for (const item of items) {
    xml += `  <url>\n`;
    xml += `    <loc>${item.loc}</loc>\n`;
    if (item.lastmod) xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    if (item.changefreq) xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    if (item.priority) xml += `    <priority>${item.priority}</priority>\n`;
    
    if (item.images && item.images.length > 0) {
      for (const img of item.images) {
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${img}</image:loc>\n`;
        xml += `    </image:image>\n`;
      }
    }
    xml += `  </url>\n`;
  }
  
  xml += `</urlset>`;
  
  return xml;
}

export async function gatherAllSitemapItems(baseUrl: string): Promise<SitemapItem[]> {
  const configs = await db.select().from(sitemapConfigs);
  
  const getConfig = (type: string) => {
    return configs.find(c => c.contentType === type) || {
      includeInSitemap: true,
      changeFrequency: 'monthly',
      priority: '0.5',
      includeImages: true,
      includeLastModified: true
    };
  };

  const globalConfig = getConfig('global');
  if (globalConfig.includeInSitemap === false) {
    return [];
  }

  const items: SitemapItem[] = [];

  // Helper to parse seoSettings JSON
  const parseSeoSettings = (jsonStr: any) => {
    if (!jsonStr) return {};
    if (typeof jsonStr === 'string') {
      try { return JSON.parse(jsonStr); } catch (e) { return {}; }
    }
    return jsonStr;
  };

  // 1. Pages
  const pageConfig = getConfig('sitePages');
  if (pageConfig.includeInSitemap !== false) {
    const pages = await db.select().from(sitePages).where(eq(sitePages.status, 'published'));
    for (const page of pages) {
      const seo = parseSeoSettings(page.seoSettings);
      if (seo.includeInSitemap === false || seo.noIndex === true) continue;
      
      const slug = page.slug === 'home' || page.slug === '/' ? '' : page.slug;
      const url = seo.canonicalUrl || seo.customUrl || `${baseUrl}/${slug}`;
      
      items.push({
        loc: url,
        lastmod: pageConfig.includeLastModified !== false ? (seo.lastModifiedOverride || page.updatedAt?.toISOString().split('T')[0]) : undefined,
        changefreq: seo.changeFrequency || pageConfig.changeFrequency || 'monthly',
        priority: seo.priority || pageConfig.priority || '0.8',
        images: pageConfig.includeImages !== false && page.bannerBgImage ? [page.bannerBgImage] : []
      });
    }
  }

  // 2. Packages
  const pkgConfig = getConfig('packages');
  if (pkgConfig.includeInSitemap !== false) {
    const pkgs = await db.select().from(packages).where(eq(packages.status, 'available'));
    for (const pkg of pkgs) {
      const seo = parseSeoSettings(pkg.seoSettings);
      if (seo.includeInSitemap === false || seo.noIndex === true) continue;
      
      const url = seo.canonicalUrl || seo.customUrl || `${baseUrl}/packages/${pkg.slug}`;
      
      items.push({
        loc: url,
        lastmod: pkgConfig.includeLastModified !== false ? (seo.lastModifiedOverride || pkg.updatedAt?.toISOString().split('T')[0]) : undefined,
        changefreq: seo.changeFrequency || pkgConfig.changeFrequency || 'weekly',
        priority: seo.priority || pkgConfig.priority || '0.9',
        images: pkgConfig.includeImages !== false && pkg.featuredImage ? [pkg.featuredImage] : []
      });
    }
  }

  // 3. Blog Posts
  const blogConfig = getConfig('blogPosts');
  if (blogConfig.includeInSitemap !== false) {
    const posts = await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true));
    for (const post of posts) {
      const seo = parseSeoSettings(post.seoSettings);
      if (seo.includeInSitemap === false || seo.noIndex === true) continue;
      
      const url = seo.canonicalUrl || seo.customUrl || `${baseUrl}/blog/${post.slug}`;
      
      items.push({
        loc: url,
        lastmod: blogConfig.includeLastModified !== false ? (seo.lastModifiedOverride || post.updatedAt?.toISOString().split('T')[0]) : undefined,
        changefreq: seo.changeFrequency || blogConfig.changeFrequency || 'weekly',
        priority: seo.priority || blogConfig.priority || '0.7',
        images: blogConfig.includeImages !== false && post.featuredImage ? [post.featuredImage] : []
      });
    }
  }

  // 4. Visa Services
  const visaConfig = getConfig('visaServices');
  if (visaConfig.includeInSitemap !== false) {
    const visas = await db.select().from(visaServices).where(eq(visaServices.isPublished, true));
    for (const visa of visas) {
      const seo = parseSeoSettings(visa.seoSettings);
      if (seo.includeInSitemap === false || seo.noIndex === true) continue;
      
      const url = seo.canonicalUrl || seo.customUrl || `${baseUrl}/services/${visa.slug}`;
      
      items.push({
        loc: url,
        lastmod: visaConfig.includeLastModified !== false ? (seo.lastModifiedOverride || visa.createdAt?.toISOString().split('T')[0]) : undefined,
        changefreq: seo.changeFrequency || visaConfig.changeFrequency || 'monthly',
        priority: seo.priority || visaConfig.priority || '0.6',
        images: visaConfig.includeImages !== false && visa.imageUrl ? [visa.imageUrl] : []
      });
    }
  }

  return items;
}
