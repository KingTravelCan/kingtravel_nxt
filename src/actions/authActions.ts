'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSessionCookie, destroySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { verifyPassword } from '@/lib/password';

export async function adminLogin(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  try {
    const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Initial setup fallback if database table is empty
    if (!userList.length) {
      const envEmail = (process.env.INITIAL_ADMIN_EMAIL || 'hassan@kingtravelcan.com').trim().toLowerCase();
      const envPassword = process.env.INITIAL_ADMIN_PASSWORD || 'KingTravel2026!';
      if (email === envEmail && password === envPassword) {
        await createSessionCookie({
          userId: 1,
          email: envEmail,
          name: 'Super Admin',
          role: 'super_admin',
        });
        return redirect('/admin/dashboard');
      }
      return { success: false, error: 'Invalid Credentials.' };
    }

    const user = userList[0];

    // Check account status
    if (!user.active) {
      return { success: false, error: 'This user account is currently disabled.' };
    }

    // Verify hashed password securely
    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Invalid Credentials.' };
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
