import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
  XCircle
} from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { SCENEAI_IMAGES } from '../../data/mockData';
import {
  ListingType,
  Property,
  PropertyAvailabilityStatus,
  PropertyCategory
} from '../../types';
import { PropertyImage } from '../PropertyImage';

interface AdminPropertiesManagerSectionProps {
  mode: 'all' | 'pending' | 'featured';
}

export const AdminPropertiesManagerSection: React.FC<
  AdminPropertiesManagerSectionProps
> = ({ mode }) => {
  const {
    properties,
    owners,
    formatPrice,
    submitNewProperty,
    updateProperty,
    deleteProperty,
    reviewPropertyApproval,
    reorderFeaturedProperties,
    uploadMediaFromDevice,
    showToast
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  // Form state for Create / Edit modal
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<PropertyCategory>('villa');
  const [formListingType, setFormListingType] = useState<ListingType>('sale');
  const [formPriceUSD, setFormPriceUSD] = useState(850000);
  const [formPriceUnit, setFormPriceUnit] = useState<Property['priceUnit']>('total');
  const [formCity, setFormCity] = useState('Cap Cana');
  const [formNeighborhood, setFormNeighborhood] = useState('Ocean Boulevard');
  const [formCountry, setFormCountry] = useState('Dominican Republic');
  const [formAddress, setFormAddress] = useState('12 Coastal Drive');
  const [formBedrooms, setFormBedrooms] = useState(4);
  const [formBathrooms, setFormBathrooms] = useState(4);
  const [formAreaSqm, setFormAreaSqm] = useState(420);
  const [formGuestCapacity, setFormGuestCapacity] = useState(0);
  const [formOwnerId, setFormOwnerId] = useState(owners[0]?.id || 'own-1');
  const [formAvailability, setFormAvailability] =
    useState<PropertyAvailabilityStatus>('available');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formAmenities, setFormAmenities] = useState(
    'Infinity Pool, Ocean View, Private Security, Backup Solar Power'
  );
  const [formDescription, setFormDescription] = useState(
    'Architectural residence with indoor-outdoor living terraces and panoramic coastal views.'
  );
  const [formImages, setFormImages] = useState<string[]>([SCENEAI_IMAGES.latest1]);

  const openEditModal = (prop: Property) => {
    setEditingProperty(prop);
    setIsCreating(false);
    setFormTitle(prop.title);
    setFormSubtitle(prop.subtitle || '');
    setFormCategory(prop.category);
    setFormListingType(prop.listingType);
    setFormPriceUSD(prop.priceUSD);
    setFormPriceUnit(prop.priceUnit || 'total');
    setFormCity(prop.location.city);
    setFormNeighborhood(prop.location.neighborhood);
    setFormCountry(prop.location.country);
    setFormAddress(prop.location.address);
    setFormBedrooms(prop.specs.bedrooms ?? 0);
    setFormBathrooms(prop.specs.bathrooms ?? 0);
    setFormAreaSqm(prop.specs.areaSqm);
    setFormGuestCapacity(prop.specs.guestCapacity ?? 0);
    setFormOwnerId(prop.ownerId);
    setFormAvailability(prop.availabilityStatus || 'available');
    setFormFeatured(Boolean(prop.featured));
    setFormAmenities(prop.amenities.join(', '));
    setFormDescription(prop.description);
    setFormImages(prop.images.length > 0 ? prop.images : [SCENEAI_IMAGES.latest1]);
  };

  const openCreateModal = () => {
    setEditingProperty(null);
    setIsCreating(true);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('villa');
    setFormListingType('sale');
    setFormPriceUSD(1250000);
    setFormPriceUnit('total');
    setFormCity('Cap Cana');
    setFormNeighborhood('Farallón Ridge');
    setFormCountry('Dominican Republic');
    setFormAddress('100 Ocean Crest');
    setFormBedrooms(4);
    setFormBathrooms(5);
    setFormAreaSqm(520);
    setFormGuestCapacity(0);
    setFormOwnerId(owners[0]?.id || 'own-1');
    setFormAvailability('available');
    setFormFeatured(true);
    setFormAmenities('Infinity Pool, Ocean View, Smart Home, Private Security');
    setFormDescription(
      'Newly curated architectural estate featuring floor-to-ceiling glazing and bespoke stonework.'
    );
    setFormImages([SCENEAI_IMAGES.latest1, SCENEAI_IMAGES.latest2]);
  };

  const handleSavePropertyModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedAmenities = formAmenities
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (isCreating) {
      submitNewProperty(
        {
          title: formTitle.trim(),
          subtitle: formSubtitle.trim() || undefined,
          category: formCategory,
          listingType: formListingType,
          priceUSD: Number(formPriceUSD) || 0,
          priceUnit: formPriceUnit,
          location: {
            city: formCity.trim(),
            neighborhood: formNeighborhood.trim(),
            country: formCountry.trim(),
            address: formAddress.trim(),
            coordinates: { lat: 18.5, lng: -68.4 }
          },
          specs: {
            bedrooms: formBedrooms || undefined,
            bathrooms: formBathrooms || undefined,
            areaSqm: Number(formAreaSqm) || 200,
            guestCapacity: formGuestCapacity || undefined,
            furnished: true
          },
          description: formDescription.trim(),
          highlights: parsedAmenities.slice(0, 3),
          amenities: parsedAmenities,
          images: formImages.length > 0 ? formImages : [SCENEAI_IMAGES.latest1],
          ownerId: formOwnerId,
          featured: formFeatured,
          availabilityStatus: formAvailability
        },
        true
      );
      setIsCreating(false);
    } else if (editingProperty) {
      updateProperty(editingProperty.id, {
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        category: formCategory,
        listingType: formListingType,
        priceUSD: Number(formPriceUSD) || 0,
        priceUnit: formPriceUnit,
        location: {
          ...editingProperty.location,
          city: formCity.trim(),
          neighborhood: formNeighborhood.trim(),
          country: formCountry.trim(),
          address: formAddress.trim()
        },
        specs: {
          ...editingProperty.specs,
          bedrooms: formBedrooms || undefined,
          bathrooms: formBathrooms || undefined,
          areaSqm: Number(formAreaSqm) || editingProperty.specs.areaSqm,
          guestCapacity: formGuestCapacity || undefined
        },
        description: formDescription.trim(),
        amenities: parsedAmenities,
        images: formImages.length > 0 ? formImages : editingProperty.images,
        ownerId: formOwnerId,
        featured: formFeatured,
        availabilityStatus: formAvailability
      });
      setEditingProperty(null);
    }
  };

  const handleModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const asset = await uploadMediaFromDevice(file, 'property', 'Property Editor');
      setFormImages((prev) => [asset.url, ...prev]);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      e.target.value = '';
    }
  };

  const baseList = properties.filter((p) => {
    if (mode === 'pending') return p.approvalStatus !== 'approved';
    if (mode === 'featured') return Boolean(p.featured);
    return true;
  });

  const filteredProperties = baseList
    .filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && p.approvalStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.referenceCode.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (mode === 'featured') {
        return (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999);
      }
      return 0;
    });

  const moveFeaturedItem = (index: number, direction: -1 | 1) => {
    const ids = filteredProperties.map((p) => p.id);
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= ids.length) return;
    const temp = ids[index];
    ids[index] = ids[targetIdx];
    ids[targetIdx] = temp;
    reorderFeaturedProperties(ids);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
            {mode === 'pending'
              ? 'Moderation & Quality Control'
              : mode === 'featured'
                ? 'Homepage Spotlight Curation'
                : 'Complete Property Inventory'}
          </span>
          <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
            {mode === 'pending'
              ? `Pending Approvals & Moderation (${filteredProperties.length})`
              : mode === 'featured'
                ? `Featured Listings Manager (${filteredProperties.length})`
                : `All Marketplace Properties (${filteredProperties.length})`}
          </h2>
          <p className="font-body text-xs text-[#737373] mt-0.5">
            Create, edit, approve, reject, hide, mark featured, or delete listings. All changes update public pages immediately.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold inline-flex items-center gap-2 shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Property</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#737373] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, reference code, or city..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-neutral-200 text-xs font-body"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-neutral-50"
        >
          <option value="all">All Categories</option>
          <option value="villa">Villas</option>
          <option value="house">Houses</option>
          <option value="apartment">Apartments</option>
          <option value="land">Land Parcels</option>
          <option value="event_space">Event Spaces</option>
          <option value="commercial">Commercial</option>
        </select>

        {mode === 'all' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-neutral-50"
          >
            <option value="all">All Approval Statuses</option>
            <option value="approved">Approved (Live)</option>
            <option value="pending">Pending Approval</option>
            <option value="changes_requested">Changes Requested</option>
            <option value="rejected">Rejected</option>
          </select>
        )}
      </div>

      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <p className="font-display text-xl text-[#0D0D0D]">
            No matching properties in this view.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((prop, idx) => {
            const owner = owners.find((o) => o.id === prop.ownerId);
            const isHidden = prop.availabilityStatus === 'hidden';

            return (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col lg:flex-row justify-between gap-5"
              >
                <div className="flex flex-col sm:flex-row gap-4 min-w-0 flex-1">
                  <div className="relative w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    <PropertyImage
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white font-ui text-[10px] font-bold uppercase">
                      {prop.referenceCode}
                    </span>
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-ui">
                      <span
                        className={`font-bold uppercase ${
                          prop.approvalStatus === 'approved'
                            ? 'text-emerald-700'
                            : prop.approvalStatus === 'pending'
                              ? 'text-amber-700'
                              : 'text-rose-700'
                        }`}
                      >
                        Status: {prop.approvalStatus.toUpperCase()}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-[#1150EF] uppercase">
                        {prop.category.replace('_', ' ')} ({prop.listingType})
                      </span>
                      <span>·</span>
                      <span className="text-[#737373]">
                        Availability:{' '}
                        <strong className="text-[#161616] uppercase">
                          {prop.availabilityStatus || 'available'}
                        </strong>
                      </span>
                      {prop.featured && (
                        <>
                          <span>·</span>
                          <span className="text-amber-600 font-bold inline-flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-current" /> Featured
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-display text-xl text-[#0D0D0D] truncate">
                      {prop.title}
                    </h3>
                    <p className="text-xs font-body text-[#737373]">
                      {prop.location.neighborhood}, {prop.location.city},{' '}
                      {prop.location.country} · Owner:{' '}
                      <strong className="text-[#161616]">{owner?.name || 'Verified Owner'}</strong>
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-3 text-xs font-ui">
                      <span className="font-bold text-base text-[#0D0D0D] tabular-nums">
                        {formatPrice(prop.priceUSD, prop.priceUnit)}
                      </span>
                      <span className="text-[#737373]">
                        {prop.specs.areaSqm.toLocaleString()} m²
                      </span>
                      {prop.specs.bedrooms !== undefined && (
                        <span className="text-[#737373]">{prop.specs.bedrooms} Beds</span>
                      )}
                      <span className="text-[#737373]">
                        {prop.amenities.slice(0, 3).join(' · ')}
                      </span>
                    </div>

                    {mode === 'pending' && (
                      <div className="pt-2">
                        <input
                          type="text"
                          value={reviewNotes[prop.id] || ''}
                          onChange={(e) =>
                            setReviewNotes((prev) => ({ ...prev, [prop.id]: e.target.value }))
                          }
                          placeholder="Optional moderator note for owner..."
                          className="w-full max-w-md h-8 px-2.5 rounded-lg border border-neutral-200 text-xs font-body"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap lg:flex-col items-stretch justify-center gap-2 shrink-0 lg:w-56">
                  {mode === 'featured' && (
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveFeaturedItem(idx, -1)}
                        className="flex-1 py-1.5 px-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-xs font-ui font-semibold inline-flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" /> Move Up
                      </button>
                      <button
                        type="button"
                        disabled={idx === filteredProperties.length - 1}
                        onClick={() => moveFeaturedItem(idx, 1)}
                        className="flex-1 py-1.5 px-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-xs font-ui font-semibold inline-flex items-center justify-center gap-1 disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" /> Move Down
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(prop)}
                      className="py-2 px-3 rounded-lg bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <Link
                      to={`/property/${prop.id}`}
                      className="py-2 px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#161616] font-ui text-xs font-semibold inline-flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        updateProperty(prop.id, { featured: !prop.featured })
                      }
                      className={`py-1.5 px-2.5 rounded-lg font-ui text-[11px] font-semibold border inline-flex items-center justify-center gap-1 cursor-pointer ${
                        prop.featured
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-white border-neutral-200 text-[#161616] hover:bg-neutral-50'
                      }`}
                    >
                      <Star className="w-3 h-3" />
                      <span>{prop.featured ? 'Unfeature' : 'Feature'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateProperty(prop.id, {
                          availabilityStatus: isHidden ? 'available' : 'hidden'
                        })
                      }
                      className={`py-1.5 px-2.5 rounded-lg font-ui text-[11px] font-semibold border inline-flex items-center justify-center gap-1 cursor-pointer ${
                        isHidden
                          ? 'bg-rose-50 border-rose-200 text-rose-800'
                          : 'bg-white border-neutral-200 text-[#161616] hover:bg-neutral-50'
                      }`}
                    >
                      <EyeOff className="w-3 h-3" />
                      <span>{isHidden ? 'Unhide' : 'Hide'}</span>
                    </button>
                  </div>

                  {/* Approval Actions */}
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-neutral-100">
                    {prop.approvalStatus !== 'approved' && (
                      <button
                        type="button"
                        onClick={() =>
                          reviewPropertyApproval(
                            prop.id,
                            'approved',
                            reviewNotes[prop.id]
                          )
                        }
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-ui text-[11px] font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                    )}
                    {prop.approvalStatus !== 'rejected' && (
                      <button
                        type="button"
                        onClick={() =>
                          reviewPropertyApproval(
                            prop.id,
                            'rejected',
                            reviewNotes[prop.id]
                          )
                        }
                        className="flex-1 py-1.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-ui text-[11px] font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3 h-3" /> Reject
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(prop.id)}
                      className="py-1.5 px-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-ui text-[11px] font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
                      title="Delete Property"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Property Modal */}
      {(isCreating || editingProperty) && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-display text-xl text-[#0D0D0D]">
                {isCreating
                  ? 'Create New Property Listing'
                  : `Edit Property: ${editingProperty?.referenceCode}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditingProperty(null);
                }}
                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSavePropertyModal}
              className="p-6 overflow-y-auto space-y-4 flex-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Property Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Editorial Subtitle
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as PropertyCategory)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
                  >
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment / Penthouse</option>
                    <option value="land">Land Parcel</option>
                    <option value="event_space">Event Space</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Transaction / Listing Type
                  </label>
                  <select
                    value={formListingType}
                    onChange={(e) => setFormListingType(e.target.value as ListingType)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="land">Land Sale</option>
                    <option value="event">Event Space Hire</option>
                  </select>
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={formPriceUSD}
                    onChange={(e) => setFormPriceUSD(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Pricing Unit
                  </label>
                  <select
                    value={formPriceUnit}
                    onChange={(e) =>
                      setFormPriceUnit(e.target.value as Property['priceUnit'])
                    }
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
                  >
                    <option value="total">Total Purchase Price</option>
                    <option value="per_month">Per Month</option>
                    <option value="per_night">Per Night</option>
                    <option value="per_day">Per Event Day</option>
                  </select>
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    required
                    value={formNeighborhood}
                    onChange={(e) => setFormNeighborhood(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    value={formBedrooms}
                    onChange={(e) => setFormBedrooms(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    value={formBathrooms}
                    onChange={(e) => setFormBathrooms(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Area (m²)
                  </label>
                  <input
                    type="number"
                    required
                    value={formAreaSqm}
                    onChange={(e) => setFormAreaSqm(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Guest Capacity (Events / Short-Term)
                  </label>
                  <input
                    type="number"
                    value={formGuestCapacity}
                    onChange={(e) => setFormGuestCapacity(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
                  />
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Assigned Property Owner / Agent
                  </label>
                  <select
                    value={formOwnerId}
                    onChange={(e) => setFormOwnerId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
                  >
                    {owners.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} ({o.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Availability Status
                  </label>
                  <select
                    value={formAvailability}
                    onChange={(e) =>
                      setFormAvailability(e.target.value as PropertyAvailabilityStatus)
                    }
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="hidden">Hidden from Public</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Amenities (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formAmenities}
                    onChange={(e) => setFormAmenities(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Property Description
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-200 text-sm font-body"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-ui text-xs font-semibold text-[#161616]">
                      Gallery Images ({formImages.length})
                    </label>
                    <label className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-ui font-semibold inline-flex items-center gap-1.5 cursor-pointer">
                      <Upload className="w-3.5 h-3.5 text-[#1150EF]" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleModalImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {formImages.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-24 h-18 rounded-lg overflow-hidden border border-neutral-200 shrink-0"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {formImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setFormImages((prev) => prev.filter((_, idx) => idx !== i))
                            }
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 text-white flex items-center justify-center text-[10px] cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="inline-flex items-center gap-2 text-xs font-ui font-semibold text-[#161616] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 accent-[#1150EF]"
                    />
                    <span>Mark as Featured Property on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProperty(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-ui font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white text-xs font-ui font-bold cursor-pointer"
                >
                  {isCreating ? 'Create & Publish Listing' : 'Save Property Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-neutral-200 space-y-4">
            <h3 className="font-display text-xl text-[#0D0D0D]">
              Confirm Property Deletion
            </h3>
            <p className="font-body text-xs text-[#737373] leading-relaxed">
              Are you sure you want to permanently remove this property from the local demo catalog? This action will immediately update all public pages.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-ui font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProperty(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-ui font-bold cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
