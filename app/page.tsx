import { AdminPreferencesModal } from "@/components/admin-preferences-modal";
import { Button } from "@/components/ui/button";
import { LanguageSelector, CurrentLanguageDisplay } from "@/components/language-selector";
import { getHomeWithNextjsLocale } from "@/sanity/lib/queries/getHomeWithPreferences";
import { Settings, Globe } from "lucide-react";

/**
 * PAGE PRINCIPALE - DIAGNOSTIC ET DÉMONSTRATION AVEC GESTION DE L'URL
 * ===================================================================
 * 
 * Cette page sert de centre de contrôle et de diagnostic pour le système multilingue.
 * Elle teste automatiquement tous les composants et affiche les erreurs de manière claire.
 * 
 * NOUVELLE FONCTIONNALITÉ : LANGUE DEPUIS L'URL
 * ============================================
 * - Récupère automatiquement la langue depuis l'URL (fr, en, es)
 * - Utilise la configuration Next.js i18n pour la gestion des routes
 * - Affiche un sélecteur de langue pour changer dynamiquement
 * - Priorité : URL > Préférences utilisateur > Préférences admin > Défaut
 * 
 * EXEMPLES D'URLS :
 * ----------------
 * - /fr (ou /) → Français
 * - /en → Anglais
 * - /es → Espagnol
 * 
 * FONCTIONNALITÉS :
 * ----------------
 * 1. Test automatique des imports et de la récupération des données
 * 2. Affichage des préférences linguistiques actuelles
 * 3. Interface de configuration des préférences
 * 4. Sélecteur de langue dynamique
 * 5. Liens vers Sanity Studio et page de test
 * 6. Diagnostic complet avec messages d'erreur clairs
 * 
 * DIAGNOSTIC AUTOMATIQUE :
 * -----------------------
 * - Test d'import des queries Sanity ✓
 * - Test de récupération des préférences admin ✓
 * - Test de récupération des données home ✓
 * - Test de récupération de la langue depuis l'URL ✓
 * - Affichage des erreurs avec solutions ✓
 * 
 * CAUSES COMMUNES D'ERREURS :
 * ---------------------------
 * 1. "Missing environment variable: SANITY_API_TOKEN"
 *    → Ajouter SANITY_API_TOKEN dans .env
 * 
 * 2. homeData est null
 *    → Aucun document "home" dans Sanity
 *    → Aller dans /studio et créer un document "Home"
 * 
 * 3. "Can't resolve '@/sanity/lib/queries'"
 *    → Problème de build Next.js
 *    → Supprimer .next/ et relancer pnpm dev
 * 
 * 4. preferences null ou erreur
 *    → Base de données Prisma non configurée
 *    → Vérifier la connexion à Neon PostgreSQL
 * 
 * 5. Langue non supportée dans l'URL
 *    → Vérifier que la langue est dans next.config.ts
 *    → Utiliser fr, en, ou es uniquement
 */

interface HomePageProps {
  params: {
    locale?: string;
  };
}

export default async function Home({ params }: HomePageProps) {
  // État pour diagnostique et gestion d'erreurs
  let importError = null;
  let homeData = null;
  let preferences = null;
  let resolvedLanguage = 'fr';
  
  // Récupération de la langue depuis l'URL
  const urlLocale = params?.locale || 'fr';

  try {
    // ÉTAPE 1 : Test d'import des queries
    // Ceci vérifie que tous les fichiers sont correctement configurés
    console.log('[HomePage] Step 1: Testing import...');
    const queries = await import("@/sanity/lib/queries");
    console.log('[HomePage] Step 1: Import successful, available functions:', Object.keys(queries));

    // ÉTAPE 2 : Test d'appel de fonction avec gestion d'erreur et langue URL
    // Ceci teste la récupération des préférences + données Sanity avec la langue de l'URL
    console.log('[HomePage] Step 2: Testing function call with URL locale:', urlLocale);
    const result = await getHomeWithNextjsLocale(urlLocale);
    console.log('[HomePage] Step 2: Function call successful');
    
    // ÉTAPE 3 : Extraction des données pour l'interface
    homeData = result.data;
    preferences = result.preferences;
    resolvedLanguage = result.resolvedLanguage;
    
    console.log('[HomePage] Step 3: Data received:', { 
      hasHomeData: !!homeData, 
      preferences, 
      resolvedLanguage,
      urlLocale 
    });
    
  } catch (error) {
    // Gestion gracieuse des erreurs avec message explicite
    importError = error instanceof Error ? error.message : String(error);
    console.error('[HomePage] Import/Call error:', error);
    
    // Fallback - valeurs par défaut pour éviter un crash complet
    preferences = {
      isMultilingual: false,
      supportedLanguages: ['fr'],
      defaultLanguage: 'fr'
    };
    resolvedLanguage = urlLocale || 'fr';
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER AVEC SÉLECTEUR DE LANGUE */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Globe className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                BD Theme - Système Multilingue
              </h1>
              <CurrentLanguageDisplay />
            </div>
          </div>
          <LanguageSelector />
        </div>

        <div className="text-center mb-12">
          {/* TITRE DYNAMIQUE basé sur les données Sanity ou fallback */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {homeData?.title || "Gestion Multilingue via URL"}
          </h2>
          
          {/* SOUS-TITRE DYNAMIQUE */}
          <p className="text-lg text-gray-600 mb-8">
            {homeData?.subtitle || "Application Next.js avec Sanity CMS et gestion multilingue dynamique"}
          </p>

          {/* INDICATEUR DE LANGUE ACTUELLE */}
          <div className="mb-6 p-4 bg-blue-100 border border-blue-400 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <Globe className="h-5 w-5" />
              <span className="font-medium">
                Langue actuelle : {resolvedLanguage.toUpperCase()}
              </span>
              {urlLocale !== resolvedLanguage && (
                <span className="text-sm text-blue-600">
                  (URL: {urlLocale.toUpperCase()})
                </span>
              )}
            </div>
          </div>

          {/* ALERTE D'ERREUR - Visible uniquement en cas de problème */}
          {importError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
              <h3 className="text-red-800 font-bold">🚨 Erreur de récupération des données :</h3>
              <p className="text-red-700 text-sm mb-2">{importError}</p>
              
              {/* SOLUTIONS PROPOSÉES selon le type d'erreur */}
              <div className="text-left text-sm text-red-600 mt-3">
                <p className="font-medium">Solutions possibles :</p>
                {importError.includes('SANITY_API_TOKEN') && (
                  <p>• Ajouter <code className="bg-red-200 px-1 rounded">SANITY_API_TOKEN</code> dans votre fichier .env</p>
                )}
                {importError.includes("Can't resolve") && (
                  <p>• Supprimer le dossier .next et relancer <code className="bg-red-200 px-1 rounded">pnpm dev</code></p>
                )}
                <p>• Vérifier que Sanity Studio est configuré correctement</p>
                <p>• Créer un document "Home" dans Studio (/studio)</p>
                <p>• Vérifier que la langue {urlLocale} est supportée</p>
              </div>
            </div>
          )}
          
          {/* CONTENU DYNAMIQUE DEPUIS SANITY */}
          {/* Message de bienvenue - affiché uniquement si présent */}
          {homeData?.welcoming && (
            <div className="mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
              <p className="text-gray-700 italic">
                💬 {homeData.welcoming}
              </p>
            </div>
          )}
          
          {/* Description étendue - affichée uniquement si présente */}
          {homeData?.description && (
            <div className="mb-6 p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-white/20">
              <p className="text-gray-600">
                📄 {homeData.description}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Configuration Administrative
          </h3>
          
          {/* PANNEAU DE DIAGNOSTIC - Informations techniques */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-medium text-gray-800 mb-2">
              🔧 Diagnostic du système
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Langue URL:</strong> {urlLocale}</p>
              <p><strong>Langue résolue:</strong> {resolvedLanguage}</p>
              <p><strong>Mode:</strong> {preferences?.isMultilingual ? '🌍 Multilingue' : '🇫🇷 Monolingue'}</p>
              <p><strong>Langue par défaut:</strong> {preferences?.defaultLanguage || 'fr'}</p>
              <p><strong>Langues supportées:</strong> {preferences?.supportedLanguages?.join(', ') || 'fr'}</p>
              <p><strong>Récupération des données:</strong> {importError ? '❌ Erreur' : '✅ Succès'}</p>
              <p><strong>Documents Sanity:</strong> {homeData ? '✅ Trouvé' : '⚠️ Aucun document "home"'}</p>
              <p><strong>Concordance URL/Résolu:</strong> {urlLocale === resolvedLanguage ? '✅ Oui' : '⚠️ Non'}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* SECTION TEST DE LANGUE */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                🌐 Test de Langue
              </h4>
              <p className="text-gray-600 mb-4">
                Testez les différentes langues disponibles. La langue sera changée dans l'URL.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <LanguageSelector variant="select" className="w-48" />
                  <span className="text-sm text-gray-500">
                    Sélecteur dropdown
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <LanguageSelector variant="dropdown" />
                  <span className="text-sm text-gray-500">
                    Sélecteur bouton
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION CONFIGURATION DES PRÉFÉRENCES */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                ⚙️ Préférences Administratives
              </h4>
              <p className="text-gray-600 mb-4">
                Configurez les langues de votre application et définissez vos préférences.
                Cela affectera les champs disponibles dans Sanity Studio.
              </p>
              
              <AdminPreferencesModal>
                <Button className="w-full sm:w-auto">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurer les préférences linguistiques
                </Button>
              </AdminPreferencesModal>
            </div>

            {/* SECTION SANITY STUDIO */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                🎨 Sanity Studio
              </h4>
              <p className="text-gray-600 mb-4">
                Accédez à Sanity Studio pour gérer le contenu de votre application.
                L'interface s'adaptera automatiquement à vos préférences linguistiques.
              </p>
              
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <a href="/studio" target="_blank" rel="noopener noreferrer">
                  Ouvrir Sanity Studio
                </a>
              </Button>
            </div>

            {/* SECTION TEST TECHNIQUE */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                🧪 Tests Techniques
              </h4>
              <p className="text-gray-600 mb-4">
                Accédez à la page de test pour voir tous les types de champs en action
                et tester le comportement selon les différentes langues.
              </p>
              
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <a href="/test-data">
                  Voir les tests de données
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
