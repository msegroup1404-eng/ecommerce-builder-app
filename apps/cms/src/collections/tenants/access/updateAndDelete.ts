import { isSuperAdmin } from '@/access/roles'
import { getUserTenantIDs } from '@/utils/getUserTanentIDs'
import { Access } from 'payload'

export const updateAndDeleteAccess: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isSuperAdmin({ req })) {
    return true
  }

  return {
    id: {
      in: getUserTenantIDs(req.user, 'tenant-admin'),
    },
  }
}