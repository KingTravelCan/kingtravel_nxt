# King Travel Canada — Next.js Application

A modern, full-stack Next.js application built for **King Travel Can Ltd** — a licensed Canadian travel agency specializing in Hajj & Umrah pilgrimages, Saudi visa processing, and global airline ticketing.

---

## 🚀 Key Features

### Frontend (Client-Facing Site)
- **Header Navigation**: Responsive navigation bar with custom dropdowns (`About Us` → `LICENSES`), WhatsApp click-to-chat integration (`+1 905-624-8344`), and a mobile hamburger drawer.
- **Hero & Search Cards**: Dynamic hero banners with interactive package search and filter widgets.
- **Packages Showcase**: Dedicated pages for **Umrah Packages** (`/umrah/packages`), **Hajj Packages** (`/hajj/packages`), **Deluxe Hajj 2027**, and **Economy Hajj 2027**.
- **Services & Visas**: Specialized landing pages for **Saudi Visa Services** (`/saudi-visa`) and **Airline Tickets** (`/airlines`).
- **Trust Badges & Testimonials**: Fully integrated accreditation badges (ACTA, ATAC, TICO, IATA, ASTA, ATOL, ABTA) and Google Reviews carousel with verified ratings.
- **Progressive Reveal Animations**: Smooth scroll-triggered animations optimized for zero-blank SSR page rendering.

### Admin Panel
- **Secure Authentication**: Accessible via custom path `/letstravel` (replaced default `/admin/login`).
- **Dashboard**: Interactive analytics displaying monthly revenue, total enquiries, active packages, and visa application counts.
- **Package Management** (`/admin/packages`): Complete CRUD controls to create, update, publish, or archive travel packages.
- **Enquiries Management** (`/admin/enquiries`): Filter, search, and manage customer booking leads and contact requests.
- **Visa Applications** (`/admin/visas`): Track and process Saudi visa applications by status.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router & Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 & Custom Global Design Tokens (`globals.css`)
- **Database ORM**: Drizzle ORM
- **Database Client**: MySQL2
- **Icons**: Font Awesome 6.5.1 & Lucide Icons

---

## 📦 Getting Started

### 1. Prerequisites
Ensure you have Node.js (v18+) installed on your machine.

### 2. Environment Setup
Create a `.env` file in the root directory:

```env
DATABASE_URL=mysql://user:password@localhost:3306/king_travel_db
NEXTAUTH_SECRET=your_jwt_secret_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Migrations
```bash
# Generate database migrations
npm run db:generate

# Push schema changes to database
npm run db:push

# Launch Drizzle Studio UI
npm run db:studio
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Compiles the production build. |
| `npm run start` | Runs the compiled production server. |
| `npm run lint` | Runs Next.js linter checks. |
| `npm run db:generate` | Generates Drizzle migration files based on schema changes. |
| `npm run db:push` | Directly pushes schema updates to the connected MySQL database. |
| `npm run db:studio` | Launches Drizzle Studio in the browser to view/edit database records. |

---

## 📁 Key Directory Structure

```
king-travel-can-nxt/
├── src/
│   ├── actions/          # Server Actions (Auth, Packages, Enquiries, Visas)
│   ├── app/              # Next.js App Router Pages & API Routes
│   │   ├── about/        # About Us Page
│   │   ├── admin/        # Protected Admin Dashboard Pages
│   │   ├── airlines/     # Airline Tickets Page
│   │   ├── contact/      # Contact Page & Form Handler
│   │   ├── hajj/         # Hajj Packages & Details Pages
│   │   ├── letstravel/   # Admin Login Portal
│   │   ├── saudi-visa/   # Saudi Visa Services Page
│   │   ├── umrah/        # Umrah Packages Showcase
│   │   ├── globals.css   # Centralized Global Styling Tokens & Component Classes
│   │   └── layout.tsx    # Root Layout Component
│   ├── components/       # Reusable Shared UI Components (Header, Footer, etc.)
│   └── lib/              # Helper utilities, schema definitions, and DB config
├── drizzle.config.ts     # Drizzle Kit Configuration
└── README.md             # Project Documentation
```

---

## 🔒 Security & Admin Access
- The default Next.js admin login path has been moved to `/letstravel`.
- Admin API routes and dashboard pages enforce server-side session checks.
