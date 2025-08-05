import { defineField, defineType } from 'sanity'
import { Tag } from 'lucide-react'

export default defineType({
  name: 'category',
  title: 'Product Category',
  type: 'document',
  icon: Tag,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'autoMultilingualString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input: any) => {
          // Handle different input types
          let text = ''
          
          if (typeof input === 'string') {
            text = input
          } else if (input && typeof input === 'object') {
            // For multilingual fields, try to extract text
            text = input.fr || input.en || input[Object.keys(input)[0]] || ''
          }
          
          // If still no text, return default
          if (!text || typeof text !== 'string') {
            return 'category'
          }
          
          // Slugify the text
          return text
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '')    // Keep only alphanumeric, spaces, and hyphens
            .replace(/\s+/g, '-')            // Replace spaces with hyphens
            .replace(/-+/g, '-')             // Replace multiple hyphens with single
            .replace(/^-+|-+$/g, '')         // Remove leading/trailing hyphens
            || 'category'
        }
      },
      validation: (Rule) => Rule.required().error('A slug is required to create a URL for this category'),
      description: 'URL-friendly version of the category name. Click "Generate" button after entering the name above.'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'autoMultilingualText',
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'autoMultilingualString',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.required().integer(),
      description: 'Order in which categories appear in menus (lower numbers appear first)',
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this category is visible to customers',
    }),
    defineField({
      name: 'parent',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Optional parent category for hierarchical organization',
      options: {
        filter: ({ document }) => {
          // Prevent circular references
          return {
            filter: '_id != $id',
            params: { id: document._id },
          }
        },
      },
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'parent.name',
      media: 'image',
      isActive: 'isActive',
      order: 'displayOrder',
    },
    prepare(selection) {
      const { title, subtitle, media, isActive, order } = selection
      return {
        title: title || 'Untitled Category',
        subtitle: `${subtitle ? `Parent: ${subtitle} | ` : ''}Order: ${order || 0}${!isActive ? ' (Inactive)' : ''}`,
        media,
      }
    },
  },
})