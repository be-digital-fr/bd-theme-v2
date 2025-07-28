# 🤖 Configuration de la Traduction Automatique

## 📋 Prérequis

1. **Compte OpenAI** avec accès à l'API
2. **Clé API OpenAI** avec des crédits disponibles

## ⚙️ Configuration

### 1. Ajouter la clé API OpenAI

Dans votre fichier `.env`, ajoutez votre clé API OpenAI :

```env
# OpenAI API pour la traduction automatique
OPENAI_API_KEY="sk-your-actual-openai-api-key-here"
```

⚠️ **Important** : 
- Remplacez `"votre-cle-openai-ici"` par votre vraie clé API
- Ne commitez jamais votre vraie clé API dans le code
- La clé doit commencer par `sk-`

### 2. Configuration dans Sanity Studio

1. **Démarrez l'application** : `pnpm dev`
2. **Accédez à Sanity Studio** : http://localhost:3000/studio
3. **Créez un document "Settings"** :
   - Nom : "Paramètres du site"
   - Activez le "Mode multilingue"
   - Sélectionnez les langues (FR, EN, ES)
   - Activez la "Traduction automatique"
   - Choisissez le modèle ChatGPT :
     - `gpt-3.5-turbo` : Rapide et économique
     - `gpt-4` : Plus précis mais plus lent
     - `gpt-4-turbo` : Équilibre entre vitesse et précision

## 🚀 Utilisation

### Types de champs disponibles

1. **`autoMultilingualString`** : Texte court avec traduction auto
   ```javascript
   {
     name: 'title',
     type: 'autoMultilingualString',
     title: 'Titre de la page'
   }
   ```

2. **`autoMultilingualText`** : Texte long avec traduction auto
   ```javascript
   {
     name: 'description',
     type: 'autoMultilingualText', 
     title: 'Description'
   }
   ```

### Comment ça marche

1. **Tapez en français** dans le champ source
2. **Attendez 2 secondes** (délai configurable)
3. **La traduction se fait automatiquement** vers EN et ES
4. **Les champs se remplissent** avec les traductions

### Interface utilisateur

- **Champ source (FR)** : Où vous tapez en français
- **Champs traduits (EN/ES)** : Remplis automatiquement
- **Indicateurs de statut** : Traduction en cours, succès, erreurs
- **Bouton "Traduire maintenant"** : Force une retraduction

## 🔧 Personnalisation

### Changer le délai de traduction

Dans les paramètres Sanity, modifiez "Délai avant traduction" (en millisecondes) :
- `1000` = 1 seconde (très réactif)
- `2000` = 2 secondes (défaut)
- `5000` = 5 secondes (économise l'API)

### Ajouter d'autres langues

1. Modifiez `LocaleCodeSchema` dans `features/locale/domain/schemas/LocaleSchema.ts`
2. Ajoutez les nouvelles langues dans les schémas Sanity
3. Mettez à jour les composants de traduction

## 🐛 Dépannage

### Erreur "Translation service not configured"
- Vérifiez que `OPENAI_API_KEY` est définie dans `.env`
- Redémarrez l'application après avoir ajouté la clé

### Erreur "No translation received from OpenAI"
- Vérifiez que votre clé API est valide
- Vérifiez que vous avez des crédits sur votre compte OpenAI

### Traductions avec guillemets
- Le système nettoie automatiquement les guillemets indésirables
- Si le problème persiste, vérifiez les logs de l'API

### Performance lente
- Utilisez `gpt-3.5-turbo` pour plus de rapidité
- Augmentez le délai de traduction pour réduire les appels

## 🔒 Sécurité

- ✅ **Clé API côté serveur** : La clé reste sécurisée sur le serveur
- ✅ **Pas de stockage client** : Aucune clé API dans le navigateur
- ✅ **API route sécurisée** : Validation et nettoyage des données

## 📊 Coûts

Les coûts dépendent du modèle choisi :
- **GPT-3.5 Turbo** : ~$0.002 per 1K tokens
- **GPT-4** : ~$0.03 per 1K tokens  
- **GPT-4 Turbo** : ~$0.01 per 1K tokens

💡 **Astuce** : Commencez avec GPT-3.5 Turbo pour tester, puis passez à GPT-4 si besoin de plus de précision.