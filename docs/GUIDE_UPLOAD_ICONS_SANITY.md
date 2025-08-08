# Guide : Uploader les icônes dans Sanity Studio

## 📍 État actuel
Vos services existent mais **sans icônes** (`_ref: null`). Il faut uploader les images.

## 🚀 Étapes pour ajouter les icônes

### 1. Ouvrir Sanity Studio
- Aller sur : `http://localhost:3000/studio`
- Se connecter si nécessaire

### 2. Naviguer vers les services
- Cliquer sur **"Page d'accueil"** dans le menu
- Descendre jusqu'à **"Liste des Services"**

### 3. Pour chaque service
1. **Cliquer sur le service** (ex: "Rapide, Fiable, Inoubliable")
2. Dans le champ **"Icône"** :
   - Cliquer sur **"Upload"** ou **"Select"**
   - Choisir votre image
   - OU glisser-déposer directement

### 4. Sauvegarder
- Cliquer sur **"Publish"** en bas
- Attendre la confirmation

## 🎨 Icônes recommandées

Si vous n'avez pas d'icônes, voici des suggestions :

### Service "Rapide, Fiable, Inoubliable"
- 🚀 Icône de fusée (rapidité)
- ⚡ Éclair (vitesse)
- ✓ Check mark (fiabilité)

### Sources d'icônes gratuites
1. **Heroicons** : https://heroicons.com/
2. **Tabler Icons** : https://tabler-icons.io/
3. **Lucide** : https://lucide.dev/
4. **Simple Icons** : https://simpleicons.org/

### Format idéal
- **Type** : SVG ou PNG
- **Taille** : 64x64px ou 128x128px
- **Fond** : Transparent
- **Couleur** : N'importe quelle couleur (sera visible sur fond gris)

## 🔧 Vérification

Après upload, dans la console du navigateur vous devriez voir :
```
iconUrl: "https://cdn.sanity.io/images/..."
```

Au lieu de :
```
iconUrl: null
```

## ⚡ Alternative rapide

Pour tester rapidement avec des icônes par défaut, je peux créer un script qui ajoute des icônes temporaires. Voulez-vous cette option ?

---

**Note** : Les icônes s'affichent immédiatement après l'upload dans Sanity !