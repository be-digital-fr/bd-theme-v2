import { defineField, defineType } from 'sanity'
import { Plus } from 'lucide-react'

export default defineType({
  name: 'productExtra',
  title: 'Product Extra',
  type: 'document',
  icon: Plus,
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
            return 'extra'
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
            || 'extra'
        }
      },
      validation: (Rule) => Rule.required().error('A slug is required to create a URL for this extra'),
      description: 'URL-friendly version of the extra name. Click "Generate" button after entering the name above.'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'autoMultilingualText',
    }),
    defineField({
      name: 'image',
      title: 'Image',
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
      name: 'type',
      title: 'Extra Type',
      type: 'string',
      options: {
        list: [
          { title: 'Size Variation', value: 'size' },
          { title: 'Additional Topping', value: 'topping' },
          { title: 'Side Dish', value: 'side' },
          { title: 'Sauce', value: 'sauce' },
          { title: 'Drink', value: 'drink' },
          { title: 'Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'basePrice',
      title: 'Base Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).precision(2),
      description: 'Default additional price for this extra',
    }),
    defineField({
      name: 'priceInModifierContext',
      title: 'Price as Modifier',
      type: 'number',
      validation: (Rule) => Rule.min(0).precision(2),
      description: 'Price when used as modifier/add-on (can differ from base price)',
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
                  { title: 'As Side Item', value: 'side' },
                  { title: 'In Bundle', value: 'bundle' },
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
          ],
          preview: {
            select: {
              context: 'context',
              price: 'price',
            },
            prepare(selection) {
              const { context, price } = selection
              const contextLabels: { [key: string]: string } = {
                'pickup': '🚶 Pickup',
                'delivery': '🚚 Delivery',
                'dine-in': '🍽️ Dine In',
                'side': '🍟 Side',
                'bundle': '📦 Bundle',
              }
              
              return {
                title: `${contextLabels[context] || context}: €${price?.toFixed(2) || '0.00'}`,
              }
            },
          },
        },
      ],
      description: 'Different prices for different contexts',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'quantityConstraints',
      title: 'Quantity Constraints',
      type: 'object',
      fields: [
        defineField({
          name: 'minQuantity',
          title: 'Minimum Quantity',
          type: 'number',
          initialValue: 0,
          validation: (Rule) => Rule.min(0).integer(),
          description: 'Minimum quantity required when selected',
        }),
        defineField({
          name: 'maxQuantity',
          title: 'Maximum Quantity',
          type: 'number',
          validation: (Rule) => Rule.min(1).integer(),
          description: 'Maximum quantity allowed per selection',
        }),
        defineField({
          name: 'defaultQuantity',
          title: 'Default Quantity',
          type: 'number',
          initialValue: 1,
          validation: (Rule) => Rule.min(1).integer(),
          description: 'Default quantity when first selected',
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: 'isAvailable',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'allergens',
      title: 'Allergens',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              { title: 'Gluten', value: 'gluten' },
              { title: 'Lactose', value: 'lactose' },
              { title: 'Eggs', value: 'eggs' },
              { title: 'Fish', value: 'fish' },
              { title: 'Crustaceans', value: 'crustaceans' },
              { title: 'Molluscs', value: 'molluscs' },
              { title: 'Peanuts', value: 'peanuts' },
              { title: 'Tree Nuts', value: 'treeNuts' },
              { title: 'Soy', value: 'soy' },
              { title: 'Celery', value: 'celery' },
              { title: 'Mustard', value: 'mustard' },
              { title: 'Sesame', value: 'sesame' },
              { title: 'Sulphites', value: 'sulphites' },
              { title: 'Lupin', value: 'lupin' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'isVegetarian',
      title: 'Vegetarian',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isVegan',
      title: 'Vegan',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'nutritionalInfo',
      title: 'Nutritional Information',
      type: 'object',
      fields: [
        {
          name: 'calories',
          title: 'Calories (kcal)',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        },
        {
          name: 'protein',
          title: 'Protein (g)',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        },
        {
          name: 'carbohydrates',
          title: 'Carbohydrates (g)',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        },
        {
          name: 'fat',
          title: 'Fat (g)',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        },
      ],
      description: 'Nutritional values per serving',
    }),
    defineField({
      name: 'uberEatsId',
      title: 'Uber Eats Extra ID',
      type: 'string',
      description: 'Extra ID from Uber Eats platform',
    }),
    defineField({
      name: 'deliverooId',
      title: 'Deliveroo Extra ID',
      type: 'string',
      description: 'Extra ID from Deliveroo platform',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      media: 'image',
      price: 'basePrice',
      isAvailable: 'isAvailable',
    },
    prepare(selection) {
      const { title, subtitle, media, price, isAvailable } = selection
      const typeLabels: Record<string, string> = {
        size: 'Size',
        topping: 'Topping',
        side: 'Side Dish',
        sauce: 'Sauce',
        drink: 'Drink',
        other: 'Other',
      }
      return {
        title: title || 'Untitled Extra',
        subtitle: `${typeLabels[subtitle as string] || 'Unknown'} - ${price ? `+${price.toFixed(2)}€` : 'No price'}${!isAvailable ? ' (Unavailable)' : ''}`,
        media,
      }
    },
  },
})