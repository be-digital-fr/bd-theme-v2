import { defineQuery } from 'next-sanity';

export const getSettingsQuery = defineQuery(`
  *[_type == "settings"][0] {
    _id,
    title,
    isMultilingual,
    supportedLanguages,
    defaultLanguage,
    headerSettings {
      logoType,
      logoText,
      logoImage {
        asset->{
          _id,
          url
        },
        alt
      },
      headerStyle,
      stickyHeader,
      showSearchIcon,
      showUserIcon,
      showCartIcon,
      cartBadgeCount
    },
    navigation {
      menuItems[]{
        _key,
        label,
        slug,
        href,
        isExternal,
        openInNewTab,
        isActive
      },
      footerMenuItems[]{
        _key,
        label,
        href,
        isExternal,
        isActive
      },
      mobileMenuTitle
    }
  }
`);