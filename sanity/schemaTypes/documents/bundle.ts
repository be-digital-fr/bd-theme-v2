import { defineField, defineType } from 'sanity'
import { Package } from 'lucide-react'

export default defineType({
  name: 'bundle',
  title: 'Bundle/Combo',
  type: 'document',
  icon: Package,
  groups: [
    {
      name: 'basic',
      title: '🏷️ Basic Information',
      default: true,
    },
    {
      name: 'items',
      title: '🛒 Bundle Items',
    },
    {
      name: 'pricing',
      title: '💰 Pricing & Savings',
    },
    {
      name: 'availability',
      title: '⏰ Availability',
    },
    {
      name: 'promotion',
      title: '⭐ Promotions',
    },
    {
      name: 'integration',
      title: '🔄 External Platforms',
    },
    {
      name: 'metadata',
      title: '📅 Metadata',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Bundle Name',
      type: 'autoMultilingualString',
      group: 'basic',
      validation: (Rule) => Rule.required(),
      description: 'Name of the bundle/combo (e.g., "Big Mac Menu", "Pizza + Drink Combo")',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input: any) => {
          let text = ''
          
          if (typeof input === 'string') {
            text = input
          } else if (input && typeof input === 'object') {
            text = input.fr || input.en || input[Object.keys(input)[0]] || ''
          }
          
          if (!text || typeof text !== 'string') {
            return 'bundle'
          }
          
          return text
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '')
            || 'bundle'
        }
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '📝 Description',
      type: 'autoMultilingualText',
      group: 'basic',
      description: 'Description of what the bundle includes and any special offers',
    }),
    defineField({
      name: 'image',
      title: '🖼️ Bundle Image',
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
    }),
    defineField({
      name: 'bundledItems',
      title: '📦 Bundled Items',
      type: 'array',
      group: 'items',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{ type: 'product' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              initialValue: 1,
              validation: (Rule) => Rule.min(1).integer(),
            }),
            defineField({
              name: 'isCustomizable',
              title: 'Allow Customization',
              type: 'boolean',
              initialValue: false,
              description: 'Allow customer to customize this item in the bundle',
            }),
            defineField({
              name: 'allowedModifierGroups',
              title: 'Allowed Modifier Groups',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'modifierGroup' }] }],
              description: 'Which modifier groups are available for this item in the bundle',
              hidden: ({ parent }) => !parent?.isCustomizable,
            }),
            defineField({
              name: 'isOptional',
              title: 'Optional Item',
              type: 'boolean',
              initialValue: false,
              description: 'Customer can choose to exclude this item from the bundle',
            }),
            defineField({
              name: 'replacementOptions',
              title: 'Replacement Options',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'product' }] }],
              description: 'Alternative products customer can choose instead',
            }),
            defineField({
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              initialValue: 0,
            }),
          ],
          preview: {
            select: {
              title: 'product.title',
              quantity: 'quantity',
              isCustomizable: 'isCustomizable',
              isOptional: 'isOptional',
            },
            prepare(selection) {
              const { title, quantity, isCustomizable, isOptional } = selection
              const badges = []
              if (isCustomizable) badges.push('Customizable')
              if (isOptional) badges.push('Optional')
              
              return {
                title: `${quantity}x ${title || 'Unnamed Product'}`,
                subtitle: badges.length ? badges.join(', ') : 'Fixed item',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(2).error('A bundle must contain at least 2 items'),
    }),
    defineField({
      name: 'pricing',
      title: '💵 Bundle Pricing',
      type: 'object',
      group: 'pricing',
      fields: [
        defineField({
          name: 'bundlePrice',
          title: 'Bundle Price',
          type: 'number',
          validation: (Rule) => Rule.min(0).precision(2),
          description: 'Total price for the entire bundle',
        }),
        defineField({
          name: 'savingsAmount',
          title: 'Savings Amount',
          type: 'number',
          validation: (Rule) => Rule.min(0).precision(2),
          description: 'How much customers save compared to buying items separately',
        }),
        defineField({
          name: 'priceOverrides',
          title: 'Price Overrides',
          type: 'array',
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
                      { title: 'Pickup', value: 'pickup' },
                      { title: 'Delivery', value: 'delivery' },
                      { title: 'Dine In', value: 'dine-in' },
                    ],
                  },
                }),
                defineField({
                  name: 'price',
                  title: 'Override Price',
                  type: 'number',
                  validation: (Rule) => Rule.min(0).precision(2),
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'category',
      title: '📋 Category',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'category' }],
      description: 'Category this bundle belongs to',
    }),
    defineField({
      name: 'availability',
      title: '🕒 Availability Settings',
      type: 'object',
      group: 'availability',
      fields: [
        defineField({
          name: 'isAvailable',
          title: 'Available',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'availabilitySchedule',
          title: 'Availability Schedule',
          type: 'array',
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
                    ],
                  },
                }),
                defineField({
                  name: 'startTime',
                  title: 'Start Time',
                  type: 'string',
                  validation: (Rule) => Rule.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
                    name: 'time',
                    invert: false,
                  }).error('Time must be in HH:MM format'),
                }),
                defineField({
                  name: 'endTime',
                  title: 'End Time',
                  type: 'string',
                  validation: (Rule) => Rule.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
                    name: 'time',
                    invert: false,
                  }).error('Time must be in HH:MM format'),
                }),
              ],
            },
          ],
        }),
        defineField({
          name: 'suspensionInfo',
          title: 'Suspension Information',
          type: 'object',
          fields: [
            defineField({
              name: 'isSuspended',
              title: 'Suspended',
              type: 'boolean',
              initialValue: false,
            }),
            defineField({
              name: 'suspendedUntil',
              title: 'Suspended Until',
              type: 'datetime',
              hidden: ({ parent }) => !parent?.isSuspended,
            }),
            defineField({
              name: 'reason',
              title: 'Suspension Reason',
              type: 'autoMultilingualString',
              hidden: ({ parent }) => !parent?.isSuspended,
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'promotions',
      title: '🏅 Promotions & Marketing',
      type: 'object',
      group: 'promotion',
      fields: [
        defineField({
          name: 'isFeatured',
          title: 'Featured Bundle',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'isLimitedTime',
          title: 'Limited Time Offer',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'validUntil',
          title: 'Valid Until',
          type: 'datetime',
          hidden: ({ parent }) => !parent?.isLimitedTime,
        }),
        defineField({
          name: 'promotionBadge',
          title: 'Promotion Badge',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Badge Text',
              type: 'autoMultilingualString',
            }),
            defineField({
              name: 'color',
              title: 'Badge Color',
              type: 'string',
              options: {
                list: [
                  { title: 'Red', value: 'red' },
                  { title: 'Orange', value: 'orange' },
                  { title: 'Yellow', value: 'yellow' },
                  { title: 'Green', value: 'green' },
                  { title: 'Blue', value: 'blue' },
                  { title: 'Purple', value: 'purple' },
                ],
              },
            }),
          ],
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    // Integration fields for external platforms
    defineField({
      name: 'externalIds',
      title: '🆔 External Platform IDs',
      type: 'object',
      group: 'integration',
      fields: [
        defineField({
          name: 'uberEatsId',
          title: 'Uber Eats Bundle ID',
          type: 'string',
        }),
        defineField({
          name: 'deliverooId',
          title: 'Deliveroo Bundle ID',
          type: 'string',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'displayOrder',
      title: '🔢 Display Order',
      type: 'number',
      group: 'basic',
      initialValue: 0,
      validation: (Rule) => Rule.integer(),
      description: 'Order in which this bundle appears (lower numbers appear first)',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      group: 'metadata',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      group: 'metadata',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      bundlePrice: 'pricing.bundlePrice',
      savingsAmount: 'pricing.savingsAmount',
      isAvailable: 'availability.isAvailable',
      isFeatured: 'promotions.isFeatured',
      media: 'image',
    },
    prepare(selection) {
      const { title, bundlePrice, savingsAmount, isAvailable, isFeatured, media } = selection
      
      const price = bundlePrice ? `€${bundlePrice.toFixed(2)}` : 'No price set'
      const savings = savingsAmount ? ` (Save €${savingsAmount.toFixed(2)})` : ''
      const badges = []
      
      if (isFeatured) badges.push('Featured')
      if (!isAvailable) badges.push('Unavailable')
      
      return {
        title: title || 'Unnamed Bundle',
        subtitle: `${price}${savings}${badges.length ? ` • ${badges.join(', ')}` : ''}`,
        media,
      }
    },
  },
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
    {
      title: 'Price',
      name: 'priceAsc',
      by: [{ field: 'pricing.bundlePrice', direction: 'asc' }],
    },
  ],
})