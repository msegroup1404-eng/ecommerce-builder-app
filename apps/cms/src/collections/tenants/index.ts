import type { CollectionConfig } from 'payload'

import { updateAndDeleteAccess } from './access/updateAndDelete'
import { isSuperAdmin } from '@/access/roles'

export const Tenants: CollectionConfig = {
    slug: 'tenants',
    access: {
        create: isSuperAdmin,
        delete: updateAndDeleteAccess,
        read: ({ req }) => Boolean(req.user),
        update: updateAndDeleteAccess,
    },
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'domain',
            type: 'text',
            admin: {
                description: 'Used for domain-based tenant handling',
            },
        },
        {
            name: 'slug',
            type: 'text',
            admin: {
                description: 'Used for url paths, example: /tenant-slug/page-slug',
            },
            index: true,
            required: true,
        },
        {
            name: 'allowPublicRead',
            type: 'checkbox',
            admin: {
                description:
                    'If checked, logging in is not required to read. Useful for building public pages.',
                position: 'sidebar',
            },
            defaultValue: false,
            index: true,
        },
        { name: 'ownerEmail', type: 'email', required: false },
        { name: 'template', type: 'text', required: false }, // template id selected
        { name: 'templateVersion', type: 'text', required: false },
        { name: 'templateSettings', type: 'json', required: false },
        { name: 'onboardingCompleted', type: 'checkbox', defaultValue: false },
        {
            name: 'owner',
            type: 'relationship',
            relationTo: 'users',
            required: true,
        },
    ],
}