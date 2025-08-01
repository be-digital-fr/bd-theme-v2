import { defineField } from "sanity";
import { UserIcon, CogIcon } from '@sanity/icons';
import { createSingleton } from "../../lib/singletons";
import { autoMultilingualString } from "../locale";

export const authSettings = createSingleton({
  name: "authSettings",
  title: "Paramètres d'authentification",
  icon: UserIcon,
  groups: [
    {
      name: "behavior",
      title: "Comportement",
    },
    {
      name: "providers",
      title: "Fournisseurs sociaux",
    },
    {
      name: "ui",
      title: "Interface utilisateur",
    },
  ],
  fields: [
    // Comportement d'authentification
    defineField({
      name: "redirectType",
      title: "Type de redirection",
      type: "string",
      description: "Comment ouvrir l'authentification depuis l'icône utilisateur",
      group: "behavior",
      options: {
        list: [
          { title: "Ouvrir une page dédiée", value: "page" },
          { title: "Ouvrir un modal", value: "modal" },
        ],
        layout: "radio",
      },
      initialValue: "page",
      validation: (rule) => rule.required(),
    }),
    
    defineField({
      name: "defaultAuthPage",
      title: "Page d'authentification par défaut",
      type: "string",
      description: "Quelle page afficher en premier",
      group: "behavior",
      options: {
        list: [
          { title: "Connexion", value: "signin" },
          { title: "Inscription", value: "signup" },
        ],
        layout: "radio",
      },
      initialValue: "signin",
      validation: (rule) => rule.required(),
    }),

    // Fournisseurs d'authentification sociale
    defineField({
      name: "oauthInfo",
      title: "Configuration OAuth",
      type: "object",
      description: "Informations importantes sur la configuration OAuth",
      group: "providers",
      fields: [
        {
          name: "info",
          type: "text",
          title: "Informations",
          readOnly: true,
          initialValue: "⚠️ Pour activer les fournisseurs OAuth, vous devez configurer les variables d'environnement correspondantes :\n\n• Google: GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET\n• Facebook: FACEBOOK_CLIENT_ID et FACEBOOK_CLIENT_SECRET\n\nConsultez la documentation AUTH.md pour les instructions détaillées.",
        }
      ],
      options: {
        collapsible: true,
        collapsed: false
      }
    }),

    defineField({
      name: "enableGoogleAuth",
      title: "Activer Google",
      type: "boolean",
      description: "Permettre la connexion avec Google (nécessite GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET)",
      group: "providers",
      initialValue: false,
    }),

    defineField({
      name: "enableFacebookAuth",
      title: "Activer Facebook",
      type: "boolean",
      description: "Permettre la connexion avec Facebook (nécessite FACEBOOK_CLIENT_ID et FACEBOOK_CLIENT_SECRET)",
      group: "providers",
      initialValue: false,
    }),

    defineField({
      name: "enableTwitterAuth",
      title: "Activer Twitter/X",
      type: "boolean",
      description: "Permettre la connexion avec Twitter/X",
      group: "providers",
      initialValue: false,
    }),

    defineField({
      name: "enableGitHubAuth",
      title: "Activer GitHub",
      type: "boolean",
      description: "Permettre la connexion avec GitHub",
      group: "providers",
      initialValue: false,
    }),

    // Personnalisation de l'interface
    defineField({
      name: "modalTitle",
      title: "Titre du modal",
      type: "autoMultilingualString",
      description: "Titre affiché en haut du modal d'authentification",
      group: "ui",
      initialValue: {
        fr: "Connexion à votre compte",
        en: "Sign in to your account",
      },
    }),

    defineField({
      name: "modalDescription",
      title: "Description du modal",
      type: "autoMultilingualString",
      description: "Description affichée sous le titre du modal",
      group: "ui",
      initialValue: {
        fr: "Accédez à votre espace personnel",
        en: "Access your personal space",
      },
    }),

    defineField({
      name: "authButtonText",
      title: "Texte du bouton d'authentification",
      type: "autoMultilingualString",
      description: "Texte du bouton dans le menu utilisateur (quand non connecté)",
      group: "ui",
      initialValue: {
        fr: "Se connecter",
        en: "Sign in",
      },
    }),

    defineField({
      name: "showSocialProviders",
      title: "Afficher les fournisseurs sociaux",
      type: "boolean",
      description: "Afficher les boutons de connexion sociale même s'ils ne sont pas activés (pour la démo)",
      group: "ui",
      initialValue: false,
    }),
  ],
});