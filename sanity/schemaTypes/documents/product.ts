import { defineField, defineType } from 'sanity'
import { ShoppingBag } from 'lucide-react'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: ShoppingBag,
  groups: [
    {
      name: 'basic',
      title: 'Basic Information',
    },
    {
      name: 'details',
      title: 'Details',
    },
    {
      name: 'pricing',
      title: 'Pricing & Availability',
    },
    {
      name: 'promotion',
      title: 'Promotion & Popularity',
    },
    {
      name: 'integrations',
      title: 'External Integrations',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // Basic Information
    defineField({
      name: 'title',
      title: 'Title',
      type: 'autoMultilingualString',
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title',
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
            return 'product'
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
            || 'product'
        }
      },
      validation: (Rule) => Rule.required().error('A slug is required to create a URL for this product'),
      description: 'URL-friendly version of the product title. Click "Generate" button after entering the title above.'
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      group: 'basic',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'basic',
      validation: (Rule) => Rule.required(),
    }),

    // Details
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'autoMultilingualText',
      group: 'details',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'autoMultilingualText',
      group: 'details',
    }),
    defineField({
      name: 'ingredients',
      title: 'Ingredients',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'reference',
          to: [{ type: 'ingredient' }],
        },
      ],
      description: 'List of ingredients that can be customized by the customer',
    }),
    defineField({
      name: 'extras',
      title: 'Available Extras',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'extra',
              title: 'Extra',
              type: 'reference',
              to: [{ type: 'productExtra' }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'price',
              title: 'Additional Price',
              type: 'number',
              validation: (Rule) => Rule.required().min(0).precision(2),
            },
          ],
          preview: {
            select: {
              title: 'extra.name',
              price: 'price',
            },
            prepare(selection) {
              const { title, price } = selection
              return {
                title: title || 'Extra',
                subtitle: price ? `+${price.toFixed(2)}€` : 'No price',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'preparationTime',
      title: 'Preparation Time (minutes)',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().min(1).integer(),
      description: 'Estimated preparation time in minutes',
    }),

    // Pricing & Availability
    defineField({
      name: 'price',
      title: 'Base Price',
      type: 'number',
      group: 'pricing',
      validation: (Rule) => Rule.required().min(0).precision(2),
    }),
    defineField({
      name: 'isAvailable',
      title: 'Available',
      type: 'boolean',
      group: 'pricing',
      initialValue: true,
    }),
    defineField({
      name: 'stockQuantity',
      title: 'Stock Quantity',
      type: 'number',
      group: 'pricing',
      description: 'Leave empty for unlimited stock',
      validation: (Rule) => Rule.min(0).integer(),
    }),

    // Promotion & Popularity
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      group: 'promotion',
      initialValue: false,
      description: 'Mark this product as featured on the homepage',
    }),
    defineField({
      name: 'isPopular',
      title: 'Popular Product',
      type: 'boolean',
      group: 'promotion',
      initialValue: false,
      description: 'Mark this product as popular/best-seller',
    }),
    defineField({
      name: 'isTrending',
      title: 'Trending Product',
      type: 'boolean',
      group: 'promotion',
      initialValue: false,
      description: 'Mark this product as currently trending',
    }),
    defineField({
      name: 'promotionBadge',
      title: 'Promotion Badge',
      type: 'object',
      group: 'promotion',
      fields: [
        {
          name: 'text',
          title: 'Badge Text',
          type: 'autoMultilingualString',
          description: 'Custom text for the promotion badge (e.g., "Nouveau", "Promo", "Chef\'s Choice")',
        },
        {
          name: 'color',
          title: 'Badge Color',
          type: 'string',
          options: {
            list: [
              { title: 'Default', value: 'default' },
              { title: 'Primary', value: 'primary' },
              { title: 'Secondary', value: 'secondary' },
              { title: 'Success', value: 'success' },
              { title: 'Warning', value: 'warning' },
              { title: 'Destructive', value: 'destructive' },
            ],
          },
          initialValue: 'primary',
        },
        {
          name: 'isVisible',
          title: 'Show Badge',
          type: 'boolean',
          initialValue: false,
        },
      ],
      description: 'Custom promotion badge for this product',
    }),
    defineField({
      name: 'popularityScore',
      title: 'Popularity Score',
      type: 'number',
      group: 'promotion',
      validation: (Rule) => Rule.min(0).max(100).integer(),
      description: 'Manual popularity score (0-100) for sorting popular products',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      group: 'promotion',
      initialValue: 0,
      validation: (Rule) => Rule.integer(),
      description: 'Order in which featured/popular products appear (lower numbers appear first)',
    }),

    // External Integrations
    defineField({
      name: 'uberEatsId',
      title: 'Uber Eats Product ID',
      type: 'string',
      group: 'integrations',
      description: 'Product ID from Uber Eats platform',
    }),
    defineField({
      name: 'deliverooId',
      title: 'Deliveroo Product ID',
      type: 'string',
      group: 'integrations',
      description: 'Product ID from Deliveroo platform',
    }),
    defineField({
      name: 'externalData',
      title: 'External Platform Data',
      type: 'object',
      group: 'integrations',
      fields: [
        {
          name: 'uberEatsData',
          title: 'Uber Eats Data',
          type: 'object',
          fields: [
            {
              name: 'isActive',
              title: 'Active on Uber Eats',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'lastSync',
              title: 'Last Sync',
              type: 'datetime',
              readOnly: true,
            },
          ],
        },
        {
          name: 'deliverooData',
          title: 'Deliveroo Data',
          type: 'object',
          fields: [
            {
              name: 'isActive',
              title: 'Active on Deliveroo',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'lastSync',
              title: 'Last Sync',
              type: 'datetime',
              readOnly: true,
            },
          ],
        },
      ],
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'autoMultilingualString',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'autoMultilingualText',
      group: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.name',
      media: 'image',
      price: 'price',
      isAvailable: 'isAvailable',
      isFeatured: 'isFeatured',
      isPopular: 'isPopular',
      isTrending: 'isTrending',
    },
    prepare(selection) {
      const { title, subtitle, media, price, isAvailable, isFeatured, isPopular, isTrending } = selection
      const badges = []
      if (isFeatured) badges.push('⭐ Featured')
      if (isPopular) badges.push('🔥 Popular')
      if (isTrending) badges.push('📈 Trending')
      
      const badgeText = badges.length > 0 ? ` | ${badges.join(' ')}` : ''
      
      return {
        title: title || 'Untitled Product',
        subtitle: `${subtitle || 'No category'} - ${price ? `${price.toFixed(2)}€` : 'No price'}${!isAvailable ? ' (Unavailable)' : ''}${badgeText}`,
        media,
      }
    },
  },
})