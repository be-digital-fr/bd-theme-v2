# Guide : Résoudre les problèmes d'upload d'images dans Sanity

## 🔍 Problème identifié
Vous ne pouvez pas uploader d'images pour les icônes dans Sanity Studio.

## 🛠️ Solutions par ordre de priorité

### Solution 1 : Vérifier la connexion au Studio
1. **Ouvrir Sanity Studio** : `http://localhost:3000/studio`
2. **Se connecter** avec votre compte Sanity
3. **Vérifier** que vous êtes bien connecté (votre avatar en haut à droite)

### Solution 2 : Créer un token d'API avec permissions
1. **Aller sur** https://sanity.io/manage
2. **Sélectionner votre projet** (1zl4yapo)
3. **Cliquer sur "API"** dans le menu latéral
4. **Onglet "Tokens"**
5. **"Add API token"**
6. **Nom** : "Local Development"
7. **Permissions** : "Editor" ou "Admin"
8. **Copier le token** généré

### Solution 3 : Ajouter le token aux variables d'environnement
1. **Ouvrir** `.env.local` dans votre projet
2. **Ajouter la ligne** :
   ```
   SANITY_API_TOKEN=your_token_here
   ```
3. **Remplacer** `your_token_here` par le token copié
4. **Redémarrer** le serveur Next.js (`pnpm dev`)

### Solution 4 : Vérifier les permissions du dataset
1. **Dans Sanity Manage** → votre projet
2. **Onglet "API"** → **"Datasets"**
3. **Vérifier** que le dataset "production" est accessible
4. **Permissions** doivent inclure "read" et "write"

### Solution 5 : Alternative - Utiliser le Studio hébergé
Si le studio local pose problème :
1. **Créer un studio hébergé** sur https://sanity.io
2. **Déployer** avec `sanity deploy`
3. **Utiliser** l'URL fournie pour éditer

## 📋 Checklist de vérification

- [ ] Connecté au Studio local (`http://localhost:3000/studio`)
- [ ] Token API créé avec bonnes permissions
- [ ] Token ajouté dans `.env.local`
- [ ] Serveur Next.js redémarré
- [ ] Test d'upload d'une petite image (< 2MB)

## 🎯 Test rapide
1. **Aller dans** Studio → Page d'accueil → Liste des Services
2. **Cliquer** sur un service existant
3. **Cliquer** sur le champ "Icône"
4. **Glisser-déposer** une image ou cliquer "Upload"

## 📱 Formats recommandés pour les icônes
- **Type** : SVG (idéal) ou PNG
- **Taille** : 64x64px ou 128x128px
- **Poids** : < 100KB
- **Fond** : Transparent de préférence

## ⚠️ Si le problème persiste
1. **Vérifier la console** du navigateur pour erreurs
2. **Tester avec** une image très petite (< 50KB)
3. **Essayer** différents formats (PNG, JPG, SVG)
4. **Contacter** support Sanity si nécessaire

---

**Note** : Les changements d'icônes s'affichent automatiquement sur le site une fois uploadées dans Sanity.