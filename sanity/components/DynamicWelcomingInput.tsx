import React, { useEffect, useState } from 'react'
import { ObjectInputProps, StringInputProps, set, unset } from 'sanity'
import { Card, Stack, Text, TextInput, Flex, Badge } from '@sanity/ui'
import { getAdminPreferences, AVAILABLE_LANGUAGES, AdminPreferences } from '../lib/admin-preferences'

/**
 * COMPOSANT DYNAMIQUE POUR SANITY STUDIO
 * ======================================
 * 
 * Ce composant remplace l'interface de saisie standard de Sanity pour créer
 * une expérience multilingue dynamique qui s'adapte aux préférences admin.
 * 
 * FONCTIONNEMENT :
 * ---------------
 * 1. Au chargement, récupère les préférences admin depuis l'API
 * 2. Adapte l'interface selon le mode (monolingue/multilingue)
 * 3. Adapte le stockage selon le type de champ (string/object)
 * 4. Fournit une interface intuitive avec badges et descriptions
 * 
 * TYPES DE CHAMPS SUPPORTÉS :
 * ---------------------------
 * - adaptiveString/adaptiveText → type: string/text → stockage: string
 * - multilingualString/multilingualText → type: object → stockage: objet
 * - Schema home.welcoming → type: object → stockage: objet
 * 
 * MODES DE FONCTIONNEMENT :
 * ------------------------
 * 
 * 1. MODE MONOLINGUE + CHAMP STRING :
 *    → Un seul champ avec la langue par défaut
 *    → Stockage : "Bonjour le monde"
 * 
 * 2. MODE MONOLINGUE + CHAMP OBJECT :
 *    → Un seul champ avec la langue par défaut
 *    → Stockage : { fr: "Bonjour le monde" }
 * 
 * 3. MODE MULTILINGUE + CHAMP STRING :
 *    → Un seul champ avec avertissement (limitation technique)
 *    → Stockage : "Bonjour le monde" (langue par défaut uniquement)
 * 
 * 4. MODE MULTILINGUE + CHAMP OBJECT :
 *    → Plusieurs champs (un par langue supportée)
 *    → Stockage : { fr: "Bonjour", en: "Hello", es: "Hola" }
 * 
 * DÉBOGAGE :
 * ---------
 * - Ouvrez la console du navigateur dans Studio pour voir les logs
 * - Les erreurs de récupération des préférences sont gérées gracieusement
 * - En cas d'erreur, fallback vers mode monolingue français
 */

type WelcomingValue = Record<string, string> | string
type DynamicInputProps = ObjectInputProps<WelcomingValue> | StringInputProps

export default function DynamicWelcomingInput(props: DynamicInputProps) {
  const { onChange, value = {}, elementProps, schemaType } = props
  const [preferences, setPreferences] = useState<AdminPreferences | null>(null)
  const [loading, setLoading] = useState(true)

  // Logs de débogage pour les développeurs
  console.log('====================================');
  console.log('[DynamicWelcomingInput] Component loaded');
  console.log('[DynamicWelcomingInput] Current value:', value);
  console.log('[DynamicWelcomingInput] Schema type:', schemaType);
  console.log('[DynamicWelcomingInput] JSON type:', schemaType?.jsonType);
  console.log('====================================');

  /**
   * Récupération des préférences admin au chargement
   * Gère les erreurs gracieusement avec fallback vers mode monolingue
   */
  useEffect(() => {
    async function fetchPreferences() {
      try {
        console.log('[DynamicWelcomingInput] Fetching admin preferences...');
        const prefs = await getAdminPreferences()
        console.log('[DynamicWelcomingInput] Preferences fetched:', prefs)
        setPreferences(prefs)
      } catch (error) {
        console.error('[DynamicWelcomingInput] Error fetching admin preferences:', error)
        // Fallback gracieux - mode monolingue français
        setPreferences({
          isMultilingual: false,
          supportedLanguages: ['fr'],
          defaultLanguage: 'fr',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [])

  /**
   * Gestionnaire de changement de valeur
   * Logic complexe pour gérer les différents modes et types de stockage
   * 
   * @param langCode - Code de la langue (fr, en, es, etc.)
   * @param newValue - Nouvelle valeur saisie par l'utilisateur
   */
  const handleChange = (langCode: string, newValue: string) => {
    if (!preferences) return

    const isObjectType = schemaType?.jsonType === 'object'
    
    console.log('[DynamicWelcomingInput] handleChange:', {
      langCode,
      newValue,
      isObjectType,
      isMultilingual: preferences.isMultilingual
    });
    
    if (!preferences.isMultilingual) {
      // MODE MONOLINGUE : toujours stocker comme string simple
      // Peu importe le type de schéma, on stocke la valeur directement
      console.log('[DynamicWelcomingInput] Monolingual mode: storing as string');
      onChange(newValue ? set(newValue) : unset())
    } else {
      // MODE MULTILINGUE : comportement selon le type de schéma
      if (isObjectType) {
        // CHAMP OBJECT : stocker toutes les langues dans un objet
        console.log('[DynamicWelcomingInput] Multilingual + Object: storing as object');
        const currentValue = typeof value === 'object' && value !== null ? value : {}
        const updatedValue = { ...currentValue, [langCode]: newValue }
        
        // Supprimer les champs vides pour maintenir la propreté
        if (!newValue) {
          delete updatedValue[langCode]
        }
        
        onChange(Object.keys(updatedValue).length > 0 ? set(updatedValue) : unset())
      } else {
        // CHAMP STRING : limitation technique, stocker seulement la langue par défaut
        console.log('[DynamicWelcomingInput] Multilingual + String: storing default language only');
        if (langCode === preferences.defaultLanguage) {
          onChange(newValue ? set(newValue) : unset())
        }
        // Ignorer les autres langues car on ne peut pas les stocker dans un champ string
      }
    }
  }

  // États de chargement et d'erreur
  if (loading) {
    return (
      <Card padding={3} radius={2} shadow={1}>
        <Text size={1} muted>
          🔄 Chargement des préférences linguistiques...
        </Text>
      </Card>
    )
  }

  if (!preferences) {
    return (
      <Card padding={3} radius={2} shadow={1} tone="critical">
        <Text size={1}>
          ❌ Erreur lors du chargement des préférences linguistiques
        </Text>
      </Card>
    )
  }

  const isObjectType = schemaType?.jsonType === 'object'
  
  // RENDU MODE MONOLINGUE
  if (!preferences.isMultilingual) {
    const language = AVAILABLE_LANGUAGES.find(l => l.code === preferences.defaultLanguage)
    const currentValue = typeof value === 'string' ? value : (value as any)?.[preferences.defaultLanguage] || ''

    return (
      <Stack space={3}>
        <Flex align="center" gap={2}>
          <Text size={1} weight="medium">
            Texte
          </Text>
          <Badge tone="primary" fontSize={0}>
            {language?.name || preferences.defaultLanguage}
          </Badge>
          <Badge tone="default" fontSize={0}>
            Mode monolingue
          </Badge>
        </Flex>
        <TextInput
          {...elementProps}
          value={currentValue}
          onChange={(event) => handleChange(preferences.defaultLanguage, event.currentTarget.value)}
          placeholder={`Saisissez votre texte en ${language?.name || preferences.defaultLanguage}`}
        />
        <Card padding={2} radius={2} tone="primary">
          <Text size={0} muted>
            💡 Pour activer le mode multilingue, modifiez les préférences depuis la page d'accueil.
          </Text>
        </Card>
      </Stack>
    )
  }

  // RENDU MODE MULTILINGUE avec limitation pour champs STRING
  if (!isObjectType) {
    const language = AVAILABLE_LANGUAGES.find(l => l.code === preferences.defaultLanguage)
    const currentValue = typeof value === 'string' ? value : (value as any)?.[preferences.defaultLanguage] || ''

    return (
      <Stack space={3}>
        <Flex align="center" gap={2}>
          <Text size={1} weight="medium">
            Texte ({language?.name || preferences.defaultLanguage})
          </Text>
          <Badge tone="caution" fontSize={0}>
            Langue par défaut uniquement
          </Badge>
        </Flex>
        <TextInput
          {...elementProps}
          value={currentValue}
          onChange={(event) => handleChange(preferences.defaultLanguage, event.currentTarget.value)}
          placeholder={`Texte en ${language?.name || preferences.defaultLanguage}`}
        />
        <Card padding={2} radius={2} tone="caution">
          <Text size={0} muted>
            ⚠️ Ce champ ne supporte qu'une seule langue car il est défini comme 'string' ou 'text'. 
            Pour le multilingue complet, utilisez un champ de type 'multilingualString' ou 'multilingualText'.
          </Text>
        </Card>
      </Stack>
    )
  }

  // RENDU MODE MULTILINGUE COMPLET (champ object)
  const currentValue = typeof value === 'object' && value !== null ? value : {}

  return (
    <Stack space={4}>
      <Flex align="center" gap={2}>
        <Text size={1} weight="medium">
          Texte multilingue
        </Text>
        <Badge tone="positive" fontSize={0}>
          {preferences.supportedLanguages.length} langue{preferences.supportedLanguages.length > 1 ? 's' : ''}
        </Badge>
        <Badge tone="default" fontSize={0}>
          Mode multilingue
        </Badge>
      </Flex>
      
      <Stack space={3}>
        {preferences.supportedLanguages.map((langCode) => {
          const language = AVAILABLE_LANGUAGES.find(l => l.code === langCode)
          const isDefault = langCode === preferences.defaultLanguage
          
          return (
            <Card key={langCode} padding={3} radius={2} shadow={1}>
              <Stack space={2}>
                <Flex align="center" gap={2}>
                  <Text size={1} weight="medium">
                    {language?.name || langCode}
                  </Text>
                  {isDefault && (
                    <Badge tone="primary" fontSize={0}>
                      Par défaut
                    </Badge>
                  )}
                </Flex>
                <TextInput
                  value={currentValue[langCode] || ''}
                  onChange={(event) => handleChange(langCode, event.currentTarget.value)}
                  placeholder={`Texte en ${language?.name || langCode}`}
                />
              </Stack>
            </Card>
          )
        })}
      </Stack>
      
      <Card padding={2} radius={2} tone="primary">
        <Text size={0} muted>
          💡 Pour modifier les langues supportées, utilisez les préférences linguistiques de l'application.
        </Text>
      </Card>
    </Stack>
  )
} 