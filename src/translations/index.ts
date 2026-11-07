import { LanguageCode } from '../types';

export interface TranslationDictionary {
  nav: {
    home: string;
    buy: string;
    rent: string;
    land: string;
    eventSpaces: string;
    agents: string;
    listProperty: string;
    propertiesDropdown: string;
    more: string;
    signIn: string;
    register: string;
    customerDashboard: string;
    ownerDashboard: string;
    adminQueue: string;
    favorites: string;
    compare: string;
    resetDemo: string;
    roleMode: string;
    dashboardsLabel: string;
    buyerRenter: string;
    ownerAgent: string;
    pendingShort: string;
    currencyLabel: string;
  };
  hero: {
    line1: string;
    line2: string;
    line3: string;
    tagline1: string;
    tagline2: string;
    exploreCta: string;
    videoCaption: string;
    quarterLabel: string;
  };
  search: {
    tabBuy: string;
    tabRent: string;
    tabLand: string;
    tabEvent: string;
    locationLabel: string;
    locationPlaceholder: string;
    categoryLabel: string;
    allCategories: string;
    minPrice: string;
    maxPrice: string;
    anyPrice: string;
    upTo: string;
    bedrooms: string;
    anyBedrooms: string;
    rentalDuration: string;
    anyDuration: string;
    shortTerm: string;
    longTerm: string;
    monthly: string;
    eventDate: string;
    guestCapacity: string;
    anyCapacity: string;
    guestsPlus: string;
    searchButton: string;
    saveSearch: string;
    clearFilters: string;
    resultsFound: string;
    advancedFilterSuffix: string;
  };
  categories: {
    house: string;
    apartment: string;
    villa: string;
    commercial: string;
    land: string;
    event_space: string;
  };
  sections: {
    latestPlacesLine1: string;
    latestPlacesLine2: string;
    latestPlacesLine3: string;
    latestSubtitle: string;
    portfolioTaxonomyKicker: string;
    browseByCategory: string;
    sec1Kicker: string;
    featuredHouses: string;
    sec2Kicker: string;
    featuredApartments: string;
    exploreRentalsBtn: string;
    sec3Kicker: string;
    primeLand: string;
    signatureEventSpaces: string;
    regionalPresenceKicker: string;
    popularLocations: string;
    activeListingsCount: string;
    howItWorksKicker: string;
    howItWorks: string;
    step1Badge: string;
    step1Title: string;
    step1Desc: string;
    step2Badge: string;
    step2Title: string;
    step2Desc: string;
    step3Badge: string;
    step3Title: string;
    step3Desc: string;
    trustAndSafety: string;
    ownerStudioKicker: string;
    listPropertyCtaTitle: string;
    listPropertyCtaDesc: string;
    viewAll: string;
    viewDetails: string;
  };
  catalog: {
    saleKicker: string;
    saleTitle: string;
    saleSubtitle: string;
    rentKicker: string;
    rentTitle: string;
    rentSubtitle: string;
    landKicker: string;
    landTitle: string;
    landSubtitle: string;
    eventKicker: string;
    eventTitle: string;
    eventSubtitle: string;
    allForSale: string;
    housesForSale: string;
    luxuryVillas: string;
    apartmentsPenthouses: string;
    commercialProps: string;
    allRentals: string;
    shortTermRetreats: string;
    monthlyResidency: string;
    longTermLeases: string;
    allEventVenues: string;
    weddingVenues: string;
    birthdayVenues: string;
    conferenceSpaces: string;
    corporateSummits: string;
    privateEvents: string;
    allAmenities: string;
    amenityPool: string;
    amenityOcean: string;
    amenitySolar: string;
    amenityFurnished: string;
    amenitySecurity: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortAreaDesc: string;
    sortNewest: string;
    viewGrid: string;
    viewList: string;
    viewMap: string;
    emptySubtitle: string;
    expandMap: string;
    compactMap: string;
  };
  property: {
    forSale: string;
    forRent: string;
    landParcel: string;
    eventVenue: string;
    beds: string;
    baths: string;
    bathroomsLabel: string;
    area: string;
    interiorTotalArea: string;
    landLotArea: string;
    approvedZoning: string;
    guests: string;
    upToGuests: string;
    verifiedOwner: string;
    pendingApproval: string;
    reference: string;
    listedOn: string;
    contactOwner: string;
    contactSeller: string;
    contactVenue: string;
    requestViewing: string;
    requestMoreDetails: string;
    askAvailability: string;
    whatsappOwner: string;
    saveFavorite: string;
    saved: string;
    compareAdd: string;
    compareAdded: string;
    shareProperty: string;
    reportListing: string;
    safetyTipsTitle: string;
    safetyTip1: string;
    safetyTip2: string;
    safetyTip3: string;
    similarProperties: string;
    virtualTour: string;
    photosTab: string;
    cinemaReelTab: string;
    drag360Hint: string;
    overviewSpecsTitle: string;
    highlightsTitle: string;
    eventGuidelinesTitle: string;
    supportedFormatsLabel: string;
    topographyLabel: string;
    utilitiesLabel: string;
    amenitiesTitle: string;
    responseRateLabel: string;
    typicalResponseLabel: string;
    languagesLabel: string;
    mapPreview: string;
    mapDemoNotice: string;
    noOnlineCheckoutNotice: string;
    defaultInquiryMessage: string;
    notFoundTitle: string;
    notFoundDesc: string;
    moderationBannerText: string;
    reviewInAdminBtn: string;
    schemaActiveTitle: string;
    schemaDesc: string;
    copyBtn: string;
    inspectBtn: string;
    hideBtn: string;
  };
  agentsPage: {
    kicker: string;
    title: string;
    subtitle: string;
    verifiedBadge: string;
    licenseLabel: string;
    portfolioBtn: string;
    activePortfolioKicker: string;
    representedBy: string;
    listingsCountLabel: string;
    regionsServedLabel: string;
    verifiedFooterNote: string;
    submitListingLink: string;
  };
  wizard: {
    kicker: string;
    stepOf: string;
    step1Short: string;
    step2Short: string;
    step3Short: string;
    step4Short: string;
    step5Short: string;
    step6Short: string;
    step7Short: string;
    step8Short: string;
    step9Short: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    forSaleOpt: string;
    forRentOpt: string;
    landSaleOpt: string;
    eventHireOpt: string;
    prefDurationLabel: string;
    step3Title: string;
    step3Desc: string;
    cityLabel: string;
    neighborhoodLabel: string;
    countryLabel: string;
    addressLabel: string;
    step4Title: string;
    step4Desc: string;
    totalAreaLabel: string;
    lotAreaLabel: string;
    parkingSpacesLabel: string;
    turnkeyFurnished: string;
    zoningClassLabel: string;
    topographyElevLabel: string;
    directRoadAccess: string;
    maxGuestCapLabel: string;
    spaceConfigLabel: string;
    indoorOutdoorBoth: string;
    indoorOnly: string;
    outdoorOnly: string;
    eventRulesLabel: string;
    step5Title: string;
    step5Desc: string;
    uploadFileBtn: string;
    pasteUrlPlaceholder: string;
    addUrlBtn: string;
    removeBtn: string;
    step6Title: string;
    step6Desc: string;
    priceUsdLabel: string;
    pricingBasisLabel: string;
    basisTotal: string;
    basisMonth: string;
    basisNight: string;
    basisDay: string;
    formattedPreviewLabel: string;
    step7Title: string;
    propTitleLabel: string;
    propSubtitleLabel: string;
    fullDescLabel: string;
    keyAmenitiesLabel: string;
    step8Title: string;
    step8Desc: string;
    step9Title: string;
    step9Desc: string;
    submittedByLabel: string;
    prevStepBtn: string;
    continueStepBtn: string;
    submitFinalBtn: string;
    successStatusBadge: string;
    successTitle: string;
    successDesc: string;
    previewListingBtn: string;
    viewOwnerStudioBtn: string;
    approveAdminBtn: string;
  };
  modals: {
    contactTitle: string;
    viewingTitle: string;
    fullName: string;
    email: string;
    phoneOptional: string;
    phoneRequired: string;
    propertyRef: string;
    message: string;
    sendInquiry: string;
    preferWalkthroughPrompt: string;
    preferredDate: string;
    preferredTime: string;
    visitType: string;
    inPerson: string;
    videoCall: string;
    eventInspection: string;
    estimatedGuestsLabel: string;
    viewingNotesLabel: string;
    viewingNotesPlaceholder: string;
    submitViewing: string;
    inquirySavedHeading: string;
    inquirySentSuccess: string;
    viewCustomerDashBtn: string;
    simulateOwnerReplyBtn: string;
    viewingLoggedHeading: string;
    viewingSentSuccess: string;
    customerScheduleBtn: string;
    confirmAsOwnerBtn: string;
    reportReasonLabel: string;
    submitReportBtn: string;
    compareTitle: string;
    clearAllBtn: string;
    authDemoSubtitle: string;
    activeDemoRoleLabel: string;
    localSessionNotice: string;
    continueAsRoleBtn: string;
    close: string;
  };
  assistant: {
    buttonLabel: string;
    title: string;
    subtitle: string;
    welcomeMessage: string;
    foundMatches: string;
    noExactMatch: string;
    inputPlaceholder: string;
    prompt1: string;
    prompt2: string;
    prompt3: string;
    prompt4: string;
  };
  dashboard: {
    customerTitle: string;
    ownerTitle: string;
    ownerSubtitle: string;
    adminTitle: string;
    overview: string;
    myProperties: string;
    addProperty: string;
    pendingListings: string;
    approvedListings: string;
    inquiries: string;
    messages: string;
    viewingRequests: string;
    favorites: string;
    savedSearches: string;
    notifications: string;
    profile: string;
    languagePrefs: string;
    approve: string;
    reject: string;
    requestChanges: string;
    markAnswered: string;
    markClosed: string;
    replyPlaceholder: string;
    sendReply: string;
    demoNotice: string;
    switchToOwnerBtn: string;
    openAdminQueueBtn: string;
    exploreListingsBtn: string;
    recentInquiriesTitle: string;
    openThreadBtn: string;
    noFavoritesText: string;
    applySearchBtn: string;
    markAllReadBtn: string;
    prefInterfaceLang: string;
    prefDisplayCurr: string;
    buyerProfileNotes: string;
    saveProfileBtn: string;
    totalPortfolioViews: string;
    tablePerformanceTitle: string;
    confirmVisitBtn: string;
    rescheduleBtn: string;
    declineBtn: string;
    editBtn: string;
    previewBtn: string;
    saveChangesBtn: string;
    adminQueueSectionBtn: string;
    adminContentSectionBtn: string;
    adminPendingHeading: string;
    adminPendingDesc: string;
    adminAllReviewed: string;
    adminApprovedHeading: string;
    unpublishBtn: string;
    contentEditorHeading: string;
    contentEditorDesc: string;
    showGridLinesLabel: string;
    publishContentBtn: string;
  };
  footer: {
    collectionsTitle: string;
    buyLinkDesc: string;
    rentLinkDesc: string;
    landLinkDesc: string;
    eventsLinkDesc: string;
    agentsLinkDesc: string;
    portalsTitle: string;
    advisoryTitle: string;
    rightsReserved: string;
  };
  common: {
    currencyNote: string;
    emptyResults: string;
    resetFilters: string;
    backToListings: string;
    copiedLink: string;
  };
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      buy: 'Buy',
      rent: 'Rent',
      land: 'Land',
      eventSpaces: 'Event Spaces',
      agents: 'Agents',
      listProperty: 'List Your Property',
      propertiesDropdown: 'Properties',
      more: 'More',
      signIn: 'Sign In',
      register: 'Register',
      customerDashboard: 'Customer Dashboard',
      ownerDashboard: 'Owner / Agent Studio',
      adminQueue: 'Admin Approval Queue',
      favorites: 'Saved',
      compare: 'Compare',
      resetDemo: 'Reset Demo Data',
      roleMode: 'Demo View',
      dashboardsLabel: 'Demo View & Dashboards',
      buyerRenter: 'Buyer / Renter',
      ownerAgent: 'Owner / Agent',
      pendingShort: 'pending',
      currencyLabel: 'Currency (Illustrative)'
    },
    hero: {
      line1: 'MY',
      line2: 'DREAM',
      line3: 'PLACE',
      tagline1: 'FIND THE PLACE',
      tagline2: "YOU'VE ALWAYS DREAMED OF.",
      exploreCta: 'EXPLORE PROPERTIES',
      videoCaption: 'Discover a place that feels like home.',
      quarterLabel: 'Timeline segment'
    },
    search: {
      tabBuy: 'Buy',
      tabRent: 'Rent',
      tabLand: 'Land',
      tabEvent: 'Event Spaces',
      locationLabel: 'Location',
      locationPlaceholder: 'City, neighborhood, or coast...',
      categoryLabel: 'Category',
      allCategories: 'All Categories',
      minPrice: 'Min Price',
      maxPrice: 'Max Price',
      anyPrice: 'Any Price',
      upTo: 'Up to',
      bedrooms: 'Bedrooms',
      anyBedrooms: 'Any',
      rentalDuration: 'Rental Duration',
      anyDuration: 'Flexible Duration',
      shortTerm: 'Short-Term Stay',
      longTerm: 'Long-Term Lease (12m+)',
      monthly: 'Monthly Residency',
      eventDate: 'Event Date',
      guestCapacity: 'Guest Capacity',
      anyCapacity: 'Any Size',
      guestsPlus: 'Guests',
      searchButton: 'Search',
      saveSearch: 'Save Search',
      clearFilters: 'Reset',
      resultsFound: 'curated properties available',
      advancedFilterSuffix: 'Advanced Discovery Filter'
    },
    categories: {
      house: 'Luxury Houses',
      apartment: 'Residences & Penthouses',
      villa: 'Architectural Villas',
      commercial: 'Commercial Estates',
      land: 'Development Land',
      event_space: 'Event Spaces & Venues'
    },
    sections: {
      latestPlacesLine1: 'OUR',
      latestPlacesLine2: 'LATEST',
      latestPlacesLine3: 'PLACES',
      latestSubtitle: 'Curated architectural residences, private sanctuaries, and coastal landmarks.',
      portfolioTaxonomyKicker: 'Portfolio Taxonomy',
      browseByCategory: 'Explore by Architectural Category',
      sec1Kicker: '01 · Residential Acquisitions',
      featuredHouses: 'Signature Houses & Villas for Sale',
      sec2Kicker: '02 · Urban & Coastal Residences',
      featuredApartments: 'Curated Apartments & Penthouses',
      exploreRentalsBtn: 'Explore Rentals & Leases',
      sec3Kicker: '03 · Titled Land & Signature Venues',
      primeLand: 'Prime Land & Coastal Parcels',
      signatureEventSpaces: 'Distinguished Event Spaces & Venues',
      regionalPresenceKicker: 'Regional Presence',
      popularLocations: 'Sought-After Destinations',
      activeListingsCount: 'active listings',
      howItWorksKicker: 'Phase 1 Direct Marketplace Architecture',
      howItWorks: 'Direct Discovery & Owner Connection',
      step1Badge: '01. Discover',
      step1Title: 'Explore Curated Estates & Venues',
      step1Desc: 'Filter houses, apartments, titled land parcels, and event venues with transparent USD, DOP, and HTG pricing.',
      step2Badge: '02. Connect',
      step2Title: 'Contact Owners & Request Viewings',
      step2Desc: 'Send direct inquiries, schedule in-person or live video tours, or open a prefilled WhatsApp consultation.',
      step3Badge: '03. Verify',
      step3Title: 'Moderated Listing Approval',
      step3Desc: 'Every submitted property enters our approval queue before appearing in public discovery.',
      trustAndSafety: 'Verified Ownership & Marketplace Integrity',
      ownerStudioKicker: 'Owner & Agent Studio',
      listPropertyCtaTitle: 'Present Your Property to Discerning Buyers & Guests',
      listPropertyCtaDesc: 'Submit your residence, land parcel, or event venue through our guided 9-step showcase wizard.',
      viewAll: 'View Collection',
      viewDetails: 'View Details'
    },
    catalog: {
      saleKicker: 'Residential & Commercial Acquisitions',
      saleTitle: 'Buy — Houses, Villas, Apartments & Commercial',
      saleSubtitle: 'Explore architect-designed homes, penthouses, and commercial flagships available for direct acquisition.',
      rentKicker: 'Flexible Short-Term & Annual Residency',
      rentTitle: 'Rent — Curated Short-Term & Long-Term Leases',
      rentSubtitle: 'Turnkey oceanfront villas, diplomatic compound apartments, and monthly executive lofts.',
      landKicker: 'Titled Parcels & Development Estates',
      landTitle: 'Land — Coastal, Hillside & Commercial Lots',
      landSubtitle: 'Verified land parcels with zoning profiles, topography notes, and road/utility access.',
      eventKicker: 'Weddings, Galas, Summits & Private Celebrations',
      eventTitle: 'Event Spaces — Architectural Venues & Sanctuaries',
      eventSubtitle: 'Discover glass conservatories, oceanfront sunset decks, and executive conference halls with transparent daily rates and guest capacities.',
      allForSale: 'All For Sale',
      housesForSale: 'Houses for Sale',
      luxuryVillas: 'Luxury Villas',
      apartmentsPenthouses: 'Apartments & Penthouses',
      commercialProps: 'Commercial Properties',
      allRentals: 'All Rentals',
      shortTermRetreats: 'Short-Term Retreats',
      monthlyResidency: 'Monthly Residency',
      longTermLeases: 'Long-Term Leases (12m+)',
      allEventVenues: 'All Event Venues',
      weddingVenues: 'Wedding Venues',
      birthdayVenues: 'Birthday & Milestone Venues',
      conferenceSpaces: 'Conference Spaces',
      corporateSummits: 'Corporate Summits',
      privateEvents: 'Private Event Spaces',
      allAmenities: 'All Amenities',
      amenityPool: 'Pool / Infinity Deck',
      amenityOcean: 'Ocean / Waterfront View',
      amenitySolar: 'Solar / Generator Backup',
      amenityFurnished: 'Turnkey Furnished',
      amenitySecurity: '24/7 Gated Security',
      sortFeatured: 'Sort: Featured First',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      sortAreaDesc: 'Largest Area (m²)',
      sortNewest: 'Newest Listed',
      viewGrid: 'Grid',
      viewList: 'List',
      viewMap: 'Map',
      emptySubtitle: 'Try broadening your price range, location keyword, or property category.',
      expandMap: 'Expand Map',
      compactMap: 'Compact Map'
    },
    property: {
      forSale: 'For Sale',
      forRent: 'For Rent',
      landParcel: 'Land Parcel',
      eventVenue: 'Event Venue',
      beds: 'Beds',
      baths: 'Baths',
      bathroomsLabel: 'Bathrooms',
      area: 'm²',
      interiorTotalArea: 'Interior / Total Area',
      landLotArea: 'Land / Lot Area',
      approvedZoning: 'Approved Zoning',
      guests: 'Guests max',
      upToGuests: 'Up to',
      verifiedOwner: 'Verified Owner',
      pendingApproval: 'Pending Approval',
      reference: 'Ref',
      listedOn: 'Listed',
      contactOwner: 'Contact Owner',
      contactSeller: 'Contact Seller',
      contactVenue: 'Contact Venue',
      requestViewing: 'Request Viewing',
      requestMoreDetails: 'Request More Details',
      askAvailability: 'Ask About Availability',
      whatsappOwner: 'Contact via WhatsApp',
      saveFavorite: 'Save',
      saved: 'Saved',
      compareAdd: 'Compare',
      compareAdded: 'Comparing',
      shareProperty: 'Share Property',
      reportListing: 'Report Listing',
      safetyTipsTitle: 'Marketplace Safety & Direct Consultation Guidelines',
      safetyTip1: 'Always inspect the property or venue in person or via live video tour before signing agreements.',
      safetyTip2: 'MY DREAM PLACE is a discovery and direct-owner connection marketplace. Never wire deposits to unverified accounts.',
      safetyTip3: 'Verify land titles, zoning certificates, and municipal permits directly with the listed owner or licensed agent.',
      similarProperties: 'Similar Curated Properties',
      virtualTour: '360° Architectural Walkthrough',
      photosTab: 'Photos',
      cinemaReelTab: 'Cinema Reel',
      drag360Hint: 'Drag slider to pan 360° across the architectural perspective',
      overviewSpecsTitle: 'Architectural Overview & Specifications',
      highlightsTitle: 'Distinguishing Highlights',
      eventGuidelinesTitle: 'Event Formats & Venue Guidelines',
      supportedFormatsLabel: 'Supported Formats',
      topographyLabel: 'Topography',
      utilitiesLabel: 'Utilities & Infrastructure',
      amenitiesTitle: 'Amenities & Infrastructure',
      responseRateLabel: 'Response Rate',
      typicalResponseLabel: 'Typical Response',
      languagesLabel: 'Languages',
      mapPreview: 'Spatial Location & Neighborhood',
      mapDemoNotice: 'Interactive Spatial Demonstration Map — coordinates are illustrative for local preview.',
      noOnlineCheckoutNotice: 'Direct Owner Consultation — No instant checkout or online booking fees.',
      defaultInquiryMessage: "Hello, I'm interested in this property. Is it still available? I'd like more information and would like to arrange a visit if possible.",
      notFoundTitle: 'Property Not Found',
      notFoundDesc: 'The requested listing reference does not exist in this local demo.',
      moderationBannerText: 'This listing is currently in the moderation workflow.',
      reviewInAdminBtn: 'Review in Admin Queue',
      schemaActiveTitle: 'Schema.org JSON-LD Active',
      schemaDesc: 'Embedded RealEstateListing, Offer, GeoCoordinates, and BreadcrumbList structured data for luxury search engine indexing.',
      copyBtn: 'Copy',
      inspectBtn: 'Inspect',
      hideBtn: 'Hide JSON-LD'
    },
    agentsPage: {
      kicker: 'Verified Advisory & Direct Representation',
      title: 'Distinguished Agents & Estate Owners',
      subtitle: 'Connect directly with verified estate developers, hospitality proprietors, and licensed advisors across Hispaniola and South Florida.',
      verifiedBadge: 'Verified',
      licenseLabel: 'License',
      portfolioBtn: 'Portfolio',
      activePortfolioKicker: 'Active Portfolio',
      representedBy: 'Represented by',
      listingsCountLabel: 'Listings',
      regionsServedLabel: 'Regions Served',
      verifiedFooterNote: 'Direct owner & agent representation verified in demo registry.',
      submitListingLink: 'Submit a listing as Owner or Agent'
    },
    wizard: {
      kicker: '9-Step Guided Showcase Wizard',
      stepOf: 'Step',
      step1Short: 'Category',
      step2Short: 'Sell or Rent',
      step3Short: 'Location',
      step4Short: 'Specifications',
      step5Short: 'Images',
      step6Short: 'Pricing',
      step7Short: 'Description',
      step8Short: 'Owner Contact',
      step9Short: 'Preview & Submit',
      step1Title: '1. Select Architectural Property Category',
      step1Desc: 'Choose the classification that best matches your property, land parcel, or event venue.',
      step2Title: '2. Transaction & Availability Format',
      step2Desc: 'Specify whether this property is offered for sale, lease, land acquisition, or event hire.',
      forSaleOpt: 'For Sale (Direct Acquisition)',
      forRentOpt: 'For Rent / Lease',
      landSaleOpt: 'Land Parcel Sale',
      eventHireOpt: 'Event Space / Venue Hire',
      prefDurationLabel: 'Preferred Rental Duration',
      step3Title: '3. Geographic Location & Address',
      step3Desc: 'Provide accurate city and neighborhood details for search discovery.',
      cityLabel: 'City / Municipality',
      neighborhoodLabel: 'Neighborhood / Enclave',
      countryLabel: 'Country',
      addressLabel: 'Street Address or Landmark',
      step4Title: '4. Architectural & Category Specifications',
      step4Desc: 'Tailored parameters for your selected category.',
      totalAreaLabel: 'Total Area (m²)',
      lotAreaLabel: 'Lot / Land Area (m²)',
      parkingSpacesLabel: 'Parking Spaces',
      turnkeyFurnished: 'Turnkey Furnished',
      zoningClassLabel: 'Zoning Classification',
      topographyElevLabel: 'Topography & Elevation',
      directRoadAccess: 'Direct Paved Road & Utility Boundary Access',
      maxGuestCapLabel: 'Maximum Guest Capacity',
      spaceConfigLabel: 'Space Configuration',
      indoorOutdoorBoth: 'Indoor Conservatory + Outdoor Gardens',
      indoorOnly: 'Indoor Climate-Controlled Hall',
      outdoorOnly: 'Outdoor Terrace / Lawn',
      eventRulesLabel: 'Event Guidelines & Curfew Notes (semicolon separated)',
      step5Title: '5. Architectural Photography & Media',
      step5Desc: 'Upload a local photo from your device, paste an image URL, or select from our curated architectural gallery.',
      uploadFileBtn: 'Upload Image File',
      pasteUrlPlaceholder: 'Or paste an image URL...',
      addUrlBtn: 'Add URL',
      removeBtn: 'Remove',
      step6Title: '6. Pricing & Valuation',
      step6Desc: 'Enter the base price in USD. Visitors can toggle USD, DOP, and HTG automatically.',
      priceUsdLabel: 'Price in USD ($)',
      pricingBasisLabel: 'Pricing Basis',
      basisTotal: 'Total Sale Price',
      basisMonth: 'Per Month (Lease)',
      basisNight: 'Per Night (Short-Term)',
      basisDay: 'Per Event Day (Venue)',
      formattedPreviewLabel: 'Formatted Display Preview',
      step7Title: '7. Editorial Title, Narrative & Amenities',
      propTitleLabel: 'Property Title',
      propSubtitleLabel: 'Editorial Subtitle',
      fullDescLabel: 'Full Architectural Description',
      keyAmenitiesLabel: 'Key Amenities (Comma Separated)',
      step8Title: '8. Owner or Representing Agent Contact Details',
      step8Desc: 'Customer inquiries and viewing requests will be routed to these details in your demo studio.',
      step9Title: '9. Final Preview & Submission to Approval Queue',
      step9Desc: 'Review your listing summary before saving it locally with status: Pending Approval.',
      submittedByLabel: 'Submitted by',
      prevStepBtn: 'Previous Step',
      continueStepBtn: 'Continue to Step',
      submitFinalBtn: 'Submit Property for Approval',
      successStatusBadge: 'Status: Pending Approval',
      successTitle: 'Property Saved to Local Marketplace Demo',
      successDesc: 'Your listing has been placed in the Owner Dashboard and the Admin Approval Queue. Approve it in the Admin Queue to publish it to public search!',
      previewListingBtn: 'Preview Listing Page',
      viewOwnerStudioBtn: 'View in Owner Studio',
      approveAdminBtn: 'Approve in Admin Queue →'
    },
    modals: {
      contactTitle: 'Direct Owner Inquiry',
      viewingTitle: 'Schedule a Private Viewing or Consultation',
      fullName: 'Full Name',
      email: 'Email Address',
      phoneOptional: 'Phone Number (Optional)',
      phoneRequired: 'Phone / WhatsApp Number',
      propertyRef: 'Property Reference',
      message: 'Your Message',
      sendInquiry: 'Send Inquiry',
      preferWalkthroughPrompt: 'Prefer a scheduled walkthrough?',
      preferredDate: 'Preferred Date',
      preferredTime: 'Preferred Time Window',
      visitType: 'Consultation Format',
      inPerson: 'Private In-Person Visit',
      videoCall: 'Live Video Walkthrough',
      eventInspection: 'Venue Site Inspection',
      estimatedGuestsLabel: 'Estimated Event Guest Count',
      viewingNotesLabel: 'Specific Questions or Inspection Notes',
      viewingNotesPlaceholder: 'Let the owner know if you want to review title deeds, solar systems, or catering access...',
      submitViewing: 'Submit Request',
      inquirySavedHeading: 'Inquiry Saved to Local Demo',
      inquirySentSuccess: 'Your inquiry has been saved to this interactive demo and routed to the owner dashboard.',
      viewCustomerDashBtn: 'View in Customer Dashboard',
      simulateOwnerReplyBtn: 'Simulate Owner Reply',
      viewingLoggedHeading: 'Viewing Request Logged',
      viewingSentSuccess: 'Your viewing request has been logged in your Customer Dashboard and the Owner Studio.',
      customerScheduleBtn: 'Customer Viewing Schedule',
      confirmAsOwnerBtn: 'Confirm as Owner',
      reportReasonLabel: 'Reason for Review',
      submitReportBtn: 'Submit Report to Admin Queue',
      compareTitle: 'Side-by-Side Property Comparison',
      clearAllBtn: 'Clear All',
      authDemoSubtitle: 'Switch your active demo persona and test Customer, Owner/Agent, or Admin workflows locally.',
      activeDemoRoleLabel: 'Active Demo Role',
      localSessionNotice: 'Local session only. No external authentication or external database is connected.',
      continueAsRoleBtn: 'Continue as',
      close: 'Close'
    },
    assistant: {
      buttonLabel: 'Property Match Assistant',
      title: 'Property Match Assistant',
      subtitle: 'Local Catalog Matcher',
      welcomeMessage: 'Welcome to MY DREAM PLACE Property Match Demo. Ask for villas, apartments, coastal land, or event spaces by city, budget, or guest capacity — I will match strictly from our verified catalog.',
      foundMatches: 'matching properties found in the MY DREAM PLACE catalog:',
      noExactMatch: 'No exact keyword match was found in the current demo dataset. Here are our top featured listings you can explore:',
      inputPlaceholder: 'Search catalog by city, villa, land...',
      prompt1: 'Oceanfront villas for sale',
      prompt2: 'Wedding venues for 200+ guests',
      prompt3: 'Titled coastal land parcels',
      prompt4: 'Furnished rentals in Pétion-Ville'
    },
    dashboard: {
      customerTitle: 'Customer Portfolio & Inquiries',
      ownerTitle: 'Owner & Agent Portfolio Studio',
      ownerSubtitle: 'Manage listings, respond to customer inquiries, and confirm viewing requests.',
      adminTitle: 'Marketplace Governance & Approval Queue',
      overview: 'Overview',
      myProperties: 'My Properties',
      addProperty: 'Add Property',
      pendingListings: 'Pending Approval',
      approvedListings: 'Approved Listings',
      inquiries: 'Customer Inquiries',
      messages: 'Message Threads',
      viewingRequests: 'Viewing Requests',
      favorites: 'Saved Properties',
      savedSearches: 'Saved Searches',
      notifications: 'Notifications',
      profile: 'Profile & Settings',
      languagePrefs: 'Language & Currency',
      approve: 'Approve Listing',
      reject: 'Reject',
      requestChanges: 'Request Changes',
      markAnswered: 'Mark Answered',
      markClosed: 'Mark Closed',
      replyPlaceholder: 'Write a reply in this local demo conversation...',
      sendReply: 'Send Reply',
      demoNotice: 'Local Interactive Demo: All inquiries, approvals, and messages are stored in your browser.',
      switchToOwnerBtn: 'Switch to Owner Studio →',
      openAdminQueueBtn: 'Open Admin Approval Queue',
      exploreListingsBtn: 'Explore Listings',
      recentInquiriesTitle: 'Recent Inquiries & Owner Responses',
      openThreadBtn: 'Open Thread',
      noFavoritesText: 'You have not saved any properties yet. Click the heart icon on any listing to save it here.',
      applySearchBtn: 'Apply Search',
      markAllReadBtn: 'Mark All Read',
      prefInterfaceLang: 'Preferred Interface Language',
      prefDisplayCurr: 'Preferred Display Currency',
      buyerProfileNotes: 'Buyer / Renter Profile Notes',
      saveProfileBtn: 'Save Profile Preferences',
      totalPortfolioViews: 'Total Portfolio Views',
      tablePerformanceTitle: 'Listing Performance & Moderation Status',
      confirmVisitBtn: 'Confirm Visit',
      rescheduleBtn: 'Reschedule',
      declineBtn: 'Decline',
      editBtn: 'Edit',
      previewBtn: 'Preview',
      saveChangesBtn: 'Save Changes',
      adminQueueSectionBtn: 'Approval Queue',
      adminContentSectionBtn: 'Editorial & Branding Settings',
      adminPendingHeading: 'Pending Moderation Queue',
      adminPendingDesc: 'When you click Approve Listing, the property immediately transitions to approved and appears in public Buy/Rent/Land/Event listings.',
      adminAllReviewed: 'All submitted listings have been reviewed!',
      adminApprovedHeading: 'Currently Approved Public Listings',
      unpublishBtn: 'Unpublish',
      contentEditorHeading: 'Homepage Hero & Editorial Content Editor',
      contentEditorDesc: 'Customize hero display lines, tagline, video card caption, and decorative grid lines in real time.',
      showGridLinesLabel: 'Show 4 Architectural Vertical Grid Lines on Hero',
      publishContentBtn: 'Publish Content Changes'
    },
    footer: {
      collectionsTitle: 'Marketplace Collections',
      buyLinkDesc: 'Houses, Villas & Commercial',
      rentLinkDesc: 'Short & Long-Term',
      landLinkDesc: 'Coastal & Hillside Parcels',
      eventsLinkDesc: 'Weddings & Summits',
      agentsLinkDesc: 'Verified Owners',
      portalsTitle: 'Portals & Studios',
      advisoryTitle: 'Advisory & Concierge',
      rightsReserved: 'All rights reserved.'
    },
    common: {
      currencyNote: 'Illustrative exchange rates: 1 USD ≈ 60.5 DOP · 1 USD ≈ 132.0 HTG',
      emptyResults: 'No properties match your current filter criteria.',
      resetFilters: 'Reset All Filters',
      backToListings: 'Back to Properties',
      copiedLink: 'Property reference link copied to clipboard'
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      buy: 'Acheter',
      rent: 'Louer',
      land: 'Terrains',
      eventSpaces: 'Espaces Événements',
      agents: 'Agents',
      listProperty: 'Publier un Bien',
      propertiesDropdown: 'Propriétés',
      more: 'Plus',
      signIn: 'Connexion',
      register: 'Inscription',
      customerDashboard: 'Espace Client',
      ownerDashboard: 'Studio Propriétaire',
      adminQueue: 'Approbation Admin',
      favorites: 'Favoris',
      compare: 'Comparer',
      resetDemo: 'Réinitialiser Démo',
      roleMode: 'Mode Démo',
      dashboardsLabel: 'Mode Démo & Tableaux de Bord',
      buyerRenter: 'Acheteur / Locataire',
      ownerAgent: 'Propriétaire / Agent',
      pendingShort: 'en attente',
      currencyLabel: 'Devise (Illustrative)'
    },
    hero: {
      line1: 'MY',
      line2: 'DREAM',
      line3: 'PLACE',
      tagline1: 'TROUVEZ LE LIEU',
      tagline2: 'DONT VOUS AVEZ TOUJOURS RÊVÉ.',
      exploreCta: 'EXPLORER LES PROPRIÉTÉS',
      videoCaption: 'Découvrez un lieu où vous vous sentez chez vous.',
      quarterLabel: 'Segment vidéo'
    },
    search: {
      tabBuy: 'Acheter',
      tabRent: 'Louer',
      tabLand: 'Terrains',
      tabEvent: 'Événements',
      locationLabel: 'Localisation',
      locationPlaceholder: 'Ville, quartier ou côte...',
      categoryLabel: 'Catégorie',
      allCategories: 'Toutes catégories',
      minPrice: 'Prix Min',
      maxPrice: 'Prix Max',
      anyPrice: 'Tout prix',
      upTo: "Jusqu'à",
      bedrooms: 'Chambres',
      anyBedrooms: 'Toutes',
      rentalDuration: 'Durée',
      anyDuration: 'Durée flexible',
      shortTerm: 'Court séjour',
      longTerm: 'Long terme (12m+)',
      monthly: 'Location mensuelle',
      eventDate: "Date d'événement",
      guestCapacity: 'Capacité invités',
      anyCapacity: 'Toute taille',
      guestsPlus: 'Invités',
      searchButton: 'Rechercher',
      saveSearch: 'Sauvegarder',
      clearFilters: 'Réinitialiser',
      resultsFound: 'propriétés sélectionnées disponibles',
      advancedFilterSuffix: 'Filtre de Recherche Avancé'
    },
    categories: {
      house: 'Maisons de Prestige',
      apartment: 'Appartements & Penthouses',
      villa: "Villas d'Architecte",
      commercial: 'Immobilier Commercial',
      land: 'Terrains à Bâtir',
      event_space: 'Lieux de Réception'
    },
    sections: {
      latestPlacesLine1: 'NOS',
      latestPlacesLine2: 'DERNIERS',
      latestPlacesLine3: 'LIEUX',
      latestSubtitle: "Résidences architecturales d'exception, sanctuaires privés et domaines côtiers.",
      portfolioTaxonomyKicker: 'Taxonomie du Portefeuille',
      browseByCategory: 'Explorer par Catégorie Architecturale',
      sec1Kicker: '01 · Acquisitions Résidentielles',
      featuredHouses: 'Maisons & Villas de Prestige à Vendre',
      sec2Kicker: '02 · Résidences Urbaines & Côtières',
      featuredApartments: 'Appartements & Penthouses Sélectionnés',
      exploreRentalsBtn: 'Explorer les Locations',
      sec3Kicker: '03 · Terrains Titrés & Lieux de Réception',
      primeLand: 'Terrains & Parcelles Côtières',
      signatureEventSpaces: 'Espaces Événementiels & Réceptions',
      regionalPresenceKicker: 'Présence Régionale',
      popularLocations: 'Destinations Prisées',
      activeListingsCount: 'annonces actives',
      howItWorksKicker: 'Architecture deMise en Relation Directe',
      howItWorks: 'Découverte & Contact Direct Propriétaire',
      step1Badge: '01. Découvrir',
      step1Title: 'Explorez des Propriétés & Lieux Sélectionnés',
      step1Desc: 'Filtrez maisons, appartements, terrains titrés et salles de réception avec des tarifs transparents en USD, DOP et HTG.',
      step2Badge: '02. Contacter',
      step2Title: 'Contactez le Propriétaire & Demandez une Visite',
      step2Desc: 'Envoyez une demande directe, planifiez une visite sur place ou en vidéo, ou ouvrez WhatsApp.',
      step3Badge: '03. Vérifier',
      step3Title: 'Modération et Approbation des Annonces',
      step3Desc: "Chaque bien soumis passe par notre file d'approbation avant d'être publié.",
      trustAndSafety: 'Vérification & Confiance du Marché',
      ownerStudioKicker: 'Studio Propriétaire & Agent',
      listPropertyCtaTitle: 'Présentez Votre Propriété aux Acheteurs et Invités',
      listPropertyCtaDesc: 'Soumettez votre résidence, terrain ou salle de réception via notre assistant guidé en 9 étapes.',
      viewAll: 'Voir la Collection',
      viewDetails: 'Voir Détails'
    },
    catalog: {
      saleKicker: 'Acquisitions Résidentielles & Commerciales',
      saleTitle: 'Acheter — Maisons, Villas, Appartements & Commercial',
      saleSubtitle: "Explorez des résidences d'architecte, penthouses et immeubles commerciaux en vente directe.",
      rentKicker: 'Séjours Courts & Baux Annuels Flexibles',
      rentTitle: 'Louer — Locations Court et Long Terme Sélectionnées',
      rentSubtitle: 'Villas clés en main en bord de mer, résidences diplomatiques sécurisées et lofts mensuels.',
      landKicker: 'Parcelles Titrées & Domaines à Développer',
      landTitle: 'Terrains — Parcelles Côtières, Montagne & Commerciales',
      landSubtitle: 'Terrains vérifiés avec zonage, topographie et accès routier/réseaux.',
      eventKicker: 'Mariages, Galas, Conférences & Réceptions Privées',
      eventTitle: 'Espaces Événements — Salles & Sanctuaires Architecturaux',
      eventSubtitle: 'Découvrez des verrières botaniques, terrasses océaniques et salles de conférence avec capacités et tarifs journaliers.',
      allForSale: 'Tout à Vendre',
      housesForSale: 'Maisons à Vendre',
      luxuryVillas: 'Villas de Prestige',
      apartmentsPenthouses: 'Appartements & Penthouses',
      commercialProps: 'Biens Commerciaux',
      allRentals: 'Toutes les Locations',
      shortTermRetreats: 'Court Séjour',
      monthlyResidency: 'Location Mensuelle',
      longTermLeases: 'Long Terme (12m+)',
      allEventVenues: 'Tous les Lieux',
      weddingVenues: 'Lieux de Mariage',
      birthdayVenues: "Lieux d'Anniversaire",
      conferenceSpaces: 'Salles de Conférence',
      corporateSummits: 'Événements Corporatifs',
      privateEvents: 'Réceptions Privées',
      allAmenities: 'Tous les Équipements',
      amenityPool: 'Piscine / Horizon',
      amenityOcean: 'Vue Mer / Front de Mer',
      amenitySolar: 'Solaire / Générateur',
      amenityFurnished: 'Meublé Clé en Main',
      amenitySecurity: 'Sécurité 24/7',
      sortFeatured: 'Tri : En Vedette',
      sortPriceAsc: 'Prix : Croissant',
      sortPriceDesc: 'Prix : Décroissant',
      sortAreaDesc: 'Plus Grande Surface (m²)',
      sortNewest: 'Plus Récents',
      viewGrid: 'Grille',
      viewList: 'Liste',
      viewMap: 'Carte',
      emptySubtitle: 'Essayez d’élargir votre fourchette de prix, la ville ou la catégorie.',
      expandMap: 'Agrandir la Carte',
      compactMap: 'Réduire la Carte'
    },
    property: {
      forSale: 'À Vendre',
      forRent: 'À Louer',
      landParcel: 'Terrain',
      eventVenue: 'Lieu Événementiel',
      beds: 'Ch.',
      baths: 'Sdb.',
      bathroomsLabel: 'Salles de Bain',
      area: 'm²',
      interiorTotalArea: 'Surface Intérieure / Totale',
      landLotArea: 'Surface du Terrain',
      approvedZoning: 'Zonage Approuvé',
      guests: 'Invités max',
      upToGuests: "Jusqu'à",
      verifiedOwner: 'Propriétaire Vérifié',
      pendingApproval: 'En Attente',
      reference: 'Réf',
      listedOn: 'Publié le',
      contactOwner: 'Contacter le Propriétaire',
      contactSeller: 'Contacter le Vendeur',
      contactVenue: 'Contacter le Lieu',
      requestViewing: 'Demander une Visite',
      requestMoreDetails: 'Plus de Détails',
      askAvailability: 'Vérifier Disponibilité',
      whatsappOwner: 'Contacter via WhatsApp',
      saveFavorite: 'Sauvegarder',
      saved: 'Sauvegardé',
      compareAdd: 'Comparer',
      compareAdded: 'Comparé',
      shareProperty: 'Partager',
      reportListing: 'Signaler',
      safetyTipsTitle: 'Conseils de Sécurité & Consultation Directe',
      safetyTip1: 'Visitez toujours le bien en personne ou par appel vidéo en direct avant tout engagement.',
      safetyTip2: 'MY DREAM PLACE facilite la mise en relation directe sans paiement en ligne instantané.',
      safetyTip3: 'Vérifiez les titres fonciers et documents officiels avec le propriétaire ou agent agréé.',
      similarProperties: 'Propriétés Similaires',
      virtualTour: 'Visite Virtuelle 360°',
      photosTab: 'Photos',
      cinemaReelTab: 'Vidéo',
      drag360Hint: 'Faites glisser le curseur pour explorer la perspective architecturale à 360°',
      overviewSpecsTitle: 'Présentation Architecturale & Spécifications',
      highlightsTitle: 'Points Forts',
      eventGuidelinesTitle: "Formats d'Événements & Règlement du Lieu",
      supportedFormatsLabel: 'Formats Acceptés',
      topographyLabel: 'Topographie',
      utilitiesLabel: 'Réseaux & Infrastructures',
      amenitiesTitle: 'Équipements & Infrastructures',
      responseRateLabel: 'Taux de Réponse',
      typicalResponseLabel: 'Délai de Réponse',
      languagesLabel: 'Langues Parlées',
      mapPreview: 'Carte & Quartier',
      mapDemoNotice: 'Carte de démonstration interactive locale — coordonnées illustratives.',
      noOnlineCheckoutNotice: 'Consultation directe propriétaire — Aucun paiement en ligne requis.',
      defaultInquiryMessage: "Bonjour, je suis intéressé(e) par cette propriété. Est-elle toujours disponible ? J'aimerais obtenir plus d'informations et organiser une visite si possible.",
      notFoundTitle: 'Propriété Introuvable',
      notFoundDesc: "La référence demandée n'existe pas dans cette démonstration locale.",
      moderationBannerText: 'Cette annonce est actuellement en cours de modération.',
      reviewInAdminBtn: 'Examiner dans la File Admin',
      schemaActiveTitle: 'Schema.org JSON-LD Actif',
      schemaDesc: 'Données structurées RealEstateListing, Offer, GeoCoordinates et BreadcrumbList intégrées pour le référencement.',
      copyBtn: 'Copier',
      inspectBtn: 'Inspecter',
      hideBtn: 'Masquer JSON-LD'
    },
    agentsPage: {
      kicker: 'Conseil Vérifié & Représentation Directe',
      title: 'Agents Distingués & Propriétaires',
      subtitle: 'Entrez directement en contact avec des promoteurs vérifiés, propriétaires et conseillers agréés.',
      verifiedBadge: 'Vérifié',
      licenseLabel: 'Licence',
      portfolioBtn: 'Portefeuille',
      activePortfolioKicker: 'Portefeuille Actif',
      representedBy: 'Représenté par',
      listingsCountLabel: 'Annonces',
      regionsServedLabel: 'Régions Couvertes',
      verifiedFooterNote: 'Représentation directe propriétaire et agent vérifiée dans le registre démo.',
      submitListingLink: 'Publier un bien en tant que Propriétaire ou Agent'
    },
    wizard: {
      kicker: 'Assistant de Publication en 9 Étapes',
      stepOf: 'Étape',
      step1Short: 'Catégorie',
      step2Short: 'Vente / Location',
      step3Short: 'Localisation',
      step4Short: 'Spécifications',
      step5Short: 'Photos',
      step6Short: 'Tarification',
      step7Short: 'Description',
      step8Short: 'Contact',
      step9Short: 'Aperçu & Envoi',
      step1Title: '1. Choisissez la Catégorie Architecturale',
      step1Desc: 'Sélectionnez la classification correspondant à votre résidence, terrain ou lieu événementiel.',
      step2Title: '2. Type de Transaction & Disponibilité',
      step2Desc: 'Précisez si ce bien est proposé à la vente, à la location ou pour des événements.',
      forSaleOpt: 'À Vendre (Acquisition Directe)',
      forRentOpt: 'À Louer / Bail',
      landSaleOpt: 'Vente de Terrain Titré',
      eventHireOpt: 'Location de Lieu Événementiel',
      prefDurationLabel: 'Durée de Location Souhaitée',
      step3Title: '3. Localisation Géographique & Adresse',
      step3Desc: 'Indiquez la ville et le quartier pour faciliter la recherche.',
      cityLabel: 'Ville / Commune',
      neighborhoodLabel: 'Quartier / Secteur',
      countryLabel: 'Pays',
      addressLabel: 'Adresse ou Point de Repère',
      step4Title: '4. Spécifications Architecturales',
      step4Desc: 'Paramètres adaptés à la catégorie sélectionnée.',
      totalAreaLabel: 'Surface Totale (m²)',
      lotAreaLabel: 'Surface du Terrain (m²)',
      parkingSpacesLabel: 'Places de Parking',
      turnkeyFurnished: 'Entièrement Meublé',
      zoningClassLabel: 'Zonage Autorisé',
      topographyElevLabel: 'Topographie & Élévation',
      directRoadAccess: 'Accès Route Pavée & Réseaux en Bordure',
      maxGuestCapLabel: 'Capacité Maximale (Invités)',
      spaceConfigLabel: "Configuration de l'Espace",
      indoorOutdoorBoth: 'Verrière Intérieure + Jardins Extérieurs',
      indoorOnly: 'Salle Intérieure Climatisée',
      outdoorOnly: 'Terrasse / Jardin Extérieur',
      eventRulesLabel: 'Conditions & Règlement (séparés par point-virgule)',
      step5Title: '5. Photographies & Médias',
      step5Desc: 'Importez une photo depuis votre appareil ou ajoutez une URL.',
      uploadFileBtn: 'Importer une Photo',
      pasteUrlPlaceholder: "Ou collez l'URL d'une image...",
      addUrlBtn: 'Ajouter URL',
      removeBtn: 'Retirer',
      step6Title: '6. Prix & Valorisation',
      step6Desc: 'Indiquez le prix en USD. La conversion en DOP et HTG est automatique.',
      priceUsdLabel: 'Prix en USD ($)',
      pricingBasisLabel: 'Base Tarifaire',
      basisTotal: 'Prix de Vente Total',
      basisMonth: 'Par Mois (Bail)',
      basisNight: 'Par Nuit (Court Séjour)',
      basisDay: "Par Jour d'Événement",
      formattedPreviewLabel: 'Aperçu du Tarif Formaté',
      step7Title: '7. Titre Éditorial, Description & Équipements',
      propTitleLabel: 'Titre de la Propriété',
      propSubtitleLabel: 'Sous-titre Éditorial',
      fullDescLabel: 'Description Architecturale Complète',
      keyAmenitiesLabel: 'Équipements Clés (séparés par virgule)',
      step8Title: '8. Coordonnées du Propriétaire ou Agent',
      step8Desc: 'Les demandes de visite et messages seront transmis à ces coordonnées dans la démo.',
      step9Title: "9. Aperçu Final & Soumission pour Approbation",
      step9Desc: "Vérifiez votre annonce avant de l'enregistrer avec le statut : En Attente d'Approbation.",
      submittedByLabel: 'Soumis par',
      prevStepBtn: 'Étape Précédente',
      continueStepBtn: "Continuer vers l'Étape",
      submitFinalBtn: 'Soumettre pour Approbation',
      successStatusBadge: "Statut : En Attente d'Approbation",
      successTitle: 'Propriété Enregistrée dans la Démo Locale',
      successDesc: "Votre annonce a été ajoutée au Studio Propriétaire et à la File d'Approbation Admin.",
      previewListingBtn: "Prévisualiser l'Annonce",
      viewOwnerStudioBtn: 'Voir Studio Propriétaire',
      approveAdminBtn: "Approuver dans l'Admin →"
    },
    modals: {
      contactTitle: 'Contacter le Propriétaire',
      viewingTitle: 'Planifier une Visite Privée',
      fullName: 'Nom Complet',
      email: 'Adresse E-mail',
      phoneOptional: 'Téléphone (Optionnel)',
      phoneRequired: 'Téléphone / WhatsApp',
      propertyRef: 'Référence du Bien',
      message: 'Votre Message',
      sendInquiry: 'Envoyer la Demande',
      preferWalkthroughPrompt: 'Vous préférez planifier une visite ?',
      preferredDate: 'Date Souhaitée',
      preferredTime: 'Créneau Horaire',
      visitType: 'Type de Visite',
      inPerson: 'Visite sur Place',
      videoCall: 'Visite Vidéo en Direct',
      eventInspection: 'Inspection du Lieu',
      estimatedGuestsLabel: "Nombre d'Invités Estimé",
      viewingNotesLabel: 'Questions ou Notes Spécifiques',
      viewingNotesPlaceholder: 'Précisez vos questions sur les titres fonciers, équipements ou accès...',
      submitViewing: 'Confirmer la Demande',
      inquirySavedHeading: 'Demande Enregistrée dans la Démo',
      inquirySentSuccess: 'Votre demande a été enregistrée dans la démo locale et transmise au propriétaire.',
      viewCustomerDashBtn: "Voir dans l'Espace Client",
      simulateOwnerReplyBtn: 'Simuler Réponse Propriétaire',
      viewingLoggedHeading: 'Demande de Visite Enregistrée',
      viewingSentSuccess: 'Votre demande de visite a été enregistrée dans votre espace client.',
      customerScheduleBtn: 'Calendrier des Visites',
      confirmAsOwnerBtn: 'Confirmer comme Propriétaire',
      reportReasonLabel: 'Motif du Signalement',
      submitReportBtn: 'Envoyer le Signalement',
      compareTitle: 'Comparaison Côte à Côte',
      clearAllBtn: 'Tout Effacer',
      authDemoSubtitle: 'Changez de rôle actif pour tester les parcours Client, Propriétaire ou Admin.',
      activeDemoRoleLabel: 'Rôle Démo Actif',
      localSessionNotice: 'Session locale uniquement. Aucune base de données externe connectée.',
      continueAsRoleBtn: 'Continuer en tant que',
      close: 'Fermer'
    },
    assistant: {
      buttonLabel: 'Assistant Immobilier',
      title: 'Assistant Immobilier',
      subtitle: 'Recherche dans le Catalogue Local',
      welcomeMessage: 'Bienvenue dans l’assistant MY DREAM PLACE. Demandez une villa, un appartement, un terrain ou une salle de réception selon la ville ou le budget.',
      foundMatches: 'propriétés correspondantes trouvées dans le catalogue :',
      noExactMatch: 'Aucune correspondance exacte trouvée. Voici nos biens phares à explorer :',
      inputPlaceholder: 'Rechercher par ville, villa, terrain...',
      prompt1: 'Villas vue mer à vendre',
      prompt2: 'Salles de mariage 200+ invités',
      prompt3: 'Terrains côtiers titrés',
      prompt4: 'Locations meublées à Pétion-Ville'
    },
    dashboard: {
      customerTitle: 'Tableau de Bord Client',
      ownerTitle: 'Studio Propriétaire & Agent',
      ownerSubtitle: 'Gérez vos annonces, répondez aux demandes clients et confirmez les visites.',
      adminTitle: 'Administration & Approbation des Biens',
      overview: 'Vue globale',
      myProperties: 'Mes Propriétés',
      addProperty: 'Ajouter un Bien',
      pendingListings: 'En Attente',
      approvedListings: 'Biens Approuvés',
      inquiries: 'Demandes Clients',
      messages: 'Messagerie',
      viewingRequests: 'Demandes de Visite',
      favorites: 'Biens Favoris',
      savedSearches: 'Recherches Sauvegardées',
      notifications: 'Notifications',
      profile: 'Profil & Préférences',
      languagePrefs: 'Langue & Devise',
      approve: 'Approuver',
      reject: 'Refuser',
      requestChanges: 'Demander Modifications',
      markAnswered: 'Marquer Répondu',
      markClosed: 'Clôturer',
      replyPlaceholder: 'Écrivez une réponse dans cette démo locale...',
      sendReply: 'Envoyer',
      demoNotice: 'Démo Interactive Locale : Toutes les données sont stockées localement dans votre navigateur.',
      switchToOwnerBtn: 'Passer au Studio Propriétaire →',
      openAdminQueueBtn: 'File Approbation Admin',
      exploreListingsBtn: 'Explorer le Catalogue',
      recentInquiriesTitle: 'Demandes Récentes & Réponses',
      openThreadBtn: 'Ouvrir la Discussion',
      noFavoritesText: "Vous n'avez pas encore sauvegardé de propriété.",
      applySearchBtn: 'Appliquer',
      markAllReadBtn: 'Tout Marquer Lu',
      prefInterfaceLang: "Langue de l'Interface",
      prefDisplayCurr: "Devise d'Affichage",
      buyerProfileNotes: 'Notes de Profil Acheteur / Locataire',
      saveProfileBtn: 'Enregistrer les Préférences',
      totalPortfolioViews: 'Vues Totales du Portefeuille',
      tablePerformanceTitle: 'Performance des Annonces & Statut',
      confirmVisitBtn: 'Confirmer Visite',
      rescheduleBtn: 'Reprogrammer',
      declineBtn: 'Refuser',
      editBtn: 'Modifier',
      previewBtn: 'Aperçu',
      saveChangesBtn: 'Enregistrer',
      adminQueueSectionBtn: "File d'Approbation",
      adminContentSectionBtn: 'Contenu & Marque',
      adminPendingHeading: 'Annonces en Attente de Modération',
      adminPendingDesc: "Cliquez sur Approuver pour publier immédiatement l'annonce dans le catalogue public.",
      adminAllReviewed: 'Toutes les annonces soumises ont été examinées !',
      adminApprovedHeading: 'Annonces Publiques Approuvées',
      unpublishBtn: 'Dépublier',
      contentEditorHeading: 'Éditeur Éditorial & Hero',
      contentEditorDesc: "Personnalisez les titres, le slogan et la légende vidéo de la page d'accueil.",
      showGridLinesLabel: 'Afficher les 4 lignes verticales architecturales sur le Hero',
      publishContentBtn: 'Publier les Modifications'
    },
    footer: {
      collectionsTitle: 'Collections du Marché',
      buyLinkDesc: 'Maisons, Villas & Commercial',
      rentLinkDesc: 'Court & Long Terme',
      landLinkDesc: 'Parcelles Côtières & Montagne',
      eventsLinkDesc: 'Mariages & Conférences',
      agentsLinkDesc: 'Propriétaires Vérifiés',
      portalsTitle: 'Portails & Studios',
      advisoryTitle: 'Conseil & Conciergerie',
      rightsReserved: 'Tous droits réservés.'
    },
    common: {
      currencyNote: 'Taux de change illustratifs : 1 USD ≈ 60.5 DOP · 1 USD ≈ 132.0 HTG',
      emptyResults: 'Aucune propriété ne correspond à vos critères actuels.',
      resetFilters: 'Réinitialiser les Filtres',
      backToListings: 'Retour aux Propriétés',
      copiedLink: 'Lien copié dans le presse-papiers'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      buy: 'Comprar',
      rent: 'Alquilar',
      land: 'Terrenos',
      eventSpaces: 'Espacios de Eventos',
      agents: 'Agentes',
      listProperty: 'Publicar Propiedad',
      propertiesDropdown: 'Propiedades',
      more: 'Más',
      signIn: 'Iniciar Sesión',
      register: 'Registrarse',
      customerDashboard: 'Panel de Cliente',
      ownerDashboard: 'Panel Propietario',
      adminQueue: 'Aprobación Admin',
      favorites: 'Guardados',
      compare: 'Comparar',
      resetDemo: 'Reiniciar Demo',
      roleMode: 'Modo Demo',
      dashboardsLabel: 'Modo Demo y Paneles',
      buyerRenter: 'Comprador / Inquilino',
      ownerAgent: 'Propietario / Agente',
      pendingShort: 'pendientes',
      currencyLabel: 'Moneda (Ilustrativa)'
    },
    hero: {
      line1: 'MY',
      line2: 'DREAM',
      line3: 'PLACE',
      tagline1: 'ENCUENTRA EL LUGAR',
      tagline2: 'QUE SIEMPRE HAS SOÑADO.',
      exploreCta: 'EXPLORAR PROPIEDADES',
      videoCaption: 'Descubre un lugar que se siente como hogar.',
      quarterLabel: 'Segmento de video'
    },
    search: {
      tabBuy: 'Comprar',
      tabRent: 'Alquilar',
      tabLand: 'Terrenos',
      tabEvent: 'Eventos',
      locationLabel: 'Ubicación',
      locationPlaceholder: 'Ciudad, sector o costa...',
      categoryLabel: 'Categoría',
      allCategories: 'Todas las categorías',
      minPrice: 'Precio Mín',
      maxPrice: 'Precio Máx',
      anyPrice: 'Cualquier precio',
      upTo: 'Hasta',
      bedrooms: 'Habitaciones',
      anyBedrooms: 'Todas',
      rentalDuration: 'Duración',
      anyDuration: 'Duración flexible',
      shortTerm: 'Corto plazo',
      longTerm: 'Largo plazo (12m+)',
      monthly: 'Estancia mensual',
      eventDate: 'Fecha del evento',
      guestCapacity: 'Capacidad invitados',
      anyCapacity: 'Cualquier aforo',
      guestsPlus: 'Invitados',
      searchButton: 'Buscar',
      saveSearch: 'Guardar búsqueda',
      clearFilters: 'Limpiar',
      resultsFound: 'propiedades exclusivas disponibles',
      advancedFilterSuffix: 'Filtro Avanzado de Búsqueda'
    },
    categories: {
      house: 'Casas de Lujo',
      apartment: 'Apartamentos y Penthouses',
      villa: 'Villas Arquitectónicas',
      commercial: 'Locales Comerciales',
      land: 'Terrenos y Solares',
      event_space: 'Salones y Eventos'
    },
    sections: {
      latestPlacesLine1: 'NUESTROS',
      latestPlacesLine2: 'ÚLTIMOS',
      latestPlacesLine3: 'LUGARES',
      latestSubtitle: 'Residencias arquitectónicas selectas, santuarios privados y destinos costeros.',
      portfolioTaxonomyKicker: 'Taxonomía del Catálogo',
      browseByCategory: 'Explorar por Categoría Arquitectónica',
      sec1Kicker: '01 · Adquisiciones Residenciales',
      featuredHouses: 'Casas y Villas Destacadas en Venta',
      sec2Kicker: '02 · Residencias Urbanas y Costeras',
      featuredApartments: 'Apartamentos y Penthouses Selectos',
      exploreRentalsBtn: 'Explorar Alquileres',
      sec3Kicker: '03 · Terrenos Titulados y Salones de Eventos',
      primeLand: 'Terrenos y Parcelas Costeras',
      signatureEventSpaces: 'Espacios Distinguidos para Eventos',
      regionalPresenceKicker: 'Presencia Regional',
      popularLocations: 'Destinos Más Solicitados',
      activeListingsCount: 'anuncios activos',
      howItWorksKicker: 'Arquitectura de Contacto Directo',
      howItWorks: 'Descubrimiento y Contacto Directo',
      step1Badge: '01. Descubrir',
      step1Title: 'Explore Propiedades y Salones Selectos',
      step1Desc: 'Filtre casas, apartamentos, solares titulados y salones de eventos con precios en USD, DOP y HTG.',
      step2Badge: '02. Conectar',
      step2Title: 'Contacte al Propietario y Solicite Visitas',
      step2Desc: 'Envíe consultas directas, programe recorridos presenciales o por video, o abra WhatsApp.',
      step3Badge: '03. Verificar',
      step3Title: 'Aprobación Moderada de Anuncios',
      step3Desc: 'Cada propiedad enviada pasa por nuestra cola de aprobación antes de publicarse.',
      trustAndSafety: 'Propiedad Verificada y Seguridad',
      ownerStudioKicker: 'Estudio de Propietarios y Agentes',
      listPropertyCtaTitle: 'Presente su Propiedad a Compradores e Invitados',
      listPropertyCtaDesc: 'Publique su residencia, terreno o espacio de eventos con nuestro asistente guiado de 9 pasos.',
      viewAll: 'Ver Colección',
      viewDetails: 'Ver Detalles'
    },
    catalog: {
      saleKicker: 'Adquisiciones Residenciales y Comerciales',
      saleTitle: 'Comprar — Casas, Villas, Apartamentos y Comercial',
      saleSubtitle: 'Explore residencias de diseño, penthouses y edificios comerciales disponibles para compra directa.',
      rentKicker: 'Estancias Cortas y Contratos Anuales',
      rentTitle: 'Alquilar — Alquileres de Corto y Largo Plazo',
      rentSubtitle: 'Villas frente al mar totalmente amuebladas, apartamentos ejecutivos y lofts mensuales.',
      landKicker: 'Solares Titulados y Terrenos de Desarrollo',
      landTitle: 'Terrenos — Parcelas Costeras, Montaña y Comerciales',
      landSubtitle: 'Terrenos verificados con perfiles de zonificación, topografía y acceso vial.',
      eventKicker: 'Bodas, Galas, Congresos y Celebraciones Privadas',
      eventTitle: 'Espacios de Eventos — Salones y Santuarios Arquitectónicos',
      eventSubtitle: 'Descubra invernaderos de cristal, terrazas frente al mar y auditorios corporativos con tarifas por día.',
      allForSale: 'Todo en Venta',
      housesForSale: 'Casas en Venta',
      luxuryVillas: 'Villas de Lujo',
      apartmentsPenthouses: 'Apartamentos y Penthouses',
      commercialProps: 'Propiedades Comerciales',
      allRentals: 'Todos los Alquileres',
      shortTermRetreats: 'Corto Plazo',
      monthlyResidency: 'Estancia Mensual',
      longTermLeases: 'Largo Plazo (12m+)',
      allEventVenues: 'Todos los Salones',
      weddingVenues: 'Salones de Bodas',
      birthdayVenues: 'Cumpleaños y Aniversarios',
      conferenceSpaces: 'Salas de Conferencias',
      corporateSummits: 'Eventos Corporativos',
      privateEvents: 'Eventos Privados',
      allAmenities: 'Todas las Comodidades',
      amenityPool: 'Piscina / Infinity',
      amenityOcean: 'Vista al Mar / Costa',
      amenitySolar: 'Energía Solar / Planta',
      amenityFurnished: 'Totalmente Amueblado',
      amenitySecurity: 'Seguridad 24/7',
      sortFeatured: 'Ordenar: Destacados',
      sortPriceAsc: 'Precio: Menor a Mayor',
      sortPriceDesc: 'Precio: Mayor a Menor',
      sortAreaDesc: 'Mayor Área (m²)',
      sortNewest: 'Más Recientes',
      viewGrid: 'Cuadrícula',
      viewList: 'Lista',
      viewMap: 'Mapa',
      emptySubtitle: 'Intente ampliar su rango de precios, ubicación o categoría de propiedad.',
      expandMap: 'Ampliar Mapa',
      compactMap: 'Compactar Mapa'
    },
    property: {
      forSale: 'En Venta',
      forRent: 'En Alquiler',
      landParcel: 'Terreno',
      eventVenue: 'Espacio de Eventos',
      beds: 'Hab.',
      baths: 'Baños',
      bathroomsLabel: 'Baños',
      area: 'm²',
      interiorTotalArea: 'Área Interior / Total',
      landLotArea: 'Área de Terreno / Solar',
      approvedZoning: 'Zonificación Aprobada',
      guests: 'Invitados máx',
      upToGuests: 'Hasta',
      verifiedOwner: 'Propietario Verificado',
      pendingApproval: 'Pendiente de Aprobación',
      reference: 'Ref',
      listedOn: 'Publicado',
      contactOwner: 'Contactar Propietario',
      contactSeller: 'Contactar Vendedor',
      contactVenue: 'Contactar Salón',
      requestViewing: 'Solicitar Visita',
      requestMoreDetails: 'Solicitar Más Detalles',
      askAvailability: 'Consultar Disponibilidad',
      whatsappOwner: 'Contactar por WhatsApp',
      saveFavorite: 'Guardar',
      saved: 'Guardado',
      compareAdd: 'Comparar',
      compareAdded: 'Comparando',
      shareProperty: 'Compartir',
      reportListing: 'Reportar Anuncio',
      safetyTipsTitle: 'Recomendaciones de Seguridad y Trato Directo',
      safetyTip1: 'Inspeccione siempre la propiedad en persona o por videollamada antes de firmar acuerdos.',
      safetyTip2: 'MY DREAM PLACE conecta directamente con propietarios sin pagos automáticos en línea.',
      safetyTip3: 'Verifique títulos de propiedad y permisos municipales directamente con el propietario o agente.',
      similarProperties: 'Propiedades Similares',
      virtualTour: 'Recorrido Virtual 360°',
      photosTab: 'Fotos',
      cinemaReelTab: 'Video',
      drag360Hint: 'Arrastre el control para girar 360° por la perspectiva arquitectónica',
      overviewSpecsTitle: 'Descripción Arquitectónica y Especificaciones',
      highlightsTitle: 'Características Destacadas',
      eventGuidelinesTitle: 'Formatos de Eventos y Normas del Salón',
      supportedFormatsLabel: 'Formatos Admitidos',
      topographyLabel: 'Topografía',
      utilitiesLabel: 'Servicios e Infraestructura',
      amenitiesTitle: 'Comodidades e Infraestructura',
      responseRateLabel: 'Tasa de Respuesta',
      typicalResponseLabel: 'Tiempo de Respuesta',
      languagesLabel: 'Idiomas',
      mapPreview: 'Ubicación y Entorno',
      mapDemoNotice: 'Mapa interactivo de demostración local — coordenadas ilustrativas.',
      noOnlineCheckoutNotice: 'Consulta directa con el propietario — Sin cargos de reserva en línea.',
      defaultInquiryMessage: 'Hola, estoy interesado en esta propiedad. ¿Sigue disponible? Me gustaría recibir más información y coordinar una visita si es posible.',
      notFoundTitle: 'Propiedad No Encontrada',
      notFoundDesc: 'La referencia solicitada no existe en esta demostración local.',
      moderationBannerText: 'Este anuncio se encuentra actualmente en revisión de moderación.',
      reviewInAdminBtn: 'Revisar en Cola Admin',
      schemaActiveTitle: 'Schema.org JSON-LD Activo',
      schemaDesc: 'Datos estructurados RealEstateListing, Offer, GeoCoordinates y BreadcrumbList integrados para buscadores.',
      copyBtn: 'Copiar',
      inspectBtn: 'Inspeccionar',
      hideBtn: 'Ocultar JSON-LD'
    },
    agentsPage: {
      kicker: 'Asesoría Verificada y Representación Directa',
      title: 'Agentes Distinguidos y Propietarios',
      subtitle: 'Conéctese directamente con desarrolladores verificados, propietarios y asesores inmobiliarios.',
      verifiedBadge: 'Verificado',
      licenseLabel: 'Licencia',
      portfolioBtn: 'Portafolio',
      activePortfolioKicker: 'Portafolio Activo',
      representedBy: 'Representado por',
      listingsCountLabel: 'Propiedades',
      regionsServedLabel: 'Regiones Atendidas',
      verifiedFooterNote: 'Representación directa verificada en el registro de demostración.',
      submitListingLink: 'Publicar una propiedad como Propietario o Agente'
    },
    wizard: {
      kicker: 'Asistente de Publicación en 9 Pasos',
      stepOf: 'Paso',
      step1Short: 'Categoría',
      step2Short: 'Venta / Alquiler',
      step3Short: 'Ubicación',
      step4Short: 'Especificaciones',
      step5Short: 'Imágenes',
      step6Short: 'Precio',
      step7Short: 'Descripción',
      step8Short: 'Contacto',
      step9Short: 'Vista Previa',
      step1Title: '1. Seleccione la Categoría de Propiedad',
      step1Desc: 'Elija la clasificación que mejor describa su residencia, terreno o salón de eventos.',
      step2Title: '2. Modalidad de Transacción y Disponibilidad',
      step2Desc: 'Indique si la propiedad se ofrece en venta, alquiler o alquiler para eventos.',
      forSaleOpt: 'En Venta (Adquisición Directa)',
      forRentOpt: 'En Alquiler / Arrendamiento',
      landSaleOpt: 'Venta de Terreno / Solar',
      eventHireOpt: 'Alquiler de Espacio para Eventos',
      prefDurationLabel: 'Duración de Alquiler Preferida',
      step3Title: '3. Ubicación Geográfica y Dirección',
      step3Desc: 'Proporcione ciudad y sector precisos para la búsqueda.',
      cityLabel: 'Ciudad / Municipio',
      neighborhoodLabel: 'Sector / Urbanización',
      countryLabel: 'País',
      addressLabel: 'Dirección o Punto de Referencia',
      step4Title: '4. Especificaciones Arquitectónicas',
      step4Desc: 'Parámetros adaptados a la categoría seleccionada.',
      totalAreaLabel: 'Área Total (m²)',
      lotAreaLabel: 'Área de Solar / Terreno (m²)',
      parkingSpacesLabel: 'Parqueos',
      turnkeyFurnished: 'Totalmente Amueblado',
      zoningClassLabel: 'Clasificación de Zonificación',
      topographyElevLabel: 'Topografía y Elevación',
      directRoadAccess: 'Acceso Vial Asfaltado y Servicios en Lindero',
      maxGuestCapLabel: 'Capacidad Máxima de Invitados',
      spaceConfigLabel: 'Configuración del Espacio',
      indoorOutdoorBoth: 'Salón Interior + Jardines Exteriores',
      indoorOnly: 'Salón Interior Climatizado',
      outdoorOnly: 'Terraza / Jardín Exterior',
      eventRulesLabel: 'Normas del Evento y Horarios (separados por punto y coma)',
      step5Title: '5. Fotografía Arquitectónica y Medios',
      step5Desc: 'Suba una foto desde su dispositivo o agregue una URL de imagen.',
      uploadFileBtn: 'Subir Archivo de Imagen',
      pasteUrlPlaceholder: 'O pegue una URL de imagen...',
      addUrlBtn: 'Agregar URL',
      removeBtn: 'Quitar',
      step6Title: '6. Precio y Valoración',
      step6Desc: 'Ingrese el precio base en USD. Los visitantes pueden cambiar a DOP y HTG automáticamente.',
      priceUsdLabel: 'Precio en USD ($)',
      pricingBasisLabel: 'Base de Precio',
      basisTotal: 'Precio Total de Venta',
      basisMonth: 'Por Mes (Alquiler)',
      basisNight: 'Por Noche (Corto Plazo)',
      basisDay: 'Por Día de Evento',
      formattedPreviewLabel: 'Vista Previa del Precio',
      step7Title: '7. Título Editorial, Descripción y Comodidades',
      propTitleLabel: 'Título de la Propiedad',
      propSubtitleLabel: 'Subtítulo Editorial',
      fullDescLabel: 'Descripción Arquitectónica Completa',
      keyAmenitiesLabel: 'Comodidades Clave (separadas por coma)',
      step8Title: '8. Datos de Contacto del Propietario o Agente',
      step8Desc: 'Las consultas y solicitudes de visita se enviarán a estos datos en la demostración.',
      step9Title: '9. Vista Previa Final y Envío a Aprobación',
      step9Desc: 'Revise el resumen antes de guardarlo localmente con estado: Pendiente de Aprobación.',
      submittedByLabel: 'Enviado por',
      prevStepBtn: 'Paso Anterior',
      continueStepBtn: 'Continuar al Paso',
      submitFinalBtn: 'Enviar Propiedad para Aprobación',
      successStatusBadge: 'Estado: Pendiente de Aprobación',
      successTitle: 'Propiedad Guardada en la Demostración Local',
      successDesc: 'Su anuncio se ha enviado al Panel de Propietario y a la Cola de Aprobación Admin.',
      previewListingBtn: 'Ver Página del Anuncio',
      viewOwnerStudioBtn: 'Ver en Panel Propietario',
      approveAdminBtn: 'Aprobar en Cola Admin →'
    },
    modals: {
      contactTitle: 'Consulta Directa al Propietario',
      viewingTitle: 'Programar Visita Privada',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      phoneOptional: 'Teléfono (Opcional)',
      phoneRequired: 'Teléfono / WhatsApp',
      propertyRef: 'Referencia de Propiedad',
      message: 'Su Mensaje',
      sendInquiry: 'Enviar Consulta',
      preferWalkthroughPrompt: '¿Prefiere programar una visita guiada?',
      preferredDate: 'Fecha Preferida',
      preferredTime: 'Horario Preferido',
      visitType: 'Modalidad de Visita',
      inPerson: 'Visita Presencial',
      videoCall: 'Recorrido por Videollamada',
      eventInspection: 'Inspección de Salón',
      estimatedGuestsLabel: 'Número Estimado de Invitados',
      viewingNotesLabel: 'Preguntas o Notas de Inspección',
      viewingNotesPlaceholder: 'Indique si desea revisar títulos, sistema solar o acceso de catering...',
      submitViewing: 'Enviar Solicitud',
      inquirySavedHeading: 'Consulta Guardada en la Demo Local',
      inquirySentSuccess: 'Su consulta se ha guardado en la demostración local y enviado al panel del propietario.',
      viewCustomerDashBtn: 'Ver en Panel de Cliente',
      simulateOwnerReplyBtn: 'Simular Respuesta del Propietario',
      viewingLoggedHeading: 'Solicitud de Visita Registrada',
      viewingSentSuccess: 'Su solicitud de visita ha sido registrada en su panel de cliente.',
      customerScheduleBtn: 'Ver Agenda de Visitas',
      confirmAsOwnerBtn: 'Confirmar como Propietario',
      reportReasonLabel: 'Motivo del Reporte',
      submitReportBtn: 'Enviar Reporte a Administración',
      compareTitle: 'Comparación de Propiedades Lado a Lado',
      clearAllBtn: 'Limpiar Todo',
      authDemoSubtitle: 'Cambie su rol activo para probar los flujos de Cliente, Propietario o Admin.',
      activeDemoRoleLabel: 'Rol Activo en Demo',
      localSessionNotice: 'Sesión local únicamente. Sin conexión a bases de datos externas.',
      continueAsRoleBtn: 'Continuar como',
      close: 'Cerrar'
    },
    assistant: {
      buttonLabel: 'Asistente de Propiedades',
      title: 'Asistente de Propiedades',
      subtitle: 'Buscador del Catálogo Local',
      welcomeMessage: 'Bienvenido al asistente de MY DREAM PLACE. Consulte por villas, apartamentos, terrenos o salones de eventos según ciudad, presupuesto o capacidad.',
      foundMatches: 'propiedades coincidentes encontradas en el catálogo:',
      noExactMatch: 'No se encontraron coincidencias exactas. Aquí están nuestras propiedades destacadas:',
      inputPlaceholder: 'Buscar por ciudad, villa, terreno...',
      prompt1: 'Villas frente al mar en venta',
      prompt2: 'Salones de bodas para 200+ invitados',
      prompt3: 'Terrenos costeros titulados',
      prompt4: 'Alquileres amueblados en Pétion-Ville'
    },
    dashboard: {
      customerTitle: 'Panel de Cliente y Consultas',
      ownerTitle: 'Estudio de Propietario y Agente',
      ownerSubtitle: 'Administre sus propiedades, responda consultas y confirme solicitudes de visita.',
      adminTitle: 'Moderación y Cola de Aprobación',
      overview: 'Resumen',
      myProperties: 'Mis Propiedades',
      addProperty: 'Publicar Propiedad',
      pendingListings: 'Pendientes',
      approvedListings: 'Aprobadas',
      inquiries: 'Consultas de Clientes',
      messages: 'Mensajes',
      viewingRequests: 'Solicitudes de Visita',
      favorites: 'Favoritos',
      savedSearches: 'Búsquedas Guardadas',
      notifications: 'Notificaciones',
      profile: 'Perfil y Ajustes',
      languagePrefs: 'Idioma y Moneda',
      approve: 'Aprobar Anuncio',
      reject: 'Rechazar',
      requestChanges: 'Solicitar Cambios',
      markAnswered: 'Marcar Respondido',
      markClosed: 'Cerrar Consulta',
      replyPlaceholder: 'Escriba una respuesta en esta conversación de demostración...',
      sendReply: 'Enviar Respuesta',
      demoNotice: 'Demostración Interactiva Local: Los mensajes y aprobaciones se guardan en su navegador.',
      switchToOwnerBtn: 'Ir al Estudio de Propietario →',
      openAdminQueueBtn: 'Abrir Cola de Aprobación Admin',
      exploreListingsBtn: 'Explorar Propiedades',
      recentInquiriesTitle: 'Consultas Recientes y Respuestas',
      openThreadBtn: 'Abrir Conversación',
      noFavoritesText: 'Aún no ha guardado ninguna propiedad.',
      applySearchBtn: 'Aplicar Búsqueda',
      markAllReadBtn: 'Marcar Todo Leído',
      prefInterfaceLang: 'Idioma Preferido de la Interfaz',
      prefDisplayCurr: 'Moneda de Visualización',
      buyerProfileNotes: 'Notas de Perfil de Comprador / Inquilino',
      saveProfileBtn: 'Guardar Preferencias',
      totalPortfolioViews: 'Vistas Totales del Portafolio',
      tablePerformanceTitle: 'Rendimiento de Anuncios y Estado',
      confirmVisitBtn: 'Confirmar Visita',
      rescheduleBtn: 'Reprogramar',
      declineBtn: 'Rechazar',
      editBtn: 'Editar',
      previewBtn: 'Vista Previa',
      saveChangesBtn: 'Guardar Cambios',
      adminQueueSectionBtn: 'Cola de Aprobación',
      adminContentSectionBtn: 'Contenido Editorial y Marca',
      adminPendingHeading: 'Cola de Moderación Pendiente',
      adminPendingDesc: 'Al hacer clic en Aprobar Anuncio, la propiedad pasa inmediatamente al catálogo público.',
      adminAllReviewed: '¡Todos los anuncios enviados han sido revisados!',
      adminApprovedHeading: 'Propiedades Públicas Aprobadas',
      unpublishBtn: 'Ocultar',
      contentEditorHeading: 'Editor de Contenido Principal y Hero',
      contentEditorDesc: 'Personalice titulares, eslogan y subtítulo del video en tiempo real.',
      showGridLinesLabel: 'Mostrar las 4 líneas verticales arquitectónicas en el Hero',
      publishContentBtn: 'Publicar Cambios'
    },
    footer: {
      collectionsTitle: 'Colecciones del Mercado',
      buyLinkDesc: 'Casas, Villas y Comercial',
      rentLinkDesc: 'Corto y Largo Plazo',
      landLinkDesc: 'Parcelas Costeras y Montaña',
      eventsLinkDesc: 'Bodas y Congresos',
      agentsLinkDesc: 'Propietarios Verificados',
      portalsTitle: 'Portales y Estudios',
      advisoryTitle: 'Asesoría y Concierge',
      rightsReserved: 'Todos los derechos reservados.'
    },
    common: {
      currencyNote: 'Tasas de cambio ilustrativas: 1 USD ≈ 60.5 DOP · 1 USD ≈ 132.0 HTG',
      emptyResults: 'Ninguna propiedad coincide con los filtros seleccionados.',
      resetFilters: 'Restablecer Filtros',
      backToListings: 'Volver a Propiedades',
      copiedLink: 'Enlace copiado al portapapeles'
    }
  },
  ht: {
    nav: {
      home: 'Akèy',
      buy: 'Achte',
      rent: 'Lwe',
      land: 'Tè',
      eventSpaces: 'Espas Evènman',
      agents: 'Ajan',
      listProperty: 'Mete Pwopriyete w',
      propertiesDropdown: 'Pwopriyete',
      more: 'Plis',
      signIn: 'Konekte',
      register: 'Enskri',
      customerDashboard: 'Espas Kliyan',
      ownerDashboard: 'Espas Mèt Kay',
      adminQueue: 'Apwobasyon Admin',
      favorites: 'Anrejistre',
      compare: 'Konpare',
      resetDemo: 'Reyinisyalize Demo',
      roleMode: 'Mòd Demo',
      dashboardsLabel: 'Mòd Demo ak Espas Yo',
      buyerRenter: 'Achtè / Lokatè',
      ownerAgent: 'Mèt Kay / Ajan',
      pendingShort: 'ap tann',
      currencyLabel: 'Lajan (Egzanp)'
    },
    hero: {
      line1: 'MY',
      line2: 'DREAM',
      line3: 'PLACE',
      tagline1: 'JWENN KOTE',
      tagline2: 'OU TE TOUJOU REVE A.',
      exploreCta: 'DEKOUVRI PWOPRIYETE YO',
      videoCaption: 'Dekouvri yon kote ki fè w santi w lakay ou.',
      quarterLabel: 'Pati videyo'
    },
    search: {
      tabBuy: 'Achte',
      tabRent: 'Lwe',
      tabLand: 'Tè',
      tabEvent: 'Evènman',
      locationLabel: 'Kote',
      locationPlaceholder: 'Vil, katye oswa bò lanmè...',
      categoryLabel: 'Kategori',
      allCategories: 'Tout Kategori',
      minPrice: 'Pri Minimòm',
      maxPrice: 'Pri Maksimòm',
      anyPrice: 'Nenpòt Pri',
      upTo: 'Jiska',
      bedrooms: 'Chanm',
      anyBedrooms: 'Tout',
      rentalDuration: 'Dire Lwaye',
      anyDuration: 'Dire Fleksib',
      shortTerm: 'Kout Tèm',
      longTerm: 'Lon Tèm (12m+)',
      monthly: 'Pa Mwa',
      eventDate: 'Dat Evènman',
      guestCapacity: 'Kapasite Envite',
      anyCapacity: 'Nenpòt Kantite',
      guestsPlus: 'Envite',
      searchButton: 'Chèche',
      saveSearch: 'Anrejistre Chèche',
      clearFilters: 'Efase',
      resultsFound: 'pwopriyete disponib',
      advancedFilterSuffix: 'Filtè Chèche Avanse'
    },
    categories: {
      house: 'Kay Liksye',
      apartment: 'Apatman & Penthouse',
      villa: 'Vila Achitekti',
      commercial: 'Espas Komèsyal',
      land: 'Tè pou Bati',
      event_space: 'Espas pou Evènman'
    },
    sections: {
      latestPlacesLine1: 'DÈNYE',
      latestPlacesLine2: 'BÈL KOTE',
      latestPlacesLine3: 'NOU YO',
      latestSubtitle: 'Pi bèl kay achitekti, espas prive ak bèl kote bò lanmè.',
      portfolioTaxonomyKicker: 'Tout Kategori Pwopriyete',
      browseByCategory: 'Chèche pa Kategori Pwopriyete',
      sec1Kicker: '01 · Kay ak Vila pou Achte',
      featuredHouses: 'Kay ak Vila pou Vann',
      sec2Kicker: '02 · Apatman nan Vil ak Bò Lanmè',
      featuredApartments: 'Apatman ak Penthouse Chwazi',
      exploreRentalsBtn: 'Wè Tout Kay pou Lwe',
      sec3Kicker: '03 · Tè ak Espas pou Gwo Evènman',
      primeLand: 'Bèl Tè ak Emplasman',
      signatureEventSpaces: 'Espas pou Maryaj ak Gwo Evènman',
      regionalPresenceKicker: 'Prezans nan Rejyon an',
      popularLocations: 'Kote Moun Pi Renmen Yo',
      activeListingsCount: 'anons disponib',
      howItWorksKicker: 'Kontak Dirèk ak Mèt Kay la',
      howItWorks: 'Kijan MY DREAM PLACE Fonksyone',
      step1Badge: '01. Dekouvri',
      step1Title: 'Chèche Kay, Tè ak Espas Evènman',
      step1Desc: 'Filtre kay, apatman, tè ak espas evènman ak pri klè an USD, DOP ak HTG.',
      step2Badge: '02. Kontakte',
      step2Title: 'Pale ak Mèt Kay la epi Mande Vizit',
      step2Desc: 'Voye mesaj dirèk, planifye yon vizit sou plas oswa pa videyo, oswa ekri sou WhatsApp.',
      step3Badge: '03. Verifye',
      step3Title: 'Apwobasyon chak Anons sou Sit la',
      step3Desc: 'Chak pwopriyete ki soumèt pase nan verifikasyon admin anvan li parèt sou sit la.',
      trustAndSafety: 'Sekirite ak Konfyans sou Platfòm nan',
      ownerStudioKicker: 'Espas Mèt Kay ak Ajan',
      listPropertyCtaTitle: 'Prezante Pwopriyete w bay Achtè ak Kliyan Seriye',
      listPropertyCtaDesc: 'Mete kay ou, tè ou oswa espas evènman ou sou platfòm nan nan 9 etap fasil.',
      viewAll: 'Wè Tout Koleksyon an',
      viewDetails: 'Wè Detay'
    },
    catalog: {
      saleKicker: 'Kay ak Espas Komèsyal pou Achte',
      saleTitle: 'Achte — Kay, Vila, Apatman ak Komèsyal',
      saleSubtitle: 'Dekouvri bèl kay achitekti, penthouse ak bilding komèsyal ki disponib pou achte dirèk.',
      rentKicker: 'Lwaye Kout Tèm ak Kontra chak Ane',
      rentTitle: 'Lwe — Kay ak Apatman pou Kout ak Lon Tèm',
      rentSubtitle: 'Vila bò lanmè tou meble, apatman sekirize ak loft pa mwa.',
      landKicker: 'Tè ak Papye Legal pou Pwojè',
      landTitle: 'Tè — Bò Lanmè, sou Mòn ak Komèsyal',
      landSubtitle: 'Tè verifye ak enfòmasyon sou zòn, topografi ak wout/kouran.',
      eventKicker: 'Maryaj, Fèt, Konferans ak Resepsyon Prive',
      eventTitle: 'Espas Evènman — Sal ak Jaden pou Gwo Okazyon',
      eventSubtitle: 'Dekouvri bèl espas pou maryaj, fèt anivèsè ak konferans ak pri pa jou.',
      allForSale: 'Tout pou Vann',
      housesForSale: 'Kay pou Vann',
      luxuryVillas: 'Vila Liksye',
      apartmentsPenthouses: 'Apatman & Penthouse',
      commercialProps: 'Espas Komèsyal',
      allRentals: 'Tout pou Lwe',
      shortTermRetreats: 'Kout Tèm',
      monthlyResidency: 'Pa Mwa',
      longTermLeases: 'Lon Tèm (12m+)',
      allEventVenues: 'Tout Espas Evènman',
      weddingVenues: 'Espas pou Maryaj',
      birthdayVenues: 'Espas pou Anivèsè',
      conferenceSpaces: 'Sal Konferans',
      corporateSummits: 'Evènman Antrepriz',
      privateEvents: 'Fèt Prive',
      allAmenities: 'Tout Ekipman Yo',
      amenityPool: 'Pisin / Infinity',
      amenityOcean: 'Vi sou Lanmè',
      amenitySolar: 'Solè / Jeneratris',
      amenityFurnished: 'Tou Meble',
      amenitySecurity: 'Sekirite 24/7',
      sortFeatured: 'Triye: Pi Enpòtan',
      sortPriceAsc: 'Pri: Pi Ba rive Pi Wo',
      sortPriceDesc: 'Pri: Pi Wo rive Pi Ba',
      sortAreaDesc: 'Pi Gwo Espas (m²)',
      sortNewest: 'Pi Nouvo Yo',
      viewGrid: 'Kadriyaj',
      viewList: 'Lis',
      viewMap: 'Kat',
      emptySubtitle: 'Eseye chanje pri a, vil la oswa kategori pwopriyete a.',
      expandMap: 'Ogmante Kat la',
      compactMap: 'Redwi Kat la'
    },
    property: {
      forSale: 'Pou Vann',
      forRent: 'Pou Lwe',
      landParcel: 'Tè',
      eventVenue: 'Espas Evènman',
      beds: 'Chanm',
      baths: 'Doub',
      bathroomsLabel: 'Sal de Ben',
      area: 'm²',
      interiorTotalArea: 'Espas Andedan / Total',
      landLotArea: 'Gwosè Tè a',
      approvedZoning: 'Zòn Otorize',
      guests: 'Envite maks',
      upToGuests: 'Jiska',
      verifiedOwner: 'Mèt Kay Verifye',
      pendingApproval: 'Ap Tann Apwobasyon',
      reference: 'Ref',
      listedOn: 'Pibliye',
      contactOwner: 'Kontakte Mèt Kay la',
      contactSeller: 'Kontakte Vandè a',
      contactVenue: 'Kontakte Espas la',
      requestViewing: 'Mande yon Vizit',
      requestMoreDetails: 'Mande Plis Detay',
      askAvailability: 'Mande Disponibilite',
      whatsappOwner: 'Kontakte sou WhatsApp',
      saveFavorite: 'Anrejistre',
      saved: 'Anrejistre',
      compareAdd: 'Konpare',
      compareAdded: 'Nan Konparezon',
      shareProperty: 'Pataje',
      reportListing: 'Siyale Anons',
      safetyTipsTitle: 'Konsèy Sekirite pou Achtè ak Lokatè',
      safetyTip1: 'Toujou vizite pwopriyete a an pèsòn oswa pa apèl videyo anvan ou pran angajman.',
      safetyTip2: 'MY DREAM PLACE mete w an kontak dirèk ak mèt kay la san pèman sou entènèt.',
      safetyTip3: 'Verifye papye tè ak otorizasyon legal dirèkteman ak mèt kay la oswa ajan otorize a.',
      similarProperties: 'Pwopriyete Menm Jan',
      virtualTour: 'Vizit Vityèl 360°',
      photosTab: 'Foto',
      cinemaReelTab: 'Videyo',
      drag360Hint: 'Glise bouton an pou gade pwopriyete a nan 360°',
      overviewSpecsTitle: 'Detay ak Karakteristik Pwopriyete a',
      highlightsTitle: 'Pwen Enpòtan Yo',
      eventGuidelinesTitle: 'Kalite Evènman ak Règleman Espas la',
      supportedFormatsLabel: 'Evènman Otorize',
      topographyLabel: 'Topografi Tè a',
      utilitiesLabel: 'Dlo, Kouran ak Wout',
      amenitiesTitle: 'Ekipman ak Avantaj Yo',
      responseRateLabel: 'To Repons',
      typicalResponseLabel: 'Tan pou Reponn',
      languagesLabel: 'Lang li Pale',
      mapPreview: 'Kat ak Katye a',
      mapDemoNotice: 'Kat demonstrasyon entèaktif lokal — kowòdone egzanp.',
      noOnlineCheckoutNotice: 'Kontak dirèk ak mèt kay la — Pa gen pèman sou sit la.',
      defaultInquiryMessage: 'Bonjou, mwen enterese nan pwopriyete sa a. Èske li toujou disponib? Mwen ta renmen jwenn plis enfòmasyon epi planifye yon vizit si sa posib.',
      notFoundTitle: 'Pwopriyete sa a Pa Jwenn',
      notFoundDesc: 'Referans pwopriyete sa a pa egziste nan demo lokal la.',
      moderationBannerText: 'Anons sa a ap tann verifikasyon admin.',
      reviewInAdminBtn: 'Verifye nan Espas Admin',
      schemaActiveTitle: 'Schema.org JSON-LD Aktif',
      schemaDesc: 'Done estriktire RealEstateListing, Offer, GeoCoordinates ak BreadcrumbList pou rechèch Google.',
      copyBtn: 'Kopye',
      inspectBtn: 'Gade Kòd la',
      hideBtn: 'Kache JSON-LD'
    },
    agentsPage: {
      kicker: 'Konseyè Verifye ak Kontak Dirèk',
      title: 'Ajan ak Mèt Pwopriyete Verifye Yo',
      subtitle: 'Pran kontak dirèk ak mèt pwopriyete, konstriktè ak ajan otorize yo.',
      verifiedBadge: 'Verifye',
      licenseLabel: 'Lisans',
      portfolioBtn: 'Pwopriyete yo',
      activePortfolioKicker: 'Pwopriyete Disponib',
      representedBy: 'Reprezante pa',
      listingsCountLabel: 'Anons',
      regionsServedLabel: 'Zòn kote li Travay',
      verifiedFooterNote: 'Kontak dirèk mèt kay ak ajan verifye nan demo a.',
      submitListingLink: 'Mete yon pwopriyete kòm Mèt Kay oswa Ajan'
    },
    wizard: {
      kicker: 'Asistan 9 Etap pou Mete Pwopriyete w',
      stepOf: 'Etap',
      step1Short: 'Kategori',
      step2Short: 'Vann oswa Lwe',
      step3Short: 'Kote li Ye',
      step4Short: 'Detay yo',
      step5Short: 'Foto yo',
      step6Short: 'Pri a',
      step7Short: 'Deskripsyon',
      step8Short: 'Kontak Ou',
      step9Short: 'Verifye & Voye',
      step1Title: '1. Chwazi Kategori Pwopriyete a',
      step1Desc: 'Chwazi kategori ki koresponn ak kay ou, tè ou oswa espas evènman ou a.',
      step2Title: '2. Vann, Lwe oswa Espas Evènman',
      step2Desc: 'Di nou si pwopriyete sa a se pou vann, pou lwe oswa pou resevwa evènman.',
      forSaleOpt: 'Pou Vann (Achte Dirèk)',
      forRentOpt: 'Pou Lwe',
      landSaleOpt: 'Tè pou Vann',
      eventHireOpt: 'Espas pou Evènman',
      prefDurationLabel: 'Dire Lwaye ou Pito',
      step3Title: '3. Kote Pwopriyete a Ye ak Adrès',
      step3Desc: 'Bay vil la ak katye a pou moun ka jwenn li fasil.',
      cityLabel: 'Vil / Komin',
      neighborhoodLabel: 'Katye / Zòn',
      countryLabel: 'Peyi',
      addressLabel: 'Adrès oswa Repè',
      step4Title: '4. Detay ak Gwosè Pwopriyete a',
      step4Desc: 'Enfòmasyon ki adapte ak kategori ou chwazi a.',
      totalAreaLabel: 'Gwosè Total (m²)',
      lotAreaLabel: 'Gwosè Tè a (m²)',
      parkingSpacesLabel: 'Plas Pakin',
      turnkeyFurnished: 'Tou Meble',
      zoningClassLabel: 'Kalite Zòn (Rezidansyèl / Komèsyal)',
      topographyElevLabel: 'Topografi Tè a',
      directRoadAccess: 'Gen Wout ak Kouran ki Rive sou Tè a',
      maxGuestCapLabel: 'Kantite Envite Maksimòm',
      spaceConfigLabel: 'Kijan Espas la Fèt',
      indoorOutdoorBoth: 'Sal Andedan + Jaden Deyò',
      indoorOnly: 'Sal Andedan ak Klimatizè',
      outdoorOnly: 'Teras / Jaden Deyò Sèlman',
      eventRulesLabel: 'Règleman ak Lè Fèmti (separe ak pwen-vigil)',
      step5Title: '5. Foto Pwopriyete a',
      step5Desc: 'Chwazi yon foto sou aparèy ou oswa mete lyen URL yon foto.',
      uploadFileBtn: 'Chwazi yon Foto',
      pasteUrlPlaceholder: 'Oswa kole lyen URL yon foto...',
      addUrlBtn: 'Ajoute Lyen',
      removeBtn: 'Retire',
      step6Title: '6. Pri Pwopriyete a',
      step6Desc: 'Mete pri a an USD. Sit la ap montre l an DOP ak HTG tou.',
      priceUsdLabel: 'Pri an USD ($)',
      pricingBasisLabel: 'Kijan Pri a Kalkile',
      basisTotal: 'Pri Total pou Vann',
      basisMonth: 'Pa Mwa (Lwaye)',
      basisNight: 'Pa Nwit (Kout Tèm)',
      basisDay: 'Pa Jou Evènman',
      formattedPreviewLabel: 'Kijan Pri a ap Parèt',
      step7Title: '7. Tit, Deskripsyon ak Ekipman Yo',
      propTitleLabel: 'Tit Pwopriyete a',
      propSubtitleLabel: 'Ti Fraz Prezantasyon',
      fullDescLabel: 'Deskripsyon Konplè Pwopriyete a',
      keyAmenitiesLabel: 'Ekipman Yo (separe ak vigil)',
      step8Title: '8. Enfòmasyon Kontak Mèt Kay la oswa Ajan an',
      step8Desc: 'Demann kliyan yo ak demann vizit yo ap rive sou enfòmasyon sa yo nan demo a.',
      step9Title: '9. Verifye epi Voye pou Apwobasyon',
      step9Desc: 'Verifye tout enfòmasyon yo anvan ou anrejistre l: Ap Tann Apwobasyon.',
      submittedByLabel: 'Soumèt pa',
      prevStepBtn: 'Etap Anvan',
      continueStepBtn: 'Kontinye nan Etap',
      submitFinalBtn: 'Voye Pwopriyete a pou Apwobasyon',
      successStatusBadge: 'Estati: Ap Tann Apwobasyon',
      successTitle: 'Pwopriyete a Anrejistre nan Demo Lokal la',
      successDesc: 'Anons ou a nan Espas Mèt Kay la ak nan Apwobasyon Admin nan. Apwouve l nan Admin pou li parèt pou tout moun!',
      previewListingBtn: 'Gade Paj Pwopriyete a',
      viewOwnerStudioBtn: 'Ale nan Espas Mèt Kay',
      approveAdminBtn: 'Apwouve nan Admin →'
    },
    modals: {
      contactTitle: 'Voye Mesaj bay Mèt Kay la',
      viewingTitle: 'Planifye yon Vizit Prive',
      fullName: 'Non Konplè',
      email: 'Adrès Imèl',
      phoneOptional: 'Telefòn (Si w vle)',
      phoneRequired: 'Telefòn / WhatsApp',
      propertyRef: 'Referans Pwopriyete',
      message: 'Mesaj Ou',
      sendInquiry: 'Voye Demann nan',
      preferWalkthroughPrompt: 'Ou pito planifye yon vizit?',
      preferredDate: 'Dat ou Pito',
      preferredTime: 'Lè ou Pito',
      visitType: 'Kalite Vizit',
      inPerson: 'Vizit sou Plas',
      videoCall: 'Vizit pa Videyo',
      eventInspection: 'Vizit Espas Evènman',
      estimatedGuestsLabel: 'Kantite Envite ou Konte Genyen',
      viewingNotesLabel: 'Kesyon oswa Nòt Espesyal',
      viewingNotesPlaceholder: 'Di mèt kay la si w vle wè papye tè, sistèm solè oswa lòt detay...',
      submitViewing: 'Voye Demann Vizit',
      inquirySavedHeading: 'Demann nan Anrejistre nan Demo a',
      inquirySentSuccess: 'Demann ou an anrejistre nan demo lokal la epi voye bay mèt kay la.',
      viewCustomerDashBtn: 'Ale nan Espas Kliyan',
      simulateOwnerReplyBtn: 'Reponn kòm Mèt Kay',
      viewingLoggedHeading: 'Demann Vizit la Anrejistre',
      viewingSentSuccess: 'Demann vizit ou an anrejistre nan espas kliyan ou an.',
      customerScheduleBtn: 'Lis Vizit Kliyan',
      confirmAsOwnerBtn: 'Konfime kòm Mèt Kay',
      reportReasonLabel: 'Rezon Siyalman an',
      submitReportBtn: 'Voye Siyalman bay Admin',
      compareTitle: 'Konpare Pwopriyete yo Kòt a Kòt',
      clearAllBtn: 'Efase Tout',
      authDemoSubtitle: 'Chanje wòl ou nan demo a pou teste Kliyan, Mèt Kay oswa Admin.',
      activeDemoRoleLabel: 'Wòl Demo Aktif',
      localSessionNotice: 'Sesyon lokal sèlman. Pa gen okenn baz done deyò ki konekte.',
      continueAsRoleBtn: 'Kontinye kòm',
      close: 'Fèmen'
    },
    assistant: {
      buttonLabel: 'Asistan Pwopriyete',
      title: 'Asistan Pwopriyete',
      subtitle: 'Chèche nan Katalòg Lokal la',
      welcomeMessage: 'Byenvini nan asistan MY DREAM PLACE la. Mande pou vila, apatman, tè oswa espas evènman selon vil la oswa bidjè w.',
      foundMatches: 'pwopriyete ki koresponn nan katalòg nou an:',
      noExactMatch: 'Nou pa jwenn mo egzak sa a, men gade pi bèl pwopriyete nou yo:',
      inputPlaceholder: 'Chèche pa vil, vila, tè...',
      prompt1: 'Vila bò lanmè pou vann',
      prompt2: 'Espas maryaj pou 200+ envite',
      prompt3: 'Tè bò lanmè ak papye',
      prompt4: 'Kay meble pou lwe Pétion-Ville'
    },
    dashboard: {
      customerTitle: 'Espas Kliyan ak Demann Yo',
      ownerTitle: 'Estidyo Mèt Kay ak Ajan',
      ownerSubtitle: 'Jere pwopriyete w yo, reponn mesaj kliyan epi konfime demann vizit yo.',
      adminTitle: 'Espas Admin ak Apwobasyon',
      overview: 'Rezime',
      myProperties: 'Pwopriyete Mwen Yo',
      addProperty: 'Mete yon Pwopriyete',
      pendingListings: 'Ap Tann Apwobasyon',
      approvedListings: 'Pwopriyete Apwouve',
      inquiries: 'Demann Kliyan Yo',
      messages: 'Mesaj Yo',
      viewingRequests: 'Demann Vizit Yo',
      favorites: 'Pwopriyete Anrejistre',
      savedSearches: 'Chèche Anrejistre',
      notifications: 'Notifikasyon',
      profile: 'Pwofil ak Paramèt',
      languagePrefs: 'Lang ak Lajan',
      approve: 'Apwouve',
      reject: 'Rejte',
      requestChanges: 'Mande Chanjman',
      markAnswered: 'Make Reponn',
      markClosed: 'Fèmen Demann',
      replyPlaceholder: 'Ekri yon repons nan konvèsasyon demo sa a...',
      sendReply: 'Voye Repons',
      demoNotice: 'Demo Entèaktif Lokal: Tout enfòmasyon ak mesaj yo anrejistre nan navigatè w la.',
      switchToOwnerBtn: 'Ale nan Espas Mèt Kay →',
      openAdminQueueBtn: 'Louvri Apwobasyon Admin',
      exploreListingsBtn: 'Gade Pwopriyete Yo',
      recentInquiriesTitle: 'Dènye Demann ak Repons Mèt Kay',
      openThreadBtn: 'Louvri Mesaj la',
      noFavoritesText: 'Ou poko anrejistre okenn pwopriyete.',
      applySearchBtn: 'Chèche Kounye a',
      markAllReadBtn: 'Make Tout Li',
      prefInterfaceLang: 'Lang Sit la',
      prefDisplayCurr: 'Lajan pou Pri yo',
      buyerProfileNotes: 'Nòt sou Pwofil Kliyan an',
      saveProfileBtn: 'Anrejistre Pwofil la',
      totalPortfolioViews: 'Kantite Fwa yo Gade Anons yo',
      tablePerformanceTitle: 'Pèfòmans Pwopriyete yo ak Estati',
      confirmVisitBtn: 'Konfime Vizit',
      rescheduleBtn: 'Chanje Lè',
      declineBtn: 'Refize',
      editBtn: 'Modifye',
      previewBtn: 'Gade',
      saveChangesBtn: 'Anrejistre Chanjman',
      adminQueueSectionBtn: 'Lis Apwobasyon',
      adminContentSectionBtn: 'Tèks Sit la ak Mak la',
      adminPendingHeading: 'Pwopriyete k ap Tann Apwobasyon',
      adminPendingDesc: 'Lè w klike sou Apwouve, pwopriyete a parèt menm kote a sou sit piblik la.',
      adminAllReviewed: 'Tout pwopriyete yo te deja verifye!',
      adminApprovedHeading: 'Pwopriyete ki Apwouve sou Sit la',
      unpublishBtn: 'Retire sou Sit Piblik',
      contentEditorHeading: 'Modifye Tèks Paj Akèy la',
      contentEditorDesc: 'Chanje gwo tit yo, eslogan an ak fraz anba videyo a.',
      showGridLinesLabel: 'Montre 4 liy vètikal yo sou Hero a',
      publishContentBtn: 'Pibliye Chanjman Yo'
    },
    footer: {
      collectionsTitle: 'Koleksyon Pwopriyete Yo',
      buyLinkDesc: 'Kay, Vila ak Komèsyal',
      rentLinkDesc: 'Kout ak Lon Tèm',
      landLinkDesc: 'Tè Bò Lanmè ak sou Mòn',
      eventsLinkDesc: 'Maryaj ak Konferans',
      agentsLinkDesc: 'Mèt Kay Verifye',
      portalsTitle: 'Espas Kliyan ak Mèt Kay',
      advisoryTitle: 'Konsèy ak Kontak',
      rightsReserved: 'Tout dwa rezève.'
    },
    common: {
      currencyNote: 'To chanj egzanp: 1 USD ≈ 60.5 DOP · 1 USD ≈ 132.0 HTG',
      emptyResults: 'Pa gen pwopriyete ki koresponn ak rechèch ou a.',
      resetFilters: 'Reyinisyalize Filtè Yo',
      backToListings: 'Retounen nan Pwopriyete Yo',
      copiedLink: 'Lyen pwopriyete a kopye'
    }
  }
};

// Helper to localize property titles, subtitles, descriptions, and amenities dynamically
const PROPERTY_TRANSLATIONS: Record<
  string,
  Partial<Record<LanguageCode, { title: string; subtitle: string; description: string }>>
> = {
  'prop-101': {
    fr: {
      title: 'Villa Sabrina — Pavillon Horizon',
      subtitle: 'Sanctuaire en verre porte-à-faux et pierre calcaire blanche surplombant les eaux turquoise',
      description:
        'Conçue avec des lignes horizontales épurées et des baies vitrées toute hauteur, la Villa Sabrina fusionne salon galerie intérieur et piscine à débordement suspendue au-dessus de la côte.'
    },
    es: {
      title: 'Villa Sabrina — Pabellón Horizonte',
      subtitle: 'Santuario en voladizo de cristal y piedra caliza blanca sobre aguas turquesas',
      description:
        'Diseñada con líneas horizontales limpias y ventanales de piso a techo, Villa Sabrina integra salones interiores de galería con una piscina infinita suspendida sobre la costa.'
    },
    ht: {
      title: 'Vila Sabrina — Paviyon Orizon',
      subtitle: 'Bèl vila an vit ak wòch blan ki bay sou lanmè ble',
      description:
        'Fèt ak gwo vit depi atè rive nan plafon, Vila Sabrina gen yon gwo salon modèn ak yon pisin infinity ki domine lanmè a.'
    }
  },
  'prop-102': {
    fr: {
      title: 'La Résidence Cour Azur',
      subtitle: 'Domaine moderniste minimaliste avec bassins réfléchissants et atrium double hauteur',
      description:
        'Située sur les hauteurs fraîches de Montagne Noire, La Résidence Cour Azur offre une intimité architecturale absolue, une autonomie solaire complète et une vue imprenable sur la baie.'
    },
    es: {
      title: 'La Residencia Patio Azul',
      subtitle: 'Propiedad modernista minimalista con espejos de agua y atrio de doble altura',
      description:
        'Ubicada en la fresca colina de Montagne Noire, ofrece privacidad arquitectónica, autonomía solar con baterías de litio y vistas panorámicas a la bahía.'
    },
    ht: {
      title: 'Rezidans Lakou Azur',
      subtitle: 'Kay modèn ak bèl pisin nan lakou epi plafon byen wo',
      description:
        'Chita nan zòn fre Montagne Noire, Rezidans Lakou Azur ba ou trankilite, sistèm solè ak batri lityòm otonòm, ak yon bèl vi sou bè a.'
    }
  },
  'prop-103': {
    fr: {
      title: 'Sanctuaire Côtier Palmiers & Verre',
      subtitle: 'Résidence privée de standing hôtelier disponible en location saisonnière ou annuelle',
      description:
        'À quelques pas de Playa Bonita, ce sanctuaire architectural associe persiennes en teck et pavillons vitrés. Disponible au mois ou à l’année.'
    },
    es: {
      title: 'Santuario Costero Palmas y Cristal',
      subtitle: 'Residencia privada de lujo disponible para alquiler de temporada o anual',
      description:
        'A pocos pasos de Playa Bonita, este santuario arquitectónico combina madera de teca con pabellones de cristal. Disponible por mes o contrato anual.'
    },
    ht: {
      title: 'Sanktyè Bò Lanmè Palmye & Vit',
      subtitle: 'Bèl kay prive bò plaj ki disponib pou lwe pa mwa oswa pa ane',
      description:
        'A kèk pa sèlman ak plaj Playa Bonita, kay sa a tou meble ak pisin prive epi entènèt fib optik rapid.'
    }
  }
};

const AMENITY_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  'Infinity Pool': { en: 'Infinity Pool', fr: 'Piscine à Débordement', es: 'Piscina Infinita', ht: 'Pisin Infinity' },
  'Ocean View': { en: 'Ocean View', fr: 'Vue sur Mer', es: 'Vista al Mar', ht: 'Vi sou Lanmè' },
  'Smart Home System': { en: 'Smart Home System', fr: 'Domotique Intelligente', es: 'Sistema Domótico', ht: 'Sistèm Kay Entelijan' },
  'Wine Cellar': { en: 'Wine Cellar', fr: 'Cave à Vin', es: 'Cava de Vinos', ht: 'Kav Diven' },
  'Private Security': { en: 'Private Security', fr: 'Sécurité Privée', es: 'Seguridad Privada', ht: 'Sekirite Prive' },
  'Solar Backup': { en: 'Solar Backup', fr: 'Autonomie Solaire', es: 'Respaldo Solar', ht: 'Sistèm Solè' },
  'Chef Kitchen': { en: 'Chef Kitchen', fr: 'Cuisine de Chef', es: 'Cocina de Chef', ht: 'Gwo Kwizin Modèn' },
  'Guest House': { en: 'Guest House', fr: "Maison d'Invités", es: 'Casa de Huéspedes', ht: 'Kay Envite' },
  'Courtyard Pool': { en: 'Courtyard Pool', fr: 'Piscine Intérieure', es: 'Piscina en Patio', ht: 'Pisin nan Lakou' },
  'Solar + Battery': { en: 'Solar + Battery', fr: 'Solaire + Batterie', es: 'Solar + Batería', ht: 'Solè + Batri' },
  'Gated Security': { en: 'Gated Security', fr: 'Résidence Gardée', es: 'Seguridad Cerrada', ht: 'Sekirite nan baryè' },
  'Beach Access': { en: 'Beach Access', fr: 'Accès Plage', es: 'Acceso a la Playa', ht: 'Aksè Dirèk sou Plaj' },
  'Private Pool': { en: 'Private Pool', fr: 'Piscine Privée', es: 'Piscina Privada', ht: 'Pisin Prive' },
  'Fully Furnished': { en: 'Fully Furnished', fr: 'Entièrement Meublé', es: 'Totalmente Amueblado', ht: 'Tou Meble' },
  'Furnished': { en: 'Furnished', fr: 'Meublé', es: 'Amueblado', ht: 'Meble' },
  'Solar Power': { en: 'Solar Power', fr: 'Énergie Solaire', es: 'Energía Solar', ht: 'Enerji Solè' }
};

export function translatePropertyText(
  propId: string,
  lang: LanguageCode,
  fallback: { title: string; subtitle?: string; description: string }
) {
  if (lang === 'en') return fallback;
  const match = PROPERTY_TRANSLATIONS[propId]?.[lang];
  return {
    title: match?.title || fallback.title,
    subtitle: match?.subtitle || fallback.subtitle,
    description: match?.description || fallback.description
  };
}

export function translateAmenity(amenity: string, lang: LanguageCode): string {
  if (lang === 'en') return amenity;
  return AMENITY_TRANSLATIONS[amenity]?.[lang] || amenity;
}
