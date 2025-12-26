import { anyone, isSuperAdminAccess } from '@/access/roles'
import { CollectionConfig } from 'payload'
import { afterChange } from './hooks/afterChange'
import { superAdminOrTenantAdminAccess } from './access/superAdminOrTenantAdmin'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    group: 'Design',
    useAsTitle: 'title',
    defaultColumns: ['title', 'handle', 'createdAt', 'updatedAt'],
  },
  access: {
    read: anyone,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          defaultValue: 'New Page',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'handle',
          type: 'text',
          required: true,
          defaultValue: 'new-page',
          access: {
            update: isSuperAdminAccess,
          },
        },
      ],
    },

    {
      name: 'snapshot',
      type: 'json',
      required: true,
      admin: {
        components: {
          Field: '@/collections/Pages/page',
        },
      },
    },
    // computed fields
    { name: 'mergedSnapshot', type: 'json', admin: { readOnly: true } },
    { name: 'pageHash', type: 'text', admin: { readOnly: true } },
  ],
  hooks: {
    afterChange: [ afterChange ]
  }
}
