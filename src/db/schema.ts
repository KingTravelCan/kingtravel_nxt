import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  timestamp,
  mysqlEnum,
  decimal,
} from 'drizzle-orm/mysql-core';

// 1. Users & Administrator Accounts
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 128 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: mysqlEnum('role', ['super_admin', 'admin', 'content_editor', 'enquiry_manager', 'seo_manager'])
    .notNull()
    .default('admin'),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 2. User Sessions
export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 128 }).primaryKey(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
});

// 3. Packages (Hajj & Umrah)
export const packages = mysqlTable('packages', {
  id: int('id').autoincrement().primaryKey(),
  type: mysqlEnum('type', ['umrah', 'hajj']).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  featuredImage: text('featured_image'),
  month: varchar('month', { length: 100 }),
  year: int('year').default(2026),
  durationDays: int('duration_days').default(14),
  departureCity: varchar('departure_city', { length: 100 }).default('Toronto'),
  destination: varchar('destination', { length: 100 }).default('Makkah & Madinah'),
  startingPrice: decimal('starting_price', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('CAD'),
  starRating: varchar('star_rating', { length: 20 }).default('5 Star'),
  status: mysqlEnum('status', ['available', 'sold_out', 'coming_soon', 'draft'])
    .notNull()
    .default('available'),
  isFeatured: boolean('is_featured').notNull().default(false),
  inclusions: text('inclusions'),
  exclusions: text('exclusions'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 4. Package Multi-Tier Pricing
export const packagePrices = mysqlTable('package_prices', {
  id: int('id').autoincrement().primaryKey(),
  packageId: int('package_id')
    .notNull()
    .references(() => packages.id, { onDelete: 'cascade' }),
  occupancyType: mysqlEnum('occupancy_type', [
    'quad',
    'triple',
    'double',
    'single',
    'child_with_bed',
    'child_no_bed',
    'infant',
  ]).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  notes: varchar('notes', { length: 255 }),
});

// 5. Package Hotels
export const packageHotels = mysqlTable('package_hotels', {
  id: int('id').autoincrement().primaryKey(),
  packageId: int('package_id')
    .notNull()
    .references(() => packages.id, { onDelete: 'cascade' }),
  hotelName: varchar('hotel_name', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  starRating: varchar('star_rating', { length: 20 }).default('5 Star'),
  nights: int('nights').default(5),
  distanceFromHaram: varchar('distance_from_haram', { length: 255 }),
  imageUrl: text('image_url'),
});

// 6. Visa Services
export const visaServices = mysqlTable('visa_services', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  processingTime: varchar('processing_time', { length: 100 }).default('3-5 Business Days'),
  requirements: text('requirements'),
  imageUrl: text('image_url'),
  isPublished: boolean('is_published').notNull().default(true),
  displayOrder: int('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 7. Lead Management & Enquiries CRM
export const enquiries = mysqlTable('enquiries', {
  id: int('id').autoincrement().primaryKey(),
  enquiryNumber: varchar('enquiry_number', { length: 128 }).notNull().unique(),
  type: mysqlEnum('type', ['quote_request', 'package_enquiry', 'visa_enquiry', 'general_contact'])
    .notNull()
    .default('quote_request'),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 50 }),
  city: varchar('city', { length: 100 }),
  province: varchar('province', { length: 100 }),
  packageId: int('package_id').references(() => packages.id, { onDelete: 'set null' }),
  visaServiceId: int('visa_service_id').references(() => visaServices.id, { onDelete: 'set null' }),
  preferredPackageType: varchar('preferred_package_type', { length: 100 }),
  departureMonth: varchar('departure_month', { length: 50 }),
  adults: int('adults').default(1),
  children: int('children').default(0),
  infants: int('infants').default(0),
  occupancy: varchar('occupancy', { length: 50 }),
  message: text('message'),
  status: mysqlEnum('status', [
    'new',
    'contacted',
    'qualified',
    'quotation_sent',
    'followup_required',
    'booked',
    'closed',
    'spam',
  ])
    .notNull()
    .default('new'),
  internalNotes: text('internal_notes'),
  assignedStaff: varchar('assigned_staff', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 8. Blog Posts & Articles
export const blogPosts = mysqlTable('blog_posts', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  featuredImage: text('featured_image'),
  category: varchar('category', { length: 100 }).default('Pilgrimage Guide'),
  authorName: varchar('author_name', { length: 100 }).default('King Travel Editorial'),
  isPublished: boolean('is_published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 9. Site Settings
export const siteSettings = mysqlTable('site_settings', {
  id: int('id').autoincrement().primaryKey(),
  key: varchar('key', { length: 128 }).notNull().unique(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});
