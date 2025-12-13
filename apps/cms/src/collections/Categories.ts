import type { CollectionConfig } from 'payload'
import { groups } from './groups'
import { HandleField } from '@/fields/handle'
import { RichTextEditor } from '@/fields/RichTextEditor/RichTextEditor'
import { SeoField } from '@/fields/seo'
import { admins, anyone } from '@/access/roles'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: admins,
  },
  admin: {
    group: groups.catalog,
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    RichTextEditor({
      name: 'description',
      label: 'Description',
    }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category image for display in shop',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Display this category prominently on the homepage',
      },
    },
    {
      name: 'visible',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show this category in the shop navigation',
      },
    },
    HandleField(),
    {
      name: 'products',
      type: 'join',
      collection: 'products',
      hasMany: true,
      on: 'collections',
      maxDepth: 5,
    },
    SeoField(),
  ],
}
