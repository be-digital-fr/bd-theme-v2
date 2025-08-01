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

    // Google OAuth Configuration
    defineField({
      name: "googleAuth",
      title: "Configuration Google OAuth",
      type: "object",
      description: "Configuration pour l'authentification Google",
      group: "providers",
      fields: [
        {
          name: "enabled",
          title: "Activer Google OAuth",
          type: "boolean",
          description: "Permettre la connexion avec Google",
          initialValue: false,
        },
        {
          name: "clientId",
          title: "Google Client ID",
          type: "string",
          description: "ID client Google obtenu depuis Google Cloud Console",
          hidden: ({ parent }) => !parent?.enabled,
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { enabled?: boolean };
              if (parent?.enabled && !value) {
                return "Client ID requis quand Google OAuth est activé";
              }
              return true;
            }),
        },
        {
          name: "clientSecret",
          title: "Google Client Secret",
          type: "string",
          description: "Secret client Google obtenu depuis Google Cloud Console",
          hidden: ({ parent }) => !parent?.enabled,
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { enabled?: boolean };
              if (parent?.enabled && !value) {
                return "Client Secret requis quand Google OAuth est activé";
              }
              return true;
            }),
        },
        {
          name: "instructions",
          type: "text",
          title: "Instructions de configuration",
          readOnly: true,
          hidden: ({ parent }) => !parent?.enabled,
          initialValue: "1. Allez sur Google Cloud Console\n2. Créez un nouveau projet ou sélectionnez un existant\n3. Activez l'API Google+ ou People API\n4. Créez des identifiants OAuth 2.0\n5. Ajoutez vos domaines autorisés\n6. Copiez le Client ID et Client Secret ci-dessus",
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),

    // Facebook OAuth Configuration
    defineField({
      name: "facebookAuth",
      title: "Configuration Facebook OAuth",
      type: "object",
      description: "Configuration pour l'authentification Facebook",
      group: "providers",
      fields: [
        {
          name: "enabled",
          title: "Activer Facebook OAuth",
          type: "boolean",
          description: "Permettre la connexion avec Facebook",
          initialValue: false,
        },
        {
          name: "appId",
          title: "Facebook App ID",
          type: "string",
          description: "ID d'application Facebook obtenu depuis Facebook Developers",
          hidden: ({ parent }) => !parent?.enabled,
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { enabled?: boolean };
              if (parent?.enabled && !value) {
                return "App ID requis quand Facebook OAuth est activé";
              }
              return true;
            }),
        },
        {
          name: "appSecret",
          title: "Facebook App Secret",
          type: "string",
          description: "Secret d'application Facebook obtenu depuis Facebook Developers",
          hidden: ({ parent }) => !parent?.enabled,
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { enabled?: boolean };
              if (parent?.enabled && !value) {
                return "App Secret requis quand Facebook OAuth est activé";
              }
              return true;
            }),
        },
        {
          name: "instructions",
          type: "text",
          title: "Instructions de configuration",
          readOnly: true,
          hidden: ({ parent }) => !parent?.enabled,
          initialValue: "1. Allez sur Facebook Developers (developers.facebook.com)\n2. Créez une nouvelle app ou sélectionnez une existante\n3. Ajoutez le produit 'Facebook Login'\n4. Configurez les domaines autorisés\n5. Copiez l'App ID et App Secret ci-dessus\n6. Activez l'app en production",
        },
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
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