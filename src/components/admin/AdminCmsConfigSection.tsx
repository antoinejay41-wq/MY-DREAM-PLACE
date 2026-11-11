import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  Download,
  Eye,
  Globe,
  Lock,
  Palette,
  Plus,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import { translations } from '../../translations';
import { CurrencyCode, LanguageCode } from '../../types';
import { Logo, OFFICIAL_LOGO_PATH } from '../Logo';

interface AdminCmsConfigSectionProps {
  mode: 'translations' | 'navigation' | 'branding' | 'analytics' | 'settings';
}

const EDITABLE_TRANSLATION_KEYS: {
  dotKey: string;
  section: string;
  field: string;
  label: string;
}[] = [
  { dotKey: 'nav.home', section: 'nav', field: 'home', label: 'Navigation: Home' },
  { dotKey: 'nav.buy', section: 'nav', field: 'buy', label: 'Navigation: Buy' },
  { dotKey: 'nav.rent', section: 'nav', field: 'rent', label: 'Navigation: Rent' },
  { dotKey: 'nav.land', section: 'nav', field: 'land', label: 'Navigation: Land' },
  { dotKey: 'nav.eventSpaces', section: 'nav', field: 'eventSpaces', label: 'Navigation: Event Spaces' },
  { dotKey: 'nav.agents', section: 'nav', field: 'agents', label: 'Navigation: Agents' },
  { dotKey: 'nav.listProperty', section: 'nav', field: 'listProperty', label: 'Button: List Your Property' },
  { dotKey: 'nav.register', section: 'nav', field: 'register', label: 'Button: Register' },
  { dotKey: 'hero.line1', section: 'hero', field: 'line1', label: 'Hero Headline Line 1' },
  { dotKey: 'hero.line2', section: 'hero', field: 'line2', label: 'Hero Headline Line 2' },
  { dotKey: 'hero.line3', section: 'hero', field: 'line3', label: 'Hero Headline Line 3' },
  { dotKey: 'hero.tagline1', section: 'hero', field: 'tagline1', label: 'Hero Tagline Line 1' },
  { dotKey: 'hero.tagline2', section: 'hero', field: 'tagline2', label: 'Hero Tagline Line 2' },
  { dotKey: 'hero.exploreCta', section: 'hero', field: 'exploreCta', label: 'Hero CTA Button: Explore Properties' },
  { dotKey: 'hero.videoCaption', section: 'hero', field: 'videoCaption', label: 'Hero Video Caption' },
  { dotKey: 'search.searchButton', section: 'search', field: 'searchButton', label: 'Search Button Label' },
  { dotKey: 'sections.latestSubtitle', section: 'sections', field: 'latestSubtitle', label: 'Latest Places Description' },
  { dotKey: 'sections.browseByCategory', section: 'sections', field: 'browseByCategory', label: 'Section Heading: Browse by Category' },
  { dotKey: 'sections.featuredHouses', section: 'sections', field: 'featuredHouses', label: 'Section Heading: Featured Houses' },
  { dotKey: 'sections.featuredApartments', section: 'sections', field: 'featuredApartments', label: 'Section Heading: Featured Apartments' },
  { dotKey: 'sections.howItWorks', section: 'sections', field: 'howItWorks', label: 'Section Heading: How It Works' },
  { dotKey: 'sections.viewDetails', section: 'sections', field: 'viewDetails', label: 'Button: View Details' },
  { dotKey: 'property.contactOwner', section: 'property', field: 'contactOwner', label: 'Button: Contact Owner' },
  { dotKey: 'property.requestViewing', section: 'property', field: 'requestViewing', label: 'Button: Request Viewing' }
];

export const AdminCmsConfigSection: React.FC<AdminCmsConfigSectionProps> = ({
  mode
}) => {
  const {
    language,
    setLanguage,
    currency,
    setCurrency,
    properties,
    inquiries,
    viewingRequests,
    notifications,
    formatPrice,
    draftWebsiteContent,
    draftBranding,
    draftNavigationConfig,
    draftWebsiteSettings,
    draftCustomTranslations,
    updateDraftWebsiteContent,
    updateDraftBranding,
    updateDraftNavigationConfig,
    updateDraftWebsiteSettings,
    updateDraftTranslation,
    saveDraftChanges,
    publishDraftChanges,
    uploadMediaFromDevice,
    authorizedAdminEmails,
    addAdminByEmail,
    removeAdminByEmail,
    logoutAdminSession,
    resetDemoData,
    showToast
  } = useMarketplace();
  const navigate = useNavigate();

  const [selectedEditLang, setSelectedEditLang] = useState<LanguageCode>('fr');
  const [newFooterLabel, setNewFooterLabel] = useState('');
  const [newFooterPath, setNewFooterPath] = useState('/buy');
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('https://');
  const [confirmFactoryReset, setConfirmFactoryReset] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');

  // ============================================================================
  // 11. LANGUAGES & MULTILINGUAL CONTENT EDITOR
  // ============================================================================
  if (mode === 'translations') {
    const getTranslationValue = (lang: LanguageCode, section: string, field: string, dotKey: string) => {
      const custom = draftCustomTranslations[lang]?.[dotKey];
      if (custom !== undefined) return custom;
      const baseDict = translations[lang] as unknown as Record<string, Record<string, string>>;
      return baseDict?.[section]?.[field] || '';
    };

    const missingKeysForLang = EDITABLE_TRANSLATION_KEYS.filter((item) => {
      const val = getTranslationValue(selectedEditLang, item.section, item.field, item.dotKey);
      return !val || !val.trim();
    });

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#1150EF]" />
              <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                Multilingual Content Editor (EN · FR · ES · HT)
              </span>
            </div>
            <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
              Edit Languages & Translations
            </h2>
            <p className="font-body text-xs text-[#737373] mt-0.5">
              Customize headings, buttons, descriptions, and navigation labels for English, French, Spanish, and Haitian Creole.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setLanguage(selectedEditLang);
                showToast(`Switched active site language to ${selectedEditLang.toUpperCase()}`);
              }}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-ui font-semibold cursor-pointer"
            >
              Test {selectedEditLang.toUpperCase()} Live
            </button>
            <button
              type="button"
              onClick={saveDraftChanges}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-ui font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>
            <button
              type="button"
              onClick={publishDraftChanges}
              className="px-4 py-2 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white text-xs font-ui font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Publish Translations
            </button>
          </div>
        </div>

        {/* Language Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              { code: 'en', name: 'English (EN)', region: 'Primary Default' },
              { code: 'fr', name: 'Français (FR)', region: 'French' },
              { code: 'es', name: 'Español (ES)', region: 'Spanish' },
              { code: 'ht', name: 'Kreyòl Ayisyen (HT)', region: 'Haitian Creole' }
            ] as { code: LanguageCode; name: string; region: string }[]
          ).map((l) => {
            const missingCount = EDITABLE_TRANSLATION_KEYS.filter(
              (k) => !getTranslationValue(l.code, k.section, k.field, k.dotKey).trim()
            ).length;

            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setSelectedEditLang(l.code)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedEditLang === l.code
                    ? 'bg-[#1150EF] text-white border-[#1150EF] shadow-md'
                    : 'bg-white text-[#161616] border-neutral-200 hover:border-[#1150EF]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-semibold">{l.name}</span>
                  {missingCount > 0 ? (
                    <span className="px-2 py-0.5 rounded bg-amber-400 text-[#0D0D0D] font-ui text-[10px] font-bold">
                      {missingCount} Missing
                    </span>
                  ) : (
                    <CheckCircle2 className="w-4 h-4 opacity-80" />
                  )}
                </div>
                <p className="text-xs font-ui opacity-80 mt-0.5">{l.region}</p>
              </button>
            );
          })}
        </div>

        {/* Missing Translation Warning Banner */}
        {missingKeysForLang.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 text-xs font-ui">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">
                Warning: {missingKeysForLang.length} translation field(s) are empty in{' '}
                {selectedEditLang.toUpperCase()}
              </div>
              <p className="mt-0.5 text-amber-800">
                Missing keys: {missingKeysForLang.map((k) => k.label).join(', ')}. Empty fields will fall back to default dictionary values until filled.
              </p>
            </div>
          </div>
        )}

        {/* Translation Key Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EDITABLE_TRANSLATION_KEYS.map((item) => {
              const enReference = getTranslationValue('en', item.section, item.field, item.dotKey);
              const currentValue = getTranslationValue(
                selectedEditLang,
                item.section,
                item.field,
                item.dotKey
              );
              const isEmpty = !currentValue.trim();

              return (
                <div
                  key={item.dotKey}
                  className={`p-4 rounded-xl border ${
                    isEmpty
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-neutral-50/60 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="font-ui text-xs font-bold text-[#0D0D0D]">
                      {item.label}
                    </label>
                    {isEmpty && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-ui font-bold text-amber-700">
                        <AlertTriangle className="w-3 h-3" /> Missing Translation
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-body text-[#737373] mb-2">
                    EN Reference: “{enReference}”
                  </div>
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) =>
                      updateDraftTranslation(selectedEditLang, item.dotKey, e.target.value)
                    }
                    placeholder={`Enter ${selectedEditLang.toUpperCase()} translation...`}
                    className="w-full h-9 px-3 rounded-lg bg-white border border-neutral-200 text-xs font-body text-[#161616]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 12. NAVIGATION & FOOTER MANAGER
  // ============================================================================
  if (mode === 'navigation') {
    const moveHeaderItem = (idx: number, dir: -1 | 1) => {
      const list = [...draftNavigationConfig.headerItems];
      const target = idx + dir;
      if (target < 0 || target >= list.length) return;
      const temp = list[idx];
      list[idx] = list[target];
      list[target] = temp;
      updateDraftNavigationConfig({ headerItems: list });
    };

    const toggleHeaderItemVisibility = (id: string) => {
      const list = draftNavigationConfig.headerItems.map((item) =>
        item.id === id && !item.essential ? { ...item, visible: !item.visible } : item
      );
      updateDraftNavigationConfig({ headerItems: list });
    };

    const updateHeaderItemLabel = (id: string, customLabel: string) => {
      const list = draftNavigationConfig.headerItems.map((item) =>
        item.id === id ? { ...item, customLabel } : item
      );
      updateDraftNavigationConfig({ headerItems: list });
    };

    const addFooterLink = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newFooterLabel.trim()) return;
      updateDraftNavigationConfig({
        footerLinks: [
          ...draftNavigationConfig.footerLinks,
          {
            id: `fl-${Date.now()}`,
            label: newFooterLabel.trim(),
            to: newFooterPath.trim() || '/buy',
            visible: true
          }
        ]
      });
      setNewFooterLabel('');
    };

    const addSocialLink = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newSocialPlatform.trim() || !newSocialUrl.trim()) return;
      updateDraftNavigationConfig({
        socialLinks: [
          ...draftNavigationConfig.socialLinks,
          {
            id: `soc-${Date.now()}`,
            platform: newSocialPlatform.trim(),
            url: newSocialUrl.trim(),
            visible: true
          }
        ]
      });
      setNewSocialPlatform('');
      setNewSocialUrl('https://');
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
              Menu Architecture & Footer Links
            </span>
            <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
              Navigation & Footer Manager
            </h2>
            <p className="font-body text-xs text-[#737373] mt-0.5">
              Reorder header items, customize labels, toggle optional links, and manage footer & social links while preserving essential routes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveDraftChanges}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-ui font-semibold cursor-pointer"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={publishDraftChanges}
              className="px-4 py-2 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white text-xs font-ui font-bold cursor-pointer"
            >
              Publish Menu Changes
            </button>
          </div>
        </div>

        {/* Header Navigation Items */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-xl text-[#0D0D0D]">
              Header Navigation Menu Items
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-ui text-[#737373]">
              <Lock className="w-3.5 h-3.5 text-[#1150EF]" />
              Essential routes (Home, Buy, Rent, Property Details, /admin) are protected
            </span>
          </div>

          <div className="space-y-2.5">
            {draftNavigationConfig.headerItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-[#1150EF]/10 text-[#1150EF] font-ui text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-[120px]">
                    <div className="font-ui text-xs font-bold text-[#0D0D0D]">
                      Route: {item.to}
                    </div>
                    <div className="text-[11px] font-ui text-[#737373]">
                      Key: {item.labelKey} {item.essential ? '(Essential)' : '(Optional)'}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={item.customLabel || ''}
                    onChange={(e) => updateHeaderItemLabel(item.id, e.target.value)}
                    placeholder={`Custom label override (leave empty for translated "${item.labelKey}")`}
                    className="flex-1 h-9 px-3 rounded-lg bg-white border border-neutral-200 text-xs font-body"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={Boolean(item.essential)}
                    onClick={() => toggleHeaderItemVisibility(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-ui font-semibold cursor-pointer ${
                      item.visible || item.essential
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-neutral-200 text-neutral-700'
                    } ${item.essential ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {item.essential ? 'Locked Visible' : item.visible ? 'Visible' : 'Hidden'}
                  </button>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveHeaderItem(idx, -1)}
                    className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === draftNavigationConfig.headerItems.length - 1}
                    onClick={() => moveHeaderItem(idx, 1)}
                    className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Links & Social Media Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="font-display text-xl text-[#0D0D0D]">Footer Collection Links</h3>
            <div className="space-y-2">
              {draftNavigationConfig.footerLinks.map((fl) => (
                <div
                  key={fl.id}
                  className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-2"
                >
                  <input
                    type="text"
                    value={fl.label}
                    onChange={(e) => {
                      const updated = draftNavigationConfig.footerLinks.map((item) =>
                        item.id === fl.id ? { ...item, label: e.target.value } : item
                      );
                      updateDraftNavigationConfig({ footerLinks: updated });
                    }}
                    className="flex-1 h-8 px-2.5 rounded bg-white border border-neutral-200 text-xs font-body"
                  />
                  <span className="text-[11px] font-ui text-[#737373]">{fl.to}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = draftNavigationConfig.footerLinks.map((item) =>
                        item.id === fl.id ? { ...item, visible: !item.visible } : item
                      );
                      updateDraftNavigationConfig({ footerLinks: updated });
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-ui font-semibold cursor-pointer ${
                      fl.visible ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {fl.visible ? 'Shown' : 'Hidden'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraftNavigationConfig({
                        footerLinks: draftNavigationConfig.footerLinks.filter(
                          (item) => item.id !== fl.id
                        )
                      })
                    }
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={addFooterLink} className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="New footer link label..."
                value={newFooterLabel}
                onChange={(e) => setNewFooterLabel(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 text-xs"
              />
              <select
                value={newFooterPath}
                onChange={(e) => setNewFooterPath(e.target.value)}
                className="h-9 px-2 rounded-lg border border-neutral-200 text-xs font-ui"
              >
                <option value="/buy">/buy</option>
                <option value="/rent">/rent</option>
                <option value="/land">/land</option>
                <option value="/events">/events</option>
                <option value="/agents">/agents</option>
                <option value="/list-property">/list-property</option>
              </select>
              <button
                type="submit"
                className="h-9 px-3 rounded-lg bg-[#1150EF] text-white text-xs font-ui font-semibold cursor-pointer"
              >
                + Add
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="font-display text-xl text-[#0D0D0D]">Social Media Links</h3>
            <div className="space-y-2">
              {draftNavigationConfig.socialLinks.map((soc) => (
                <div
                  key={soc.id}
                  className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-2"
                >
                  <span className="font-ui text-xs font-bold text-[#0D0D0D] min-w-[80px]">
                    {soc.platform}
                  </span>
                  <input
                    type="text"
                    value={soc.url}
                    onChange={(e) => {
                      const updated = draftNavigationConfig.socialLinks.map((item) =>
                        item.id === soc.id ? { ...item, url: e.target.value } : item
                      );
                      updateDraftNavigationConfig({ socialLinks: updated });
                    }}
                    className="flex-1 h-8 px-2.5 rounded bg-white border border-neutral-200 text-xs font-body"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = draftNavigationConfig.socialLinks.map((item) =>
                        item.id === soc.id ? { ...item, visible: !item.visible } : item
                      );
                      updateDraftNavigationConfig({ socialLinks: updated });
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-ui font-semibold cursor-pointer ${
                      soc.visible ? 'bg-emerald-50 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {soc.visible ? 'Shown' : 'Hidden'}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraftNavigationConfig({
                        socialLinks: draftNavigationConfig.socialLinks.filter(
                          (item) => item.id !== soc.id
                        )
                      })
                    }
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={addSocialLink} className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Platform (e.g. X / TikTok)"
                value={newSocialPlatform}
                onChange={(e) => setNewSocialPlatform(e.target.value)}
                className="w-36 h-9 px-3 rounded-lg border border-neutral-200 text-xs"
              />
              <input
                type="url"
                placeholder="https://..."
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                className="flex-1 h-9 px-3 rounded-lg border border-neutral-200 text-xs"
              />
              <button
                type="submit"
                className="h-9 px-3 rounded-lg bg-[#1150EF] text-white text-xs font-ui font-semibold cursor-pointer"
              >
                + Add
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 13. BRANDING & APPEARANCE
  // ============================================================================
  if (mode === 'branding') {
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const asset = await uploadMediaFromDevice(file, 'logo', 'Brand Logo');
        updateDraftBranding({ logoUrl: asset.url });
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Logo upload failed');
      } finally {
        e.target.value = '';
      }
    };

    const toggleSectionVis = (key: keyof typeof draftBranding.sectionVisibility) => {
      updateDraftBranding({
        sectionVisibility: {
          ...draftBranding.sectionVisibility,
          [key]: !draftBranding.sectionVisibility[key]
        }
      });
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#1150EF]" />
              <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                Centralized Theme & Visual Identity
              </span>
            </div>
            <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
              Branding & Appearance Controls
            </h2>
            <p className="font-body text-xs text-[#737373] mt-0.5">
              Configure website name, logo, brand colors, button styling, typography presets, and homepage section visibility.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveDraftChanges}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-ui font-semibold cursor-pointer"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={publishDraftChanges}
              className="px-4 py-2 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white text-xs font-ui font-bold cursor-pointer"
            >
              Publish Branding
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Brand Identity & Logo */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="font-display text-xl text-[#0D0D0D]">
              Website Name, Slogan & Logo
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-ui text-xs font-semibold mb-1">Website Name</label>
                <input
                  type="text"
                  value={draftBranding.siteName}
                  onChange={(e) => updateDraftBranding({ siteName: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
                />
              </div>
              <div>
                <label className="block font-ui text-xs font-semibold mb-1">Brand Subtitle</label>
                <input
                  type="text"
                  value={draftBranding.subtitle}
                  onChange={(e) => updateDraftBranding({ subtitle: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold mb-1">Official Brand Slogan</label>
              <input
                type="text"
                value={draftBranding.slogan}
                onChange={(e) => updateDraftBranding({ slogan: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm"
              />
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-3">
              <label className="block font-ui text-xs font-semibold">
                Website Logo Preview & Replacement
              </label>
              <div className="p-4 rounded-xl bg-neutral-100 flex flex-wrap items-center justify-between gap-4">
                <Logo variant="desktop" overrideLogoUrl={draftBranding.logoUrl} />
                <div className="flex flex-wrap gap-2">
                  <label className="px-3.5 py-2 rounded-xl bg-[#1150EF] text-white text-xs font-ui font-semibold inline-flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => updateDraftBranding({ logoUrl: OFFICIAL_LOGO_PATH })}
                    className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-ui font-semibold cursor-pointer"
                  >
                    Restore Official Logo
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-ui text-xs font-semibold mb-1">
                Footer Brand Note
              </label>
              <input
                type="text"
                value={draftBranding.footerBrandNote}
                onChange={(e) => updateDraftBranding({ footerBrandNote: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs"
              />
            </div>
          </div>

          {/* Colors, Typography & Button Styling */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
            <h3 className="font-display text-xl text-[#0D0D0D]">
              Colors, Typography & Button Styling
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-ui text-[11px] font-semibold mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={draftBranding.primaryColor}
                    onChange={(e) => updateDraftBranding({ primaryColor: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer border border-neutral-200"
                  />
                  <span className="text-xs font-ui tabular-nums">
                    {draftBranding.primaryColor}
                  </span>
                </div>
              </div>
              <div>
                <label className="block font-ui text-[11px] font-semibold mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={draftBranding.secondaryColor}
                    onChange={(e) => updateDraftBranding({ secondaryColor: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer border border-neutral-200"
                  />
                  <span className="text-xs font-ui tabular-nums">
                    {draftBranding.secondaryColor}
                  </span>
                </div>
              </div>
              <div>
                <label className="block font-ui text-[11px] font-semibold mb-1">
                  Sky Blue Accent
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={draftBranding.skyBlueColor}
                    onChange={(e) => updateDraftBranding({ skyBlueColor: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer border border-neutral-200"
                  />
                  <span className="text-xs font-ui tabular-nums">
                    {draftBranding.skyBlueColor}
                  </span>
                </div>
              </div>
              <div>
                <label className="block font-ui text-[11px] font-semibold mb-1">
                  Light Blue Mist
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={draftBranding.lightBlueColor}
                    onChange={(e) => updateDraftBranding({ lightBlueColor: e.target.value })}
                    className="w-9 h-9 rounded cursor-pointer border border-neutral-200"
                  />
                  <span className="text-xs font-ui tabular-nums">
                    {draftBranding.lightBlueColor}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  updateDraftBranding({
                    primaryColor: '#1150EF',
                    secondaryColor: '#135AF3',
                    skyBlueColor: '#76A2FA',
                    lightBlueColor: '#B9CFFD'
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#1150EF] text-white text-xs font-ui font-semibold cursor-pointer"
              >
                Official Royal Blue Palette
              </button>
              <button
                type="button"
                onClick={() =>
                  updateDraftBranding({
                    primaryColor: '#0F3D3E',
                    secondaryColor: '#145354',
                    skyBlueColor: '#5C9EAD',
                    lightBlueColor: '#CFE8EF'
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#0F3D3E] text-white text-xs font-ui font-semibold cursor-pointer"
              >
                Coastal Emerald Palette
              </button>
              <button
                type="button"
                onClick={() =>
                  updateDraftBranding({
                    primaryColor: '#1E293B',
                    secondaryColor: '#334155',
                    skyBlueColor: '#64748B',
                    lightBlueColor: '#CBD5E1'
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#1E293B] text-white text-xs font-ui font-semibold cursor-pointer"
              >
                Architectural Slate Palette
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
              <div>
                <label className="block font-ui text-xs font-semibold mb-1.5">
                  Typography Preset
                </label>
                <select
                  value={draftBranding.typographyPreset}
                  onChange={(e) =>
                    updateDraftBranding({
                      typographyPreset: e.target.value as typeof draftBranding.typographyPreset
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
                >
                  <option value="classic_luxury">
                    Classic Luxury (Playfair Display + Archivo + Manrope)
                  </option>
                  <option value="modern_editorial">
                    Modern Editorial (Georgia Serif + Manrope)
                  </option>
                  <option value="architectural_sans">
                    Architectural Sans (Archivo Geometric + Manrope)
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-ui text-xs font-semibold mb-1.5">
                  Button Corner Styling
                </label>
                <select
                  value={draftBranding.buttonRadius}
                  onChange={(e) =>
                    updateDraftBranding({
                      buttonRadius: e.target.value as typeof draftBranding.buttonRadius
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
                >
                  <option value="rounded-xl">Soft Architectural (rounded-xl)</option>
                  <option value="rounded-full">Cinematic Capsule (rounded-full)</option>
                  <option value="rounded-none">Sharp Brutalist (rounded-none)</option>
                </select>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-ui font-semibold text-[#161616] cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={draftBranding.showGridLines}
                onChange={(e) => updateDraftBranding({ showGridLines: e.target.checked })}
                className="w-4 h-4 accent-[#1150EF]"
              />
              <span>Show Four Vertical Architectural Grid Lines on Homepage Hero</span>
            </label>
          </div>
        </div>

        {/* Section Visibility Matrix */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <h3 className="font-display text-xl text-[#0D0D0D]">
            Homepage Section Visibility Controls
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {(
              [
                { key: 'heroVideoCard', label: 'Hero Video Card' },
                { key: 'latestPlaces', label: 'Our Latest Places' },
                { key: 'categoriesStrip', label: 'Categories Strip' },
                { key: 'featuredHouses', label: 'Featured Houses' },
                { key: 'featuredApartments', label: 'Featured Apartments' },
                { key: 'landAndEvents', label: 'Land & Event Spaces' },
                { key: 'popularLocations', label: 'Popular Destinations' },
                { key: 'aboutSection', label: 'About Section' },
                { key: 'howItWorksAndTrust', label: 'How It Works & Trust' },
                { key: 'ownerCtaBanner', label: 'Owner CTA Banner' }
              ] as { key: keyof typeof draftBranding.sectionVisibility; label: string }[]
            ).map((sec) => {
              const isVisible = draftBranding.sectionVisibility?.[sec.key] ?? true;
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => toggleSectionVis(sec.key)}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                    isVisible
                      ? 'bg-[#1150EF]/8 border-[#1150EF] text-[#0D0D0D]'
                      : 'bg-neutral-50 border-neutral-200 text-[#737373]'
                  }`}
                >
                  <span className="font-ui text-xs font-semibold">{sec.label}</span>
                  <Eye className={`w-4 h-4 ${isVisible ? 'text-[#1150EF]' : 'opacity-40'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 14. REPORTS & ANALYTICS
  // ============================================================================
  if (mode === 'analytics') {
    const totalValuation = properties.reduce((acc, p) => acc + p.priceUSD, 0);
    const totalViews = properties.reduce((acc, p) => acc + p.viewsCount, 0);
    const totalInquiries = properties.reduce((acc, p) => acc + p.inquiriesCount, 0);

    const categoryBreakdown = (
      ['villa', 'house', 'apartment', 'land', 'event_space', 'commercial'] as const
    ).map((cat) => {
      const subset = properties.filter((p) => p.category === cat);
      const views = subset.reduce((acc, p) => acc + p.viewsCount, 0);
      const inqs = subset.reduce((acc, p) => acc + p.inquiriesCount, 0);
      return {
        category: cat,
        count: subset.length,
        views,
        inqs,
        totalValue: subset.reduce((acc, p) => acc + p.priceUSD, 0)
      };
    });

    const handleExportAnalyticsReport = () => {
      const report = {
        generatedAt: new Date().toISOString(),
        siteName: draftBranding.siteName,
        summary: {
          totalProperties: properties.length,
          totalValuationUSD: totalValuation,
          totalViews,
          totalInquiries,
          totalViewingRequests: viewingRequests.length
        },
        categoryBreakdown
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-dream-place-analytics-report.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Exported JSON analytics report');
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#1150EF]" />
              <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
                Marketplace Intelligence
              </span>
            </div>
            <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
              Reports, Traffic & Portfolio Analytics
            </h2>
            <p className="font-body text-xs text-[#737373] mt-0.5">
              Analyze listing engagement, inquiry conversion, category valuation, and moderation logs.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExportAnalyticsReport}
            className="px-4 py-2.5 rounded-xl bg-[#0D0D0D] hover:bg-[#1150EF] text-white font-ui text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Analytics JSON</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="text-xs font-ui text-[#737373]">Total Portfolio Value</div>
            <div className="font-display text-2xl text-[#0D0D0D] mt-1 tabular-nums">
              {formatPrice(totalValuation)}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="text-xs font-ui text-[#737373]">Cumulative Property Views</div>
            <div className="font-display text-2xl text-[#1150EF] mt-1 tabular-nums">
              {totalViews.toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="text-xs font-ui text-[#737373]">Total Direct Inquiries</div>
            <div className="font-display text-2xl text-[#0D0D0D] mt-1 tabular-nums">
              {totalInquiries + inquiries.length}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-5">
            <div className="text-xs font-ui text-[#737373]">Scheduled Viewing Requests</div>
            <div className="font-display text-2xl text-emerald-700 mt-1 tabular-nums">
              {viewingRequests.length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <h3 className="font-display text-xl text-[#0D0D0D]">
            Performance Breakdown by Property Category
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-ui">
              <thead>
                <tr className="border-b border-neutral-200 text-[#737373] uppercase">
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Listings</th>
                  <th className="py-3 px-4">Total Views</th>
                  <th className="py-3 px-4">Inquiries</th>
                  <th className="py-3 px-4">Category Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categoryBreakdown.map((row) => (
                  <tr key={row.category} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 font-bold uppercase text-[#0D0D0D]">
                      {row.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 tabular-nums">{row.count}</td>
                    <td className="py-3 px-4 tabular-nums font-semibold text-[#1150EF]">
                      {row.views.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 tabular-nums">{row.inqs}</td>
                    <td className="py-3 px-4 tabular-nums font-bold">
                      {formatPrice(row.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-3">
          <h3 className="font-display text-xl text-[#0D0D0D]">
            Recent System & Moderation Notifications ({notifications.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-ui font-bold text-[#0D0D0D]">{n.title}</span>
                  <p className="font-body text-[#737373] mt-0.5">{n.message}</p>
                </div>
                <span className="text-[11px] font-ui text-[#737373] shrink-0">
                  {n.createdAt.split('T')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 15. WEBSITE SETTINGS
  // ============================================================================
  const handleExportFullBackup = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      websiteContent: draftWebsiteContent,
      branding: draftBranding,
      navigationConfig: draftNavigationConfig,
      websiteSettings: draftWebsiteSettings,
      propertiesCount: properties.length
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-dream-place-cms-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded full CMS configuration backup JSON');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#1150EF]" />
            <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
              Global Platform Configuration
            </span>
          </div>
          <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
            Website Settings, Currencies & SEO
          </h2>
          <p className="font-body text-xs text-[#737373] mt-0.5">
            Configure default language, currency conversion rates, interactive widgets, SEO metadata, and demo state backups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={saveDraftChanges}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-ui font-semibold cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={publishDraftChanges}
            className="px-4 py-2 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white text-xs font-ui font-bold cursor-pointer"
          >
            Publish Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional & Currency Settings */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <h3 className="font-display text-xl text-[#0D0D0D]">
            Default Language & Currency Exchange Rates
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-ui text-xs font-semibold mb-1">
                Active Interface Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  const l = e.target.value as LanguageCode;
                  setLanguage(l);
                  updateDraftWebsiteSettings({ defaultLanguage: l });
                }}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
              >
                <option value="en">English (EN)</option>
                <option value="fr">Français (FR)</option>
                <option value="es">Español (ES)</option>
                <option value="ht">Kreyòl Ayisyen (HT)</option>
              </select>
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold mb-1">
                Active Display Currency
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  const c = e.target.value as CurrencyCode;
                  setCurrency(c);
                  updateDraftWebsiteSettings({ defaultCurrency: c });
                }}
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-white"
              >
                <option value="USD">USD ($)</option>
                <option value="DOP">DOP (RD$)</option>
                <option value="HTG">HTG (Gourdes)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-ui text-xs font-semibold mb-1">
                DOP Rate (per 1 USD)
              </label>
              <input
                type="number"
                step="0.1"
                value={draftWebsiteSettings.exchangeRates?.DOP ?? 60.5}
                onChange={(e) =>
                  updateDraftWebsiteSettings({
                    exchangeRates: {
                      ...draftWebsiteSettings.exchangeRates,
                      DOP: Number(e.target.value) || 60.5
                    }
                  })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
              />
            </div>
            <div>
              <label className="block font-ui text-xs font-semibold mb-1">
                HTG Rate (per 1 USD)
              </label>
              <input
                type="number"
                step="0.5"
                value={draftWebsiteSettings.exchangeRates?.HTG ?? 132.0}
                onChange={(e) =>
                  updateDraftWebsiteSettings({
                    exchangeRates: {
                      ...draftWebsiteSettings.exchangeRates,
                      HTG: Number(e.target.value) || 132.0
                    }
                  })
                }
                className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-sm font-ui"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles & SEO */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
          <h3 className="font-display text-xl text-[#0D0D0D]">
            Interactive Features & SEO Defaults
          </h3>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
              <span className="font-ui text-xs font-semibold text-[#161616]">
                Enable Floating Property Match Assistant Widget
              </span>
              <input
                type="checkbox"
                checked={draftWebsiteSettings.enableAssistantWidget}
                onChange={(e) =>
                  updateDraftWebsiteSettings({ enableAssistantWidget: e.target.checked })
                }
                className="w-4 h-4 accent-[#1150EF]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
              <span className="font-ui text-xs font-semibold text-[#161616]">
                Enable Side-by-Side Property Comparison Drawer
              </span>
              <input
                type="checkbox"
                checked={draftWebsiteSettings.enablePropertyComparison}
                onChange={(e) =>
                  updateDraftWebsiteSettings({
                    enablePropertyComparison: e.target.checked
                  })
                }
                className="w-4 h-4 accent-[#1150EF]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer">
              <span className="font-ui text-xs font-semibold text-[#161616]">
                Require Admin Approval for New Owner Submissions
              </span>
              <input
                type="checkbox"
                checked={draftWebsiteSettings.requireAdminApprovalForNewListings}
                onChange={(e) =>
                  updateDraftWebsiteSettings({
                    requireAdminApprovalForNewListings: e.target.checked
                  })
                }
                className="w-4 h-4 accent-[#1150EF]"
              />
            </label>
          </div>

          <div>
            <label className="block font-ui text-xs font-semibold mb-1">
              Default SEO Title
            </label>
            <input
              type="text"
              value={draftWebsiteSettings.seoDefaultTitle}
              onChange={(e) =>
                updateDraftWebsiteSettings({ seoDefaultTitle: e.target.value })
              }
              className="w-full h-10 px-3 rounded-xl border border-neutral-200 text-xs font-body"
            />
          </div>
        </div>
      </div>

      {/* Admin Team & Session Controls */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF] inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Team & Session Controls
            </span>
            <h3 className="font-display text-lg text-[#0D0D0D] mt-0.5">
              Authorized Website Administrators ({authorizedAdminEmails.length})
            </h3>
            <p className="font-body text-xs text-[#737373]">
              Authorize additional administrators by email or log out of your Admin session after publishing changes.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logoutAdminSession();
              navigate('/');
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-ui text-xs font-bold cursor-pointer shrink-0"
          >
            Log Out & Exit Admin
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newAdminEmail.trim()) return;
            addAdminByEmail(newAdminEmail.trim(), newAdminName.trim() || undefined);
            setNewAdminName('');
            setNewAdminEmail('');
          }}
          className="grid grid-cols-1 sm:grid-cols-12 gap-2.5"
        >
          <input
            type="text"
            placeholder="Full Name (optional)"
            value={newAdminName}
            onChange={(e) => setNewAdminName(e.target.value)}
            className="sm:col-span-4 h-10 px-3.5 rounded-xl border border-neutral-200 text-xs font-body"
          />
          <input
            type="email"
            required
            placeholder="Google Email Address (e.g. colleague@gmail.com)"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            className="sm:col-span-5 h-10 px-3.5 rounded-xl border border-neutral-200 text-xs font-body"
          />
          <button
            type="submit"
            className="sm:col-span-3 h-10 px-4 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add as Admin</span>
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {authorizedAdminEmails.map((email) => {
            const isPrimary = email.toLowerCase() === 'antoinejay41@gmail.com';
            return (
              <div
                key={email}
                className="px-3 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs font-ui flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#1150EF]" />
                <span className="font-bold text-[#0D0D0D]">{email}</span>
                {isPrimary ? (
                  <span className="px-1.5 py-0.5 rounded bg-[#1150EF] text-white text-[10px] font-bold uppercase">
                    Owner Admin
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeAdminByEmail(email)}
                    className="text-rose-600 hover:text-rose-800 font-bold text-[11px] cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup & Factory Reset */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg text-[#0D0D0D]">
            Export CMS Configuration or Reset Demo Environment
          </h3>
          <p className="font-body text-xs text-[#737373]">
            Download a JSON snapshot of your current CMS settings or restore factory demo defaults.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportFullBackup}
            className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-ui font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CMS Backup</span>
          </button>

          {confirmFactoryReset ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  resetDemoData();
                  setConfirmFactoryReset(false);
                }}
                className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-ui font-bold cursor-pointer"
              >
                Confirm Factory Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmFactoryReset(false)}
                className="px-3 py-2.5 rounded-xl bg-neutral-100 text-xs font-ui font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmFactoryReset(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-ui font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Factory Reset Demo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
