'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { hashPassword } from '@/lib/password';

let ensureColumnsRan = false;

async function ensureUserColumnsExist() {
  if (ensureColumnsRan) return;
  ensureColumnsRan = true;
  try {
    await db.execute(sql`ALTER TABLE \`users\` ADD COLUMN \`badge_bg\` varchar(32) DEFAULT '#0F766E'`);
  } catch (e) {}
  try {
    await db.execute(sql`ALTER TABLE \`users\` ADD COLUMN \`badge_text_color\` varchar(32) DEFAULT '#FFFFFF'`);
  } catch (e) {}
}

export async function getUsersList() {
  try {
    await ensureUserColumnsExist();
    let list = await db.select().from(users);

    // If database table is empty, seed default admin user into database
    if (!list || list.length === 0) {
      const initEmail = (process.env.INITIAL_ADMIN_EMAIL || 'hassan@kingtravelcan.com').trim().toLowerCase();
      const initPwd = process.env.INITIAL_ADMIN_PASSWORD || 'KingTravel2026!';
      const defaultUser = {
        name: 'Hassan',
        email: initEmail,
        passwordHash: hashPassword(initPwd),
        role: 'super_admin' as const,
        active: true,
        badgeBg: '#64F900',
        badgeTextColor: '#000000',
      };
      try {
        await db.insert(users).values(defaultUser);
        list = await db.select().from(users);
      } catch (seedErr) {
        console.error('Failed to seed default admin user to DB:', seedErr);
      }
    }

    return list || [];
  } catch (err: any) {
    if (err?.message?.includes('badge_bg') || err?.code === 'ER_BAD_FIELD_ERROR') {
      try {
        ensureColumnsRan = false;
        await ensureUserColumnsExist();
        const retryList = await db.select().from(users);
        return retryList || [];
      } catch (retryErr) {
        console.error('Retry getUsersList failed:', retryErr);
      }
    }
    console.error('getUsersList DB query failed:', err);
    return [];
  }
}

export async function createUserAction(data: {
  name: string;
  email: string;
  password?: string;
  role: string;
  active: boolean;
  badgeBg?: string;
  badgeTextColor?: string;
}) {
  try {
    await ensureUserColumnsExist();
    const emailLower = data.email.trim().toLowerCase();

    // Check duplicate in MySQL DB
    const existing = await db.select().from(users).where(eq(users.email, emailLower)).limit(1);
    if (existing && existing.length > 0) {
      return { success: false, error: 'User with this email already exists in database.' };
    }

    let plainPassword = data.password && data.password.trim() ? data.password.trim() : '';
    if (!plainPassword) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      const bytes = require('crypto').randomBytes(12);
      for (let i = 0; i < 12; i++) {
        plainPassword += chars[bytes[i] % chars.length];
      }
    }
    const hashedPassword = hashPassword(plainPassword);

    const newUserObj = {
      name: data.name.trim(),
      email: emailLower,
      passwordHash: hashedPassword,
      role: (data.role || 'admin') as any,
      active: data.active,
      badgeBg: data.badgeBg || '#0F766E',
      badgeTextColor: data.badgeTextColor || '#FFFFFF',
    };

    const res = await db.insert(users).values(newUserObj);
    const insertId = res && res[0]?.insertId ? Number(res[0].insertId) : 0;

    revalidatePath('/admin/settings');
    return {
      success: true,
      user: {
        id: insertId,
        ...newUserObj,
        createdAt: new Date(),
      },
    };
  } catch (err: any) {
    console.error('createUserAction DB insert error:', err);
    return { success: false, error: err.message || 'Failed to create user in database.' };
  }
}

export async function updateUserAction(
  id: number,
  data: {
    name: string;
    email: string;
    password?: string;
    role: string;
    active: boolean;
    badgeBg?: string;
    badgeTextColor?: string;
  }
) {
  try {
    await ensureUserColumnsExist();
    const emailLower = data.email.trim().toLowerCase();

    const updateObj: any = {
      name: data.name.trim(),
      email: emailLower,
      role: data.role,
      active: data.active,
      badgeBg: data.badgeBg || '#0F766E',
      badgeTextColor: data.badgeTextColor || '#FFFFFF',
      updatedAt: new Date(),
    };

    // Only update passwordHash if new password is provided
    if (data.password && data.password.trim().length > 0) {
      updateObj.passwordHash = hashPassword(data.password.trim());
    }

    await db.update(users).set(updateObj).where(eq(users.id, id));

    revalidatePath('/admin/settings');
    return { success: true };
  } catch (err: any) {
    console.error('updateUserAction DB update error:', err);
    return { success: false, error: err.message || 'Failed to update user in database.' };
  }
}

export async function deleteUserAction(id: number) {
  try {
    await db.delete(users).where(eq(users.id, id));
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (err: any) {
    console.error('deleteUserAction DB delete error:', err);
    return { success: false, error: err.message || 'Failed to delete user from database.' };
  }
}
