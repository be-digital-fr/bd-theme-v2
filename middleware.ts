import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Langues supportées par l'application
const SUPPORTED_LOCALES = ['fr', 'en', 'es'];
const DEFAULT_LOCALE = 'fr';

/**
 * Middleware pour la gestion des langues et redirections
 * 
 * FONCTIONNALITÉS :
 * - Redirection automatique des langues non supportées
 * - Gestion du fallback vers la langue par défaut
 * - Support des routes spéciales (studio, api, etc.)
 * - Détection de la langue préférée utilisateur
 * - Logging pour le débogage
 * 
 * EXEMPLES :
 * - /de/about → /fr/about (langue non supportée)
 * - /unknown → /fr (langue invalide)
 * - /api/... → pas de redirection (route API)
 * - /studio → pas de redirection (Sanity Studio)
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Exclure les routes spéciales
  const isSpecialRoute = 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public/') ||
    pathname.includes('.');

  if (isSpecialRoute) {
    return NextResponse.next();
  }

  // Extraire la locale potentielle depuis l'URL
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0];
  
  // Vérifier si la locale est supportée
  if (potentialLocale && SUPPORTED_LOCALES.includes(potentialLocale)) {
    // Locale supportée, continuer normalement
    return NextResponse.next();
  }
  
  // Gérer les cas de locale non supportée ou manquante
  if (potentialLocale && !SUPPORTED_LOCALES.includes(potentialLocale)) {
    // Langue non supportée, rediriger vers la langue par défaut
    // Exemple : /de/about → /fr/about
    const newPath = `/${DEFAULT_LOCALE}/${segments.join('/')}`;
    
    
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // Aucune locale dans l'URL, rediriger vers la langue par défaut
  // Exemple : /about → /fr/about
  if (pathname !== '/' && !pathname.startsWith(`/${DEFAULT_LOCALE}`)) {
    const newPath = `/${DEFAULT_LOCALE}${pathname}`;
    
    
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // Route racine, optionnellement rediriger vers la langue préférée
  if (pathname === '/') {
    const acceptLanguage = request.headers.get('accept-language');
    const preferredLocale = getPreferredLocale(acceptLanguage);
    
    if (preferredLocale && preferredLocale !== DEFAULT_LOCALE) {
      const newPath = `/${preferredLocale}`;
      
      
      return NextResponse.redirect(new URL(newPath, request.url));
    }
  }
  
  return NextResponse.next();
}

/**
 * Détermine la langue préférée depuis l'header Accept-Language
 */
function getPreferredLocale(acceptLanguage: string | null): string | null {
  if (!acceptLanguage) return null;
  
  // Parser l'header Accept-Language
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, quality] = lang.split(';q=');
      return {
        code: code.trim().toLowerCase().split('-')[0], // fr-FR → fr
        quality: quality ? parseFloat(quality) : 1.0,
      };
    })
    .sort((a, b) => b.quality - a.quality);
  
  // Trouver la première langue supportée
  for (const lang of languages) {
    if (SUPPORTED_LOCALES.includes(lang.code)) {
      return lang.code;
    }
  }
  
  return null;
}

/**
 * Configuration du matcher
 * Définit les routes sur lesquelles le middleware s'applique
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - studio (Sanity Studio)
     * - public folder
     */
    '/((?!api|_next|favicon.ico|studio|public|__webpack_hmr).*)',
  ],
}; 