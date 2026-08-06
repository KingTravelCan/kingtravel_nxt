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

export async function getRecentActivities(limit?: number): Promise<ActivityItem[]> {
  try {
    const setting = await db.select().from(siteSettings).where(eq(siteSettings.key, 'activity_logs')).limit(1);
    if (setting && setting.length > 0) {
      const parsed = JSON.parse(setting[0].value);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, limit || 50);
      }
    }
    return [];
  } catch (err) {
    console.error('getRecentActivities DB query failed:', err);
    throw new Error('Failed to fetch recent activities');
  }
}

export async function logAdminActivityAction(entry: Omit<ActivityItem, 'id' | 'timestamp'>) {
  try {
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeAgo: 'Just now',
      ...entry,
    };

    let currentActivities: ActivityItem[] = [];
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, 'activity_logs')).limit(1);

    if (existing && existing.length > 0) {
      currentActivities = JSON.parse(existing[0].value);
      if (!Array.isArray(currentActivities)) currentActivities = [];
    }
    
    const newActivities = [newActivity, ...currentActivities].slice(0, 100);
    const json = JSON.stringify(newActivities);

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
    return { success: false, error: err.message || 'Failed to log activity' };
  }
}
