# MY DREAM PLACE — Real Estate

> *"Find the place you've always dreamed of."*

**MY DREAM PLACE — Real Estate** is an interactive, responsive luxury real estate marketplace and visual Content Management System (CMS) built with React 19, TypeScript, Tailwind CSS, `localStorage`, and `IndexedDB`. It combines intuitive property discovery, structured listing exploration, and architectural editorial aesthetics into a complete frontend interactive demonstration.

---

## Brand Identity & Design System

- **Website Name**: MY DREAM PLACE
- **Subtitle**: Real Estate
- **Slogan**: *"Find the place you've always dreamed of."*
- **Color Palette**:
  - Primary Royal Blue: `#1150EF`
  - Secondary Blue: `#135AF3`
  - Sky Blue: `#76A2FA`
  - Light Blue: `#B9CFFD`
  - Pure White: `#FFFFFF`
  - Charcoal: `#161616`
  - Near Black: `#0D0D0D`
  - Neutral Gray: `#737373`
- **Typography**:
  - **Playfair Display** — Luxury editorial headings
  - **Archivo** — Navigation and body copy
  - **Manrope** — Interactive controls, badges, and dashboards

---

## Core Marketplace Features

### 1. Property Discovery & Exploration
- **Hero Search & Filtering**: Filter listings by transaction mode (*For Sale*, *For Rent*, *Vacation & Event Spaces*), location, property category, price range, bedrooms, rental duration, and guest capacity.
- **Interactive Map & Split-View Discovery (`/explore`)**: Browse verified listings with synchronized map markers, sorting controls, and instant filtering.
- **Rich Property Detail Pages (`/property/:id`)**:
  - High-resolution image galleries and video walkthroughs
  - Comprehensive property specifications, architectural highlights, and verified ownership badges
  - Interactive Mortgage & Financing Calculator
  - Private In-Person & Live Video Tour scheduling
  - Direct Owner / Agent inquiry messaging
  - Embedded **Schema.org JSON-LD** (`RealEstateListing` & `SingleFamilyResidence` / `Accommodation`) structured data for search engine visibility

### 2. Multi-Role Interactive Dashboards
- **Customer Dashboard (`/dashboard/customer`)**: Manage saved favorite properties, saved search alerts, scheduled property viewings, and inquiry message threads.
- **Owner & Agent Portal (`/dashboard/owner`, `/list-property`)**: Submit new property listings with multi-step validation, track approval statuses, respond to buyer inquiries, and manage tour requests.
- **Property Comparison Drawer**: Compare up to 4 properties side-by-side across price, price-per-square-meter, dimensions, amenities, and verification status.

### 3. Multilingual & Multi-Currency Support
- **4 Complete Languages**:
  - English (`en`)
  - French (`fr`)
  - Spanish (`es`)
  - Haitian Creole (`ht`)
- **3 Currencies**: Live formatting and conversion across **USD ($)**, **HTG (G)**, and **EUR (€)**.

---

## Complete Admin Content Management System (`/admin`)

The visual **Admin CMS** at `/admin` (also accessible via `/dashboard/admin`) operates in **DEMO MODE** and allows administrators to customize the entire website without editing code files.

### 15 Admin Sidebar Modules
1. **Overview**: Portfolio KPIs, quick moderation queue, and module directory shortcuts.
2. **Website Editor**: Edit homepage hero headlines, subtitles, hero background image, hero video, CTA buttons, section titles/descriptions, property category order, featured listing order, About section, How It Works steps, Trust & Safety pillars, contact details, and footer copy — complete with a live **Visual Draft Preview**.
3. **Media Library**: Upload images and videos from your device stored locally in **IndexedDB** (`mdp_cms_media_db`), view storage quota usage, replace or delete assets, assign media directly to website slots (Hero, Logo, Video), and reorder property photo galleries.
4. **Properties**: Create, edit, delete (with confirmation), hide, or feature properties, and update prices, locations, amenities, owners, and availability status (`available`, `under_offer`, `sold`, `rented`, `reserved`).
5. **Pending Approvals**: Review newly submitted properties and approve, request changes, or reject listings with moderator notes.
6. **Featured Listings**: Curate and reorder featured properties displayed on the homepage.
7. **Owners & Agents**: Add, edit, and verify property owners and licensed real estate agents.
8. **Customers**: Manage customer profiles, roles, and account statuses.
9. **Inquiries & Messages**: Read and reply to customer property inquiries and update conversation statuses.
10. **Viewing Requests**: Confirm, reschedule, or decline private in-person and video viewing appointments.
11. **Languages & Translations**: Edit UI translations across English, French, Spanish, and Haitian Creole with automatic missing-translation warnings.
12. **Navigation & Footer**: Customize header menu labels, reorder navigation items, toggle optional links, edit footer links, and manage social media URLs while preserving core system routes.
13. **Branding & Appearance**: Customize the website name, logo, primary/secondary brand colors, button border radius, typography presets, section visibility toggles, and architectural grid lines.
14. **Reports & Analytics**: Inspect portfolio valuation, category breakdown, city distribution, and inquiry conversion metrics.
15. **Website Settings**: Configure default language, default currency, currency exchange rates, SEO metadata defaults, and global feature toggles.

### Draft vs. Published Workflow
- **Save Draft**: Stage content, branding, translation, and navigation edits in local storage without affecting the default public view.
- **Preview Draft on Site**: Toggle live Draft Preview Mode across all public routes (`/` and `/explore`) with a floating preview banner.
- **Publish Changes**: Immediately promote Draft changes to the Published state across the browser session.
- **Restore Previous Version**: Roll back to the previous published snapshot with one click.
- **Factory Reset Demo**: Restore all sample properties, CMS settings, and IndexedDB media assets to their initial defaults.

---

## Project Structure

```text
├── public/
│   └── assets/aistudio/         # Official MY DREAM PLACE brand logo asset
├── src/
│   ├── components/
│   │   ├── admin/               # Modular Admin CMS sections (Website Editor, Media Library, CRUD, Config)
│   │   ├── Header.tsx           # Responsive 3-zone header + mobile drawer + Draft Preview bar
│   │   ├── Footer.tsx           # Dynamic CMS-driven footer & social links
│   │   ├── Logo.tsx             # Calibrated responsive Logo component (desktop, compact, mobile, dashboard)
│   │   ├── HeroVideoCard.tsx    # Interactive architectural video showcase card
│   │   ├── PropertyCard.tsx     # Listing card with favorites, comparison, and status badges
│   │   └── ...
│   ├── contexts/
│   │   └── MarketplaceContext.tsx # Central state, Draft/Publish CMS engine, and CRUD handlers
│   ├── data/
│   │   ├── mockData.ts          # Realistic luxury properties, owners, agents, and initial CMS config
│   │   └── translations.ts      # Complete EN, FR, ES, and HT dictionaries
│   ├── pages/
│   │   ├── HomePage.tsx         # Dynamic CMS-driven luxury marketplace homepage
│   │   ├── ExplorePage.tsx      # Split-screen filter & interactive map catalog
│   │   ├── PropertyDetailsPage.tsx # Full listing view + Schema.org JSON-LD + tour booking
│   │   ├── ListPropertyPage.tsx # Multi-step property submission wizard
│   │   ├── CustomerDashboardPage.tsx
│   │   ├── OwnerDashboardPage.tsx
│   │   └── AdminDashboardPage.tsx # 15-module Visual CMS at /admin
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces for listings, users, and CMS state
│   └── utils/
│       └── mediaStorage.ts      # IndexedDB storage engine with file validation & quota tracking
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (or Bun)

### Installation & Local Development

```bash
# Install dependencies
npm install

# Start the development server on port 3000
npm run dev
```

### Build & Type Check

```bash
# Run TypeScript type checking
npm run lint

# Build for production
npm run build
```

---

## Demo Mode Notice

This application runs entirely as a self-contained **frontend interactive demonstration**. All edits, property submissions, approvals, uploaded media files (`IndexedDB`), and published CMS configurations (`localStorage`) persist locally within your current browser.
