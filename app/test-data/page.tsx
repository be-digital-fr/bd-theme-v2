'use client';

// import { Suspense } from 'react'
import Link from 'next/link'
import { LanguageSelector, CurrentLanguageDisplay } from '@/components/language-selector'
import { Button } from '@/components/ui/button'
import { Globe, ArrowLeft } from 'lucide-react'
import { useHomeContent, useAdminPreferences } from '@/hooks/use-locale-data'
import { useCurrentLocale } from '@/lib/locale'

/**
 * PAGE DE TEST DES DONNÉES AVEC GESTION DES LANGUES
 * =================================================
 * 
 * Cette page teste la récupération et la résolution des données depuis Sanity
 * avec la nouvelle gestion des langues via l'URL.
 * 
 * FONCTIONNALITÉS TESTÉES :
 * - Récupération des données selon la langue URL
 * - Affichage des préférences admin
 * - Résolution automatique des langues
 * - Changement de langue avec navigation
 * - Tests de différents cas : multilingue activé/désactivé
 */

/**
 * Composant pour tester les données
 */
function DataTest() {
  const { data: homeData, error: homeError, isLoading } = useHomeContent()
  const { data: adminPreferences } = useAdminPreferences()
  const currentLocale = useCurrentLocale()
  const urlLocale = currentLocale // Using current locale

  // États de chargement
  if (isLoading) {
    return <div className="p-4 bg-gray-50 rounded">⏳ Chargement des données...</div>
  }

  // Erreurs
  if (homeError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <p className="font-medium text-red-800">❌ Erreur lors du chargement</p>
        <p className="text-sm text-red-600 mt-1">{homeError.message}</p>
      </div>
    )
  }

  // Affichage des données de test
  return (
    <div className="space-y-8">
      {/* INFOS CONTEXTE */}
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">📊 Contexte de Test</h3>
        <div className="space-y-1 text-sm">
          <p><strong>URL Locale:</strong> {urlLocale}</p>
          <p><strong>Current Locale:</strong> {currentLocale}</p>
          <p><strong>Mode multilingue:</strong> {adminPreferences?.isMultilingual ? 'Activé ✅' : 'Désactivé ❌'}</p>
          <p><strong>Langue par défaut:</strong> {adminPreferences?.defaultLanguage || 'Non définie'}</p>
          <p><strong>Langues supportées:</strong> {adminPreferences?.supportedLanguages?.join(', ') || 'Aucune'}</p>
        </div>
      </div>

      {/* DONNÉES RÉSOLUES */}
      <div className="bg-green-50 p-4 rounded">
        <h3 className="font-semibold text-green-900 mb-2">✅ Données Résolues</h3>
        
        {homeData ? (
          <div className="space-y-2 text-sm">
            <div>
              <strong>Title:</strong> 
              <span className="ml-2">{homeData.title || '(vide)'}</span>
            </div>
            <div>
              <strong>Subtitle:</strong> 
              <span className="ml-2">{homeData.subtitle || '(vide)'}</span>
            </div>
            <div>
              <strong>Welcoming:</strong> 
              <span className="ml-2">{homeData.welcoming || '(vide)'}</span>
            </div>
            <div>
              <strong>Description:</strong> 
              <p className="ml-2 text-gray-600">{homeData.description || '(vide)'}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Aucune donnée disponible</p>
        )}
      </div>

      {/* TESTS DE RÉSOLUTION */}
      <div className="bg-yellow-50 p-4 rounded">
        <h3 className="font-semibold text-yellow-900 mb-2">🧪 Tests de Résolution</h3>
        
        <div className="space-y-3 text-sm">
          {/* Test multilingue désactivé */}
          <div className="p-3 bg-white rounded border">
            <p className="font-medium">Test 1: Mode Monolingue</p>
            <p className="text-gray-600 mt-1">
              Si multilingue = false, les données devraient être des strings simples
            </p>
            <div className="mt-2 font-mono text-xs bg-gray-100 p-2 rounded">
              {homeData?.title && typeof homeData.title === 'string' ? 
                '✅ String simple détecté' : 
                '❌ Format incorrect'
              }
            </div>
          </div>

          {/* Test multilingue activé */}
          <div className="p-3 bg-white rounded border">
            <p className="font-medium">Test 2: Mode Multilingue</p>
            <p className="text-gray-600 mt-1">
              Si multilingue = true, les données devraient être résolues selon la langue URL
            </p>
            <div className="mt-2 font-mono text-xs bg-gray-100 p-2 rounded">
              {adminPreferences?.isMultilingual ? 
                `Langue demandée: ${urlLocale} → Résultat: ${typeof homeData?.title}` : 
                'Mode monolingue actif'
              }
            </div>
          </div>

          {/* Test langue manquante */}
          <div className="p-3 bg-white rounded border">
            <p className="font-medium">Test 3: Fallback sur langue par défaut</p>
            <p className="text-gray-600 mt-1">
              Si la langue demandée n&apos;existe pas, fallback sur defaultLanguage
            </p>
            <div className="mt-2 font-mono text-xs bg-gray-100 p-2 rounded">
              {`Fallback actif: ${adminPreferences?.defaultLanguage || 'fr'}`}
            </div>
          </div>
        </div>
      </div>

      {/* DONNÉES BRUTES (DEBUG) */}
      <details className="bg-gray-50 p-4 rounded">
        <summary className="cursor-pointer font-semibold text-gray-700">
          🔍 Données brutes (debug)
        </summary>
        <pre className="mt-4 text-xs bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify({ homeData, adminPreferences, urlLocale, currentLocale }, null, 2)}
        </pre>
      </details>
    </div>
  )
}

/**
 * Page principale de test
 */
export default function TestDataPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* HEADER */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              🧪 Test des Données Multilingues
            </h1>
            <CurrentLanguageDisplay />
          </div>

          {/* SÉLECTEUR DE LANGUE */}
          <div className="bg-gray-50 p-4 rounded mb-4">
            <div className="flex items-center gap-4">
              <Globe className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Sélecteur de langue :</span>
              <LanguageSelector variant="select" />
            </div>
          </div>

          {/* INFOS */}
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Objectif :</strong> Tester la récupération et résolution des données selon la langue</p>
            <p><strong>Changez de langue :</strong> Utilisez le sélecteur ci-dessus pour tester d&apos;autres langues</p>
          </div>
        </div>

        {/* TESTS DES DONNÉES */}
        <DataTest />

        {/* NAVIGATION */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l&apos;accueil
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <a href="/studio" target="_blank" rel="noopener noreferrer">
              Ouvrir Sanity Studio
            </a>
          </Button>
        </div>
      </div>
    </main>
  )
}