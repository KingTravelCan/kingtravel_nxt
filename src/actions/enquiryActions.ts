'use server';

import { db } from '@/db';
import {
  enquiries,
  quoteEnquiries,
  packageBookingEnquiries,
  contactEnquiries,
  visaEnquiries,
  flightEnquiries,
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { dispatchFormEmails } from '@/lib/emailService';

export async function submitQuoteEnquiryAction(data: {
  fullName: string;
  phone: string;
  email: string;
  packageType?: string;
  departureDate?: string;
  adults?: number;
}) {
  try {
    const { fullName, phone, email, packageType = 'Umrah Package', departureDate = '', adults = 1 } = data;

    if (!fullName || !email || !phone) {
      return { success: false, error: 'Full Name, Email, and Phone number are required.' };
    }

    const enquiryNumber = `QT-${Date.now().toString().slice(-6)}`;

    // 1. Insert into dedicated quote_enquiries table
    try {
      await db.insert(quoteEnquiries).values({
        enquiryNumber,
        fullName,
        phone,
        email,
        packageType,
        departureDate,
        adults,
        status: 'new',
      });
    } catch (subErr) {
      console.warn('Quote sub-table insert warning:', subErr);
    }

    // 2. Aggregate in unified enquiries table
    await db.insert(enquiries).values({
      enquiryNumber,
      type: 'quote_request',
      fullName,
      email,
      phone,
      preferredPackageType: packageType,
      departureMonth: departureDate,
      adults,
      status: 'new',
    });

    // Dispatch Dual Emails (Admin Notification + User Confirmation)
    dispatchFormEmails('Get a Free Quote Form', {
      enquiryNumber,
      fullName,
      email,
      phone,
      packageType,
      departureDate,
      adults,
    });

    revalidatePath('/admin/enquiries');
    revalidatePath('/admin/dashboard');
    return {
      success: true,
      enquiryNumber,
      message: 'Thank you! Your quote request has been submitted to the database. Our specialist will contact you shortly.',
    };
  } catch (error: any) {
    console.error('Error submitting quote enquiry:', error);
    return { success: false, error: 'Failed to submit quote request. Please try again.' };
  }
}

export async function submitPackageBookingEnquiryAction(data: {
  packageId?: number;
  packageName?: string;
  fullName: string;
  phone: string;
  email: string;
  adults?: number;
  children?: number;
  infants?: number;
  startDate?: string;
  totalPrice?: string;
  message?: string;
}) {
  try {
    const {
      packageId,
      packageName = 'Umrah 2026 Package',
      fullName,
      phone,
      email,
      adults = 1,
      children = 0,
      infants = 0,
      startDate = '',
      totalPrice = '',
      message = '',
    } = data;

    if (!fullName || !email || !phone) {
      return { success: false, error: 'Full Name, Email, and Phone number are required.' };
    }

    const bookingNumber = `BK-${Date.now().toString().slice(-6)}`;

    // 1. Insert into dedicated package_booking_enquiries table
    try {
      await db.insert(packageBookingEnquiries).values({
        bookingNumber,
        packageId,
        packageName,
        fullName,
        phone,
        email,
        adults,
        children,
        infants,
        startDate,
        totalPrice,
        status: 'new',
      });
    } catch (subErr) {
      console.warn('Booking sub-table insert warning:', subErr);
    }

    // 2. Aggregate in unified enquiries table
    await db.insert(enquiries).values({
      enquiryNumber: bookingNumber,
      type: 'package_enquiry',
      fullName,
      email,
      phone,
      packageId,
      preferredPackageType: packageName,
      adults,
      children,
      infants,
      departureMonth: startDate,
      status: 'new',
    });

    // Dispatch Dual Emails (Admin Notification + User Confirmation)
    dispatchFormEmails('Package Detail Page Booking Form', {
      bookingNumber,
      packageName,
      fullName,
      email,
      phone,
      adults,
      children,
      infants,
      startDate,
      totalPrice,
      message,
    });

    revalidatePath('/admin/enquiries');
    revalidatePath('/admin/dashboard');
    return {
      success: true,
      bookingNumber,
      message: 'Your package booking request has been saved successfully in the database!',
    };
  } catch (error: any) {
    console.error('Error submitting package booking enquiry:', error);
    return { success: false, error: 'Failed to submit package booking. Please try again.' };
  }
}

export async function submitContactEnquiryAction(data: {
  fullName: string;
  email: string;
  phone: string;
  website?: string;
  packageType?: string;
  message: string;
}) {
  try {
    const { fullName, email, phone, website = '', packageType = '', message } = data;

    if (!fullName || !email) {
      return { success: false, error: 'Full Name and Email are required.' };
    }

    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;

    // 1. Insert into dedicated contact_enquiries table
    try {
      await db.insert(contactEnquiries).values({
        ticketNumber,
        fullName,
        email,
        phone: phone || 'N/A',
        website,
        packageType,
        message,
        status: 'new',
      });
    } catch (subErr) {
      console.warn('Contact sub-table insert warning:', subErr);
    }

    // 2. Aggregate in unified enquiries table
    await db.insert(enquiries).values({
      enquiryNumber: ticketNumber,
      type: 'general_contact',
      fullName,
      email,
      phone: phone || 'N/A',
      preferredPackageType: packageType || 'General Contact',
      message,
      status: 'new',
    });

    // Dispatch Dual Emails (Admin Notification + User Confirmation)
    dispatchFormEmails('Contact Us Form', {
      ticketNumber,
      fullName,
      email,
      phone,
      packageType,
      website,
      message,
    });

    revalidatePath('/admin/enquiries');
    revalidatePath('/admin/dashboard');
    return {
      success: true,
      ticketNumber,
      message: 'Thank you! Your message has been logged in our database.',
    };
  } catch (error: any) {
    console.error('Error submitting contact enquiry:', error);
    return { success: false, error: 'Failed to send message. Please try again.' };
  }
}

export async function submitVisaEnquiryAction(data: {
  visaServiceId?: number;
  visaTitle?: string;
  fullName: string;
  email: string;
  phone: string;
  travelersCount?: number;
  nationality?: string;
  message?: string;
}) {
  try {
    const {
      visaServiceId,
      visaTitle = 'Saudi Tourist eVisa',
      fullName,
      email,
      phone,
      travelersCount = 1,
      nationality = 'Canadian',
      message = '',
    } = data;

    if (!fullName || !email || !phone) {
      return { success: false, error: 'Full Name, Email, and Phone are required.' };
    }

    const enquiryNumber = `VSA-${Date.now().toString().slice(-6)}`;

    try {
      await db.insert(visaEnquiries).values({
        enquiryNumber,
        visaServiceId,
        visaTitle,
        fullName,
        email,
        phone,
        travelersCount,
        nationality,
        message,
        status: 'new',
      });
    } catch (subErr) {
      console.warn('Visa sub-table insert warning:', subErr);
    }

    await db.insert(enquiries).values({
      enquiryNumber,
      type: 'visa_enquiry',
      fullName,
      email,
      phone,
      visaServiceId,
      preferredPackageType: visaTitle,
      adults: travelersCount,
      message,
      status: 'new',
    });

    // Dispatch Dual Emails (Admin Notification + User Confirmation)
    dispatchFormEmails('Visa Consultation Form', {
      enquiryNumber,
      visaTitle,
      fullName,
      email,
      phone,
      travelersCount,
      nationality,
      message,
    });

    revalidatePath('/admin/enquiries');
    revalidatePath('/admin/dashboard');
    return { success: true, enquiryNumber, message: 'Visa consultation request received!' };
  } catch (error: any) {
    console.error('Error submitting visa enquiry:', error);
    return { success: false, error: 'Failed to submit visa enquiry.' };
  }
}

export async function submitQuoteRequest(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const packageType = (formData.get('packageType') as string) || 'Umrah Package';
  const departureDate = (formData.get('departureDate') as string) || '';
  const adults = parseInt((formData.get('adults') as string) || '1', 10);

  return await submitQuoteEnquiryAction({ fullName, email, phone, packageType, departureDate, adults });
}

export async function submitPackageEnquiry(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const packageName = (formData.get('packageName') as string) || 'Package Enquiry';
  const message = (formData.get('message') as string) || '';

  return await submitPackageBookingEnquiryAction({ fullName, email, phone, packageName, message });
}

export async function getEnquiriesList() {
  try {
    return await db.select().from(enquiries).orderBy(desc(enquiries.createdAt));
  } catch {
    return [];
  }
}

export async function getQuoteEnquiriesList() {
  try {
    return await db.select().from(quoteEnquiries).orderBy(desc(quoteEnquiries.createdAt));
  } catch {
    return [];
  }
}

export async function getPackageBookingEnquiriesList() {
  try {
    return await db.select().from(packageBookingEnquiries).orderBy(desc(packageBookingEnquiries.createdAt));
  } catch {
    return [];
  }
}

export async function getContactEnquiriesList() {
  try {
    return await db.select().from(contactEnquiries).orderBy(desc(contactEnquiries.createdAt));
  } catch {
    return [];
  }
}

export async function submitFlightEnquiryAction(data: {
  fullName: string;
  email: string;
  phone: string;
  originCity?: string;
  destinationCity?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
}) {
  try {
    const {
      fullName,
      email,
      phone,
      originCity = 'Toronto (YYZ)',
      destinationCity = 'Jeddah (JED)',
      departureDate = '',
      returnDate = '',
      passengers = 1,
    } = data;

    if (!fullName || !email || !phone) {
      return { success: false, error: 'Full Name, Email, and Phone are required.' };
    }

    const enquiryNumber = `FLT-${Date.now().toString().slice(-6)}`;

    try {
      await db.insert(flightEnquiries).values({
        enquiryNumber,
        fullName,
        email,
        phone,
        originCity,
        destinationCity,
        departureDate,
        returnDate,
        passengers,
        status: 'new',
      });
    } catch (subErr) {
      console.warn('Flight sub-table insert warning:', subErr);
    }

    await db.insert(enquiries).values({
      enquiryNumber,
      type: 'flight_enquiry',
      fullName,
      email,
      phone,
      preferredPackageType: `Flight: ${originCity} to ${destinationCity}`,
      adults: passengers,
      departureMonth: departureDate,
      status: 'new',
    });

    // Dispatch Dual Emails (Admin Notification + User Confirmation)
    dispatchFormEmails('Flight Booking Form', {
      enquiryNumber,
      fullName,
      email,
      phone,
      originCity,
      destinationCity,
      departureDate,
      returnDate,
      passengers,
    });

    revalidatePath('/admin/enquiries');
    revalidatePath('/admin/dashboard');
    return { success: true, enquiryNumber, message: 'Flight booking request received!' };
  } catch (error: any) {
    console.error('Error submitting flight enquiry:', error);
    return { success: false, error: 'Failed to submit flight enquiry.' };
  }
}

export async function getFlightEnquiriesList() {
  try {
    return await db.select().from(flightEnquiries).orderBy(desc(flightEnquiries.createdAt));
  } catch {
    return [];
  }
}

export async function getVisaEnquiriesList() {
  try {
    return await db.select().from(visaEnquiries).orderBy(desc(visaEnquiries.createdAt));
  } catch {
    return [];
  }
}

export async function updateEnquiryStatus(enquiryId: number, status: any, internalNotes?: string): Promise<void> {
  try {
    await db
      .update(enquiries)
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

export async function deleteEnquiryAction(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    await db.delete(enquiries).where(eq(enquiries.id, id));
    revalidatePath('/admin/enquiries');
    revalidatePath('/admin/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting enquiry:', error);
    return { success: false, error: error.message || 'Failed to delete enquiry from database.' };
  }
}
