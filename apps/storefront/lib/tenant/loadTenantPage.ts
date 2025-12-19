// apps/storefront/src/lib/tenant/loadTenantPage.ts
/**
 * loadTenantPage.ts
 *
 * Central data-loading pipeline used by the storefront universal page resolver.
 * Responsibilities:
 *  - Resolve page & product data from Payload (or worker/Redis cache) 
 *    includes merged /compiled template snapshot, page hash and page Data
 *  - Preload components used on page (so SSR can import them)
 *
 * Returns a structured object ready for rendering:
 *  {
 *    tenant, page, product, templateSnapshot, merged, pageHash, cacheHit
 *  }
 */

// Use existing helper functions in your codebase (adjust imports if different)
import { fetchTenantById } from "../data/payload";
import { collectTypesFromPuck } from "../puck/puckUtils";
import { preloadComponents } from "../puck/componentRegistry.server";
import { getRedisJSON, setRedisJSON } from "@repo/shared-utils/redis"; // optional cache helpers


export type LoadTenantPageResult = {
  tenant: any | null;
  page: any | null;
  product?: any | null;
  templateSnapshot?: any | null;
  merged: any | null;
  pageHash: string | null;
  cacheHit: boolean;
};

/**
 * loadTenantPage
 * @param tenantSlug string - tenant id (or slug if you prefer)
 * @param path string - requested path (e.g. '/', '/products/lamp')
 * @param opts object - { useCache: boolean, preview: boolean }
 */
export async function loadTenantPage(
  tenantSlug: string,
  path: string,
  opts: { useCache?: boolean; preview?: boolean } = {}
): Promise<LoadTenantPageResult> {
  const useCache = opts.useCache ?? true;
  const preview = opts.preview ?? false;

  // 1) Load tenant (fast)
  // const tenant = await fetchTenantById(tenantId);
  // if (!tenant) {
  //   return { tenant: null, page: null, product: null, templateSnapshot: null, merged: null, pageHash: null, cacheHit: false };
  // }

  // Cache key for the merged snapshot / page-level HTML (optional)
  const mergedCacheKey = `merged:${tenantSlug}:${path}`;

  // 2) Try fast cache (if allowed)
  if (useCache && !preview) {
    const cached = await getRedisJSON(mergedCacheKey);
    if (cached) {
      return { ...cached, cacheHit: true };
    }
  }

  // 3) Resolve page from cms api (product takes priority)
  const res = await fetch(`${process.env.CMS_API_URL}/api/resolved-page/${tenantSlug}/${path}?preview=${preview}`);

  if (!res.ok) {
    return { tenant: null, page: null, product: null, templateSnapshot: null, merged: null, pageHash: null, cacheHit: false }
  }

  const { page, merged, pageHash } = await res.json();

  // 4) Preload components used on page (so server dynamic import will be warm)
  try {
    const types = collectTypesFromPuck(merged);
    await preloadComponents(types);
  } catch (err) {
    console.warn("preloadComponents failed:", err);
  }

  // 11) Optionally prime block caches or store merged snapshot for fast subsequent reads
  if (useCache && !preview) {
    try {
      const payload = { tenantId: tenantSlug, page, merged, pageHash }; // Adjust if product needed
      await setRedisJSON(mergedCacheKey, JSON.stringify(payload), 60 * 60); // 1 hr TTL
    } catch (err) {
      console.warn("loadTenantPage - redis set failed:", err);
    }
  }

  return { tenant: tenantSlug, page, merged, pageHash, cacheHit: false };
}

