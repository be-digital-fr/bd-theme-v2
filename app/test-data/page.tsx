import { Suspense } from 'react'
import { getHomeWithNextjsLocale } from '@/sanity/lib/queries/getHomeWithPreferences'
import { LanguageSelector, CurrentLanguageDisplay } from '@/components/language-selector'
import { Button } from '@/components/ui/button'
import { Globe, ArrowLeft } from 'lucide-react'

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
 * - Gestion d'erreurs et fallbacks
 * - Comparaison des données multilingues
 * 
 * UTILISATION :
 * - /fr/test-data → données en français
 * - /en/test-data → données en anglais
 * - /es/test-data → données en espagnol
 */

interface TestDataPageProps {
  params: {
    locale?: string;
  };
}

// Fonction de test pour récupérer les données avec la langue URL
async function testDataFetch(locale?: string) {
  try {
    console.log(`[TestDataPage] Testing data fetch for locale: ${locale}`);
    
    // Utiliser la nouvelle fonction avec support de la langue URL
    const result = await getHomeWithNextjsLocale(locale);
    
    console.log(`[TestDataPage] Success:`, {
      hasData: !!result.data,
      resolvedLanguage: result.resolvedLanguage,
      urlLocale: locale
    });
    
    return { success: true, data: result, urlLocale: locale };
  } catch (error) {
    console.error(`[TestDataPage] Error:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      urlLocale: locale
    };
  }
}

// Composant de test des données avec affichage détaillé
async function DataTest({ locale }: { locale?: string }) {
  const result = await testDataFetch(locale);
  
  if (!result.success) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <h3 className="text-red-800 font-bold">❌ Erreur de récupération des données :</h3>
        <p className="text-red-700 mb-2">{result.error}</p>
        <div className="text-sm text-red-600">
          <p><strong>Langue URL :</strong> {result.urlLocale || 'Non spécifiée'}</p>
          <p><strong>Solutions :</strong></p>
          <ul className="list-disc ml-5 mt-1">
            <li>Vérifier la configuration Sanity</li>
            <li>Vérifier les préférences admin</li>
            <li>Créer du contenu dans Sanity Studio</li>
            <li>Vérifier que la langue {result.urlLocale} est supportée</li>
          </ul>
        </div>
      </div>
    );
  }

  if (!result.data) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h3 className="text-yellow-800 font-bold">⚠️ Aucune donnée disponible</h3>
        <p className="text-yellow-700">
          Langue URL : {result.urlLocale || 'Non spécifiée'}
        </p>
      </div>
    );
  }

  const { data: homeData, preferences, resolvedLanguage } = result.data;

  return (
    <div className="space-y-6">
      {/* STATUT DE SUCCÈS */}
      <div className="p-4 bg-green-100 border border-green-400 rounded">
        <h3 className="text-green-800 font-bold">✅ Récupération des données réussie !</h3>
        <div className="mt-2 text-sm text-green-700">
          <p><strong>Langue URL :</strong> {result.urlLocale || 'Non spécifiée'}</p>
          <p><strong>Langue résolue :</strong> {resolvedLanguage}</p>
          <p><strong>Concordance :</strong> {result.urlLocale === resolvedLanguage ? '✅ Oui' : '⚠️ Non'}</p>
        </div>
      </div>

      {/* INFORMATIONS DE DIAGNOSTIC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-blue-800 mb-2">🔧 Préférences Admin</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Mode :</strong> {preferences?.isMultilingual ? 'Multilingue' : 'Monolingue'}</p>
            <p><strong>Défaut :</strong> {preferences?.defaultLanguage}</p>
            <p><strong>Supportées :</strong> {preferences?.supportedLanguages?.join(', ')}</p>
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-bold text-purple-800 mb-2">🌐 Résolution Langue</h4>
          <div className="text-sm text-purple-700 space-y-1">
            <p><strong>URL :</strong> {result.urlLocale || 'Non spécifiée'}</p>
            <p><strong>Résolue :</strong> {resolvedLanguage}</p>
            <p><strong>Statut :</strong> {result.urlLocale === resolvedLanguage ? 'Exacte' : 'Fallback'}</p>
          </div>
        </div>

        <div className="p-4 bg-orange-50 rounded-lg">
          <h4 className="font-bold text-orange-800 mb-2">📊 Données Home</h4>
          <div className="text-sm text-orange-700 space-y-1">
            <p><strong>ID :</strong> {homeData?._id || 'Non trouvé'}</p>
            <p><strong>Titre :</strong> {homeData?.title ? '✅ Présent' : '❌ Absent'}</p>
            <p><strong>Sous-titre :</strong> {homeData?.subtitle ? '✅ Présent' : '❌ Absent'}</p>
            <p><strong>Welcoming :</strong> {homeData?.welcoming ? '✅ Présent' : '❌ Absent'}</p>
          </div>
        </div>
      </div>

      {/* RENDU DES DONNÉES */}
      {homeData && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-4">📝 Rendu des données résolues :</h4>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-600">Titre</p>
              <p className="text-lg font-semibold text-gray-900">
                {homeData.title || <span className="text-gray-400 italic">Non défini</span>}
              </p>
            </div>
            
            <div className="p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-600">Sous-titre</p>
              <p className="text-gray-800">
                {homeData.subtitle || <span className="text-gray-400 italic">Non défini</span>}
              </p>
            </div>
            
            <div className="p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-600">Message de bienvenue</p>
              <p className="text-gray-800">
                {homeData.welcoming || <span className="text-gray-400 italic">Non défini</span>}
              </p>
            </div>
            
            <div className="p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-600">Description</p>
              <p className="text-gray-800">
                {homeData.description || <span className="text-gray-400 italic">Non défini</span>}
              </p>
            </div>
            
            <div className="p-3 bg-white rounded border">
              <p className="text-sm font-medium text-gray-600">Contenu</p>
              <p className="text-gray-800">
                {homeData.content || <span className="text-gray-400 italic">Non défini</span>}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DONNÉES BRUTES POUR DÉVELOPPEURS */}
      <details className="p-4 bg-gray-50 rounded-lg">
        <summary className="font-bold text-gray-800 cursor-pointer mb-2">
          🔧 Données brutes (développeurs)
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Données résolues (UI) :</h5>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto h-64">
              {JSON.stringify(homeData, null, 2)}
            </pre>
          </div>
          <div>
            <h5 className="font-medium text-gray-700 mb-2">Données brutes (Sanity) :</h5>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto h-64">
              {JSON.stringify(homeData?.originalData, null, 2)}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
}

export default function TestDataPage({ params }: TestDataPageProps) {
  const urlLocale = params?.locale || 'fr';

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER AVEC NAVIGATION */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Globe className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Test de Récupération des Données
              </h1>
              <CurrentLanguageDisplay />
            </div>
          </div>
          <LanguageSelector />
        </div>

        {/* INFORMATIONS DE LA PAGE */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            📋 Informations de test
          </h2>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>URL actuelle :</strong> /{urlLocale}/test-data</p>
            <p><strong>Langue testée :</strong> {urlLocale.toUpperCase()}</p>
            <p><strong>Objectif :</strong> Tester la récupération et résolution des données selon la langue URL</p>
            <p><strong>Changez de langue :</strong> Utilisez le sélecteur ci-dessus pour tester d'autres langues</p>
          </div>
        </div>

        {/* TESTS DES DONNÉES */}
        <Suspense fallback={
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Récupération des données pour {urlLocale.toUpperCase()}...</p>
          </div>
        }>
          <DataTest locale={urlLocale} />
        </Suspense>

        {/* NAVIGATION */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </a>
          </Button>
          
          <Button variant="outline" asChild>
            <a href="/studio" target="_blank" rel="noopener noreferrer">
              Ouvrir Sanity Studio
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
} 