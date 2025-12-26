import { isSuperAdmin } from '@/access/roles'
import { User } from '@/payload-types'
import type { CollectionAfterLoginHook } from 'payload'

import { mergeHeaders, generateCookie, getCookieExpiration } from 'payload'

export const setCookieBasedOnDomain: CollectionAfterLoginHook<User> = async ({ req, user }) => {
  const selectedTenantID = user.tenants?.[0]?.id

  if (!selectedTenantID || isSuperAdmin(user)) {
    return user
  }

  // const relatedOrg = await req.payload.find({
  //   collection: 'tenants',
  //   depth: 0,
  //   limit: 1,
  //   where: {
  //     domain: {
  //       // equals: req.headers.get('host'),
  //       equals: selectedTenantID
  //     },
  //   },
  // })

  // If a matching tenant is found, set the 'payload-tenant' cookie
  // if (relatedOrg && relatedOrg.docs.length > 0) {
  const tenantCookie = generateCookie({
    name: 'payload-tenant',
    expires: getCookieExpiration({ seconds: 7200 }),
    path: '/',
    returnCookieAsObject: false,
    value: String(selectedTenantID),
  })
  // Merge existing responseHeaders with the new Set-Cookie header
  const newHeaders = new Headers({
    'Set-Cookie': tenantCookie as string,
  })

  // Ensure you merge existing response headers if they already exist
  req.responseHeaders = req.responseHeaders
    ? mergeHeaders(req.responseHeaders, newHeaders)
    : newHeaders

  return user
}