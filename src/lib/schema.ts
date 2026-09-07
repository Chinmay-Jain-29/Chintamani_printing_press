export type SupportedLanguage = 'en' | 'mr' | 'hi';

export interface BusinessInfo {
  name: string;
  owner: string;
  establishedYear: number;
  tagline_en: string;
  tagline_mr: string;
  tagline_hi: string;
  address: string;
  taluka: string;
  district: string;
  state: string;
  pincode: string;
  phone1: string;
  phone2: string;
  whatsapp: string;
  email: string;
  businessHours_en: string;
  businessHours_mr: string;
  businessHours_hi: string;
  googleMapsUrl: string;
  ownerTitle_en?: string;
  ownerTitle_mr?: string;
  ownerTitle_hi?: string;
  ownerBio_en?: string;
  ownerBio_mr?: string;
  ownerBio_hi?: string;
  ownerPhotoUrl?: string | null;
}

export interface Branding {
  logoUrl: string | null;
  darkLogoUrl: string | null;
  useDefaultVectorLogo: boolean;
  altText: string;
}

export interface HeroSection {
  badge_en: string;
  badge_mr: string;
  badge_hi: string;
  title_en: string;
  title_mr: string;
  title_hi: string;
  subtitle_en: string;
  subtitle_mr: string;
  subtitle_hi: string;
  primaryCtaText_en: string;
  primaryCtaText_mr: string;
  primaryCtaText_hi: string;
  primaryCtaLink: string;
  secondaryCtaText_en: string;
  secondaryCtaText_mr: string;
  secondaryCtaText_hi: string;
  secondaryCtaLink: string;
  heroImageUrl: string;
}

export interface TrustStat {
  id: string;
  value: string;
  label_en: string;
  label_mr: string;
  label_hi: string;
  description_en: string;
  description_mr: string;
  description_hi: string;
}

export interface TimelineMilestone {
  year: string;
  title_en: string;
  title_mr: string;
  title_hi: string;
  desc_en: string;
  desc_mr: string;
  desc_hi: string;
}

export interface HomepageConfig {
  hero: HeroSection;
  stats: TrustStat[];
  timeline: TimelineMilestone[];
  showStats: boolean;
  showTimeline: boolean;
  showFeaturedServices: boolean;
  showWhyChooseUs: boolean;
  showTopWorks: boolean;
  showReviews: boolean;
  showQuoteBanner: boolean;
}

export type ServiceCategory = 'printing' | 'designing' | 'other' | 'coming-soon';

export interface Service {
  id: string;
  slug: string;
  name_en: string;
  name_mr: string;
  name_hi: string;
  desc_en: string;
  desc_mr: string;
  desc_hi: string;
  category: ServiceCategory;
  icon: string;
  imageUrl?: string;
  featured: boolean;
  comingSoon: boolean;
  visible: boolean;
  sortOrder: number;
}

export type PortfolioCategory =
  | 'visiting-cards'
  | 'wedding'
  | 'invitations'
  | 'business-printing'
  | 'promotional'
  | 'packaging'
  | 'other';

export interface PortfolioItem {
  id: string;
  title_en: string;
  title_mr: string;
  title_hi: string;
  desc_en: string;
  desc_mr: string;
  desc_hi: string;
  category: PortfolioCategory;
  imageUrl: string;
  thumbnailUrl?: string;
  featured: boolean;
  topWork: boolean;
  visible: boolean;
  sortOrder: number;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  customerName: string;
  location?: string;
  rating: number; // 1 to 5
  reviewText: string;
  language: SupportedLanguage;
  customerPhoto?: string;
  status: ReviewStatus;
  featured: boolean;
  createdAt: string; // ISO string
}

export type QuoteStatus = 'New' | 'Contacted' | 'In Progress' | 'Completed' | 'Cancelled';
export type PreferredContactMethod = 'Phone' | 'WhatsApp' | 'Email';

export interface QuoteRequest {
  id: string; // e.g. "CP-2026-001"
  customerName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  service: string;
  quantity?: string;
  sizeSpecification?: string;
  requirements: string;
  preferredContact: PreferredContactMethod;
  status: QuoteStatus;
  internalNotes?: string;
  createdAt: string; // ISO string
  updatedAt?: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
  whatsappChannel: string;
}

export interface SeoSettings {
  siteTitle_en: string;
  siteTitle_mr: string;
  siteTitle_hi: string;
  metaDescription_en: string;
  metaDescription_mr: string;
  metaDescription_hi: string;
  keywords_en: string;
  keywords_mr: string;
  keywords_hi: string;
  ogImage: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  tokenVersion?: number;
  resetTokenHash?: string;
  resetToken?: string; // Legacy fallback
  resetExpires?: string;
}

export interface AppDatabase {
  businessInfo: BusinessInfo;
  branding: Branding;
  homepage: HomepageConfig;
  services: Service[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  quotes: QuoteRequest[];
  socialLinks: SocialLinks;
  seo: SeoSettings;
  admin: AdminUser;
  translations: Record<string, Record<SupportedLanguage, string>>;
}
