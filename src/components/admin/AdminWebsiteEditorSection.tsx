import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  Save,
  Sparkles,
  Upload,
  Video
} from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { PropertyCategory } from '../../types';
import { PropertyImage } from '../PropertyImage';

export const AdminWebsiteEditorSection: React.FC = () => {
  const {
    draftWebsiteContent,
    draftBranding,
    updateDraftWebsiteContent,
    properties,
    reorderFeaturedProperties,
    updateProperty,
    mediaAssets,
    uploadMediaFromDevice,
    saveDraftChanges,
    publishDraftChanges,
    isDraftPreviewMode,
    setIsDraftPreviewMode,
    hasUnsavedDraftChanges,
    showToast
  } = useMarketplace();

  const [activeSubTab, setActiveSubTab] = useState<
    'hero' | 'sections' | 'categories_featured' | 'about_how_trust' | 'contact_footer'
  >('hero');
  const [showVisualPreview, setShowVisualPreview] = useState(true);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const featuredList = [...properties]
    .filter((p) => p.featured && p.approvalStatus === 'approved')
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));

  const moveCategory = (index: number, direction: -1 | 1) => {
    const current = [...(draftWebsiteContent.homepageCategoryOrder || ['house', 'apartment', 'land', 'event_space', 'commercial'])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIndex];
    current[targetIndex] = temp;
    updateDraftWebsiteContent({ homepageCategoryOrder: current });
  };

  const moveFeaturedProperty = (index: number, direction: -1 | 1) => {
    const ids = featuredList.map((p) => p.id);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= ids.length) return;
    const temp = ids[index];
    ids[index] = ids[targetIndex];
    ids[targetIndex] = temp;
    reorderFeaturedProperties(ids);
  };

  const handleQuickFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'heroBgImage' | 'heroVideoUrl' | 'heroVideoPoster'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    try {
      const cat = field === 'heroVideoUrl' ? 'video' : 'hero';
      const asset = await uploadMediaFromDevice(file, cat, `Website Editor (${field})`);
      updateDraftWebsiteContent({ [field]: asset.url });
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const categoryLabels: Record<PropertyCategory, string> = {
    house: 'Houses & Estates',
    villa: 'Luxury Villas',
    apartment: 'Apartments & Penthouses',
    land: 'Titled Land Parcels',
    event_space: 'Event Spaces & Venues',
    commercial: 'Commercial Properties'
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Sub-navigation Bar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-[#1150EF]" />
            <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
              Visual Website Content Editor
            </span>
            {hasUnsavedDraftChanges && (
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-ui text-[11px] font-bold">
                Draft Modified
              </span>
            )}
          </div>
          <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
            Edit Homepage, Sections, CTAs & Editorial Copy
          </h2>
          <p className="font-body text-xs text-[#737373] mt-0.5">
            Edit in Draft state, inspect in the live visual preview below, then Save Draft or Publish to update public pages immediately.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowVisualPreview((prev) => !prev)}
            className={`px-3.5 py-2 rounded-xl font-ui text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              showVisualPreview
                ? 'bg-[#1150EF]/10 border-[#1150EF] text-[#1150EF]'
                : 'bg-neutral-50 border-neutral-200 text-[#161616]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showVisualPreview ? 'Hide Visual Preview' : 'Show Visual Preview'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDraftPreviewMode(!isDraftPreviewMode)}
            className={`px-3.5 py-2 rounded-xl font-ui text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              isDraftPreviewMode
                ? 'bg-amber-400 border-amber-500 text-[#0D0D0D]'
                : 'bg-white border-neutral-200 text-[#161616] hover:bg-neutral-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isDraftPreviewMode ? 'Live Site Preview: ON' : 'Preview on Live Site'}</span>
          </button>

          <button
            type="button"
            onClick={saveDraftChanges}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-ui text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={publishDraftChanges}
            className="px-4 py-2 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Editor Sub-Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-neutral-200">
        {[
          { id: 'hero', label: '1. Hero Headline, Image, Video & CTAs' },
          { id: 'sections', label: '2. Section Headings & Descriptions' },
          { id: 'categories_featured', label: '3. Categories & Featured Order' },
          { id: 'about_how_trust', label: '4. About, How It Works & Trust' },
          { id: 'contact_footer', label: '5. Contact Info, Banner & Footer' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
            className={`px-3.5 py-2 rounded-xl font-ui text-xs font-semibold cursor-pointer transition-colors ${
              activeSubTab === tab.id
                ? 'bg-[#1150EF] text-white'
                : 'text-[#161616] hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: HERO */}
      {activeSubTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-display text-xl text-[#0D0D0D]">
              Homepage Hero Headline, Subtitle & Call-to-Action Buttons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Hero Headline Line 1
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.heroHeadlineLine1}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ heroHeadlineLine1: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Hero Headline Line 2
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.heroHeadlineLine2}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ heroHeadlineLine2: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Hero Headline Line 3
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.heroHeadlineLine3}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ heroHeadlineLine3: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Hero Subtitle / Tagline Line 1
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.heroTaglineLine1}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ heroTaglineLine1: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Hero Subtitle / Tagline Line 2
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.heroTaglineLine2}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ heroTaglineLine2: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.heroPrimaryCtaText}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ heroPrimaryCtaText: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Primary CTA Destination Link
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.heroPrimaryCtaLink}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ heroPrimaryCtaLink: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Secondary CTA Button Text (Optional)
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.heroSecondaryCtaText}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ heroSecondaryCtaText: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Secondary CTA Destination Link
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.heroSecondaryCtaLink}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ heroSecondaryCtaLink: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="font-display text-xl text-[#0D0D0D]">
              Hero Background Image & Cinema Video
            </h3>

            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Hero Architectural Image URL or Upload
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draftWebsiteContent.heroBgImage}
                  onChange={(e) => updateDraftWebsiteContent({ heroBgImage: e.target.value })}
                  className="flex-1 h-10 px-3 rounded-xl border border-neutral-200 text-xs font-body"
                />
                <label className="h-10 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-ui font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5 text-[#1150EF]" />
                  <span>{uploadingField === 'heroBgImage' ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleQuickFileUpload(e, 'heroBgImage')}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
                {mediaAssets
                  .filter((m) => m.type === 'image')
                  .slice(0, 5)
                  .map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => updateDraftWebsiteContent({ heroBgImage: asset.url })}
                      className="px-2 py-1 rounded bg-neutral-100 hover:bg-[#1150EF] hover:text-white text-[10px] font-ui whitespace-nowrap cursor-pointer"
                    >
                      Use: {asset.name.slice(0, 18)}
                    </button>
                  ))}
              </div>
            </div>

            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Hero Video URL (MP4/WebM) or Upload
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draftWebsiteContent.heroVideoUrl}
                  onChange={(e) => updateDraftWebsiteContent({ heroVideoUrl: e.target.value })}
                  className="flex-1 h-10 px-3 rounded-xl border border-neutral-200 text-xs font-body"
                />
                <label className="h-10 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-ui font-semibold inline-flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Video className="w-3.5 h-3.5 text-[#1150EF]" />
                  <span>{uploadingField === 'heroVideoUrl' ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleQuickFileUpload(e, 'heroVideoUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Hero Video Card Caption
              </label>
              <input
                type="text"
                value={draftWebsiteContent.heroVideoCaption}
                onChange={(e) =>
                  updateDraftWebsiteContent({ heroVideoCaption: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: SECTION HEADINGS & DESCRIPTIONS */}
      {activeSubTab === 'sections' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-6">
          <h3 className="font-display text-xl text-[#0D0D0D]">
            Homepage Section Headings, Kickers & Editorial Descriptions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Latest Places Title Line 1
              </label>
              <input
                type="text"
                value={draftWebsiteContent.latestPlacesTitleLine1}
                onChange={(e) =>
                  updateDraftWebsiteContent({ latestPlacesTitleLine1: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Latest Places Title Line 2
              </label>
              <input
                type="text"
                value={draftWebsiteContent.latestPlacesTitleLine2}
                onChange={(e) =>
                  updateDraftWebsiteContent({ latestPlacesTitleLine2: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Latest Places Title Line 3
              </label>
              <input
                type="text"
                value={draftWebsiteContent.latestPlacesTitleLine3}
                onChange={(e) =>
                  updateDraftWebsiteContent({ latestPlacesTitleLine3: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
          </div>

          <div>
            <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
              Latest Places Section Description
            </label>
            <textarea
              rows={2}
              value={draftWebsiteContent.latestPlacesSubtitle}
              onChange={(e) =>
                updateDraftWebsiteContent({ latestPlacesSubtitle: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-neutral-200 text-sm font-body"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Categories Section Kicker
              </label>
              <input
                type="text"
                value={draftWebsiteContent.categoriesSectionKicker}
                onChange={(e) =>
                  updateDraftWebsiteContent({ categoriesSectionKicker: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Categories Section Heading
              </label>
              <input
                type="text"
                value={draftWebsiteContent.categoriesSectionTitle}
                onChange={(e) =>
                  updateDraftWebsiteContent({ categoriesSectionTitle: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>

            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Featured Houses Kicker
              </label>
              <input
                type="text"
                value={draftWebsiteContent.featuredHousesKicker}
                onChange={(e) =>
                  updateDraftWebsiteContent({ featuredHousesKicker: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Featured Houses Heading
              </label>
              <input
                type="text"
                value={draftWebsiteContent.featuredHousesTitle}
                onChange={(e) =>
                  updateDraftWebsiteContent({ featuredHousesTitle: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>

            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Featured Apartments Kicker
              </label>
              <input
                type="text"
                value={draftWebsiteContent.featuredApartmentsKicker}
                onChange={(e) =>
                  updateDraftWebsiteContent({ featuredApartmentsKicker: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Featured Apartments Heading
              </label>
              <input
                type="text"
                value={draftWebsiteContent.featuredApartmentsTitle}
                onChange={(e) =>
                  updateDraftWebsiteContent({ featuredApartmentsTitle: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>

            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Land & Event Spaces Kicker
              </label>
              <input
                type="text"
                value={draftWebsiteContent.landEventsKicker}
                onChange={(e) =>
                  updateDraftWebsiteContent({ landEventsKicker: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Land & Event Spaces Heading
              </label>
              <input
                type="text"
                value={draftWebsiteContent.landEventsTitle}
                onChange={(e) =>
                  updateDraftWebsiteContent({ landEventsTitle: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CATEGORIES & FEATURED ORDER */}
      {activeSubTab === 'categories_featured' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Homepage Property Categories Order */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="font-display text-xl text-[#0D0D0D]">
              Homepage Property Categories Order
            </h3>
            <p className="font-body text-xs text-[#737373]">
              Reorder how property categories appear in the Homepage Architectural Categories strip.
            </p>
            <div className="space-y-2">
              {(draftWebsiteContent.homepageCategoryOrder || [
                'house',
                'apartment',
                'land',
                'event_space',
                'commercial'
              ]).map((catKey, idx, arr) => (
                <div
                  key={catKey}
                  className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-[#1150EF]/10 text-[#1150EF] font-ui text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-ui text-sm font-semibold text-[#0D0D0D]">
                        {categoryLabels[catKey] || catKey}
                      </div>
                      <div className="text-[11px] font-ui text-[#737373] uppercase">
                        Key: {catKey}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveCategory(idx, -1)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === arr.length - 1}
                      onClick={() => moveCategory(idx, 1)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Property Order */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="font-display text-xl text-[#0D0D0D]">
              Featured Property Display Order ({featuredList.length})
            </h3>
            <p className="font-body text-xs text-[#737373]">
              Reorder featured listings and toggle Editorial Latest Places spotlight.
            </p>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {featuredList.map((prop, idx) => (
                <div
                  key={prop.id}
                  className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-[#1150EF] text-white font-ui text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-11 h-11 rounded-lg object-cover shrink-0 bg-neutral-200"
                    />
                    <div className="min-w-0">
                      <div className="font-display text-sm font-semibold text-[#0D0D0D] truncate">
                        {prop.title}
                      </div>
                      <div className="text-[11px] font-ui text-[#737373]">
                        {prop.referenceCode} · {prop.location.city}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        updateProperty(prop.id, { latestEditorial: !prop.latestEditorial })
                      }
                      className={`px-2 py-1 rounded text-[10px] font-ui font-bold cursor-pointer ${
                        prop.latestEditorial
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {prop.latestEditorial ? 'Latest Top 3' : 'Make Top 3'}
                    </button>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFeaturedProperty(idx, -1)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === featuredList.length - 1}
                      onClick={() => moveFeaturedProperty(idx, 1)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: ABOUT, HOW IT WORKS & TRUST */}
      {activeSubTab === 'about_how_trust' && (
        <div className="space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="font-display text-xl text-[#0D0D0D]">About Section Editor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  About Kicker
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.aboutSectionKicker}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ aboutSectionKicker: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  About Section Heading
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.aboutSectionTitle}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ aboutSectionTitle: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                About Description Paragraph
              </label>
              <textarea
                rows={3}
                value={draftWebsiteContent.aboutSectionDescription}
                onChange={(e) =>
                  updateDraftWebsiteContent({ aboutSectionDescription: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(draftWebsiteContent.aboutSectionHighlights || ['', '', '']).map((hl, idx) => (
                <div key={idx}>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Highlight Pillar #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={hl}
                    onChange={(e) => {
                      const next = [...(draftWebsiteContent.aboutSectionHighlights || [])];
                      next[idx] = e.target.value;
                      updateDraftWebsiteContent({ aboutSectionHighlights: next });
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-body"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* How It Works & Trust/Safety */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              <h3 className="font-display text-xl text-[#0D0D0D]">How It Works Section</h3>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.howItWorksTitle}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ howItWorksTitle: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Step 01 Title & Description
                  </label>
                  <input
                    type="text"
                    value={draftWebsiteContent.howStep1Title}
                    onChange={(e) =>
                      updateDraftWebsiteContent({ howStep1Title: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs font-body mb-1.5"
                  />
                  <textarea
                    rows={2}
                    value={draftWebsiteContent.howStep1Desc}
                    onChange={(e) =>
                      updateDraftWebsiteContent({ howStep1Desc: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-neutral-200 text-xs font-body"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Step 02 Title & Description
                  </label>
                  <input
                    type="text"
                    value={draftWebsiteContent.howStep2Title}
                    onChange={(e) =>
                      updateDraftWebsiteContent({ howStep2Title: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs font-body mb-1.5"
                  />
                  <textarea
                    rows={2}
                    value={draftWebsiteContent.howStep2Desc}
                    onChange={(e) =>
                      updateDraftWebsiteContent({ howStep2Desc: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-neutral-200 text-xs font-body"
                  />
                </div>
                <div>
                  <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                    Step 03 Title & Description
                  </label>
                  <input
                    type="text"
                    value={draftWebsiteContent.howStep3Title}
                    onChange={(e) =>
                      updateDraftWebsiteContent({ howStep3Title: e.target.value })
                    }
                    className="w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs font-body mb-1.5"
                  />
                  <textarea
                    rows={2}
                    value={draftWebsiteContent.howStep3Desc}
                    onChange={(e) =>
                      updateDraftWebsiteContent({ howStep3Desc: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border border-neutral-200 text-xs font-body"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              <h3 className="font-display text-xl text-[#0D0D0D]">
                Trust & Safety Information
              </h3>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Trust & Safety Box Heading
                </label>
                <input
                  type="text"
                  value={draftWebsiteContent.trustSafetyTitle}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ trustSafetyTitle: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Safety Guideline #1
                </label>
                <textarea
                  rows={2}
                  value={draftWebsiteContent.trustTip1}
                  onChange={(e) => updateDraftWebsiteContent({ trustTip1: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Safety Guideline #2
                </label>
                <textarea
                  rows={2}
                  value={draftWebsiteContent.trustTip2}
                  onChange={(e) => updateDraftWebsiteContent({ trustTip2: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs font-body"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                  Safety Guideline #3
                </label>
                <textarea
                  rows={2}
                  value={draftWebsiteContent.trustTip3}
                  onChange={(e) => updateDraftWebsiteContent({ trustTip3: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-neutral-200 text-xs font-body"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CONTACT, ANNOUNCEMENT & FOOTER */}
      {activeSubTab === 'contact_footer' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-xl text-[#0D0D0D]">
                Admin Contact Information, WhatsApp Numbers & Footer Content
              </h3>
              <p className="font-body text-xs text-[#737373] mt-0.5">
                Update the official phone number, WhatsApp lines, and service emails displayed to visitors across the website.
              </p>
            </div>
            <button
              type="button"
              onClick={publishDraftChanges}
              className="px-4 py-2 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold cursor-pointer transition-colors"
            >
              Save & Publish Contact Info Live
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Primary Admin / Services Email
              </label>
              <input
                type="email"
                value={draftWebsiteContent.supportEmail}
                onChange={(e) => updateDraftWebsiteContent({ supportEmail: e.target.value })}
                placeholder="jnscompany916@gmail.com"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Secondary Admin / Services Email
              </label>
              <input
                type="email"
                value={draftWebsiteContent.secondarySupportEmail || ''}
                onChange={(e) =>
                  updateDraftWebsiteContent({ secondarySupportEmail: e.target.value })
                }
                placeholder="contact.mc99haiti@gmail.com"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Call From USA Phone Number
              </label>
              <input
                type="text"
                value={draftWebsiteContent.supportPhone}
                onChange={(e) => updateDraftWebsiteContent({ supportPhone: e.target.value })}
                placeholder="+1 (484) 208-2963"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Primary WhatsApp Number (Digits with Country Code)
              </label>
              <input
                type="text"
                value={draftWebsiteContent.whatsappNumber}
                onChange={(e) => updateDraftWebsiteContent({ whatsappNumber: e.target.value })}
                placeholder="18298508107"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                All WhatsApp Numbers (Comma-separated — displayed in Footer & Contact Cards)
              </label>
              <input
                type="text"
                value={(
                  draftWebsiteContent.whatsappNumbers || [
                    '+1 (829) 850-8107',
                    '+1 (829) 876-8096',
                    '+509 3999-4934'
                  ]
                ).join(', ')}
                onChange={(e) => {
                  const list = e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean);
                  updateDraftWebsiteContent({
                    whatsappNumbers: list,
                    ...(list[0] ? { whatsappNumber: list[0].replace(/\D/g, '') } : {})
                  });
                }}
                placeholder="+1 (829) 850-8107, +1 (829) 876-8096, +509 3999-4934"
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Office / Gallery Address
              </label>
              <input
                type="text"
                value={draftWebsiteContent.officeAddress}
                onChange={(e) => updateDraftWebsiteContent({ officeAddress: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Owner CTA Banner Title
              </label>
              <input
                type="text"
                value={draftWebsiteContent.ownerCtaTitle}
                onChange={(e) => updateDraftWebsiteContent({ ownerCtaTitle: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Owner CTA Banner Description
              </label>
              <input
                type="text"
                value={draftWebsiteContent.ownerCtaDesc}
                onChange={(e) => updateDraftWebsiteContent({ ownerCtaDesc: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-neutral-100">
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Footer Editorial Description
              </label>
              <textarea
                rows={2}
                value={draftWebsiteContent.footerDescription}
                onChange={(e) =>
                  updateDraftWebsiteContent({ footerDescription: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-body"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold text-[#161616] mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={draftWebsiteContent.footerCopyrightText}
                onChange={(e) =>
                  updateDraftWebsiteContent({ footerCopyrightText: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-body mb-2"
              />
              <label className="inline-flex items-center gap-2 text-xs font-ui font-semibold text-[#161616] cursor-pointer">
                <input
                  type="checkbox"
                  checked={draftWebsiteContent.showAnnouncementBanner}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ showAnnouncementBanner: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#1150EF]"
                />
                <span>Display Top Announcement Bar on Website</span>
              </label>
              {draftWebsiteContent.showAnnouncementBanner && (
                <input
                  type="text"
                  value={draftWebsiteContent.announcementBanner}
                  onChange={(e) =>
                    updateDraftWebsiteContent({ announcementBanner: e.target.value })
                  }
                  className="mt-2 w-full h-9 px-3 rounded-lg border border-neutral-200 text-xs font-body"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* VISUAL PREVIEW PANEL BEFORE SAVING / PUBLISHING */}
      {showVisualPreview && (
        <div className="bg-white rounded-2xl border-2 border-[#1150EF]/30 overflow-hidden shadow-lg">
          <div className="px-5 py-3 bg-[#0D0D0D] text-white flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#76A2FA]" />
              <span className="font-ui text-xs font-bold uppercase tracking-wider">
                Live Visual Draft Preview (Before Publishing)
              </span>
            </div>
            <span className="text-[11px] font-ui text-white/70">
              Reflects your unsaved Draft edits in real time
            </span>
          </div>

          <div
            style={{
              backgroundImage: `linear-gradient(180deg, ${draftBranding.primaryColor || '#1150EF'} 0%, ${draftBranding.secondaryColor || '#135AF3'} 45%, ${draftBranding.skyBlueColor || '#76A2FA'} 85%, #ffffff 100%)`
            }}
            className="p-6 sm:p-8 text-white"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-6 space-y-3">
                <div className="font-display text-4xl sm:text-5xl uppercase leading-[0.94] tracking-tight">
                  <div>{draftWebsiteContent.heroHeadlineLine1}</div>
                  <div>{draftWebsiteContent.heroHeadlineLine2}</div>
                  <div>{draftWebsiteContent.heroHeadlineLine3}</div>
                </div>
                <p className="font-body text-xs sm:text-sm uppercase tracking-widest text-white/90">
                  {draftWebsiteContent.heroTaglineLine1} {draftWebsiteContent.heroTaglineLine2}
                </p>
                <div className="pt-2 flex flex-wrap gap-2">
                  <span
                    className={`px-4 py-2 ${draftBranding.buttonRadius || 'rounded-full'} bg-white text-[#0D0D0D] font-ui text-xs font-bold uppercase`}
                  >
                    {draftWebsiteContent.heroPrimaryCtaText || 'EXPLORE PROPERTIES'}
                  </span>
                  {draftWebsiteContent.heroSecondaryCtaText && (
                    <span
                      className={`px-4 py-2 ${draftBranding.buttonRadius || 'rounded-full'} bg-white/20 text-white border border-white/30 font-ui text-xs font-semibold uppercase`}
                    >
                      {draftWebsiteContent.heroSecondaryCtaText}
                    </span>
                  )}
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="bg-white/95 text-[#161616] rounded-xl p-2.5 shadow-md">
                  <div className="h-24 rounded-lg overflow-hidden bg-black">
                    <video
                      src={draftWebsiteContent.heroVideoUrl}
                      poster={draftWebsiteContent.heroVideoPoster}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-2 text-[11px] font-body font-medium text-[#161616]">
                    “{draftWebsiteContent.heroVideoCaption}”
                  </p>
                </div>

                <div className="rounded-2xl overflow-hidden border border-white/40 shadow-lg h-40 bg-white/20">
                  <PropertyImage
                    src={draftWebsiteContent.heroBgImage}
                    alt="Hero Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <div className="font-ui font-bold text-[#1150EF] uppercase">
                {draftWebsiteContent.latestPlacesTitleLine1}{' '}
                {draftWebsiteContent.latestPlacesTitleLine2}{' '}
                {draftWebsiteContent.latestPlacesTitleLine3}
              </div>
              <p className="mt-1 text-[#737373] font-body">
                {draftWebsiteContent.latestPlacesSubtitle}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80">
              <div className="font-ui font-bold text-[#1150EF] uppercase">
                {draftWebsiteContent.aboutSectionKicker}
              </div>
              <div className="font-display text-sm text-[#0D0D0D] mt-0.5">
                {draftWebsiteContent.aboutSectionTitle}
              </div>
              <p className="mt-1 text-[#737373] font-body line-clamp-2">
                {draftWebsiteContent.aboutSectionDescription}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D0D] text-white">
              <div className="font-ui font-bold text-[#76A2FA] uppercase">
                Footer & Contact Preview
              </div>
              <p className="mt-1 text-white/80 font-body">{draftWebsiteContent.supportEmail}</p>
              <p className="text-white/80 font-body">{draftWebsiteContent.supportPhone}</p>
              <p className="mt-1 text-white/50 text-[11px]">
                © {new Date().getFullYear()} {draftBranding.siteName} —{' '}
                {draftWebsiteContent.footerCopyrightText}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
