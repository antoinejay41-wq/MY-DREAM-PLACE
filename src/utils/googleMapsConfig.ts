/**
 * Google Maps Platform configuration & Tier-2 Quota Defense helpers.
 * Uses environment variables exclusively (never hardcoded keys).
 * Docs: https://developers.google.com/maps/documentation/javascript?utm_campaign=gmp_mcp_codeassist_v1_aistudio
 */

export const GMP_ATTRIBUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';
export const GMP_MAP_ID = 'DEMO_MAP_ID';

export function getGoogleMapsApiKey(): string {
  const viteKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const procKey =
    typeof process !== 'undefined' && process.env
      ? (process.env.GOOGLE_MAPS_PLATFORM_API_KEY as string | undefined)
      : undefined;

  const candidate = (viteKey || procKey || '').trim();
  if (
    !candidate ||
    candidate === 'YOUR_GOOGLE_MAPS_API_KEY' ||
    candidate === 'MY_GOOGLE_MAPS_API_KEY'
  ) {
    return '';
  }
  return candidate;
}

export function triggerMapsQuotaExceeded(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
}

export function checkAndTriggerQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  if (
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OverQuotaMapError') ||
    msg.includes('QuotaExceededError') ||
    msg.includes('429')
  ) {
    triggerMapsQuotaExceeded();
    return true;
  }
  return false;
}
