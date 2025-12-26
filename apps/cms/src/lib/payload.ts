import { PayloadSDK } from '@shopnex/payload-sdk'
import { Config } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sha256Hex } from '@repo/shared-utils/hash'
import { getRedisJSON, setRedisJSON } from '@repo/shared-utils/redis'
import { mergeTemplateWithPage } from '@repo/ui/utils/mergeEngine'

// Create SDK with dynamic shop handle resolution
const sdk = new PayloadSDK<Config>({
  baseURL: (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000') + '/api',
  baseInit: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  // Custom fetch that adds shop handle dynamically
  fetch: async (...args) => {
    const [url, init] = args

    // Merge headers with dynamic shop handle
    const modifiedInit = {
      ...init,
      headers: {
        ...(init?.headers || {}),
      },
    }

    // Use appropriate fetch based on environment
    if (typeof window !== 'undefined') {
      return window.fetch(url, modifiedInit)
    } else {
      return fetch(url, modifiedInit)
    }
  },
})


export async function fetchTenantPage(tenantSlug: string, path: string, preview?: boolean) {

  preview = preview ?? false
  const payload = await getPayload({ config })

  const cacheKey = `tenant:${tenantSlug}:page:${path || '/'}`;

  const cached = await getRedisJSON(cacheKey);
  if (cached && !preview) return cached;

  try {
    const tenant = (await payload.find({ collection: 'tenants', where: { slug: { equals: tenantSlug } } })).docs[0];
    if (!tenant) return ({ error: 'Tenant not found' });

    const pageQuery = { handle: { equals: path || '/' }, tenant: { equals: tenant.id } };
    const page = (await payload.find({ collection: 'pages', where: pageQuery, draft: preview })).docs[0];

    if (!page) return ({ error: 'Page not found' });

    // Use precomputed if available; else merge on-the-fly
    let merged = page.mergedSnapshot ? JSON.parse(page.mergedSnapshot as string) : mergeTemplateWithPage(
      tenant.templateSettings || {},
      page.snapshot || {},
      {}
    );
    let pageHash = page.pageHash || sha256Hex(JSON.stringify({
      templateVersion: tenant.templateVersion ?? null,
      merged,
    }));

    // const payload = { tenant, page, merged, pageHash };

    if (!preview) await setRedisJSON(cacheKey, payload, 3600);

    return { tenant, page, merged, pageHash };
  } catch (err) {
    console.error('Resolved-page endpoint error:', err);
    return ({ error: 'Internal server error' });
  }

}

export { sdk }
