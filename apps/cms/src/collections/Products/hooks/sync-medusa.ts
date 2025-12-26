// /**
//  * -------------------------
//  * Medusa API helpers
//  * -------------------------
//  */

// import { Product } from '@/payload-types'

// /** Read required env vars */
// const MEDUSA_ADMIN_URL = process.env.MEDUSA_ADMIN_URL || 'http://localhost:9000'
// const MEDUSA_ADMIN_TOKEN = process.env.MEDUSA_ADMIN_TOKEN || ''

// if (!MEDUSA_ADMIN_TOKEN) {
//   // In production you'd probably want to throw or warn more explicitly.
//   // We keep this note so you know where the token comes from.
//   // (We don't throw at module load to keep dev-time flexibility.)
//   // eslint-disable-next-line no-console
//   console.warn(
//     '[medusa-sync] MEDUSA_ADMIN_TOKEN is not set. Hooks will fail until you set this env var.',
//   )
// }

// /** low-level request to Medusa Admin API */
// async function medusaRequest(method: 'POST' | 'GET' | 'PUT' | 'PATCH', path: string, body?: any) {
//   const url = `${MEDUSA_ADMIN_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//   }

//   // Prefer Bearer auth for admin token (Medusa supports JWT/Bearer or API token methods).
//   if (MEDUSA_ADMIN_TOKEN) {
//     headers['Authorization'] = `Bearer ${MEDUSA_ADMIN_TOKEN}`
//   }

//   const res = await fetch(url, {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : undefined,
//   })

//   const text = await res.text()
//   let json: any = null
//   try {
//     json = text ? JSON.parse(text) : null
//   } catch (e) {
//     // not JSON
//     json = text
//   }

//   if (!res.ok) {
//     // throw a helpful error containing Medusa's response if available
//     const message = typeof json === 'object' ? JSON.stringify(json) : String(json || res.statusText)
//     const err = new Error(`[medusa-sync] ${method} ${url} failed: ${res.status} ${message}`)
//     // @ts-ignore - attach fields for callers
//     err.status = res.status
//     // @ts-ignore
//     err.response = json
//     throw err
//   }

//   return json
// }

// /** Create product in Medusa (POST /admin/products).
//  *  Accepts a body shaped like Medusa's AdminPostProductsReq.
//  */
// async function medusaCreateProduct(payloadBody: any) {
//   // endpoint: POST /admin/products
//   // Medusa responds with { product: {...} } or the created product object depending on version/SDK.
//   const json = await medusaRequest('POST', '/admin/products', payloadBody)
//   return json
// }

// /** Update product in Medusa (POST /admin/products/{id})
//  *  Note: Medusa uses POST for update in the Admin API (see docs). Use the product id from medusa.
//  */
// async function medusaUpdateProduct(medusaId: string, payloadBody: any) {
//   // endpoint: POST /admin/products/{id}
//   const json = await medusaRequest('POST', `/admin/products/${medusaId}`, payloadBody)
//   return json
// }

// /**
//  * -------------------------
//  * Mapping helpers (Payload -> Medusa)
//  * -------------------------
//  *
//  * Extend these mappers if you want more fields (collections, types, shipping_profile_id, etc.)
//  */

// /** Map a Payload product document to a Medusa Admin create/update request body */
// function mapPayloadDocToMedusaBody(doc: Product) {
//   // Minimal, safe shape built from fields defined in the collection below.
//   // - title (required)
//   // - description
//   // - handle
//   // - images (array of urls)
//   // - thumbnail (single url)
//   // - is_giftcard, discountable
//   // - options: array [{ title, values }]
//   // - variants: array [{ title, sku, manage_inventory, prices: [{ currency_code, amount }] }]
//   const medusaBody: any = {
//     title: doc.title,
//     // subtitle: doc.subtitle || undefined,
//     description: doc.description || undefined,
//     // is_giftcard: !!doc.is_giftcard,
//     is_giftcard: false,
//     // discountable: doc.discountable === undefined ? true : !!doc.discountable,
//     discountable: true,
//     handle: doc.handle || undefined,
//     images: Array.isArray(doc.images) ? doc.images.map((i: any) => i?.url || i) : undefined,
//     thumbnail: doc.thumbnail?.url || doc.thumbnail || undefined,
//     // metadata: doc.metadata || undefined,
//   }

//   // options: Payload stores options as { title, values: string[] }
//   if (Array.isArray(doc.options) && doc.options.length > 0) {
//     medusaBody.options = doc.options.map((o: any) => ({
//       title: o.title,
//       values: Array.isArray(o.values) ? o.values : [],
//     }))
//   }

//   // variants mapping
//   if (Array.isArray(doc.variants) && doc.variants.length > 0) {
//     medusaBody.variants = doc.variants.map((v: any) => {
//       const variant: any = {
//         title: v.title || doc.title || 'Default Variant',
//         sku: v.sku || undefined,
//         manage_inventory: typeof v.manage_inventory === 'boolean' ? v.manage_inventory : false,
//         allow_backorder: !!v.allow_backorder,
//         // Map prices array to medusa price objects: { amount, currency_code }
//         prices:
//           Array.isArray(v.prices) && v.prices.length > 0
//             ? v.prices.map((p: any) => ({
//                 amount: Number(p.amount) || 0,
//                 currency_code: (p.currency_code || 'usd').toLowerCase(),
//               }))
//             : [],
//         options: v.options || undefined, // when options exist, medusa expects { OptionTitle: "value" } shape in some flows
//       }

//       // Option values may be provided as { OptionName: "value" } or array; leave as-is if provided.
//       return variant
//     })
//   } else {
//     // If no variants were provided, create a default variant so Medusa has at least one saleable variant.
//     medusaBody.options = medusaBody.options || [{ title: 'Default', values: ['default'] }]
//     medusaBody.variants = [
//       {
//         title: doc.title || 'Default Variant',
//         manage_inventory: false,
//         prices:
//           doc.price !== undefined
//             ? [
//                 {
//                   amount: Number(doc.price) || 0,
//                   currency_code: (doc.currency_code || 'usd').toLowerCase(),
//                 },
//               ]
//             : [],
//         options: { Default: 'default' },
//       },
//     ]
//   }

//   return medusaBody
// }
