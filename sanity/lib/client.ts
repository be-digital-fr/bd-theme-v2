import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Désactivé pour toujours avoir les données les plus récentes
})

// Client pour voir les brouillons (drafts)
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts', // Pour voir les brouillons
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
})
