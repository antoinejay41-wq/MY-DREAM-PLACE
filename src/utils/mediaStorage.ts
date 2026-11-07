import { SCENEAI_IMAGES } from '../data/mockData';

export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'logo';
  category: 'hero' | 'property' | 'banner' | 'logo' | 'video' | 'general';
  url: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
  dimensions?: string;
  usedIn?: string;
}

const DB_NAME = 'mdp_cms_media_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_assets';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per image
export const MAX_VIDEO_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB per video
export const MAX_TOTAL_STORAGE_BYTES = 40 * 1024 * 1024; // 40 MB demo quota

export const DEFAULT_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'media-logo-official',
    name: 'My Dream Place Official Logo',
    type: 'logo',
    category: 'logo',
    url: '/assets/aistudio/My_Dream_Place_Logo_47bf8882.png',
    sizeBytes: 142000,
    mimeType: 'image/png',
    createdAt: '2026-10-01T10:00:00Z',
    dimensions: '1024 × 1024',
    usedIn: 'Global Brand Logo'
  },
  {
    id: 'media-hero-main',
    name: 'Hero Architectural Flagship Residence',
    type: 'image',
    category: 'hero',
    url: SCENEAI_IMAGES.heroMain,
    sizeBytes: 680000,
    mimeType: 'image/png',
    createdAt: '2026-10-05T12:00:00Z',
    dimensions: '1920 × 1080',
    usedIn: 'Homepage Hero Main Image'
  },
  {
    id: 'media-latest-1',
    name: 'Villa Sabrina Horizon Pavilion',
    type: 'image',
    category: 'banner',
    url: SCENEAI_IMAGES.latest1,
    sizeBytes: 540000,
    mimeType: 'image/png',
    createdAt: '2026-10-08T14:20:00Z',
    dimensions: '1600 × 1200',
    usedIn: 'Latest Places #1 & Video Poster'
  },
  {
    id: 'media-latest-2',
    name: 'Azure Cliffside Sanctuary',
    type: 'image',
    category: 'banner',
    url: SCENEAI_IMAGES.latest2,
    sizeBytes: 510000,
    mimeType: 'image/png',
    createdAt: '2026-10-09T09:15:00Z',
    dimensions: '1600 × 1200',
    usedIn: 'Latest Places #2'
  },
  {
    id: 'media-latest-3',
    name: 'Palais Mirador Glass Estate',
    type: 'image',
    category: 'banner',
    url: SCENEAI_IMAGES.latest3,
    sizeBytes: 590000,
    mimeType: 'image/png',
    createdAt: '2026-10-10T16:40:00Z',
    dimensions: '1600 × 1200',
    usedIn: 'Latest Places #3'
  },
  {
    id: 'media-hero-video',
    name: 'Homepage Architectural Cinema Reel',
    type: 'video',
    category: 'video',
    url: SCENEAI_IMAGES.heroVideo,
    sizeBytes: 3450000,
    mimeType: 'video/mp4',
    createdAt: '2026-10-12T11:00:00Z',
    dimensions: '1280 × 720',
    usedIn: 'Homepage Hero Video Card'
  }
];

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllMediaAssets(): Promise<MediaAsset[]> {
  try {
    const db = await openMediaDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const stored = (req.result as MediaAsset[]) || [];
        if (stored.length === 0) {
          resolve(DEFAULT_MEDIA_ASSETS);
        } else {
          // Ensure default assets exist unless deleted
          const existingIds = new Set(stored.map((s) => s.id));
          const merged = [
            ...stored,
            ...DEFAULT_MEDIA_ASSETS.filter((d) => !existingIds.has(d.id))
          ];
          resolve(merged);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return DEFAULT_MEDIA_ASSETS;
  }
}

export async function saveMediaAsset(asset: MediaAsset): Promise<void> {
  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(asset);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteMediaAssetFromDB(id: string): Promise<void> {
  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function clearAllMediaAssetsFromDB(): Promise<void> {
  try {
    const db = await openMediaDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // ignore in fallback environments
  }
}

export function validateAndReadMediaFile(
  file: File,
  currentTotalBytes: number
): Promise<{ dataUrl: string; asset: MediaAsset }> {
  return new Promise((resolve, reject) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      reject(
        new Error(
          'Unsupported file format. Please upload PNG, JPG, WEBP, SVG images or MP4/WEBM videos.'
        )
      );
      return;
    }

    if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
      reject(
        new Error(
          `Image "${file.name}" (${formatBytes(file.size)}) exceeds the 5 MB demo upload limit.`
        )
      );
      return;
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
      reject(
        new Error(
          `Video "${file.name}" (${formatBytes(file.size)}) exceeds the 12 MB demo upload limit.`
        )
      );
      return;
    }

    if (currentTotalBytes + file.size > MAX_TOTAL_STORAGE_BYTES) {
      reject(
        new Error(
          `IndexedDB storage limit reached (${formatBytes(MAX_TOTAL_STORAGE_BYTES)} max). Please remove unused media files first.`
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newAsset: MediaAsset = {
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: isVideo ? 'video' : 'image',
        category: isVideo ? 'video' : 'general',
        url: dataUrl,
        sizeBytes: file.size,
        mimeType: file.type,
        createdAt: new Date().toISOString()
      };
      resolve({ dataUrl, asset: newAsset });
    };
    reader.onerror = () => reject(new Error('Failed to read local file from device.'));
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
