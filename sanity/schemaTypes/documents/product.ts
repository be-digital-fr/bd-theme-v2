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
      name: 'modifierGroups',
      title: 'Modifier Groups',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'group',
              title: 'Modifier Group',
              type: 'reference',
              to: [{ type: 'modifierGroup' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              initialValue: 0,
              description: 'Order in which this group appears in customization',
            }),
            defineField({
              name: 'isRequired',
              title: 'Required Selection',
              type: 'boolean',
              initialValue: false,
              description: 'Customer must make a selection from this group',
            }),
            defineField({
              name: 'isVisible',
              title: 'Visible to Customer',
              type: 'boolean',
              initialValue: true,
              description: 'Show this modifier group in product customization',
            }),
          ],
          preview: {
            select: {
              title: 'group.name',
              type: 'group.type',
              displayOrder: 'displayOrder',
              isRequired: 'isRequired',
              isVisible: 'isVisible',
            },
            prepare(selection) {
              const { title, type, displayOrder, isRequired, isVisible } = selection
              const typeLabels: { [key: string]: string } = {
                'add-ingredient': '➕',
                'remove-ingredient': '➖',
                'size': '📏',
                'cooking-instruction': '👨‍🍳',
                'up-sell': '⬆️',
                'choice-required': '✅',
                'optional-addons': '🔧',
              }
              
              const badge = typeLabels[type] || '⚙️'
              const flags = []
              if (isRequired) flags.push('Required')
              if (!isVisible) flags.push('Hidden')
              
              return {
                title: `${badge} ${title || 'Unnamed Group'}`,
                subtitle: `Order: ${displayOrder || 0}${flags.length ? ` • ${flags.join(', ')}` : ''}`,
              }
            },
          },
        },
      ],
      description: 'Customization options available for this product (sizes, add-ons, cooking instructions, etc.)',
    }),
    defineField({
      name: 'preparationTime',
      title: 'Preparation Time (minutes)',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.required().min(1).integer(),
      description: 'Estimated preparation time in minutes',
    }),
    // Product identification codes for POS and external platforms
    defineField({
      name: 'plu',
      title: 'PLU (Product Lookup Unit)',
      type: 'string',
      group: 'details',
      description: 'Internal product lookup code for POS systems',
    }),
    defineField({
      name: 'barcodes',
      title: 'Barcodes',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'details',
      validation: (Rule) => Rule.max(10),
      description: 'Product barcodes (max 10)',
    }),
    defineField({
      name: 'containsAlcohol',
      title: 'Contains Alcohol',
      type: 'boolean',
      group: 'details',
      initialValue: false,
      description: 'Whether this product contains alcohol',
    }),

    // Pricing & Availability
    defineField({
      name: 'price',
      title: 'Base Price',
      type: 'number',
      group: 'pricing',
      validation: (Rule) => Rule.required().min(0).precision(2),
      description: 'Standard price for this product',
    }),
    defineField({
      name: 'priceOverrides',
      title: 'Price Overrides',
      type: 'array',
      group: 'pricing',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'context',
              title: 'Context',
              type: 'string',
              options: {
                list: [
                  { title: 'Pickup Order', value: 'pickup' },
                  { title: 'Delivery Order', value: 'delivery' },
                  { title: 'Dine In', value: 'dine-in' },
                  { title: 'As Modifier/Add-on', value: 'modifier' },
                  { title: 'Happy Hour', value: 'happy-hour' },
                  { title: 'Lunch Special', value: 'lunch-special' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Override Price',
              type: 'number',
              validation: (Rule) => Rule.required().min(0).precision(2),
            }),
            defineField({
              name: 'isActive',
              title: 'Active',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'validFrom',
              title: 'Valid From',
              type: 'datetime',
              description: 'When this price override becomes active',
            }),
            defineField({
              name: 'validUntil',
              title: 'Valid Until',
              type: 'datetime',
              description: 'When this price override expires',
            }),
          ],
          preview: {
            select: {
              context: 'context',
              price: 'price',
              isActive: 'isActive',
            },
            prepare(selection) {
              const { context, price, isActive } = selection
              const contextLabels: { [key: string]: string } = {
                'pickup': '🚶 Pickup',
                'delivery': '🚚 Delivery',
                'dine-in': '🍽️ Dine In',
                'modifier': '➕ As Modifier',
                'happy-hour': '🍻 Happy Hour',
                'lunch-special': '🍽️ Lunch Special',
              }
              
              return {
                title: `${contextLabels[context] || context}: €${price?.toFixed(2) || '0.00'}`,
                subtitle: isActive ? 'Active' : 'Inactive',
              }
            },
          },
        },
      ],
      description: 'Different prices for different contexts (pickup, delivery, as modifier, etc.)',
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
    defineField({
      name: 'suspensionInfo',
      title: 'Suspension Information',
      type: 'object',
      group: 'pricing',
      fields: [
        defineField({
          name: 'isSuspended',
          title: 'Temporarily Suspended',
          type: 'boolean',
          initialValue: false,
          description: 'Temporarily suspend this product from ordering',
        }),
        defineField({
          name: 'suspendedUntil',
          title: 'Suspended Until',
          type: 'datetime',
          description: 'Automatically resume availability at this time',
          hidden: ({ parent }) => !parent?.isSuspended,
        }),
        defineField({
          name: 'reason',
          title: 'Suspension Reason',
          type: 'autoMultilingualString',
          description: 'Message to display to customers about why product is unavailable',
          hidden: ({ parent }) => !parent?.isSuspended,
        }),
        defineField({
          name: 'hiddenFromMenu',
          title: 'Hide from Menu',
          type: 'boolean',
          initialValue: false,
          description: 'Hide completely from menu (vs showing as unavailable)',
          hidden: ({ parent }) => !parent?.isSuspended,
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'availabilitySchedule',
      title: 'Availability Schedule',
      type: 'array',
      group: 'pricing',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'dayOfWeek',
              title: 'Day of Week',
              type: 'string',
              options: {
                list: [
                  { title: 'Monday', value: 'monday' },
                  { title: 'Tuesday', value: 'tuesday' },
                  { title: 'Wednesday', value: 'wednesday' },
                  { title: 'Thursday', value: 'thursday' },
                  { title: 'Friday', value: 'friday' },
                  { title: 'Saturday', value: 'saturday' },
                  { title: 'Sunday', value: 'sunday' },
                  { title: 'All Days', value: 'all' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'startTime',
              title: 'Available From',
              type: 'string',
              validation: (Rule) => Rule.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
                name: 'time',
                invert: false,
              }).error('Time must be in HH:MM format (e.g., 09:30)'),
              placeholder: '09:00',
            }),
            defineField({
              name: 'endTime',
              title: 'Available Until',
              type: 'string',
              validation: (Rule) => Rule.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
                name: 'time',
                invert: false,
              }).error('Time must be in HH:MM format (e.g., 22:30)'),
              placeholder: '22:00',
            }),
            defineField({
              name: 'isActive',
              title: 'Active Schedule',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              day: 'dayOfWeek',
              startTime: 'startTime',
              endTime: 'endTime',
              isActive: 'isActive',
            },
            prepare(selection) {
              const { day, startTime, endTime, isActive } = selection
              const dayLabels: { [key: string]: string } = {
                'monday': 'Mon',
                'tuesday': 'Tue',
                'wednesday': 'Wed',
                'thursday': 'Thu',
                'friday': 'Fri',
                'saturday': 'Sat',
                'sunday': 'Sun',
                'all': 'All Days',
              }
              
              const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : 'No time set'
              
              return {
                title: `${dayLabels[day] || day}: ${timeRange}`,
                subtitle: isActive ? 'Active' : 'Inactive',
              }
            },
          },
        },
      ],
      description: 'Specific hours when this product is available for ordering',
      options: {
        collapsible: true,
        collapsed: true,
      },
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