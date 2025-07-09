import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'test',
  title: 'Test',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
})