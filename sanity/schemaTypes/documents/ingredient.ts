import { defineField, defineType } from 'sanity'
import { Carrot } from 'lucide-react'

export default defineType({
  name: 'ingredient',
  title: 'Ingredient',
  type: 'document',
  icon: Carrot,
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
            return 'ingredient'
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
            || 'ingredient'
        }
      },
      validation: (Rule) => Rule.required().error('A slug is required to create a URL for this ingredient'),
      description: 'URL-friendly version of the ingredient name. Click "Generate" button after entering the name above.'
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
      description: 'Select all allergens present in this ingredient',
    }),
    defineField({
      name: 'isVegetarian',
      title: 'Vegetarian',
      type: 'boolean',
      initialValue: true,
      description: 'Suitable for vegetarians',
    }),
    defineField({
      name: 'isVegan',
      title: 'Vegan',
      type: 'boolean',
      initialValue: false,
      description: 'Suitable for vegans',
    }),
    defineField({
      name: 'isGlutenFree',
      title: 'Gluten Free',
      type: 'boolean',
      initialValue: false,
      description: 'Free from gluten',
    }),
    defineField({
      name: 'isRemovable',
      title: 'Can be Removed',
      type: 'boolean',
      initialValue: true,
      description: 'Whether customers can request to remove this ingredient',
    }),
    defineField({
      name: 'additionalPrice',
      title: 'Additional Price',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).precision(2),
      description: 'Extra cost when adding this ingredient (0 if included in base price)',
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
        {
          name: 'fiber',
          title: 'Fiber (g)',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        },
        {
          name: 'sodium',
          title: 'Sodium (mg)',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        },
      ],
      description: 'Nutritional values per 100g',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      isVegetarian: 'isVegetarian',
      isVegan: 'isVegan',
      allergens: 'allergens',
    },
    prepare(selection) {
      const { title, media, isVegetarian, isVegan, allergens } = selection
      const badges = []
      if (isVegan) badges.push('🌱 Vegan')
      else if (isVegetarian) badges.push('🥗 Vegetarian')
      if (allergens && allergens.length > 0) badges.push(`⚠️ ${allergens.length} allergen${allergens.length > 1 ? 's' : ''}`)
      
      return {
        title: title || 'Untitled Ingredient',
        subtitle: badges.join(' | ') || 'No dietary info',
        media,
      }
    },
  },
})