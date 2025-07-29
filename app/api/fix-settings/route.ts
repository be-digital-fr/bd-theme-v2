import { createClient } from '@sanity/client';
import { NextResponse } from 'next/server';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-07-05',
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
});

const defaultSettingsData = {
  headerSettings: {
    logoType: 'text',
    logoText: 'BD Theme',
    headerStyle: 'transparent',
    stickyHeader: true,
    showSearchIcon: true,
    showUserIcon: true,
    showCartIcon: true,
    cartBadgeCount: 0,
  },
  navigationSettings: {
    menuItems: [
      {
        label: {
          fr: 'Accueil',
          en: 'Home',
        },
        slug: {
          current: 'accueil',
        },
        href: '/',
        isExternal: false,
        openInNewTab: false,
        order: 1,
        isActive: true,
      },
      {
        label: {
          fr: 'Menu',
          en: 'Menu',
        },
        slug: {
          current: 'menu',
        },
        href: '/menu',
        isExternal: false,
        openInNewTab: false,
        order: 2,
        isActive: true,
      },
      {
        label: {
          fr: 'À propos',
          en: 'About',
        },
        slug: {
          current: 'a-propos',
        },
        href: '/about',
        isExternal: false,
        openInNewTab: false,
        order: 3,
        isActive: true,
      },
      {
        label: {
          fr: 'Blog',
          en: 'Blog',
        },
        slug: {
          current: 'blog',
        },
        href: '/blog',
        isExternal: false,
        openInNewTab: false,
        order: 4,
        isActive: true,
      },
      {
        label: {
          fr: 'Contact',
          en: 'Contact',
        },
        slug: {
          current: 'contact',
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
    },
  },
};

export async function POST() {
  try {
    // Find existing settings document
    const existingSettings = await client.fetch('*[_type == "settings"][0]');
    
    if (!existingSettings) {
      return NextResponse.json({ error: 'No settings document found' }, { status: 404 });
    }

    // Update the document with missing fields
    const updated = await client
      .patch(existingSettings._id)
      .set(defaultSettingsData)
      .commit();

    return NextResponse.json({ 
      success: true, 
      message: 'Settings updated successfully',
      data: updated 
    });
  } catch (error) {
    console.error('Error fixing settings:', error);
    return NextResponse.json({ 
      error: 'Failed to update settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const settings = await client.fetch(`
      *[_type == "settings"][0] {
        _id,
        title,
        headerSettings,
        navigationSettings {
          menuItems[] {
            label,
            slug,
            href,
            order,
            isActive
          }
        }
      }
    `);

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}