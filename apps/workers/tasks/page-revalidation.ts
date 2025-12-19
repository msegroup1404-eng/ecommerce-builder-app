// Step 5: Worker Updates for Revalidation (Optional Incremental Add-On)

// worker/tasks/page-revalidation.ts (new file)
import { getRedisJSON, setRedisJSON } from '../../../packages/shared-utils/cache';
import { mergeTemplateWithPage } from '../../../packages/ui-components/lib/mergeEngine';
import { sha256Hex } from '../../../packages/shared-utils/hash';

// Example task: Triggered by CMS webhook on template/tenant update
export async function revalidatePagesForTenant(tenantId: string) {
  // Fetch affected pages
  const pages = await payload.find({ collection: 'pages', where: { tenant: { equals: tenantId } } }); // Assume payload client in worker

  for (const page of pages.docs) {
    const tenant = await payload.findByID({ collection: 'tenants', id: tenantId });
    const template = await payload.findOne({ collection: 'templates', where: { slug: { equals: tenant.template || tenant.templateVersion } } });

    const merged = mergeTemplateWithPage(template?.snapshot ?? {}, tenant.templateSettings ?? {}, page.snapshot ?? {});

    const pageHashInput = JSON.stringify({
      templateVersion: template?.version ?? template?.updatedAt ?? null,
      merged,
    });
    const pageHash = sha256Hex(pageHashInput);

    // Update page in CMS
    await payload.update({ collection: 'pages', id: page.id, data: { mergedSnapshot: JSON.stringify(merged), pageHash } });

    // Prime cache
    const cacheKey = `tenant:${tenant.slug}:page:${page.handle}`;
    await setRedisJSON(cacheKey, { merged, pageHash, tenant, page }, 3600);
  }
}

// In worker/index.ts or tasks, add webhook listener or cron for this