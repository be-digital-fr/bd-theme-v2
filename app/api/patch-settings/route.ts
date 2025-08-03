import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-07-05',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});

export async function POST() {
  try {

    // Récupérer le document settings existant
    const existing = await client.fetch('*[_type == "settings"][0]');

    if (!existing) {
      return NextResponse.json(
        { error: 'No settings document found' },
        { status: 404 }
      );
    }


    // Données à ajouter
    const patchData: Record<string, unknown> = {};

    // Ajouter headerSettings s'il n'existe pas
    if (!existing.headerSettings) {
      patchData.headerSettings = {
        logoType: 'text',
        logoText: 'BD Theme',
        headerStyle: 'transparent',
        stickyHeader: true,
        showSearchIcon: true,
        showUserIcon: true,
        showCartIcon: true,
        cartBadgeCount: 0,
      };
    }

    // Ajouter navigationSettings s'il n'existe pas
    if (!existing.navigationSettings) {
      patchData.navigationSettings = {
        menuItems: [
          {
            _key: 'item1',
            label: {
              fr: 'Accueil',
              en: 'Home',
              es: 'Inicio',
            },
            slug: {
              current: 'accueil',
              _type: 'slug',
            },
            href: '/',
            isExternal: false,
            openInNewTab: false,
            order: 1,
            isActive: true,
          },
          {
            _key: 'item2',
            label: {
              fr: 'Menu',
              en: 'Menu',
              es: 'Menú',
            },
            slug: {
              current: 'menu',
              _type: 'slug',
            },
            href: '/menu',
            isExternal: false,
            openInNewTab: false,
            order: 2,
            isActive: true,
          },
          {
            _key: 'item3',
            label: {
              fr: 'À propos',
              en: 'About',
              es: 'Acerca de',
            },
            slug: {
              current: 'a-propos',
              _type: 'slug',
            },
            href: '/about',
            isExternal: false,
            openInNewTab: false,
            order: 3,
            isActive: true,
          },
          {
            _key: 'item4',
            label: {
              fr: 'Blog',
              en: 'Blog',
              es: 'Blog',
            },
            slug: {
              current: 'blog',
              _type: 'slug',
            },
            href: '/blog',
            isExternal: false,
            openInNewTab: false,
            order: 4,
            isActive: true,
          },
          {
            _key: 'item5',
            label: {
              fr: 'Contact',
              en: 'Contact',
              es: 'Contacto',
            },
            slug: {
              current: 'contact',
              _type: 'slug',
            },
            href: '/contact',
            isExternal: false,
            openInNewTab: false,
            order: 5,
            isActive: true,
          },
        ],
        mobileMenuTitle: {
          fr: 'Menu',
          en: 'Menu',
          es: 'Menú',
        },
      };
    }

    // Si des champs doivent être ajoutés
    if (Object.keys(patchData).length > 0) {

      // Utiliser patch pour mettre à jour le document
      await client
        .patch(existing._id)
        .setIfMissing(patchData)
        .commit();


      // Vérifier le résultat
      const updated = await client.fetch(`
        *[_type == "settings"][0] {
          _id,
          headerSettings,
          navigationSettings
        }
      `);

      return NextResponse.json({
        success: true,
        message: 'Settings patched successfully',
        data: {
          headerSettings: updated.headerSettings ? '✅ Present' : '❌ Missing',
          navigationSettings: updated.navigationSettings
            ? '✅ Present'
            : '❌ Missing',
          menuItemsCount: updated.navigationSettings?.menuItems?.length || 0,
        },
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'All fields are already present',
        data: existing,
      });
    }
  } catch (error) {
    console.error('❌ Error patching settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to patch settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const settings = await client.fetch(`
      *[_type == "settings"][0] {
        _id,
        headerSettings,
        navigationSettings {
          menuItems[] {
            label,
            slug,
            href,
            order,
            isActive
          },
          mobileMenuTitle
        }
      }
    `);

    return NextResponse.json({
      settings,
      hasHeaderSettings: !!settings?.headerSettings,
      hasNavigationSettings: !!settings?.navigationSettings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
