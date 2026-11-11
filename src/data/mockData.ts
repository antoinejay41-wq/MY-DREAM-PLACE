import {
  Agent,
  BrandingSettings,
  Inquiry,
  ListingApproval,
  Message,
  Notification,
  Owner,
  Property,
  SavedSearch,
  User,
  ViewingRequest,
  WebsiteContent
} from '../types';

export const SCENEAI_IMAGES = {
  heroMain: 'https://cdn.sceneai.art/Bg%20images/1dd58514-cedb-4f70-9aee-709c3f887808.png',
  latest1: 'https://cdn.sceneai.art/Bg%20images/c789ac4d-f2c8-463a-93f6-1f8c6fa09f9a.png',
  latest2: 'https://cdn.sceneai.art/Bg%20images/bf2e3004-db02-48a1-8e15-c6a58c158b5c.png',
  latest3: 'https://cdn.sceneai.art/Bg%20images/dce07180-2db9-45fe-889a-7a11657c6234.png',
  heroVideo: 'https://cdn.sceneai.art/Hero%20Section%20Video/adec243d-ffda-48cf-a8a8-26e6d6bcbe9b.mp4'
};

// High-craft architectural SVG artwork data URLs for additional gallery angles & specialized categories
const createArchitecturalSvg = (
  primaryHex: string,
  secondaryHex: string,
  accentHex: string,
  skyHex: string,
  label: string,
  variant: 'villa' | 'penthouse' | 'land' | 'event' | 'commercial' | 'interior'
) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
    <defs>
      <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${primaryHex}" />
        <stop offset="55%" stop-color="${secondaryHex}" />
        <stop offset="100%" stop-color="${skyHex}" />
      </linearGradient>
      <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55" />
        <stop offset="100%" stop-color="${accentHex}" stop-opacity="0.25" />
      </linearGradient>
      <linearGradient id="water" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0d3b9e" />
        <stop offset="50%" stop-color="#135af3" />
        <stop offset="100%" stop-color="#76a2fa" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#sky)" />
    <circle cx="920" cy="190" r="140" fill="#ffffff" fill-opacity="0.16" />
    ${
      variant === 'land'
        ? `
      <path d="M0 520 Q320 410 640 490 T1200 440 L1200 800 L0 800 Z" fill="#1e3a2f" />
      <path d="M0 590 Q420 510 820 575 T1200 540 L1200 800 L0 800 Z" fill="#2d5a46" />
      <rect x="280" y="420" width="640" height="210" fill="none" stroke="#ffffff" stroke-width="3" stroke-dasharray="14 10" stroke-opacity="0.85" />
      <circle cx="280" cy="420" r="8" fill="#ffffff" />
      <circle cx="920" cy="420" r="8" fill="#ffffff" />
      <circle cx="280" cy="630" r="8" fill="#ffffff" />
      <circle cx="920" cy="630" r="8" fill="#ffffff" />
      <path d="M0 680 L1200 680 L1200 800 L0 800 Z" fill="url(#water)" />
    `
        : variant === 'event'
        ? `
      <rect x="0" y="590" width="1200" height="210" fill="#121824" />
      <rect x="140" y="250" width="920" height="340" fill="#f8fafc" />
      <rect x="180" y="210" width="840" height="40" fill="#e2e8f0" />
      <rect x="220" y="290" width="220" height="260" fill="url(#glass)" stroke="#cbd5e1" stroke-width="2" />
      <rect x="490" y="290" width="220" height="260" fill="url(#glass)" stroke="#cbd5e1" stroke-width="2" />
      <rect x="760" y="290" width="220" height="260" fill="url(#glass)" stroke="#cbd5e1" stroke-width="2" />
      <circle cx="330" cy="340" r="22" fill="#fde68a" fill-opacity="0.7" />
      <circle cx="600" cy="340" r="22" fill="#fde68a" fill-opacity="0.7" />
      <circle cx="870" cy="340" r="22" fill="#fde68a" fill-opacity="0.7" />
      <rect x="260" y="630" width="680" height="110" rx="8" fill="url(#water)" fill-opacity="0.75" />
    `
        : variant === 'penthouse'
        ? `
      <rect x="0" y="600" width="1200" height="200" fill="#0f172a" />
      <rect x="180" y="180" width="840" height="420" fill="#f8fafc" />
      <rect x="140" y="150" width="920" height="34" fill="#0f172a" />
      <rect x="220" y="220" width="360" height="340" fill="url(#glass)" />
      <rect x="610" y="220" width="370" height="340" fill="url(#glass)" />
      <rect x="180" y="380" width="840" height="18" fill="#cbd5e1" />
      <rect x="80" y="640" width="1040" height="120" fill="url(#water)" />
    `
        : `
      <rect x="0" y="600" width="1200" height="200" fill="#1e293b" />
      <rect x="150" y="310" width="540" height="290" fill="#f8fafc" />
      <rect x="520" y="230" width="520" height="370" fill="#ffffff" />
      <rect x="110" y="285" width="620" height="28" fill="#0f172a" />
      <rect x="480" y="200" width="590" height="30" fill="#1150ef" />
      <rect x="190" y="350" width="290" height="210" fill="url(#glass)" />
      <rect x="560" y="270" width="430" height="290" fill="url(#glass)" />
      <rect x="240" y="640" width="820" height="120" fill="url(#water)" />
    `
    }
    <rect x="48" y="690" width="520" height="62" rx="6" fill="#0d0d0d" fill-opacity="0.68" />
    <text x="72" y="728" fill="#ffffff" font-family="Georgia, serif" font-size="22" letter-spacing="2">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_USER: User = {
  id: 'usr-customer-1',
  name: 'Jean-Marc Laurent',
  email: 'jeanmarc.laurent@example.com',
  phone: '+1 (305) 555-0194',
  role: 'customer',
  preferredLanguage: 'en',
  preferredCurrency: 'USD',
  verified: true,
  joinedDate: '2025-02-14',
  bio: 'Architectural collector and coastal real estate investor exploring residences across Hispaniola and Miami.'
};

export const INITIAL_OWNERS: Owner[] = [
  {
    id: 'own-1',
    name: 'Sabrina Moreau-Valdez',
    roleTitle: 'Principal Estate Owner & Architectural Developer',
    email: 'sabrina@mydreamplace.demo',
    phone: '+1 (809) 555-0148',
    whatsapp: '18095550148',
    verified: true,
    responseRate: 99,
    responseTime: 'Within 1 hour',
    joinedYear: 2021,
    totalListings: 6,
    languages: ['English', 'French', 'Spanish', 'Haitian Creole'],
    bio: 'Founder of Azure Horizon Developments, specializing in cantilevered oceanfront villas and sustainable courtyard residences.'
  },
  {
    id: 'own-2',
    name: 'Henri-Claude Desmarais',
    roleTitle: 'Private Property Owner & Hospitality Curator',
    email: 'henri.desmarais@mydreamplace.demo',
    phone: '+509 3701-8842',
    whatsapp: '50937018842',
    verified: true,
    responseRate: 96,
    responseTime: 'Within 2 hours',
    joinedYear: 2022,
    totalListings: 5,
    languages: ['French', 'Haitian Creole', 'English'],
    bio: 'Curator of heritage estates, hillside villas, and premier private event sanctuaries in Pétion-Ville, Cap-Haïtien, and Jacmel.'
  },
  {
    id: 'own-3',
    name: 'Camila Altagracia Santos',
    roleTitle: 'Commercial & Coastal Land Director',
    email: 'camila.santos@mydreamplace.demo',
    phone: '+1 (829) 555-0921',
    whatsapp: '18295550921',
    verified: true,
    responseRate: 98,
    responseTime: 'Within 1 hour',
    joinedYear: 2020,
    totalListings: 5,
    languages: ['Spanish', 'English', 'French'],
    bio: 'Specializing in titled oceanfront land parcels, boutique resort lots, and luxury penthouses in Punta Cana, Las Terrenas, and Santo Domingo.'
  },
  {
    id: 'own-4',
    name: 'Olivier Beaubrun',
    roleTitle: 'Event Venue Proprietor & Estate Manager',
    email: 'olivier@mydreamplace.demo',
    phone: '+1 (786) 555-0310',
    whatsapp: '17865550310',
    verified: true,
    responseRate: 95,
    responseTime: 'Within 3 hours',
    joinedYear: 2023,
    totalListings: 4,
    languages: ['English', 'French', 'Haitian Creole'],
    bio: 'Managing architectural pavilions, botanical wedding gardens, and executive corporate summits across the Caribbean and South Florida.'
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    ...INITIAL_OWNERS[0],
    agencyName: 'MY DREAM PLACE Private Client Advisory',
    licenseNumber: 'MDP-LUX-88412',
    specialties: ['Oceanfront Villas', 'Architectural Penthouses', 'Cross-Border Advisory'],
    regionsServed: ['Punta Cana', 'Cap-Haïtien', 'Miami Beach', 'Casa de Campo'],
    soldCount: 48,
    rating: 4.95,
    reviewCount: 64
  },
  {
    ...INITIAL_OWNERS[1],
    agencyName: 'Antilles Heritage & Estates',
    licenseNumber: 'MDP-HT-40291',
    specialties: ['Hillside Residences', 'Luxury Long-Term Leases', 'Private Event Estates'],
    regionsServed: ['Pétion-Ville', 'Labadee Coast', 'Jacmel', 'Kenscoff'],
    soldCount: 37,
    rating: 4.92,
    reviewCount: 41
  },
  {
    ...INITIAL_OWNERS[2],
    agencyName: 'Hispaniola Land & Coastal Group',
    licenseNumber: 'MDP-DR-77319',
    specialties: ['Titled Coastal Land', 'Commercial Development', 'Resort Residences'],
    regionsServed: ['Las Terrenas', 'Santo Domingo', 'Cap Cana', 'Samaná'],
    soldCount: 53,
    rating: 4.98,
    reviewCount: 72
  },
  {
    ...INITIAL_OWNERS[3],
    agencyName: 'Lumière Venues & Commercial Portfolio',
    licenseNumber: 'MDP-EV-55910',
    specialties: ['Wedding Pavilions', 'Corporate Retreats', 'Boutique Commercial'],
    regionsServed: ['Santo Domingo', 'Pétion-Ville', 'Coral Gables', 'La Romana'],
    soldCount: 29,
    rating: 4.89,
    reviewCount: 35
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  // 1. EDITORIAL LATEST PLACE #1 (SceneAI Image 1)
  {
    id: 'prop-101',
    referenceCode: 'MDP-2026-001',
    title: 'Villa Sabrina Horizon Pavilion',
    subtitle: 'Cantilevered glass and white limestone sanctuary overlooking turquoise waters',
    category: 'villa',
    listingType: 'sale',
    priceUSD: 2450000,
    priceUnit: 'total',
    location: {
      country: 'Dominican Republic',
      province: 'La Altagracia',
      city: 'Cap Cana',
      neighborhood: 'Farallón Cliffside',
      address: 'Boulevard Farallón Sector, Cap Cana',
      coordinates: { lat: 18.5000, lng: -68.3895 },
      locationAccuracy: 'approximate'
    },
    specs: {
      bedrooms: 5,
      bathrooms: 6,
      areaSqm: 740,
      lotSizeSqm: 1850,
      yearBuilt: 2025,
      parkingSpaces: 4,
      furnished: true
    },
    description:
      'Designed with sweeping horizontal rooflines and floor-to-ceiling low-iron glass, Villa Sabrina Horizon Pavilion merges indoor gallery living with an infinity-edge lap pool suspended above the coast. Includes a private guest casita, climate-controlled wine vault, and solar microgrid.',
    highlights: [
      'Direct panoramic ocean and cliffside exposure',
      'Zero-edge heated infinity pool with sunken fire lounge',
      'Custom Italian travertine kitchen with Gaggenau appliances',
      'Full smart-home lighting and acoustic automation'
    ],
    amenities: [
      'Infinity Pool',
      'Ocean View',
      'Smart Home System',
      'Wine Cellar',
      'Private Security',
      'Solar Backup',
      'Chef Kitchen',
      'Guest House'
    ],
    images: [
      SCENEAI_IMAGES.latest1,
      SCENEAI_IMAGES.heroMain,
      SCENEAI_IMAGES.latest2
    ],
    videoUrl: SCENEAI_IMAGES.heroVideo,
    hasVirtualTour: true,
    virtualTourLabel: 'Interactive 360° Horizon Terrace & Main Salon Tour',
    ownerId: 'own-1',
    agentId: 'own-1',
    featured: true,
    latestEditorial: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-18',
    viewsCount: 1420,
    inquiriesCount: 19
  },

  // 2. EDITORIAL LATEST PLACE #2 (SceneAI Image 2)
  {
    id: 'prop-102',
    referenceCode: 'MDP-2026-002',
    title: 'The Azure Courtyard Residence',
    subtitle: 'Minimalist modernist estate with reflecting pools and double-height atrium',
    category: 'house',
    listingType: 'sale',
    priceUSD: 1680000,
    priceUnit: 'total',
    location: {
      country: 'Haiti',
      province: 'Ouest',
      city: 'Pétion-Ville',
      neighborhood: 'Montagne Noire',
      address: '28 Impasse des Flamboyants, Montagne Noire',
      coordinates: { lat: 18.5021, lng: -72.2756 },
      locationAccuracy: 'exact'
    },
    specs: {
      bedrooms: 4,
      bathrooms: 5,
      areaSqm: 560,
      lotSizeSqm: 1200,
      yearBuilt: 2025,
      parkingSpaces: 4,
      furnished: true
    },
    description:
      'Set in the cool hillside enclave of Montagne Noire, The Azure Courtyard Residence offers serene architectural privacy, lush tropical framing, and uninterrupted views across the bay. Built with reinforced seismic engineering, cistern reserves, and hybrid solar-battery autonomy.',
    highlights: [
      '100% energy-autonomous solar + lithium battery bank',
      'Double-height architectural salon with acoustic cedar ceilings',
      'Heated saltwater courtyard pool & outdoor summer kitchen',
      '24/7 gated perimeter and staff quarters'
    ],
    amenities: [
      'Courtyard Pool',
      'Mountain & Bay View',
      'Solar + Battery',
      'Water Cistern',
      'Gated Security',
      'Staff Quarters',
      'Home Office',
      'Covered Terrace'
    ],
    images: [
      SCENEAI_IMAGES.latest2,
      SCENEAI_IMAGES.latest3,
      SCENEAI_IMAGES.heroMain
    ],
    videoUrl: SCENEAI_IMAGES.heroVideo,
    hasVirtualTour: true,
    virtualTourLabel: '360° Atrium & Pool Deck Walkthrough',
    ownerId: 'own-2',
    agentId: 'own-2',
    featured: true,
    latestEditorial: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-22',
    viewsCount: 1185,
    inquiriesCount: 14
  },

  // 3. EDITORIAL LATEST PLACE #3 (SceneAI Image 3)
  {
    id: 'prop-103',
    referenceCode: 'MDP-2026-003',
    title: 'Palms & Glass Coastal Sanctuary',
    subtitle: 'Private resort-caliber residence available for seasonal or annual lease',
    category: 'villa',
    listingType: 'rent',
    priceUSD: 8500,
    priceUnit: 'per_month',
    rentalDuration: 'long_term',
    location: {
      country: 'Dominican Republic',
      province: 'Samaná',
      city: 'Las Terrenas',
      neighborhood: 'Playa Bonita',
      address: '7 Paseo de la Costa, Playa Bonita',
      coordinates: { lat: 19.3142, lng: -69.5618 },
      locationAccuracy: 'approximate'
    },
    specs: {
      bedrooms: 4,
      bathrooms: 4,
      areaSqm: 480,
      lotSizeSqm: 1100,
      yearBuilt: 2024,
      parkingSpaces: 3,
      furnished: true
    },
    description:
      'Steps from the tranquil sands of Playa Bonita, this turnkey architectural sanctuary pairs warm teak louvers with expansive glass pavilions. Available for flexible monthly residency or annual lease, complete with pool maintenance and concierge onboarding.',
    highlights: [
      '3-minute walk to Playa Bonita beachfront promenade',
      'Turnkey designer furnishings and high-speed fiber internet',
      'Wrap-around reflection pool and shaded yoga deck',
      'Flexible monthly or 12-month lease terms directly with owner'
    ],
    amenities: [
      'Beach Access',
      'Private Pool',
      'Fully Furnished',
      'Fiber Internet',
      'Backup Generator',
      'Air Conditioning',
      'Outdoor Shower'
    ],
    images: [
      SCENEAI_IMAGES.latest3,
      SCENEAI_IMAGES.latest1,
      SCENEAI_IMAGES.heroMain
    ],
    videoUrl: SCENEAI_IMAGES.heroVideo,
    hasVirtualTour: true,
    virtualTourLabel: '360° Garden Pavilion & Master Suite Tour',
    ownerId: 'own-3',
    agentId: 'own-3',
    featured: true,
    latestEditorial: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-25',
    viewsCount: 990,
    inquiriesCount: 16
  },

  // 4. HERO SIGNATURE HOUSE FOR SALE
  {
    id: 'prop-104',
    referenceCode: 'MDP-2026-004',
    title: 'L’Horizon Bleu Flagship Residence',
    subtitle: 'The iconic MY DREAM PLACE architectural showcase residence',
    category: 'house',
    listingType: 'sale',
    priceUSD: 3200000,
    priceUnit: 'total',
    location: {
      country: 'United States',
      province: 'Florida',
      city: 'Miami Beach',
      neighborhood: 'Venetian Islands',
      address: '412 San Marino Drive, Miami Beach, FL',
      coordinates: { lat: 25.7907, lng: -80.1628 },
      locationAccuracy: 'exact'
    },
    specs: {
      bedrooms: 6,
      bathrooms: 7,
      areaSqm: 890,
      lotSizeSqm: 1450,
      yearBuilt: 2026,
      parkingSpaces: 4,
      furnished: true
    },
    description:
      'Our signature architectural residence featuring cantilevered white concrete planes, deep waterfront dockage, and effortless indoor-outdoor entertaining salons.',
    highlights: [
      '100 feet of deep-water bay frontage with private yacht dock',
      'Rooftop sky lounge with summer kitchen and sunset plunge pool',
      'Private elevator serving all three architectural levels'
    ],
    amenities: [
      'Private Dock',
      'Infinity Pool',
      'Elevator',
      'Smart Home',
      'Wine Vault',
      'Home Cinema',
      'Gated Entry'
    ],
    images: [
      SCENEAI_IMAGES.heroMain,
      SCENEAI_IMAGES.latest1,
      SCENEAI_IMAGES.latest2
    ],
    videoUrl: SCENEAI_IMAGES.heroVideo,
    hasVirtualTour: true,
    ownerId: 'own-1',
    agentId: 'own-1',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-28',
    viewsCount: 2150,
    inquiriesCount: 27
  },

  // 5. APARTMENT FOR SALE
  {
    id: 'prop-105',
    referenceCode: 'MDP-2026-005',
    title: 'Skyline Mirador Duplex Penthouse',
    subtitle: 'Double-height glass penthouse with private plunge terrace over the Caribbean Sea',
    category: 'apartment',
    listingType: 'sale',
    priceUSD: 940000,
    priceUnit: 'total',
    location: {
      country: 'Dominican Republic',
      province: 'Distrito Nacional',
      city: 'Santo Domingo',
      neighborhood: 'Piantini / Mirador Sur',
      address: 'Torre Mirador Azul, PH-A, Av. Anacaona',
      coordinates: { lat: 18.4512, lng: -69.9541 },
      locationAccuracy: 'exact'
    },
    specs: {
      bedrooms: 3,
      bathrooms: 4,
      areaSqm: 385,
      yearBuilt: 2025,
      parkingSpaces: 3,
      furnished: true
    },
    description:
      'Occupying the 28th and 29th floors above Parque Mirador Sur, this duplex penthouse delivers unobstructed ocean and park vistas, private key-locked elevator access, and a landscaped sky terrace.',
    highlights: [
      'Private elevator foyer and 110 m² sky terrace',
      'Full-service residential tower with wellness spa and lap pool',
      'Floor-to-ceiling hurricane-rated acoustic glazing'
    ],
    amenities: [
      'Private Terrace',
      'Concierge 24/7',
      'Gym & Spa',
      'Ocean View',
      '3 Covered Parking Spaces',
      'Full Generator'
    ],
    images: [
      createArchitecturalSvg('#1150ef', '#3c7af6', '#76a2fa', '#b9cffd', 'SKYLINE MIRADOR PENTHOUSE', 'penthouse'),
      SCENEAI_IMAGES.latest2,
      SCENEAI_IMAGES.latest1
    ],
    hasVirtualTour: true,
    ownerId: 'own-3',
    agentId: 'own-3',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-12',
    viewsCount: 840,
    inquiriesCount: 11
  },

  // 6. APARTMENT FOR SALE #2
  {
    id: 'prop-106',
    referenceCode: 'MDP-2026-006',
    title: 'Cap-Haïtien Citadelle Bay Residence',
    subtitle: 'Contemporary 3-bedroom waterfront residence with marina views',
    category: 'apartment',
    listingType: 'sale',
    priceUSD: 425000,
    priceUnit: 'total',
    location: {
      country: 'Haiti',
      province: 'Nord',
      city: 'Cap-Haïtien',
      neighborhood: 'Carénage Waterfront',
      address: '19 Boulevard du Carénage, Cap-Haïtien',
      coordinates: { lat: 19.7667, lng: -72.1981 },
      locationAccuracy: 'exact'
    },
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      areaSqm: 230,
      yearBuilt: 2024,
      parkingSpaces: 2,
      furnished: false
    },
    description:
      'Situated along the historic and vibrant Carénage waterfront of Cap-Haïtien, this refined residence offers breezy wrap-around balconies, harbor views, and independent solar-inverter infrastructure.',
    highlights: [
      'Unobstructed views of Cap-Haïtien bay and coastal mountains',
      'Dedicated solar microgrid + 15,000-gallon treated water reserve',
      'Secure underground parking and 24-hour concierge desk'
    ],
    amenities: [
      'Harbor View',
      'Solar Power',
      'Rooftop Lounge',
      '24/7 Security',
      'Elevator',
      'Covered Parking'
    ],
    images: [
      createArchitecturalSvg('#0d3b9e', '#135af3', '#86acfb', '#e0ecff', 'CARENAGE BAY RESIDENCE', 'penthouse'),
      SCENEAI_IMAGES.latest3
    ],
    ownerId: 'own-2',
    agentId: 'own-2',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-09',
    viewsCount: 620,
    inquiriesCount: 9
  },

  // 7. COMMERCIAL FOR SALE
  {
    id: 'prop-107',
    referenceCode: 'MDP-2026-007',
    title: 'Galerie Lumière Boutique Commercial Atrium',
    subtitle: 'Architectural flagship retail and executive showroom building',
    category: 'commercial',
    listingType: 'sale',
    priceUSD: 1890000,
    priceUnit: 'total',
    location: {
      country: 'Dominican Republic',
      province: 'Distrito Nacional',
      city: 'Santo Domingo',
      neighborhood: 'Naco / Churchill Corridor',
      address: '108 Avenida Winston Churchill, Santo Domingo',
      coordinates: { lat: 18.4725, lng: -69.9398 },
      locationAccuracy: 'exact'
    },
    specs: {
      bathrooms: 6,
      areaSqm: 920,
      lotSizeSqm: 650,
      yearBuilt: 2024,
      parkingSpaces: 16,
      furnished: false
    },
    description:
      'A three-level architectural commercial gallery ideal for a luxury design showroom, private bank branch, or diplomatic headquarters. Features a double-height glass curtain wall and executive rooftop terrace.',
    highlights: [
      'Prime corner visibility on Avenida Winston Churchill',
      '16 private client parking spaces + valet drop-off bay',
      'Commercial elevator and redundant twin generators'
    ],
    amenities: [
      'Commercial Zoning',
      '16 Parking Spaces',
      'Fiber Optic Backbone',
      'Dual Generators',
      'Loading Bay',
      'Rooftop Terrace'
    ],
    images: [
      createArchitecturalSvg('#161616', '#1150ef', '#76a2fa', '#dbeafe', 'GALERIE LUMIERE COMMERCIAL', 'commercial'),
      SCENEAI_IMAGES.latest1
    ],
    ownerId: 'own-3',
    agentId: 'own-3',
    featured: false,
    approvalStatus: 'approved',
    dateListed: '2026-09-29',
    viewsCount: 510,
    inquiriesCount: 7
  },

  // 8. SHORT-TERM RENTAL VILLA
  {
    id: 'prop-108',
    referenceCode: 'MDP-2026-008',
    title: 'Villa Brise Marine — Labadee Coast',
    subtitle: 'Private oceanfront cove villa for short-term retreats and executive stays',
    category: 'villa',
    listingType: 'rent',
    priceUSD: 680,
    priceUnit: 'per_night',
    rentalDuration: 'short_term',
    location: {
      country: 'Haiti',
      province: 'Nord',
      city: 'Cap-Haïtien',
      neighborhood: 'Labadee Coastal Road',
      address: 'Route de Labadie KM 4, Cap-Haïtien',
      coordinates: { lat: 19.7845, lng: -72.2412 },
      locationAccuracy: 'approximate'
    },
    specs: {
      bedrooms: 4,
      bathrooms: 4,
      areaSqm: 410,
      lotSizeSqm: 1500,
      yearBuilt: 2024,
      parkingSpaces: 3,
      furnished: true
    },
    description:
      'Perched directly above a calm turquoise bay near Labadee, Villa Brise Marine offers private boat jetty access, an infinity plunge deck, and optional private chef service arranged directly with the owner.',
    highlights: [
      'Private sea access steps and kayak launch cove',
      'Includes daily housekeeping and caretaker on site',
      'Available for weekend retreats, weekly stays, or monthly residency'
    ],
    amenities: [
      'Oceanfront Access',
      'Infinity Pool',
      'Daily Housekeeping',
      'Solar + Generator',
      'High-Speed Wi-Fi',
      'Private Dock'
    ],
    images: [
      SCENEAI_IMAGES.latest1,
      SCENEAI_IMAGES.latest3
    ],
    ownerId: 'own-2',
    agentId: 'own-2',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-15',
    viewsCount: 780,
    inquiriesCount: 15
  },

  // 9. LONG-TERM RENTAL APARTMENT
  {
    id: 'prop-109',
    referenceCode: 'MDP-2026-009',
    title: 'Résidence Les Jardins de Bourdon',
    subtitle: 'Furnished executive 3-bedroom apartment in a diplomatic gated compound',
    category: 'apartment',
    listingType: 'rent',
    priceUSD: 2900,
    priceUnit: 'per_month',
    rentalDuration: 'long_term',
    location: {
      country: 'Haiti',
      province: 'Ouest',
      city: 'Port-au-Prince',
      neighborhood: 'Bourdon / Musseau',
      address: '12 Rue Mercier, Bourdon, Port-au-Prince',
      coordinates: { lat: 18.5392, lng: -72.3364 },
      locationAccuracy: 'exact'
    },
    specs: {
      bedrooms: 3,
      bathrooms: 3,
      areaSqm: 215,
      yearBuilt: 2023,
      parkingSpaces: 2,
      furnished: true
    },
    description:
      'Designed for diplomats, executives, and families seeking turnkey comfort, this garden-level residence features a wrap-around veranda, lap pool access, and 24/7 armed perimeter security.',
    highlights: [
      '24/7 power redundancy (solar array + twin generators)',
      'Lush botanical courtyard with heated lap pool and gym',
      '12-month or 24-month lease directly with verified owner'
    ],
    amenities: [
      'Gated Diplomatic Compound',
      'Swimming Pool',
      'Fitness Studio',
      '24/7 Power & Water',
      'Furnished',
      '2 Covered Parking'
    ],
    images: [
      SCENEAI_IMAGES.latest2,
      createArchitecturalSvg('#1150ef', '#135af3', '#76a2fa', '#e2e8f0', 'JARDINS DE BOURDON', 'penthouse')
    ],
    ownerId: 'own-2',
    agentId: 'own-2',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-11',
    viewsCount: 640,
    inquiriesCount: 12
  },

  // 10. MONTHLY RENTAL PENTHOUSE
  {
    id: 'prop-110',
    referenceCode: 'MDP-2026-010',
    title: 'Blue Marina Loft — Punta Cana Village',
    subtitle: 'Designer 2-bedroom loft with private rooftop jacuzzi and marina privileges',
    category: 'apartment',
    listingType: 'rent',
    priceUSD: 4200,
    priceUnit: 'per_month',
    rentalDuration: 'monthly',
    location: {
      country: 'Dominican Republic',
      province: 'La Altagracia',
      city: 'Punta Cana',
      neighborhood: 'Punta Cana Village & Marina',
      address: 'Paseo de la Marina, Edificio Sotavento 402, Punta Cana',
      coordinates: { lat: 18.5601, lng: -68.3725 },
      locationAccuracy: 'approximate'
    },
    specs: {
      bedrooms: 2,
      bathrooms: 2,
      areaSqm: 195,
      yearBuilt: 2025,
      parkingSpaces: 2,
      furnished: true
    },
    description:
      'Overlooking luxury yachts in Marina Cap Cana, this light-filled architectural loft is tailored for remote executives and seasonal residents seeking 1-to-6 month flexible leases.',
    highlights: [
      'Direct views over Marina Cap Cana yacht basin',
      'Dedicated dual-monitor workspace with 500 Mbps fiber',
      'Access to private beach clubs and championship golf'
    ],
    amenities: [
      'Marina View',
      'Rooftop Jacuzzi',
      'Fiber 500 Mbps',
      'Beach Club Access',
      'Furnished',
      'Elevator'
    ],
    images: [
      createArchitecturalSvg('#135af3', '#3c7af6', '#86acfb', '#ffffff', 'BLUE MARINA LOFT', 'penthouse'),
      SCENEAI_IMAGES.latest3
    ],
    ownerId: 'own-1',
    agentId: 'own-1',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-19',
    viewsCount: 530,
    inquiriesCount: 8
  },

  // 11. LAND PARCEL #1 — COASTAL
  {
    id: 'prop-111',
    referenceCode: 'MDP-2026-011',
    title: 'Punta Bonita Oceanfront Peninsula Lot',
    subtitle: 'Titled 4,500 m² beachfront parcel zoned for luxury villa or boutique eco-hotel',
    category: 'land',
    listingType: 'land',
    priceUSD: 1150000,
    priceUnit: 'total',
    location: {
      country: 'Dominican Republic',
      province: 'Samaná',
      city: 'Las Terrenas',
      neighborhood: 'Punta Bonita',
      address: 'Parcela 18-B, Sector Punta Bonita, Samaná',
      coordinates: { lat: 19.3189, lng: -69.5702 },
      locationAccuracy: 'approximate'
    },
    specs: {
      areaSqm: 4500,
      lotSizeSqm: 4500,
      zoningType: 'Residential / Boutique Hospitality (Low-Density)',
      topography: 'Flat coastal palm grove with gentle 4m elevation at rear',
      roadAccess: true,
      utilitiesAvailable: ['Municipal Water', 'Three-Phase Electricity', 'Fiber Optic Conduit', 'Paved Road']
    },
    description:
      'A rare titled beachfront parcel with 62 linear meters of pristine white sand frontage in Punta Bonita. Certified Deslinde title ready for immediate architectural permitting.',
    highlights: [
      '62 meters of direct beachfront frontage with calm reef-protected waters',
      'Clean Deslinde title and environmental topography survey completed',
      'Approved for either a private family compound or up to 12 boutique suites'
    ],
    amenities: [
      'Clean Deslinde Title',
      '62m Beachfront',
      'Paved Road Access',
      'Electricity at Boundary',
      'Water Connection',
      'Surveyed & Staked'
    ],
    images: [
      createArchitecturalSvg('#1150ef', '#3c7af6', '#76a2fa', '#b9cffd', 'PUNTA BONITA 4,500 SQM PARCEL', 'land'),
      SCENEAI_IMAGES.latest3
    ],
    ownerId: 'own-3',
    agentId: 'own-3',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-05',
    viewsCount: 910,
    inquiriesCount: 14
  },

  // 12. LAND PARCEL #2 — HILLSIDE ESTATE LOT
  {
    id: 'prop-112',
    referenceCode: 'MDP-2026-012',
    title: 'KenscoffBelvédère Pine Ridge Estate Parcel',
    subtitle: 'Cool-climate 3,200 m² panoramic mountain parcel with stone perimeter wall',
    category: 'land',
    listingType: 'land',
    priceUSD: 340000,
    priceUnit: 'total',
    location: {
      country: 'Haiti',
      province: 'Ouest',
      city: 'Kenscoff',
      neighborhood: 'Belvédère Fermathe',
      address: 'Route de Kenscoff, Belvédère Fermathe 58',
      coordinates: { lat: 18.4612, lng: -72.2839 },
      locationAccuracy: 'approximate'
    },
    specs: {
      areaSqm: 3200,
      lotSizeSqm: 3200,
      zoningType: 'Residential Estate / Agricultural Sanctuary',
      topography: 'Terraced plateau with 270-degree mountain vistas',
      roadAccess: true,
      utilitiesAvailable: ['Paved Access Road', 'Stone Perimeter Wall', 'Natural Spring Well Permit']
    },
    description:
      'Located at 1,400 meters elevation where temperatures stay crisp year-round, this walled 3,200 m² plateau is primed for a signature mountain villa or diplomatic retreat.',
    highlights: [
      'Already enclosed with a 2.8m hand-cut stone perimeter wall and gate',
      'Notarized survey plan and historical title chain verified',
      'Rich volcanic soil with mature pine, avocado, and citrus trees'
    ],
    amenities: [
      'Stone Perimeter Wall',
      'Notarized Survey',
      'Panoramic Mountain View',
      'Paved Road Access',
      'Terraced Plataforma'
    ],
    images: [
      createArchitecturalSvg('#0f172a', '#1150ef', '#76a2fa', '#dbeafe', 'KENSCOFF 3,200 SQM PLATEAU', 'land'),
      SCENEAI_IMAGES.latest2
    ],
    ownerId: 'own-2',
    agentId: 'own-2',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-02',
    viewsCount: 540,
    inquiriesCount: 10
  },

  // 13. LAND PARCEL #3 — COMMERCIAL DEVELOPMENT LOT
  {
    id: 'prop-113',
    referenceCode: 'MDP-2026-013',
    title: 'Cap-Haïtien Airport Boulevard Commercial Lot',
    subtitle: 'High-visibility 6,000 m² commercial parcel for logistics, hotel, or retail plaza',
    category: 'land',
    listingType: 'land',
    priceUSD: 690000,
    priceUnit: 'total',
    location: {
      country: 'Haiti',
      province: 'Nord',
      city: 'Cap-Haïtien',
      neighborhood: 'Boulevard de l’Aéroport',
      address: 'Boulevard Hugo Chávez, Zone Aéroportuaire, Cap-Haïtien',
      coordinates: { lat: 19.7382, lng: -72.1945 },
      locationAccuracy: 'exact'
    },
    specs: {
      areaSqm: 6000,
      lotSizeSqm: 6000,
      zoningType: 'Commercial / Hospitality / Mixed-Use',
      topography: '100% level compacted grade',
      roadAccess: true,
      utilitiesAvailable: ['Main Highway Frontage', 'Commercial Power Line', 'Municipal Drainage']
    },
    description:
      'Strategically positioned 800 meters from Cap-Haïtien International Airport, offering 85 meters of direct boulevard frontage for a commercial center, business hotel, or showroom.',
    highlights: [
      '85 meters of highway frontage on the main airport corridor',
      'Level, compacted terrain ready for immediate foundation work',
      'Subdividable into two 3,000 m² commercial lots upon request'
    ],
    amenities: [
      '85m Highway Frontage',
      'Commercial Zoning',
      'Level Grade',
      'Near International Airport',
      'Clear Title'
    ],
    images: [
      createArchitecturalSvg('#1e293b', '#135af3', '#86acfb', '#e2e8f0', 'AIRPORT BLVD 6,000 SQM COMMERCIAL', 'land')
    ],
    ownerId: 'own-2',
    agentId: 'own-2',
    featured: false,
    approvalStatus: 'approved',
    dateListed: '2026-09-25',
    viewsCount: 470,
    inquiriesCount: 6
  },

  // 14. EVENT SPACE #1 — WEDDING PAVILION
  {
    id: 'prop-114',
    referenceCode: 'MDP-2026-014',
    title: 'Le Pavillon Céleste — Botanical Wedding & Gala Sanctuary',
    subtitle: 'Glass conservatory and royal palm gardens for up to 350 guests',
    category: 'event_space',
    listingType: 'event',
    priceUSD: 4800,
    priceUnit: 'per_day',
    location: {
      country: 'Haiti',
      province: 'Ouest',
      city: 'Pétion-Ville',
      neighborhood: 'Laboule 12',
      address: '45 Route de Laboule, Pétion-Ville',
      coordinates: { lat: 18.4892, lng: -72.3012 },
      locationAccuracy: 'exact'
    },
    specs: {
      areaSqm: 1400,
      guestCapacity: 350,
      indoorOutdoor: 'both',
      parkingSpaces: 90,
      eventTypesSupported: ['wedding', 'corporate', 'private', 'birthday'],
      eventRestrictions: [
        'Outdoor amplified music transitions into glass conservatory after 11:30 PM',
        'Licensed catering teams or in-house culinary brigade permitted',
        'Dedicated valet and security team included in venue hire'
      ],
      cateringAllowed: true
    },
    description:
      'An architectural glass-and-steel conservatory surrounded by terraced botanical gardens, reflecting pools, and a bridal preparation villa. The premier setting for destination weddings, diplomatic galas, and milestone celebrations.',
    highlights: [
      'Accommodates up to 350 seated banquet guests or 450 cocktail reception',
      'Includes private bridal & VIP suite, commercial prep kitchen, and 90-car parking',
      'Full acoustic lighting rig and 100 kVA silent backup generators'
    ],
    amenities: [
      '350 Guest Capacity',
      'Glass Conservatory',
      'Botanical Gardens',
      'Bridal VIP Suite',
      'Commercial Kitchen',
      '90 Valet Spaces',
      'Silent Generators'
    ],
    images: [
      createArchitecturalSvg('#1150ef', '#135af3', '#76a2fa', '#ffffff', 'LE PAVILLON CELESTE — WEDDING VENUE', 'event'),
      SCENEAI_IMAGES.latest2,
      SCENEAI_IMAGES.latest1
    ],
    videoUrl: SCENEAI_IMAGES.heroVideo,
    hasVirtualTour: true,
    virtualTourLabel: '360° Grand Conservatory & Ceremony Lawn Walkthrough',
    ownerId: 'own-4',
    agentId: 'own-4',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-14',
    viewsCount: 1320,
    inquiriesCount: 24
  },

  // 15. EVENT SPACE #2 — OCEANFRONT VILLA & CORPORATE / BIRTHDAY VENUE
  {
    id: 'prop-115',
    referenceCode: 'MDP-2026-015',
    title: 'Casa del Mar Sunset Deck & Private Event Club',
    subtitle: 'Oceanfront cliff terrace for private birthdays, brand launches, and weddings',
    category: 'event_space',
    listingType: 'event',
    priceUSD: 3600,
    priceUnit: 'per_day',
    location: {
      country: 'Dominican Republic',
      province: 'La Romana',
      city: 'La Romana',
      neighborhood: 'Bahía de Chavón',
      address: '9 Paseo del Mar, La Romana',
      coordinates: { lat: 18.4156, lng: -68.8892 },
      locationAccuracy: 'approximate'
    },
    specs: {
      areaSqm: 980,
      guestCapacity: 220,
      indoorOutdoor: 'both',
      parkingSpaces: 50,
      eventTypesSupported: ['wedding', 'birthday', 'corporate', 'private'],
      eventRestrictions: [
        'Fireworks require 14-day municipal maritime notice',
        'External event decorators have full load-in access starting at 8:00 AM'
      ],
      cateringAllowed: true
    },
    description:
      'Featuring a 600 m² over-water teak sunset deck and an air-conditioned architectural salon, Casa del Mar hosts unforgettable milestone birthdays, executive retreats, and coastal weddings.',
    highlights: [
      'Unrivaled western sunset views directly over the Caribbean Sea',
      'Infinity pool stage platform option and built-in Bose line-array audio',
      'Direct coordination with venue manager for bespoke layout plans'
    ],
    amenities: [
      '220 Guest Capacity',
      'Oceanfront Sunset Deck',
      'Built-In Sound System',
      'VIP Green Room',
      'Catering Kitchen',
      'Valet Parking'
    ],
    images: [
      SCENEAI_IMAGES.latest1,
      createArchitecturalSvg('#0d3b9e', '#3c7af6', '#86acfb', '#ffffff', 'CASA DEL MAR EVENT CLUB', 'event')
    ],
    ownerId: 'own-4',
    agentId: 'own-4',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-08',
    viewsCount: 890,
    inquiriesCount: 18
  },

  // 16. EVENT SPACE #3 — EXECUTIVE CONFERENCE & SUMMIT FORUM
  {
    id: 'prop-116',
    referenceCode: 'MDP-2026-016',
    title: 'Forum Azul — Executive Conference & Summit Hall',
    subtitle: 'Architectural auditorium, boardrooms, and rooftop reception gallery',
    category: 'event_space',
    listingType: 'event',
    priceUSD: 2950,
    priceUnit: 'per_day',
    location: {
      country: 'Dominican Republic',
      province: 'Distrito Nacional',
      city: 'Santo Domingo',
      neighborhood: 'Piantini Financial District',
      address: 'Torre Corporativa Azul, Piso 18, Av. Abraham Lincoln',
      coordinates: { lat: 18.4689, lng: -69.9312 },
      locationAccuracy: 'exact'
    },
    specs: {
      areaSqm: 820,
      guestCapacity: 180,
      indoorOutdoor: 'indoor',
      parkingSpaces: 75,
      eventTypesSupported: ['conference', 'corporate', 'private'],
      eventRestrictions: [
        'Simultaneous translation booths included for EN/FR/ES/HT summits',
        'Available for single-day or multi-day corporate reservations'
      ],
      cateringAllowed: true
    },
    description:
      'Purpose-built for international summits, diplomatic press briefings, and executive product launches. Equipped with a 4K LED wall, 4-language simultaneous interpretation booths, and an adjacent sky lounge.',
    highlights: [
      '180-seat tiered acoustic forum + 3 breakout glass boardrooms',
      '6-meter 4K LED stage wall and broadcast livestream studio',
      'Dedicated high-density Wi-Fi 6E and underground VIP parking'
    ],
    amenities: [
      '180 Guest Capacity',
      '4K LED Stage Wall',
      'Translation Booths',
      '3 Boardrooms',
      'Espresso & Catering Bar',
      '75 VIP Parking Spaces'
    ],
    images: [
      createArchitecturalSvg('#0d0d0d', '#1150ef', '#76a2fa', '#dbeafe', 'FORUM AZUL CONFERENCE HALL', 'event'),
      SCENEAI_IMAGES.latest2
    ],
    ownerId: 'own-4',
    agentId: 'own-4',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-04',
    viewsCount: 670,
    inquiriesCount: 13
  },

  // 17. HOUSE FOR SALE — JACMEL HERITAGE MODERN
  {
    id: 'prop-117',
    referenceCode: 'MDP-2026-017',
    title: 'Villa Cyvadier — Coastal Cliff House',
    subtitle: 'Restored contemporary coastal estate overlooking Cyvadier cove',
    category: 'house',
    listingType: 'sale',
    priceUSD: 780000,
    priceUnit: 'total',
    location: {
      country: 'Haiti',
      province: 'Sud-Est',
      city: 'Jacmel',
      neighborhood: 'Baie de Cyvadier',
      address: '8 Route de Cyvadier, Jacmel',
      coordinates: { lat: 18.2291, lng: -72.5012 },
      locationAccuracy: 'approximate'
    },
    specs: {
      bedrooms: 4,
      bathrooms: 4,
      areaSqm: 390,
      lotSizeSqm: 1600,
      yearBuilt: 2024,
      parkingSpaces: 3,
      furnished: true
    },
    description:
      'Blending Jacmel’s artistic heritage with crisp contemporary tropical modernism, Villa Cyvadier features wide ocean verandas, a saltwater lap pool, and lush mango and bougainvillea gardens.',
    highlights: [
      'Direct cliffside sunset views over Baie de Cyvadier',
      'Separate artist studio / guest pavilion in the garden',
      'Complete off-grid solar autonomy and rainwater filtration'
    ],
    amenities: [
      'Ocean View',
      'Saltwater Pool',
      'Artist Studio',
      'Solar Off-Grid',
      'Furnished',
      'Private Garden'
    ],
    images: [
      SCENEAI_IMAGES.latest3,
      SCENEAI_IMAGES.heroMain
    ],
    ownerId: 'own-2',
    agentId: 'own-2',
    featured: false,
    approvalStatus: 'approved',
    dateListed: '2026-09-30',
    viewsCount: 590,
    inquiriesCount: 9
  },

  // 18. HOUSE FOR SALE — CASA DE CAMPO
  {
    id: 'prop-118',
    referenceCode: 'MDP-2026-018',
    title: 'Estancia Los Lagos — Golf & Ocean Sanctuary',
    subtitle: 'Six-bedroom coralina limestone villa overlooking championship fairways',
    category: 'villa',
    listingType: 'sale',
    priceUSD: 3850000,
    priceUnit: 'total',
    location: {
      country: 'Dominican Republic',
      province: 'La Romana',
      city: 'La Romana',
      neighborhood: 'Casa de Campo',
      address: 'Los Lagos 24, Casa de Campo',
      coordinates: { lat: 18.4091, lng: -68.9112 },
      locationAccuracy: 'approximate'
    },
    specs: {
      bedrooms: 6,
      bathrooms: 7,
      areaSqm: 960,
      lotSizeSqm: 2600,
      yearBuilt: 2025,
      parkingSpaces: 6,
      furnished: true
    },
    description:
      'Crafted from hand-finished Dominican coralina stone and Brazilian ipe hardwood, Estancia Los Lagos centers around a reflection courtyard, gazebo palapa, and 25-meter heated lap pool.',
    highlights: [
      'Front-row golf course and lake vistas inside gated Casa de Campo',
      'Two 6-passenger electric touring carts included',
      'Professional hot and cold kitchens for large-scale entertaining'
    ],
    amenities: [
      'Golf View',
      '25m Lap Pool',
      'Gazebo Palapa',
      'Staff Quarters',
      'Home Theater',
      'Gated Resort Security'
    ],
    images: [
      SCENEAI_IMAGES.heroMain,
      SCENEAI_IMAGES.latest2
    ],
    ownerId: 'own-1',
    agentId: 'own-1',
    featured: true,
    approvalStatus: 'approved',
    dateListed: '2026-10-20',
    viewsCount: 1120,
    inquiriesCount: 15
  },

  // 19. PENDING APPROVAL PROPERTY #1 (For Admin Approval Queue & Owner Dashboard Testing)
  {
    id: 'prop-119',
    referenceCode: 'MDP-2026-019',
    title: 'Villa Céleste — Samaná Ocean Ridge',
    subtitle: 'Newly submitted 4-bedroom infinity villa awaiting marketplace verification',
    category: 'villa',
    listingType: 'sale',
    priceUSD: 1490000,
    priceUnit: 'total',
    location: {
      country: 'Dominican Republic',
      province: 'Samaná',
      city: 'Samaná',
      neighborhood: 'Loma de Las Galeras',
      address: 'Camino Real 11, Las Galeras, Samaná',
      coordinates: { lat: 19.2891, lng: -69.2014 },
      locationAccuracy: 'approximate'
    },
    specs: {
      bedrooms: 4,
      bathrooms: 5,
      areaSqm: 510,
      lotSizeSqm: 1900,
      yearBuilt: 2026,
      parkingSpaces: 3,
      furnished: true
    },
    description:
      'Recently completed contemporary ocean-ridge villa with whale-watching terrace, infinity pool, and tropical hardwood decks. Submitted by owner for public listing approval.',
    highlights: [
      'Unobstructed 180-degree views of Samaná Bay',
      'Brand-new 2026 construction with 10-year structural warranty'
    ],
    amenities: ['Ocean View', 'Infinity Pool', 'Solar Power', 'Furnished'],
    images: [
      SCENEAI_IMAGES.latest1,
      SCENEAI_IMAGES.latest3
    ],
    ownerId: 'own-1',
    agentId: 'own-1',
    featured: false,
    approvalStatus: 'pending',
    dateListed: '2026-11-04',
    viewsCount: 18,
    inquiriesCount: 0
  },

  // 20. PENDING APPROVAL PROPERTY #2 (Event Venue in Approval Queue)
  {
    id: 'prop-120',
    referenceCode: 'MDP-2026-020',
    title: 'Jardin d’Or — Private Rooftop & Birthday Lounge',
    subtitle: 'Panoramic open-air rooftop garden for private celebrations up to 150 guests',
    category: 'event_space',
    listingType: 'event',
    priceUSD: 2200,
    priceUnit: 'per_day',
    location: {
      country: 'Haiti',
      province: 'Ouest',
      city: 'Pétion-Ville',
      neighborhood: 'Juvénat',
      address: '7 Rue Rigaud Prolongée, Juvénat, Pétion-Ville',
      coordinates: { lat: 18.5162, lng: -72.2998 },
      locationAccuracy: 'exact'
    },
    specs: {
      areaSqm: 540,
      guestCapacity: 150,
      indoorOutdoor: 'outdoor',
      parkingSpaces: 40,
      eventTypesSupported: ['birthday', 'private', 'corporate', 'wedding'],
      eventRestrictions: ['Curfew at 1:00 AM', 'In-house acoustic system provided'],
      cateringAllowed: true
    },
    description:
      'An elevated rooftop sanctuary overlooking the lights of Port-au-Prince bay, designed for milestone birthday soirées, cocktail receptions, and intimate weddings.',
    highlights: [
      '360-degree skyline and bay sunset views',
      'Retractable pergola canopy and architectural bar lounge'
    ],
    amenities: ['150 Guest Capacity', 'Rooftop Pergola', 'Mixology Bar', '40 Parking Spaces'],
    images: [
      createArchitecturalSvg('#135af3', '#3c7af6', '#76a2fa', '#ffffff', 'JARDIN D OR ROOFTOP VENUE', 'event')
    ],
    ownerId: 'own-2',
    agentId: 'own-2',
    featured: false,
    approvalStatus: 'pending',
    dateListed: '2026-11-05',
    viewsCount: 9,
    inquiriesCount: 0
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    propertyId: 'prop-101',
    propertyReference: 'MDP-2026-001',
    propertyTitle: 'Villa Sabrina Horizon Pavilion',
    customerId: 'usr-customer-1',
    customerName: 'Jean-Marc Laurent',
    customerEmail: 'jeanmarc.laurent@example.com',
    customerPhone: '+1 (305) 555-0194',
    ownerId: 'own-1',
    subject: 'Private architectural tour & dossier request — MDP-2026-001',
    initialMessage:
      "Hello Sabrina, I'm interested in Villa Sabrina Horizon Pavilion. Is it still available? I will be in Cap Cana next Thursday and would love to review the architectural floor plans and arrange a private visit.",
    status: 'answered',
    createdAt: '2026-11-03T14:20:00Z',
    updatedAt: '2026-11-03T15:05:00Z'
  },
  {
    id: 'inq-2',
    propertyId: 'prop-114',
    propertyReference: 'MDP-2026-014',
    propertyTitle: 'Le Pavillon Céleste — Botanical Wedding & Gala Sanctuary',
    customerId: 'usr-customer-1',
    customerName: 'Jean-Marc Laurent',
    customerEmail: 'jeanmarc.laurent@example.com',
    customerPhone: '+1 (305) 555-0194',
    ownerId: 'own-4',
    subject: 'Availability for December Gala Dinner (240 Guests)',
    initialMessage:
      'Hello Olivier, we are planning an anniversary gala for 240 seated guests in mid-December. Could you confirm available Saturday dates and catering kitchen specifications?',
    status: 'new',
    createdAt: '2026-11-05T10:15:00Z',
    updatedAt: '2026-11-05T10:15:00Z'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    inquiryId: 'inq-1',
    senderId: 'usr-customer-1',
    senderName: 'Jean-Marc Laurent',
    senderRole: 'customer',
    content:
      "Hello Sabrina, I'm interested in Villa Sabrina Horizon Pavilion. Is it still available? I will be in Cap Cana next Thursday and would love to review the architectural floor plans and arrange a visit.",
    createdAt: '2026-11-03T14:20:00Z'
  },
  {
    id: 'msg-2',
    inquiryId: 'inq-1',
    senderId: 'own-1',
    senderName: 'Sabrina Moreau-Valdez',
    senderRole: 'owner',
    content:
      'Bonjour Jean-Marc! Yes, Villa Sabrina Horizon Pavilion is available for private viewing. I have reserved Thursday at 4:00 PM for you so you can experience the sunset from the cantilevered terrace. Feel free to reply here if that time works.',
    createdAt: '2026-11-03T15:05:00Z'
  },
  {
    id: 'msg-3',
    inquiryId: 'inq-2',
    senderId: 'usr-customer-1',
    senderName: 'Jean-Marc Laurent',
    customerRole: 'customer',
    senderRole: 'customer',
    content:
      'Hello Olivier, we are planning an anniversary gala for 240 seated guests in mid-December. Could you confirm available Saturday dates and catering kitchen specifications?',
    createdAt: '2026-11-05T10:15:00Z'
  } as Message
];

export const INITIAL_VIEWING_REQUESTS: ViewingRequest[] = [
  {
    id: 'view-1',
    propertyId: 'prop-101',
    propertyReference: 'MDP-2026-001',
    propertyTitle: 'Villa Sabrina Horizon Pavilion',
    customerId: 'usr-customer-1',
    customerName: 'Jean-Marc Laurent',
    customerEmail: 'jeanmarc.laurent@example.com',
    customerPhone: '+1 (305) 555-0194',
    ownerId: 'own-1',
    preferredDate: '2026-11-12',
    preferredTime: '16:00',
    visitType: 'in_person',
    notes: 'Interested in inspecting the solar microgrid room and guest casita.',
    status: 'confirmed',
    ownerResponseNote: 'Confirmed with gate security at Farallón entrance.',
    createdAt: '2026-11-03T15:10:00Z'
  },
  {
    id: 'view-2',
    propertyId: 'prop-102',
    propertyReference: 'MDP-2026-002',
    propertyTitle: 'The Azure Courtyard Residence',
    customerId: 'usr-customer-1',
    customerName: 'Jean-Marc Laurent',
    customerEmail: 'jeanmarc.laurent@example.com',
    customerPhone: '+1 (305) 555-0194',
    ownerId: 'own-2',
    preferredDate: '2026-11-15',
    preferredTime: '11:00',
    visitType: 'video_call',
    notes: 'Would appreciate a live WhatsApp or Zoom architectural walkthrough first.',
    status: 'pending',
    createdAt: '2026-11-05T16:40:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    recipientRole: 'customer',
    title: 'Owner Replied: Villa Sabrina Horizon Pavilion',
    message: 'Sabrina Moreau-Valdez replied to your inquiry (Ref: MDP-2026-001) and confirmed your Thursday viewing.',
    type: 'inquiry',
    relatedPropertyId: 'prop-101',
    read: false,
    createdAt: '2026-11-03T15:06:00Z'
  },
  {
    id: 'notif-2',
    recipientRole: 'owner',
    title: 'New Gala Venue Inquiry Received',
    message: 'Jean-Marc Laurent sent an availability inquiry for Le Pavillon Céleste (Ref: MDP-2026-014).',
    type: 'inquiry',
    relatedPropertyId: 'prop-114',
    read: false,
    createdAt: '2026-11-05T10:15:00Z'
  },
  {
    id: 'notif-3',
    recipientRole: 'admin',
    title: '2 Listings Pending Admin Approval',
    message: 'Villa Céleste (MDP-2026-019) and Jardin d’Or (MDP-2026-020) are awaiting moderation in the approval queue.',
    type: 'approval',
    relatedPropertyId: 'prop-119',
    read: false,
    createdAt: '2026-11-05T12:00:00Z'
  }
];

export const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'ss-1',
    name: 'Oceanfront Villas · Cap Cana & Las Terrenas',
    tab: 'sale',
    location: 'Cap Cana',
    category: 'villa',
    minPrice: 1000000,
    maxPrice: 3500000,
    bedrooms: 4,
    createdAt: '2026-10-29'
  },
  {
    id: 'ss-2',
    name: 'Pétion-Ville Event & Wedding Venues (200+ Guests)',
    tab: 'event',
    location: 'Pétion-Ville',
    category: 'event_space',
    guestCapacity: 200,
    createdAt: '2026-11-01'
  }
];

export const INITIAL_APPROVAL_QUEUE: ListingApproval[] = [
  {
    id: 'appr-1',
    propertyId: 'prop-119',
    propertyTitle: 'Villa Céleste — Samaná Ocean Ridge',
    submittedBy: 'Sabrina Moreau-Valdez',
    submittedAt: '2026-11-04T09:30:00Z',
    status: 'pending'
  },
  {
    id: 'appr-2',
    propertyId: 'prop-120',
    propertyTitle: 'Jardin d’Or — Private Rooftop & Birthday Lounge',
    submittedBy: 'Henri-Claude Desmarais',
    submittedAt: '2026-11-05T11:20:00Z',
    status: 'pending'
  }
];

export const INITIAL_CUSTOMERS: User[] = [
  INITIAL_USER,
  {
    id: 'usr-customer-2',
    name: 'Valérie Saint-Clair',
    email: 'valerie.saintclair@example.com',
    phone: '+509 3812-4410',
    role: 'customer',
    preferredLanguage: 'fr',
    preferredCurrency: 'USD',
    verified: true,
    joinedDate: '2025-05-19',
    bio: 'Hospitality director sourcing private wedding estates and short-term executive villas in Pétion-Ville and Cap-Haïtien.'
  },
  {
    id: 'usr-customer-3',
    name: 'Alejandro Morales-Ríos',
    email: 'alejandro.morales@example.com',
    phone: '+1 (809) 555-0831',
    role: 'customer',
    preferredLanguage: 'es',
    preferredCurrency: 'DOP',
    verified: true,
    joinedDate: '2025-08-03',
    bio: 'Real estate developer acquiring titled oceanfront parcels and luxury penthouses across Cap Cana and Santo Domingo.'
  },
  {
    id: 'usr-customer-4',
    name: 'Nadine Pierre-Louis',
    email: 'nadine.pl@example.com',
    phone: '+1 (786) 555-0612',
    role: 'customer',
    preferredLanguage: 'ht',
    preferredCurrency: 'HTG',
    verified: false,
    joinedDate: '2026-01-11',
    bio: 'Diaspora investor searching for family residences and coastal land in Labadee and Jacmel.'
  }
];

export const INITIAL_WEBSITE_CONTENT: WebsiteContent = {
  heroHeadlineLine1: 'MY',
  heroHeadlineLine2: 'DREAM',
  heroHeadlineLine3: 'PLACE',
  heroTaglineLine1: 'FIND THE PLACE',
  heroTaglineLine2: "YOU'VE ALWAYS DREAMED OF.",
  heroBgImage: SCENEAI_IMAGES.heroMain,
  heroVideoUrl: SCENEAI_IMAGES.heroVideo,
  heroVideoPoster: SCENEAI_IMAGES.latest1,
  heroVideoCaption: 'Discover a place that feels like home.',
  heroPrimaryCtaText: 'EXPLORE PROPERTIES',
  heroPrimaryCtaLink: '#discovery-section',
  heroSecondaryCtaText: 'LIST YOUR PROPERTY',
  heroSecondaryCtaLink: '/list-property',
  latestPlacesTitleLine1: 'OUR',
  latestPlacesTitleLine2: 'LATEST',
  latestPlacesTitleLine3: 'PLACES',
  latestPlacesSubtitle:
    'Curated architectural residences, coastal sanctuaries, and distinguished spaces selected by our editorial desk.',
  categoriesSectionKicker: 'PORTFOLIO TAXONOMY',
  categoriesSectionTitle: 'Browse by Architectural Category',
  homepageCategoryOrder: ['house', 'apartment', 'land', 'event_space', 'commercial'],
  featuredHousesKicker: 'CURATED RESIDENCES',
  featuredHousesTitle: 'Featured Houses & Villas for Sale',
  featuredApartmentsKicker: 'URBAN & COASTAL LIVING',
  featuredApartmentsTitle: 'Apartments & Penthouses for Sale & Rent',
  landEventsKicker: 'ACQUISITION & CELEBRATION',
  landEventsTitle: 'Prime Land Parcels & Signature Event Spaces',
  popularLocationsKicker: 'REGIONAL PRESENCE',
  popularLocationsTitle: 'Popular Destinations',
  aboutSectionKicker: 'ARCHITECTURAL MARKETPLACE',
  aboutSectionTitle: 'Where Caribbean & Coastal Architecture Meets Direct Discovery',
  aboutSectionDescription:
    'MY DREAM PLACE — Real Estate combines the effortless visual discovery of a luxury hospitality platform with the rigorous property intelligence of an international brokerage. Connect directly with verified estate owners, developers, and licensed advisors.',
  aboutSectionHighlights: [
    'Direct-to-Owner & Verified Advisor Communication',
    'Titled Coastal Land, Villas, Penthouses & Event Sanctuaries',
    'Multilingual Experience in English, French, Spanish & Haitian Creole'
  ],
  howItWorksKicker: 'DIRECT-TO-OWNER ARCHITECTURE',
  howItWorksTitle: 'How MY DREAM PLACE Works',
  howStep1Title: 'Discover & Filter',
  howStep1Desc:
    'Search across houses, apartments, titled land parcels, and private event spaces by location, price, or guest capacity.',
  howStep2Title: 'Connect Directly',
  howStep2Desc:
    'Message verified property owners or licensed agents directly and request in-person or live video walkthroughs.',
  howStep3Title: 'Finalize Privately',
  howStep3Desc:
    'Inspect title deeds, coordinate terms, and close directly with the owner or advisor — with zero online checkout friction.',
  trustSafetyTitle: 'Marketplace Trust & Safety',
  trustTip1:
    'Always verify property title deeds and ownership credentials in person or through licensed legal counsel.',
  trustTip2:
    'Never wire funds or deposits before completing an official viewing or verified video walkthrough.',
  trustTip3:
    'Communicate directly with verified owners and agents using the MY DREAM PLACE inquiry system.',
  ownerCtaKicker: 'OWNER & AGENT STUDIO',
  ownerCtaTitle: 'Own a Distinguished Property, Land Parcel, or Event Space?',
  ownerCtaDesc:
    'Publish your listing through our 9-step architectural wizard and connect directly with qualified buyers, tenants, and event planners.',
  announcementBanner:
    'Direct-to-Owner Luxury Real Estate & Event Space Marketplace — Interactive Local Demo',
  showAnnouncementBanner: false,
  supportEmail: 'jnscompany916@gmail.com',
  secondarySupportEmail: 'contact.mc99haiti@gmail.com',
  supportPhone: '+1 (484) 208-2963',
  whatsappNumber: '18298508107',
  whatsappNumbers: ['+1 (829) 850-8107', '+1 (829) 876-8096', '+509 3999-4934'],
  officeAddress: 'Boulevard Turístico & Pétion-Ville Architectural Gallery',
  footerDescription:
    'Direct-to-Owner & Licensed Advisory Real Estate Marketplace across the Dominican Republic, Haiti, and the Caribbean.',
  footerCopyrightText: 'All rights reserved.'
};

export const INITIAL_BRANDING: BrandingSettings = {
  siteName: 'MY DREAM PLACE',
  subtitle: 'Real Estate',
  slogan: "Find the place you've always dreamed of.",
  logoUrl: '/assets/aistudio/My_Dream_Place_Logo_47bf8882.png',
  primaryColor: '#1150EF',
  secondaryColor: '#135AF3',
  skyBlueColor: '#76A2FA',
  lightBlueColor: '#B9CFFD',
  buttonRadius: 'rounded-xl',
  typographyPreset: 'classic_luxury',
  showGridLines: true,
  sectionVisibility: {
    heroVideoCard: true,
    latestPlaces: true,
    categoriesStrip: true,
    featuredHouses: true,
    featuredApartments: true,
    landAndEvents: true,
    popularLocations: true,
    aboutSection: true,
    howItWorksAndTrust: true,
    ownerCtaBanner: true
  },
  footerBrandNote: 'Direct-to-Owner & Licensed Agent Inquiry Platform (No Online Checkout)'
};

export const INITIAL_NAVIGATION_CONFIG = {
  headerItems: [
    { id: 'nav-home', to: '/', labelKey: 'home', customLabel: '', visible: true, essential: true, group: 'primary' as const },
    { id: 'nav-buy', to: '/buy', labelKey: 'buy', customLabel: '', visible: true, essential: true, group: 'primary' as const },
    { id: 'nav-rent', to: '/rent', labelKey: 'rent', customLabel: '', visible: true, essential: true, group: 'primary' as const },
    { id: 'nav-land', to: '/land', labelKey: 'land', customLabel: '', visible: true, essential: false, group: 'secondary' as const },
    { id: 'nav-events', to: '/events', labelKey: 'eventSpaces', customLabel: '', visible: true, essential: false, group: 'secondary' as const },
    { id: 'nav-agents', to: '/agents', labelKey: 'agents', customLabel: '', visible: true, essential: false, group: 'secondary' as const },
    { id: 'nav-list', to: '/list-property', labelKey: 'listProperty', customLabel: '', visible: true, essential: false, group: 'secondary' as const }
  ],
  footerLinks: [
    { id: 'fl-buy', label: 'Buy — Villas, Houses & Penthouses', to: '/buy', visible: true },
    { id: 'fl-rent', label: 'Rent — Short-Term & Long-Term', to: '/rent', visible: true },
    { id: 'fl-land', label: 'Land — Coastal & Commercial Parcels', to: '/land', visible: true },
    { id: 'fl-events', label: 'Event Spaces — Weddings, Galas & Summits', to: '/events', visible: true },
    { id: 'fl-agents', label: 'Agents & Advisory', to: '/agents', visible: true },
    { id: 'fl-list', label: 'List Your Property', to: '/list-property', visible: true }
  ],
  socialLinks: [
    { id: 'soc-ig', platform: 'Instagram', url: 'https://instagram.com', visible: true },
    { id: 'soc-li', platform: 'LinkedIn', url: 'https://linkedin.com', visible: true },
    { id: 'soc-yt', platform: 'YouTube', url: 'https://youtube.com', visible: true },
    { id: 'soc-fb', platform: 'Facebook', url: 'https://facebook.com', visible: true }
  ]
};

export const INITIAL_WEBSITE_SETTINGS = {
  defaultLanguage: 'en' as const,
  defaultCurrency: 'USD' as const,
  exchangeRates: {
    USD: 1,
    DOP: 60.5,
    HTG: 132.0
  },
  enableAssistantWidget: true,
  enablePropertyComparison: true,
  requireAdminApprovalForNewListings: true,
  seoDefaultTitle: 'MY DREAM PLACE — Real Estate | Luxury Residences, Land & Event Spaces',
  seoDefaultDescription:
    "Find the place you've always dreamed of. Discover architectural villas, penthouses, titled land parcels, and private event spaces.",
  authorizedAdminEmails: [
    'antoinejay41@gmail.com',
    'jnscompany916@gmail.com',
    'contact.mc99haiti@gmail.com'
  ]
};

export const INITIAL_CUSTOM_TRANSLATIONS = {
  en: {},
  fr: {},
  es: {},
  ht: {}
};
