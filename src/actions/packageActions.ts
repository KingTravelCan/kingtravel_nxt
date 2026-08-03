'use server';

import { db } from '@/db';
import { packages, packagePrices, packageHotels } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const defaultFallbackPackages = [
  {
    id: 1,
    title: 'Customize Umrah Package 2026',
    slug: 'customized-umrah-package-2026',
    type: 'umrah' as const,
    month: 'Flexible 2026 (10, 15 Days)',
    startingPrice: '1995.00',
    starRating: '5 Star',
    status: 'available' as const,
    featuredImage: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Flexible 10 or 15 days customized 5-Star Umrah packages tailored to your schedule.',
    fullDescription: 'Experience the holy journey of Umrah customized to your specific travel dates, airline preference, and room accommodations.',
    inclusions: JSON.stringify([
      'Return Flights from Toronto (YYZ)',
      '5-Star Hotels in Makkah & Madinah',
      'Saudi Tourist / Umrah Visa Assistance',
      'Luxury Air-Conditioned Transfers',
      'Guided Ziyarat in Makkah & Madinah',
      '24/7 Canadian Ground Support Staff',
    ]),
    departureCity: 'Toronto (YYZ)',
    destination: 'Makkah & Madinah',
    departureDate: '2026-08-01',
    returnDate: '2026-08-15',
    durationDays: 14,
    airline: 'Saudi Airlines / Turkish Airlines',
    availableSeats: 25,
    totalCapacity: 30,
    bookingDeadline: '2026-07-15',
    isFeatured: true,
    displayOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: 'August 5-Star Umrah Package 2026',
    slug: 'august-5-star-umrah-package-2026',
    type: 'umrah' as const,
    month: 'August 2026 (12 Nights)',
    startingPrice: '2695.00',
    starRating: '5 Star',
    status: 'available' as const,
    featuredImage: 'https://images.unsplash.com/photo-1553755088-ef1973c7b4a1?auto=format&fit=crop&w=700&q=80',
    shortDescription: '12 Nights August 5-Star Umrah group package departing from Toronto.',
    fullDescription: 'Stay at Swissotel Makkah and Dar Al Iman InterContinental Madinah right steps away from the Holy Harams.',
    inclusions: JSON.stringify([
      'Swissotel Makkah (5★ - 0m from Haram)',
      'Dar Al Iman InterContinental Madinah (5★ - 0m from Prophet\'s Mosque)',
      'Direct Saudi Airlines / Turkish Airlines Flights',
      'High-Speed Haramain Train Transfers',
      'Complimentary Ihram Kit & Zamzam Water',
      'Group Imam Leadership & Religious Seminars',
    ]),
    departureCity: 'Toronto (YYZ)',
    destination: 'Makkah & Madinah',
    departureDate: '2026-08-10',
    returnDate: '2026-08-22',
    durationDays: 12,
    airline: 'Saudia',
    availableSeats: 15,
    totalCapacity: 40,
    bookingDeadline: '2026-07-25',
    isFeatured: true,
    displayOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    title: 'September 5-Star Umrah Package 2026',
    slug: 'september-5-star-umrah-package-2026',
    type: 'umrah' as const,
    month: 'September 2026 (14 Nights)',
    startingPrice: '2795.00',
    starRating: '5 Star',
    status: 'available' as const,
    featuredImage: 'https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=900&q=80',
    shortDescription: '14 Nights September 5-Star Umrah group package featuring Pullman Zamzam Makkah & Madinah.',
    fullDescription: 'Enjoy luxury stays at Pullman Zamzam Clock Tower Makkah and Pullman ZamZam Madina with complete Canadian group leadership.',
    inclusions: JSON.stringify([
      'Pullman Zamzam Makkah (5★ - Abraj Al Bait)',
      'Pullman Zamzam Madina (5★ - Central Area)',
      'Complete Visa Endorsement & Health Insurance',
      'VIP Private GMC Airport & Intercity Transport',
      'Historical Ziyarat Tours (Uhud, Quba, Badar)',
      'Multilingual Canadian Tour Operations Manager',
    ]),
    departureCity: 'Toronto (YYZ)',
    destination: 'Makkah & Madinah',
    departureDate: '2026-09-05',
    returnDate: '2026-09-19',
    durationDays: 14,
    airline: 'Turkish Airlines',
    availableSeats: 20,
    totalCapacity: 40,
    bookingDeadline: '2026-08-20',
    isFeatured: true,
    displayOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    title: 'October 5-Star Umrah Package 2026',
    slug: 'october-5-star-umrah-package-2026',
    type: 'umrah' as const,
    month: 'October 2026 (14 Nights)',
    startingPrice: '2995.00',
    starRating: '5 Star',
    status: 'available' as const,
    featuredImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Ultra Luxury October Umrah Package staying at Raffles Makkah Palace & Oberoi Madinah.',
    fullDescription: 'Experience unparalleled 5-Star luxury at Raffles Makkah Palace and Oberoi Madinah with VIP private transfers.',
    inclusions: JSON.stringify([
      'Raffles Makkah Palace (5★ Luxury Suites)',
      'Oberoi Madinah (5★ Deluxe Court View)',
      'Full Breakfast Buffet Included Daily',
      'Nusuk Rawdah Permitting Assistance',
      '5-Star VIP Ground Coordination',
      'Luggage Handling & Airport Meet & Greet',
    ]),
    departureCity: 'Toronto (YYZ)',
    destination: 'Makkah & Madinah',
    departureDate: '2026-10-10',
    returnDate: '2026-10-24',
    durationDays: 14,
    airline: 'Qatar Airways',
    availableSeats: 12,
    totalCapacity: 30,
    bookingDeadline: '2026-09-25',
    isFeatured: true,
    displayOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    title: 'Deluxe Hajj Package 2027',
    slug: 'deluxe-hajj-package-2027',
    type: 'hajj' as const,
    month: 'June 2027 (21 Days)',
    startingPrice: '12995.00',
    starRating: '5 Star',
    status: 'available' as const,
    featuredImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'VIP Non-Shifting 5-Star Deluxe Hajj Package with Mina VIP Air-Conditioned Tents.',
    fullDescription: 'Comprehensive VIP Hajj package departing from Toronto with complete guidance by experienced Canadian Imams.',
    inclusions: JSON.stringify([
      'Swissotel Makkah (5★ Non-Shifting)',
      'Dar Al Iman InterContinental Madinah (5★)',
      'Mina VIP Air-Conditioned Tents (Category A)',
      'Private High-Speed Train & Bus Transfers',
      'Daily Full Board Buffet Meals Included',
      '24/7 Canadian Medical & Religious Staff',
    ]),
    departureCity: 'Toronto (YYZ)',
    destination: 'Makkah, Mina, Arafat & Madinah',
    departureDate: '2027-06-01',
    returnDate: '2027-06-22',
    durationDays: 21,
    airline: 'Saudi Airlines',
    availableSeats: 10,
    totalCapacity: 25,
    bookingDeadline: '2027-04-15',
    isFeatured: true,
    displayOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 6,
    title: 'Economy Hajj Package 2027',
    slug: 'economy-hajj-package-2027',
    type: 'hajj' as const,
    month: 'June 2027 (18 Days)',
    startingPrice: '9995.00',
    starRating: '4 Star',
    status: 'available' as const,
    featuredImage: 'https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80',
    shortDescription: 'Affordable 18-Day Shifting Hajj package with Canadian group leadership.',
    fullDescription: 'Affordable and spiritual Hajj package designed for pilgrims seeking complete Hajj rituals at budget rates.',
    inclusions: JSON.stringify([
      'Standard Shifting Hotel in Makkah & Madinah',
      'Air-Conditioned Tents in Mina & Arafat',
      'Saudi Airlines Round-trip Flights',
      'Complete Hajj Visa & Permit Processing',
      'Group Imam Guidance throughout rituals',
    ]),
    departureCity: 'Toronto (YYZ)',
    destination: 'Makkah, Mina & Madinah',
    departureDate: '2027-06-03',
    returnDate: '2027-06-21',
    durationDays: 18,
    airline: 'Saudia',
    availableSeats: 15,
    totalCapacity: 35,
    bookingDeadline: '2027-04-20',
    isFeatured: true,
    displayOrder: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getAllPackages() {
  try {
    let list = await db.select().from(packages).orderBy(desc(packages.createdAt));
    if (!list || list.length === 0) {
      for (const p of defaultFallbackPackages) {
        try {
          await db.insert(packages).values({
            title: p.title,
            slug: p.slug,
            type: p.type,
            month: p.month,
            startingPrice: p.startingPrice,
            starRating: p.starRating,
            status: p.status,
            featuredImage: p.featuredImage,
            shortDescription: p.shortDescription,
            fullDescription: p.fullDescription,
            inclusions: p.inclusions,
            departureCity: p.departureCity,
            destination: p.destination,
            durationDays: p.durationDays,
            isFeatured: p.isFeatured,
          });
        } catch (seedErr) {}
      }
      list = await db.select().from(packages).orderBy(desc(packages.createdAt));
    }
    return list || defaultFallbackPackages;
  } catch {
    return defaultFallbackPackages;
  }
}

export async function getPackageBySlug(slug: string) {
  try {
    const pkgList = await db.select().from(packages).where(eq(packages.slug, slug)).limit(1);
    if (!pkgList.length) {
      const fallback = defaultFallbackPackages.find((p) => p.slug === slug);
      if (fallback) {
        return { ...fallback, prices: [], hotels: [] };
      }
      return null;
    }

    const pkg = pkgList[0];
    const prices = await db.select().from(packagePrices).where(eq(packagePrices.packageId, pkg.id));
    const hotels = await db.select().from(packageHotels).where(eq(packageHotels.packageId, pkg.id));

    return { ...pkg, prices, hotels };
  } catch {
    const fallback = defaultFallbackPackages.find((p) => p.slug === slug);
    if (fallback) {
      return { ...fallback, prices: [], hotels: [] };
    }
    return null;
  }
}

export async function createPackage(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const title = formData.get('title') as string;
    const type = (formData.get('type') as 'umrah' | 'hajj') || 'umrah';
    const month = formData.get('month') as string || 'Flexible 2026';
    const startingPrice = (formData.get('startingPrice') as string) || '1995.00';
    const starRating = (formData.get('starRating') as string) || '5 Star';
    const status = (formData.get('status') as any) || 'available';
    const shortDescription = formData.get('shortDescription') as string || '';
    const fullDescription = formData.get('fullDescription') as string || '';

    if (!title) return { success: false, error: 'Package title is required.' };

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    await db.insert(packages).values({
      title,
      type,
      slug,
      month,
      startingPrice,
      starRating,
      status,
      shortDescription,
      fullDescription,
      inclusions: JSON.stringify([
        'Return Flights from Toronto',
        'Luxury Ground Transportation',
        'Free Ihram Kit',
        'Registration & Visa Assistance',
        'Imam Lead Guide & Seminar',
        '5 Star Hotels Makkah & Madinah',
      ]),
    });

    revalidatePath('/admin/packages');
    revalidatePath('/hajj-packages');
    revalidatePath('/umrah/packages');
    revalidatePath('/hajj/packages');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating package:', error);
    return { success: false, error: error.message || 'Failed to create package in database.' };
  }
}

export async function updatePackageAction(
  id: number,
  data: {
    title: string;
    type: 'umrah' | 'hajj';
    month?: string;
    startingPrice?: string;
    starRating?: string;
    status?: 'available' | 'sold_out' | 'coming_soon' | 'draft';
    shortDescription?: string;
    fullDescription?: string;
    featuredImage?: string;
    departureCity?: string;
    destination?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.update(packages).set({
      title: data.title,
      type: data.type,
      month: data.month,
      startingPrice: data.startingPrice,
      starRating: data.starRating,
      status: data.status,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      featuredImage: data.featuredImage,
      departureCity: data.departureCity,
      destination: data.destination,
      updatedAt: new Date(),
    }).where(eq(packages.id, id));

    revalidatePath('/admin/packages');
    revalidatePath('/hajj-packages');
    revalidatePath('/umrah/packages');
    revalidatePath('/hajj/packages');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating package:', error);
    return { success: false, error: error.message || 'Failed to update package in database.' };
  }
}

export async function updatePackageStatus(id: number, status: 'available' | 'sold_out' | 'coming_soon' | 'draft'): Promise<void> {
  try {
    await db.update(packages).set({ status, updatedAt: new Date() }).where(eq(packages.id, id));
    revalidatePath('/admin/packages');
    revalidatePath('/');
  } catch (error) {
    console.error('Error updating package status:', error);
  }
}

export async function deletePackage(id: number): Promise<void> {
  try {
    await db.delete(packages).where(eq(packages.id, id));
    revalidatePath('/admin/packages');
    revalidatePath('/');
  } catch (error) {
    console.error('Error deleting package:', error);
  }
}
