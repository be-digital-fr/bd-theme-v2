import { defineType, defineField } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homeWithAutoTranslate = defineType({
  name: 'home',
  title: 'Page d\'accueil',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {
      name: 'hero',
      title: 'Bannière Hero', 
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO & Métadonnées',
    },
  ],
  fields: [

    // Bannière Hero
    defineField({
      name: 'heroBanner',
      title: 'Bannière Hero',
      type: 'object',
      description: 'Configuration de la bannière principale de la page d\'accueil',
      group: 'hero',
      fields: [
        defineField({
          name: 'isActive',
          type: 'boolean',
          title: 'Bannière active',
          description: 'Activer/désactiver l\'affichage de la bannière',
          initialValue: true,
        }),
        defineField({
          name: 'heroTitle',
          type: 'autoMultilingualString',
          title: 'Titre accrocheur',
          description: 'Titre principal de la bannière - traduit automatiquement',
          validation: (rule) => rule.required(),
          initialValue: {
            fr: 'Savourez nos burgers uniques',
            en: 'Taste our unique burgers',
            es: 'Saborea nuestras hamburguesas únicas',
            de: 'Probieren Sie unsere einzigartigen Burger'
          }
        }),
        defineField({
          name: 'heroDescription',
          type: 'autoMultilingualText',
          title: 'Description',
          description: 'Description courte et appétissante - traduite automatiquement',
          validation: (rule) => rule.required(),
          initialValue: {
            fr: 'Des recettes fraîches, gourmandes et préparées avec des ingrédients de qualité pour une expérience gustative exceptionnelle',
            en: 'Fresh, delicious recipes prepared with quality ingredients for an exceptional taste experience',
            es: 'Recetas frescas y deliciosas preparadas con ingredientes de calidad para una experiencia gastronómica excepcional',
            de: 'Frische, köstliche Rezepte mit hochwertigen Zutaten für ein außergewöhnliches Geschmackserlebnis'
          }
        }),
        defineField({
          name: 'primaryButton',
          type: 'object',
          title: 'Bouton principal',
          fields: [
            defineField({
              name: 'text',
              type: 'autoMultilingualString',
              title: 'Texte du bouton',
              validation: (rule) => rule.required(),
              initialValue: {
                fr: 'Commander maintenant',
                en: 'Order now',
                es: 'Pedir ahora',
                de: 'Jetzt bestellen'
              }
            }),
            defineField({
              name: 'url',
              type: 'string',
              title: 'URL de destination',
              description: 'Lien vers lequel le bouton redirige (ex: /menu, /order)',
              validation: (rule) => rule.required(),
              initialValue: '/order'
            }),
          ],
        }),
        defineField({
          name: 'secondaryButton',
          type: 'object',
          title: 'Bouton secondaire',
          fields: [
            defineField({
              name: 'text',
              type: 'autoMultilingualString',
              title: 'Texte du bouton',
              validation: (rule) => rule.required(),
              initialValue: {
                fr: 'Voir le menu',
                en: 'View menu',
                es: 'Ver menú',
                de: 'Menü ansehen'
              }
            }),
            defineField({
              name: 'url',
              type: 'string',
              title: 'URL de destination',
              description: 'Lien vers lequel le bouton redirige (ex: /menu)',
              validation: (rule) => rule.required(),
              initialValue: '/menu'
            }),
          ],
        }),
        defineField({
          name: 'heroImage',
          type: 'object',
          title: 'Image principale',
          fields: [
            defineField({
              name: 'desktop',
              type: 'image',
              title: 'Image desktop',
              description: 'Image principale pour desktop (recommandé: 1600x1200px)',
              validation: (rule) => rule.required(),
              options: {
                hotspot: true,
                accept: 'image/*'
              }
            }),
            defineField({
              name: 'mobile',
              type: 'image',
              title: 'Image mobile',
              description: 'Image optimisée pour mobile (recommandé: 600x400px)',
              validation: (rule) => rule.required(),
              options: {
                hotspot: true,
                accept: 'image/*'
              }
            }),
            defineField({
              name: 'alt',
              type: 'autoMultilingualString',
              title: 'Texte alternatif',
              description: 'Description de l\'image pour l\'accessibilité - traduite automatiquement',
              validation: (rule) => rule.required(),
              initialValue: {
                fr: 'Délicieux burger avec des ingrédients frais',
                en: 'Delicious burger with fresh ingredients',
                es: 'Deliciosa hamburguesa con ingredientes frescos',
                de: 'Köstlicher Burger mit frischen Zutaten'
              }
            }),
          ],
        }),
        defineField({
          name: 'backgroundImages',
          type: 'object',
          title: 'Images de fond',
          description: 'Images d\'arrière-plan de la bannière',
          fields: [
            defineField({
              name: 'desktop',
              type: 'image',
              title: 'Arrière-plan desktop',
              description: 'Image de fond pour les écrans desktop (recommandé: 1920x1080px)',
              options: {
                hotspot: true,
                accept: 'image/*'
              }
            }),
            defineField({
              name: 'mobile',
              type: 'image',
              title: 'Arrière-plan mobile',
              description: 'Image de fond pour les écrans mobiles (recommandé: 768x1024px)',
              options: {
                hotspot: true,
                accept: 'image/*'
              }
            }),
          ],
          options: { collapsible: true, collapsed: true },
        }),
      ],
      options: { collapsible: true, collapsed: false },
    }),
    // SEO & Métadonnées
    defineField({
      name: 'metadata',
      title: 'Métadonnées SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({
          name: 'seoTitle',
          type: 'autoMultilingualString',
          title: 'Titre SEO',
          description: 'Titre pour les moteurs de recherche - traduit automatiquement',
        }),
        defineField({
          name: 'seoDescription',
          type: 'autoMultilingualText',
          title: 'Description SEO',
          description: 'Description pour les moteurs de recherche - traduite automatiquement',
        }),
      ],
      options: { collapsible: true, collapsed: true },
    }),
  ],
  preview: {
    select: {
      title: 'title.fr',
      subtitle: 'subtitle.fr',
      welcoming: 'welcoming.fr',
    },
    prepare({ title, subtitle, welcoming }) {
      return {
        title: title || 'Page d\'accueil',
        subtitle: subtitle || welcoming || 'Avec traduction automatique',
      };
    },
  },
});

export default homeWithAutoTranslate;