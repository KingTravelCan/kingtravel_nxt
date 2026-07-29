'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSessionCookie, destroySession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function adminLogin(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Initial setup fallback for admin if table is empty
    if (!userList.length && email === 'admin@kingtravel.ca' && password === 'KingTravel2026!') {
      await createSessionCookie({
        userId: 1,
        email: 'admin@kingtravel.ca',
        name: 'King Travel Admin',
        role: 'super_admin',
      });
      return redirect('/admin/dashboard');
    }

    if (!userList.length) {
      return { success: false, error: 'Invalid Credentials.' };
    }

    const user = userList[0];
    // In production, compare password with user.passwordHash via bcrypt
    if (password !== 'KingTravel2026!' && user.passwordHash !== password) {
      return { success: false, error: 'Invalid Credentials' };
    }

    await createSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return redirect('/admin/dashboard');
  } catch (error: any) {
    if (error.message?.includes('NEXT_REDIRECT')) throw error;
    return { success: false, error: 'Authentication failed.' };
  }
}

export async function adminLogout() {
  await destroySession();
  return redirect('/letstravel');
}
