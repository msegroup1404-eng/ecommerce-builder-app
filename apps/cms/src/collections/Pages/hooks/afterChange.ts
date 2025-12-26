import { Page } from "@/payload-types";
import { CollectionAfterChangeHook } from "payload";
import { mergeTemplateWithPage } from "../../../../../../packages/ui/src/utils/mergeEngine"
import { sha256Hex } from '@repo/shared-utils/hash'
import { setRedisJSON } from '@repo/shared-utils/redis'

export const afterChange: CollectionAfterChangeHook<Page> = async ({ req, doc, operation }) => {
    // if (operation === 'create' || operation === 'update') {
    //     try {
    //         // must be change to current tenant selected
    //         const tenant = await req.payload.findByID({ collection: 'tenants', id: typeof doc.tenant === 'object' ? doc.tenant?.id : doc.tenant });
    //         const templateQuery = await req.payload.find({ collection: 'templates', where: { slug: { equals: tenant.template || tenant.templateVersion } } });
    //         const template = templateQuery.docs[0];
    //         const baseTemplate = template ? template.snapshot : {}; // Use template.snapshot as base
    //         const tenantOverrides = tenant.templateSettings || {}; // Use templateSettings as overrides
    //         const pageOverrides = doc.snapshot || {}; // Use page.snapshot as overrides

    //         const merged = mergeTemplateWithPage(baseTemplate, tenantOverrides, pageOverrides);
    //         // only for suppressing error in payload generate types that cannot reach mergeTemplateWithPage
    //         // let merged = {}

    //         const pageHashInput = JSON.stringify({
    //             templateVersion: template?.version ?? template?.updatedAt ?? null,
    //             merged,
    //             // productId: doc.productId ?? null, // If linked to products
    //         });
    //         const pageHash = sha256Hex(pageHashInput);

    //         // Update doc with computed fields
    //         await req.payload.update({
    //             collection: 'pages',
    //             id: doc.id,
    //             data: { mergedSnapshot: JSON.stringify(merged), pageHash },
    //         });

    //         // Prime Redis cache (async, best-effort)
    //         const cacheKey = `tenant:${tenant.slug}:page:${doc.handle}`;
    //         await setRedisJSON(cacheKey, { merged, pageHash, template, tenant, page: doc }, 3600); // 1hr TTL
    //     } catch (err) {
    //         console.error('Page merge/hash failed:', err);
    //         // Optional: Throw to fail save, or continue
    //     }
    // }
}