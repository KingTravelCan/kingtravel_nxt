import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface ActivityItem {
  id: string;
  type: 'pages' | 'users' | 'packages' | 'visas' | 'settings' | 'enquiries' | 'menus';
  action: string;
  user: string;
  userEmail?: string;
  details?: string;
  timestamp: string;
  timeAgo?: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'users',
    action: 'Login User',
    user: 'Hassan',
    userEmail: 'hassan@kingtravelcan.com',
    details: 'Authenticated Super Admin session',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    timeAgo: '4h ago',
  },
  {
    id: 'act-2',
    type: 'settings',
    action: 'Update Disclaimer Popup',
    user: 'Hassan',
    userEmail: 'hassan@kingtravelcan.com',
    details: '{"enabled": true, "frequency": "2 times / 12 hrs"}',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    timeAgo: '6h ago',
  },
  {
    id: 'act-3',
    type: 'pages',
    action: 'Update Page Status',
    user: 'Hassan',
    userEmail: 'hassan@kingtravelcan.com',
    details: '{"page": "/umrah-packages", "status": "published"}',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    timeAgo: '12h ago',
  },
  {
    id: 'act-4',
    type: 'menus',
    action: 'Update Header Navigation',
    user: 'Hassan',
    userEmail: 'hassan@kingtravelcan.com',
    details: '{"label": "Umrah Packages", "url": "/umrah-packages"}',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    timeAgo: '1d ago',
  },
  {
    id: 'act-5',
    type: 'packages',
    action: 'Update Umrah Package',
    user: 'Hassan',
    userEmail: 'hassan@kingtravelcan.com',
    details: '{"package": "14 Days Premium Umrah", "price": "$2,450"}',
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    timeAgo: '1d ago',
  },
  {
    id: 'act-6',
    type: 'visas',
    action: 'Update Visa Solution',
    user: 'Hassan',
    userEmail: 'hassan@kingtravelcan.com',
    details: '{"visa": "Saudi Tourist eVisa", "status": "active"}',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    timeAgo: '1d ago',
  },
  {
    id: 'act-7',
    type: 'enquiries',
    action: 'Review Pilgrim Enquiry',
    user: 'Hassan',
    userEmail: 'hassan@kingtravelcan.com',
    details: '{"enquiryId": "ENQ-1002", "status": "contacted"}',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    timeAgo: '2d ago',
  },
  {
    id: 'act-8',
    type: 'settings',
    action: 'Save Global CSS Overrides',
    user: 'Hassan',
    userEmail: 'hassan@kingtravelcan.com',
    details: 'Updated theme rules & custom font styles',
    timestamp: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
    timeAgo: '2d ago',
  },
];

let activityMemoryCache: ActivityItem[] = [...DEFAULT_ACTIVITIES];

export async function getRecentActivities(limit?: number): Promise<ActivityItem[]> {
  try {
    const setting = await db.select().from(siteSettings).where(eq(siteSettings.key, 'activity_logs')).limit(1);
    if (setting && setting.length > 0) {
      const parsed = JSON.parse(setting[0].value);
      if (Array.isArray(parsed) && parsed.length > 0) {
        activityMemoryCache = parsed;
      }
    }
  } catch (err) {
    console.warn('getRecentActivities DB query failed, using memory cache:', err);
  }

  const list = activityMemoryCache.slice(0, limit || 50);
  return list;
}

export async function logAdminActivityAction(entry: Omit<ActivityItem, 'id' | 'timestamp'>) {
  try {
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      ...entry,
    };

    activityMemoryCache = [newActivity, ...activityMemoryCache];

    const json = JSON.stringify(activityMemoryCache.slice(0, 100));
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'activity_logs')).limit(1);

    if (existing && existing.length > 0) {
      await db.update(siteSettings).set({ value: json, updatedAt: new Date() }).where(eq(siteSettings.key, 'activity_logs'));
    } else {
      await db.insert(siteSettings).values({ key: 'activity_logs', value: json });
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/activity');
    return { success: true };
  } catch (err: any) {
    console.error('logAdminActivityAction failed:', err);
    return { success: false };
  }
}
