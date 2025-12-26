import { isSuperAdmin } from '@/access/roles'
import { getCollectionIDType } from '@/utils/getCollectionIDType'
import { getUserTenantIDs } from '@/utils/getUserTanentIDs'
import { getTenantFromCookie } from '@payloadcms/plugin-multi-tenant/utilities'
import { headers as getHeaders } from 'next/headers'
import { Access } from 'payload'

/**
 * Tenant admins and super admins can will be allowed access
 */
export const superAdminOrTenantAdminAccess: Access = async ({ req }) => {
  const headers = await getHeaders()
  const payload = req.payload

  if (!req.user) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  const activeTenantID = getTenantFromCookie(
    headers,
    getCollectionIDType({ collectionSlug: 'tenants', payload }),
  )
  const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin')
  const requestedTenant = +activeTenantID!


  if (requestedTenant && adminTenantAccessIDs.includes(requestedTenant)) {
    return true
  }

  return false
}
