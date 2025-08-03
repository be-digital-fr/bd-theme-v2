# Lighthouse Performance Testing

Ce projet inclut des outils complets pour tester les performances avec Lighthouse et Unlighthouse.

## 🚀 Quick Start

### Test rapide
```bash
# Test du site en production
npm run test:lighthouse:quick

# Test local (serveur de dev doit être lancé)
npm run test:lighthouse:local

# Test mobile
npm run test:lighthouse:mobile
```

### Test complet avec script personnalisé
```bash
# Test desktop avec throttling
./scripts/quick-lighthouse.sh https://bd-theme-nu.vercel.app desktop

# Test mobile
./scripts/quick-lighthouse.sh https://bd-theme-nu.vercel.app mobile
```

## 📊 Scripts Disponibles

| Script | Description | Usage |
|--------|-------------|-------|
| `test:lighthouse` | Test complet desktop avec script personnalisé | `npm run test:lighthouse` |
| `test:lighthouse:mobile` | Test complet mobile | `npm run test:lighthouse:mobile` |
| `test:lighthouse:local` | Test sur serveur local | `npm run test:lighthouse:local` |
| `test:lighthouse:quick` | Test rapide (3 pages) | `npm run test:lighthouse:quick` |
| `test:lighthouse:ci` | Test avec budget de performance | `npm run test:lighthouse:ci` |

## 📱 URLs de Test

- **Production**: `https://bd-theme-lrgurlfym-seck-mamadous-projects.vercel.app`
- **Domain custom**: `https://bd-theme-nu.vercel.app` (si configuré)
- **Local**: `http://localhost:3000`

## 🎯 Objectifs de Performance

| Métrique | Objectif | Seuil d'alerte |
|----------|----------|----------------|
| **Performance Score** | ≥ 90 | < 85 |
| **Accessibility Score** | ≥ 95 | < 90 |
| **Best Practices Score** | ≥ 90 | < 85 |
| **SEO Score** | ≥ 95 | < 90 |
| **PWA Score** | ≥ 80 | < 70 |

### Core Web Vitals

| Métrique | Bon | À améliorer | Mauvais |
|----------|-----|-------------|---------|
| **First Contentful Paint (FCP)** | ≤ 1.8s | 1.8s - 3.0s | > 3.0s |
| **Largest Contentful Paint (LCP)** | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| **Cumulative Layout Shift (CLS)** | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |
| **Total Blocking Time (TBT)** | ≤ 300ms | 300ms - 600ms | > 600ms |
| **Speed Index (SI)** | ≤ 3.4s | 3.4s - 5.8s | > 5.8s |

## 🔧 Configuration

### Unlighthouse Config
Le fichier `unlighthouse.config.ts` configure :
- Pages à scanner
- Paramètres de throttling
- Options Lighthouse
- Hooks pour les rapports

### Budget de Performance
Le fichier `lighthouse-budget.json` définit :
- Limites de taille des ressources
- Seuils de performance
- Nombre maximum de requêtes

## 📈 Rapports

Les rapports sont générés dans :
- `./lighthouse-reports/` - Rapports locaux
- `.unlighthouse/` - Rapports Unlighthouse
- GitHub Actions Artifacts - Rapports CI/CD

### Contenu des Rapports

1. **Dashboard HTML** - Vue d'ensemble interactive
2. **Rapports JSON** - Données détaillées
3. **Screenshots** - Captures d'écran des pages
4. **Métriques** - Core Web Vitals et autres métriques

## 🤖 Automation

### GitHub Actions
Le workflow `.github/workflows/lighthouse.yml` s'exécute :
- À chaque push sur `main`
- À chaque Pull Request
- Quotidiennement à 2h UTC
- Manuellement via workflow_dispatch

### CI/CD Integration
```bash
# Intégration dans votre pipeline
npm run test:lighthouse:ci
```

## 🛠️ Dépannage

### Erreur 401/403
```bash
# Vérifier que le site est accessible
curl -I https://votre-url.vercel.app

# Vérifier les variables d'environnement sur Vercel
vercel env ls
```

### Timeout ou Erreurs de Réseau
```bash
# Augmenter le timeout dans unlighthouse.config.ts
lighthouse: {
  options: {
    maxWaitForLoad: 60000
  }
}
```

### Performance Dégradée
1. Vérifier la taille des bundles : `npm run build`
2. Analyser avec : `ANALYZE=true npm run build`
3. Optimiser les images et fonts
4. Vérifier les Core Web Vitals

## 📚 Ressources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Unlighthouse Documentation](https://unlighthouse.dev/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Vercel Analytics](https://vercel.com/analytics)

## 🎯 Conseils d'Optimisation

### Performance
- Utilisez Next.js Image avec optimisation automatique
- Implémentez le lazy loading
- Minimisez le JavaScript initial
- Utilisez la compression gzip/brotli

### Accessibility
- Ajoutez des alt text aux images
- Utilisez des contrastes suffisants
- Implémentez la navigation au clavier
- Testez avec des lecteurs d'écran

### SEO
- Configurez les meta tags
- Implémentez le sitemap XML
- Optimisez les Core Web Vitals
- Utilisez des URLs sémantiques

### PWA
- Configurez le Web App Manifest
- Implémentez un Service Worker
- Optimisez pour l'installation
- Testez hors ligne