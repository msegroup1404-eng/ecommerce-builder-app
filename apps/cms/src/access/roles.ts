import type { FieldAccessArgs } from '@/admin/types'
import { User } from '@/payload-types'

import type { Access, AccessArgs } from 'payload'

export const checkRole = (roles: User['roles'] = [], user?: null | User) =>
  !!user?.roles?.some((role) => roles?.includes(role))

type isAdminAccess = (args: AccessArgs<User> | FieldAccessArgs<User> ) => boolean
type isAdmin = (args: User | null ) => boolean

export const adminPluginAccess: Access = ({ req }) => {
  const shopHandle = req.headers.get('x-payload-sdk-token')
  req.user = shopHandle ? JSON.parse(req.payload.decrypt(shopHandle!)) : req.user
  return admins({ req })
}

export const admins: isAdminAccess = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}

export const isSuperAdminAccess: isAdminAccess = ({ req: { user } }) => {
  return checkRole(['super-admin'], user)
}

export const isSuperAdmin: isAdmin = (user) => {
  return checkRole(['super-admin'], user)
}

export const anyone: Access = () => {
  return true
}

export const adminsOrSelf: Access = ({ req: { user } }) => {
  if (user) {
    if (checkRole(['admin'], user)) {
      return true
    }

    return {
      id: {
        equals: user.id,
      },
    }
  }

  return false
}
