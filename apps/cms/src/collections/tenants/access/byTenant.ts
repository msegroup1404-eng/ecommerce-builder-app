import { isSuperAdmin } from '@/access/roles'
import { Tenant } from '@/payload-types'
import type { Access } from 'payload'


export const filterByTenantRead: Access = (args) => {
  // Allow public tenants to be read by anyone
  if (!args.req.user) {
    return {
      allowPublicRead: {
        equals: true,
      },
    }
  }

  return true
}

export const canMutateTenant: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isSuperAdmin({ req })) {
    return true
  }

  return {
    id: {
      in:
        req.user?.tenants
          ?.map(({ roles, tenant }) =>
            roles?.includes('tenant-admin')
              ? tenant && (typeof tenant === 'string' ? tenant : (tenant as Tenant).id)
              : null,
          )
          .filter(Boolean) || [],
    },
  }
}