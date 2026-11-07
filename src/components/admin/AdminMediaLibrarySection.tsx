import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Eye,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  Video,
  X
} from 'lucide-react';
import { useMarketplace } from '../../contexts/MarketplaceContext';
import {
  formatBytes,
  MAX_TOTAL_STORAGE_BYTES,
  MediaAsset
} from '../../utils/mediaStorage';
import { OFFICIAL_LOGO_PATH } from '../Logo';

export const AdminMediaLibrarySection: React.FC = () => {
  const {
    mediaAssets,
    uploadMediaFromDevice,
    replaceMediaAssetFile,
    removeMediaAsset,
    registerExternalMediaUrl,
    updateDraftWebsiteContent,
    updateDraftBranding,
    publishDraftChanges,
    properties,
    updateProperty,
    showToast
  } = useMarketplace();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [uploadCategory, setUploadCategory] = useState<MediaAsset['category']>('general');
  const [externalName, setExternalName] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    properties[0]?.id || 'prop-101'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const totalStorageBytes = mediaAssets.reduce((acc, m) => acc + (m.sizeBytes || 0), 0);
  const usagePercent = Math.min(
    100,
    Math.round((totalStorageBytes / MAX_TOTAL_STORAGE_BYTES) * 100)
  );

  const filteredAssets =
    filterCategory === 'all'
      ? mediaAssets
      : mediaAssets.filter((m) => m.category === filterCategory || m.type === filterCategory);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setErrorMessage(null);
    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await uploadMediaFromDevice(files[i], uploadCategory);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'File validation error';
      setErrorMessage(msg);
      showToast(msg);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleReplaceFile = async (
    assetId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMessage(null);
    try {
      const updated = await replaceMediaAssetFile(assetId, file);
      if (previewAsset?.id === assetId) {
        setPreviewAsset(updated);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to replace file';
      setErrorMessage(msg);
      showToast(msg);
    } finally {
      e.target.value = '';
    }
  };

  const handleAddExternalUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalUrl.trim()) return;
    const isVid =
      externalUrl.toLowerCase().endsWith('.mp4') ||
      externalUrl.toLowerCase().endsWith('.webm');
    await registerExternalMediaUrl(
      externalName || 'External Media',
      externalUrl,
      uploadCategory,
      isVid ? 'video' : 'image'
    );
    setExternalName('');
    setExternalUrl('');
  };

  const assignAssetToWebsiteTarget = (
    asset: MediaAsset,
    target: 'logo' | 'heroBg' | 'heroVideo' | 'heroPoster' | 'addToProperty'
  ) => {
    if (target === 'logo') {
      updateDraftBranding({ logoUrl: asset.url });
      showToast(`Assigned "${asset.name}" as Website Logo in Draft (Click Publish to apply live)`);
    } else if (target === 'heroBg') {
      updateDraftWebsiteContent({ heroBgImage: asset.url });
      showToast(`Assigned "${asset.name}" as Homepage Hero Banner in Draft`);
    } else if (target === 'heroVideo') {
      updateDraftWebsiteContent({ heroVideoUrl: asset.url });
      showToast(`Assigned "${asset.name}" as Homepage Hero Video in Draft`);
    } else if (target === 'heroPoster') {
      updateDraftWebsiteContent({ heroVideoPoster: asset.url });
      showToast(`Assigned "${asset.name}" as Video Poster & About Image in Draft`);
    } else if (target === 'addToProperty' && selectedProperty) {
      updateProperty(selectedProperty.id, {
        images: [...selectedProperty.images, asset.url]
      });
    }
  };

  const moveGalleryImage = (index: number, direction: -1 | 1) => {
    if (!selectedProperty) return;
    const imgs = [...selectedProperty.images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= imgs.length) return;
    const temp = imgs[index];
    imgs[index] = imgs[targetIndex];
    imgs[targetIndex] = temp;
    updateProperty(selectedProperty.id, { images: imgs });
  };

  const removeGalleryImage = (index: number) => {
    if (!selectedProperty) return;
    if (selectedProperty.images.length <= 1) {
      showToast('A property must retain at least 1 cover image.');
      return;
    }
    const imgs = selectedProperty.images.filter((_, i) => i !== index);
    updateProperty(selectedProperty.id, { images: imgs });
  };

  const handlePropertyGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProperty) return;
    setErrorMessage(null);
    try {
      const asset = await uploadMediaFromDevice(
        file,
        'property',
        `Property ${selectedProperty.referenceCode}`
      );
      updateProperty(selectedProperty.id, {
        images: [asset.url, ...selectedProperty.images]
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & IndexedDB Storage Meter */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#1150EF]" />
            <span className="font-ui text-xs font-bold uppercase tracking-widest text-[#1150EF]">
              IndexedDB Local Media Library
            </span>
          </div>
          <h2 className="font-display text-2xl text-[#0D0D0D] mt-1">
            Upload, Preview, Replace & Reorder Media Assets
          </h2>
          <p className="font-body text-xs text-[#737373] mt-0.5">
            Uploaded files are validated and persisted in browser IndexedDB (avoiding localStorage base64 bloat). Max 5 MB per image, 12 MB per video.
          </p>
        </div>

        <div className="w-full lg:w-80 bg-neutral-50 rounded-xl p-4 border border-neutral-200/80">
          <div className="flex items-center justify-between text-xs font-ui mb-1.5">
            <span className="font-semibold text-[#161616]">IndexedDB Quota Usage</span>
            <span className="font-bold text-[#1150EF] tabular-nums">
              {formatBytes(totalStorageBytes)} / {formatBytes(MAX_TOTAL_STORAGE_BYTES)}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
            <div
              style={{ width: `${usagePercent}%` }}
              className={`h-full transition-all ${
                usagePercent > 85 ? 'bg-rose-600' : 'bg-[#1150EF]'
              }`}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-ui text-[#737373]">
            <span>{mediaAssets.length} stored files</span>
            <button
              type="button"
              onClick={publishDraftChanges}
              className="text-[#1150EF] font-semibold hover:underline cursor-pointer"
            >
              Publish Media Assignments
            </button>
          </div>
        </div>
      </div>

      {/* Validation / Storage Limit Alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-3 text-xs font-ui">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="p-1 rounded hover:bg-rose-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Bar & External URL Adder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-neutral-200 p-5 space-y-4">
          <h3 className="font-display text-lg text-[#0D0D0D]">
            Upload Files from Your Device
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as MediaAsset['category'])}
              className="h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-neutral-50"
            >
              <option value="general">Category: General</option>
              <option value="hero">Category: Hero Banner</option>
              <option value="property">Category: Property Photo</option>
              <option value="banner">Category: Section Banner</option>
              <option value="logo">Category: Brand Logo</option>
              <option value="video">Category: Video Reel</option>
            </select>

            <label className="flex-1 min-h-[42px] px-4 py-2.5 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading to IndexedDB...' : 'Choose Device Image / Video'}</span>
              <input
                type="file"
                multiple
                accept="image/*,video/mp4,video/webm"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-ui text-[#737373]">
            <span>Supported: PNG, JPG, WEBP, SVG (≤ 5MB) · MP4, WEBM (≤ 12MB)</span>
            <button
              type="button"
              onClick={() => {
                updateDraftBranding({ logoUrl: OFFICIAL_LOGO_PATH });
                publishDraftChanges();
              }}
              className="text-[#1150EF] font-semibold hover:underline cursor-pointer"
            >
              Restore Official MY DREAM PLACE Logo
            </button>
          </div>
        </div>

        <form
          onSubmit={handleAddExternalUrl}
          className="lg:col-span-6 bg-white rounded-2xl border border-neutral-200 p-5 space-y-4"
        >
          <h3 className="font-display text-lg text-[#0D0D0D]">
            Register Image or Video via Direct URL
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <input
              type="text"
              placeholder="Asset title (e.g. Sunset Poolside)"
              value={externalName}
              onChange={(e) => setExternalName(e.target.value)}
              className="sm:col-span-4 h-10 px-3 rounded-xl border border-neutral-200 text-xs font-body"
            />
            <input
              type="url"
              required
              placeholder="https://..."
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="sm:col-span-5 h-10 px-3 rounded-xl border border-neutral-200 text-xs font-body"
            />
            <button
              type="submit"
              className="sm:col-span-3 h-10 px-3 rounded-xl bg-[#0D0D0D] hover:bg-[#1150EF] text-white font-ui text-xs font-semibold inline-flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Bar & Media Grid */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Media' },
              { id: 'hero', label: 'Hero Banners' },
              { id: 'banner', label: 'Editorial Banners' },
              { id: 'property', label: 'Property Photos' },
              { id: 'logo', label: 'Logos' },
              { id: 'video', label: 'Videos' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterCategory(f.id)}
                className={`px-3 py-1.5 rounded-lg font-ui text-xs font-semibold cursor-pointer transition-colors ${
                  filterCategory === f.id
                    ? 'bg-[#1150EF] text-white'
                    : 'bg-neutral-100 text-[#161616] hover:bg-neutral-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-neutral-900 overflow-hidden group">
                  {asset.type === 'video' ? (
                    <video
                      src={asset.url}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 text-white font-ui text-[10px] font-bold uppercase">
                    {asset.category} · {formatBytes(asset.sizeBytes)}
                  </div>
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewAsset(asset)}
                      title="Preview File"
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-[#0D0D0D] shadow cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <label
                      title="Replace File"
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-[#1150EF] shadow cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept={asset.type === 'video' ? 'video/*' : 'image/*'}
                        onChange={(e) => handleReplaceFile(asset.id, e)}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeMediaAsset(asset.id)}
                      title="Remove File"
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-rose-600 hover:text-white text-rose-600 shadow cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-display text-base text-[#0D0D0D] truncate">{asset.name}</h4>
                  <p className="text-[11px] font-ui text-[#737373] mt-0.5">
                    {asset.usedIn || 'Available in Library'}
                  </p>
                </div>
              </div>

              {/* Quick Assignment Controls */}
              <div className="px-4 pb-4 pt-2 border-t border-neutral-200/70 flex flex-wrap gap-1.5">
                {asset.type === 'video' ? (
                  <button
                    type="button"
                    onClick={() => assignAssetToWebsiteTarget(asset, 'heroVideo')}
                    className="px-2.5 py-1 rounded-lg bg-[#1150EF] text-white font-ui text-[11px] font-semibold cursor-pointer"
                  >
                    Set as Hero Video
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => assignAssetToWebsiteTarget(asset, 'heroBg')}
                      className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:border-[#1150EF] text-[11px] font-ui font-semibold cursor-pointer"
                    >
                      Set Hero Banner
                    </button>
                    <button
                      type="button"
                      onClick={() => assignAssetToWebsiteTarget(asset, 'heroPoster')}
                      className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:border-[#1150EF] text-[11px] font-ui font-semibold cursor-pointer"
                    >
                      Set Video Poster
                    </button>
                    <button
                      type="button"
                      onClick={() => assignAssetToWebsiteTarget(asset, 'logo')}
                      className="px-2.5 py-1 rounded-lg bg-white border border-neutral-200 hover:border-[#1150EF] text-[11px] font-ui font-semibold cursor-pointer"
                    >
                      Set as Website Logo
                    </button>
                    <button
                      type="button"
                      onClick={() => assignAssetToWebsiteTarget(asset, 'addToProperty')}
                      className="px-2.5 py-1 rounded-lg bg-[#1150EF]/10 text-[#1150EF] hover:bg-[#1150EF] hover:text-white text-[11px] font-ui font-semibold cursor-pointer"
                    >
                      + Add to Selected Property
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Property Gallery Reorder & Image Manager */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl text-[#0D0D0D]">
              Reorder & Manage Property Galleries
            </h3>
            <p className="font-body text-xs text-[#737373]">
              Select any property listing to reorder its gallery photos, upload new angles, or remove images.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="h-10 px-3 rounded-xl border border-neutral-200 text-xs font-ui font-semibold bg-neutral-50 max-w-xs"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.referenceCode} — {p.title}
                </option>
              ))}
            </select>
            <label className="h-10 px-3.5 rounded-xl bg-[#1150EF] hover:bg-[#135AF3] text-white font-ui text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo to Gallery</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePropertyGalleryUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {selectedProperty && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {selectedProperty.images.map((imgUrl, idx) => (
              <div
                key={`${selectedProperty.id}-img-${idx}`}
                className="rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 p-2.5 space-y-2"
              >
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-200">
                  <img
                    src={imgUrl}
                    alt={`${selectedProperty.title} #${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-white font-ui text-[10px] font-bold">
                    {idx === 0 ? 'Cover Photo (#1)' : `Photo #${idx + 1}`}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveGalleryImage(idx, -1)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                      title="Move earlier"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === selectedProperty.images.length - 1}
                      onClick={() => moveGalleryImage(idx, 1)}
                      className="p-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 cursor-pointer"
                      title="Move later"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-ui text-[11px] font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Preview Lightbox Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-200">
            <div className="px-5 py-3.5 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h4 className="font-display text-lg text-[#0D0D0D]">{previewAsset.name}</h4>
                <p className="text-xs font-ui text-[#737373]">
                  {previewAsset.mimeType} · {formatBytes(previewAsset.sizeBytes)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 bg-neutral-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              {previewAsset.type === 'video' ? (
                <video
                  src={previewAsset.url}
                  controls
                  autoPlay
                  className="max-h-[60vh] w-auto rounded-lg"
                />
              ) : (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.name}
                  className="max-h-[60vh] w-auto object-contain rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
