import { defineField, defineType } from 'sanity'
import { Settings } from 'lucide-react'

export default defineType({
  name: 'modifierGroup',
  title: 'Modifier Group',
  type: 'document',
  icon: Settings,
  groups: [
    {
      name: 'basic',
      title: '🏷️ Basic Information',
      default: true,
    },
    {
      name: 'rules',
      title: '📋 Selection Rules',
    },
    {
      name: 'items',
      title: '🔧 Modifier Items',
    },
    {
      name: 'integration',
      title: '🔄 External Integration',
    },
    {
      name: 'metadata',
      title: '📅 Metadata',
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Group Name',
      type: 'autoMultilingualString',
      group: 'basic',
      validation: (Rule) => Rule.required(),
      description: 'Name of the modifier group (e.g., "Size", "Add Ingredients", "Cooking Instructions")',
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
            return 'modifier-group'
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
            || 'modifier-group'
        }
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Modifier Type',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: 'Add Ingredient', value: 'add-ingredient' },
          { title: 'Remove Ingredient', value: 'remove-ingredient' },
          { title: 'Size Selection', value: 'size' },
          { title: 'Cooking Instruction', value: 'cooking-instruction' },
          { title: 'Up-sell Items', value: 'up-sell' },
          { title: 'Choice Required', value: 'choice-required' },
          { title: 'Optional Add-ons', value: 'optional-addons' },
        ],
      },
      validation: (Rule) => Rule.required(),
      description: 'Type of modification this group represents',
    }),
    defineField({
      name: 'displayOrder',
      title: '🔢 Display Order',
      type: 'number',
      group: 'basic',
      initialValue: 0,
      validation: (Rule) => Rule.integer(),
      description: 'Order in which this group appears in the product customization (lower numbers appear first)',
    }),
    defineField({
      name: 'selectionRules',
      title: '📋 Selection Rules',
      type: 'object',
      group: 'rules',
      fields: [
        defineField({
          name: 'minSelection',
          title: 'Minimum Selection',
          type: 'number',
          initialValue: 0,
          validation: (Rule) => Rule.min(0).integer(),
          description: 'Minimum number of options user must select',
        }),
        defineField({
          name: 'maxSelection',
          title: 'Maximum Selection',
          type: 'number',
          validation: (Rule) => Rule.min(1).integer(),
          description: 'Maximum number of options user can select (leave empty for unlimited)',
        }),
        defineField({
          name: 'isRepeatable',
          title: 'Allow Repeated Selection',
          type: 'boolean',
          initialValue: false,
          description: 'Allow users to select the same option multiple times',
        }),
      ],
    }),
    defineField({
      name: 'modifierItems',
      title: '🍴 Modifier Options',
      type: 'array',
      group: 'items',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'item',
              title: 'Item',
              type: 'reference',
              to: [{ type: 'productExtra' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'displayOrder',
              title: 'Display Order',
              type: 'number',
              initialValue: 0,
            }),
            defineField({
              name: 'isDefault',
              title: 'Default Selection',
              type: 'boolean',
              initialValue: false,
              description: 'Pre-select this option by default',
            }),
            defineField({
              name: 'maxQuantity',
              title: 'Max Quantity for this Item',
              type: 'number',
              validation: (Rule) => Rule.min(1).integer(),
              description: 'Override global max for this specific item',
            }),
          ],
          preview: {
            select: {
              title: 'item.name',
              order: 'displayOrder',
              isDefault: 'isDefault',
            },
            prepare(selection) {
              const { title, order, isDefault } = selection
              return {
                title: title || 'Unnamed item',
                subtitle: `Order: ${order || 0}${isDefault ? ' (Default)' : ''}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one modifier option is required'),
    }),
    defineField({
      name: 'isActive',
      title: '✅ Active',
      type: 'boolean',
      group: 'basic',
      initialValue: true,
      description: 'Whether this modifier group is available for selection',
    }),
    defineField({
      name: 'description',
      title: '📝 Description',
      type: 'autoMultilingualText',
      group: 'basic',
      description: 'Optional description to help customers understand this modifier group',
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
          title: 'Uber Eats Modifier Group ID',
          type: 'string',
        }),
        defineField({
          name: 'deliverooId',
          title: 'Deliveroo Modifier Group ID',
          type: 'string',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
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
      type: 'type',
      isActive: 'isActive',
      minSelection: 'selectionRules.minSelection',
      maxSelection: 'selectionRules.maxSelection',
    },
    prepare(selection) {
      const { title, type, isActive, minSelection, maxSelection } = selection
      const typeLabels: { [key: string]: string } = {
        'add-ingredient': '➕ Add Ingredient',
        'remove-ingredient': '➖ Remove Ingredient',
        'size': '📏 Size',
        'cooking-instruction': '👨‍🍳 Cooking',
        'up-sell': '⬆️ Up-sell',
        'choice-required': '✅ Required Choice',
        'optional-addons': '🔧 Optional Add-ons',
      }
      
      const rules = []
      if (minSelection !== undefined) rules.push(`Min: ${minSelection}`)
      if (maxSelection !== undefined) rules.push(`Max: ${maxSelection}`)
      
      return {
        title: title || 'Unnamed Modifier Group',
        subtitle: `${typeLabels[type] || type}${rules.length ? ` (${rules.join(', ')})` : ''}${!isActive ? ' (Inactive)' : ''}`,
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
      title: 'Type',
      name: 'typeAsc',
      by: [{ field: 'type', direction: 'asc' }],
    },
  ],
})