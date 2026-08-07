import { db } from './src/db';
import { sitePages } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function check() {
  try {
    const pages = await db.select().from(sitePages).where(eq(sitePages.slug, '/'));
    if (pages.length > 0) {
      const page = pages[0];
      const sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
      const hero = sections.find((s: any) => s.type === 'Homepage Hero Banner' || s.type === 'Hero Slider');
      console.log(JSON.stringify(hero, null, 2));
    } else {
      console.log("Page not found");
    }
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
