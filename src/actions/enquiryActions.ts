'use server';

import { db } from '@/db';
import { enquiries } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function submitQuoteRequest(formData: FormData) {
  try {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const preferredPackageType = formData.get('packageType') as string || 'Umrah';
    const departureMonth = formData.get('departureMonth') as string || 'Soon';
    const adults = parseInt(formData.get('adults') as string || '1', 10);
    const children = parseInt(formData.get('children') as string || '0', 10);
    const infants = parseInt(formData.get('infants') as string || '0', 10);
    const occupancy = formData.get('occupancy') as string || 'Quad';
    const city = formData.get('city') as string || '';
    const province = formData.get('province') as string || '';
    const message = formData.get('message') as string || '';

    if (!fullName || !email || !phone) {
      return { success: false, error: 'Full Name, Email, and Phone number are required.' };
    }

    const enquiryNumber = `KT-${Date.now().toString().slice(-6)}`;

    await db.insert(enquiries).values({
      enquiryNumber,
      type: 'quote_request',
      fullName,
      email,
      phone,
      city,
      province,
      preferredPackageType,
      departureMonth,
      adults,
      children,
      infants,
      occupancy,
      message,
      status: 'new',
    });

    revalidatePath('/admin/enquiries');
    return { success: true, enquiryNumber, message: 'Thank you! Your quote request has been received. Our pilgrimage specialist will contact you shortly.' };
  } catch (error: any) {
    console.error('Error submitting quote request:', error);
    return { success: false, error: 'Failed to submit quote request. Please try again or contact us via WhatsApp.' };
  }
}

export async function submitPackageEnquiry(formData: FormData) {
  try {
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const packageId = formData.get('packageId') ? parseInt(formData.get('packageId') as string, 10) : undefined;
    const packageName = formData.get('packageName') as string || 'Package Enquiry';
    const message = formData.get('message') as string || '';

    if (!fullName || !email || !phone) {
      return { success: false, error: 'Full Name, Email, and Phone number are required.' };
    }

    const enquiryNumber = `KT-PKG-${Date.now().toString().slice(-6)}`;

    await db.insert(enquiries).values({
      enquiryNumber,
      type: 'package_enquiry',
      fullName,
      email,
      phone,
      packageId,
      preferredPackageType: packageName,
      message,
      status: 'new',
    });

    revalidatePath('/admin/enquiries');
    return { success: true, enquiryNumber, message: 'Your package enquiry has been received successfully.' };
  } catch (error: any) {
    console.error('Error submitting package enquiry:', error);
    return { success: false, error: 'Failed to submit enquiry. Please try again.' };
  }
}

export async function updateEnquiryStatus(enquiryId: number, status: any, internalNotes?: string): Promise<void> {
  try {
    await db.update(enquiries)
      .set({
        status,
        internalNotes: internalNotes || undefined,
        updatedAt: new Date(),
      })
      .where(eq(enquiries.id, enquiryId));

    revalidatePath('/admin/enquiries');
  } catch (error) {
    console.error('Error updating enquiry status:', error);
  }
}

export async function getEnquiriesList() {
  try {
    return await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
  } catch {
    return [];
  }
}
