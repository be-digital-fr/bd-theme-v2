import { definePlugin } from 'sanity';
import { initializeSingletons } from '../lib/singletons';

/**
 * Plugin Sanity pour initialiser automatiquement les documents singleton
 * 
 * Ce plugin s'exécute au démarrage de Sanity Studio et vérifie que tous
 * les documents singleton existent avec leurs données par défaut.
 */
export const singletonInitializer = definePlugin({
  name: 'singleton-initializer',
  studio: {
    components: {
      layout: (props) => {
        // Initialiser les singletons au montage du layout
        React.useEffect(() => {
          const timer = setTimeout(() => {
            initializeSingletons().catch(console.error);
          }, 1000); // Délai pour permettre à Sanity de se charger complètement

          return () => clearTimeout(timer);
        }, []);

        return props.renderDefault(props);
      },
    },
  },
});

// Version alternative avec React import
import React from 'react';

export const singletonInitializerPlugin = definePlugin({
  name: 'singleton-initializer',
  studio: {
    components: {
      layout: (props) => {
        const [initialized, setInitialized] = React.useState(false);

        React.useEffect(() => {
          if (!initialized) {
            // Petite attente pour s'assurer que Sanity est prêt
            const timer = setTimeout(async () => {
              try {
                console.log('[Plugin] Initializing singleton documents...');
                await initializeSingletons();
                setInitialized(true);
                console.log('[Plugin] Singleton documents initialized successfully');
              } catch (error) {
                console.error('[Plugin] Error initializing singletons:', error);
              }
            }, 2000);

            return () => clearTimeout(timer);
          }
        }, [initialized]);

        return props.renderDefault(props);
      },
    },
  },
});