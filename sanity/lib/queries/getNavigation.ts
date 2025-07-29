import { defineQuery } from 'next-sanity';

export const getNavigationQuery = defineQuery(`
  *[_type == "navigation"][0] {
    _id,
    title,
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
`);