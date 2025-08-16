export interface HeroBanner {
  id: string;
  isActive: boolean;
  heroTitle: Record<string, string>;
  heroDescription: Record<string, string>;
  primaryButtonText: Record<string, string>;
  primaryButtonUrl: string;
  secondaryButtonText: Record<string, string>;
  secondaryButtonUrl: string;
  heroImageDesktop?: string;
  heroImageMobile?: string;
  heroImageAlt?: Record<string, string>;
  backgroundImageDesktop?: string;
  backgroundImageMobile?: string;
  homeContentId: string;
}

export interface FeatureItem {
  id: string;
  title: Record<string, string>;
  iconUrl: string;
  order: number;
  featuresSectionId: string;
}

export interface FeaturesSection {
  id: string;
  isActive: boolean;
  homeContentId: string;
  featureItems: FeatureItem[];
}

export interface SeoMetadata {
  id: string;
  seoTitle?: Record<string, string>;
  seoDescription?: Record<string, string>;
  ogImage?: string;
  homeContentId: string;
}

export interface HomeContent {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  heroBanner?: HeroBanner;
  featuresSection?: FeaturesSection;
  seoMetadata?: SeoMetadata;
}

export interface UpdateHomeContentDto {
  heroBanner?: {
    isActive: boolean;
    heroTitle: Record<string, string>;
    heroDescription: Record<string, string>;
    primaryButtonText: Record<string, string>;
    primaryButtonUrl: string;
    secondaryButtonText: Record<string, string>;
    secondaryButtonUrl: string;
    heroImageDesktop?: string;
    heroImageMobile?: string;
    heroImageAlt?: Record<string, string>;
    backgroundImageDesktop?: string;
    backgroundImageMobile?: string;
  };
  featuresSection?: {
    isActive: boolean;
    featureItems: Array<{
      title: Record<string, string>;
      iconUrl: string;
      order: number;
    }>;
  };
  seoMetadata?: {
    seoTitle?: Record<string, string>;
    seoDescription?: Record<string, string>;
    ogImage?: string;
  };
}