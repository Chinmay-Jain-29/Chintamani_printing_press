import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from 'next/font/google';
import '@/styles/globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';
import { FloatingContact } from '@/components/navigation/FloatingContact';
import { CustomCursor } from '@/components/common/CustomCursor';
import { ScrollRestorationManager } from '@/components/common/ScrollRestorationManager';
import { getDatabaseAsync } from '@/lib/db';
import { safeJsonLdStringify } from '@/lib/security';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  display: 'swap',
  variable: '--font-devanagari',
});

export const viewport: Viewport = {
  themeColor: '#8B0000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://newchintamaniprinting.com'),
  title: {
    default: 'New Chintamani Printing Press | Dongaon (Estd. 1999)',
    template: '%s | New Chintamani Printing Press',
  },
  description:
    'Quality printing services trusted since 1999 in Dongaon, Mehekar, Buldhana. Visiting cards, wedding invitations, flex banners, bill books, and graphic designing by Mr. Prakash Devendra Jain.',
  keywords: [
    'Printing Press in Dongaon',
    'Printing Shop Dongaon',
    'Visiting Card Printing Dongaon',
    'Wedding Card Printing Dongaon',
    'Flex Printing Mehekar',
    'Printing Buldhana',
    'Chintamani Printing Dongaon',
    'Prakash Jain Printing',
  ],
  authors: [{ name: 'Mr. Prakash Devendra Jain', url: 'https://newchintamaniprinting.com' }],
  creator: 'New Chintamani Printing Press',
  publisher: 'New Chintamani Printing Press',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'New Chintamani Printing Press | Dongaon (Estd. 1999)',
    description:
      'Quality offset, digital, and flex printing with 25+ years of trusted heritage in Dongaon, Buldhana. Founded by Mr. Prakash Devendra Jain.',
    url: 'https://newchintamaniprinting.com',
    siteName: 'New Chintamani Printing Press',
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = await getDatabaseAsync();
  const business = db.businessInfo;
  const branding = db.branding;
  const social = db.socialLinks;

  // LocalBusiness Schema markup
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: 'Premier printing and designing services established in 1999 in Dongaon, Maharashtra.',
    founder: {
      '@type': 'Person',
      name: business.owner,
    },
    foundingDate: '1999',
    telephone: [`+91${business.phone1}`, `+91${business.phone2}`],
    email: business.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: 'Dongaon',
      addressRegion: 'Maharashtra',
      postalCode: business.pincode,
      addressCountry: 'IN',
    },
    openingHours: 'Mo-Su 08:00-20:30',
    priceRange: '₹₹',
  };

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${notoSansDevanagari.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if('scrollRestoration' in history){history.scrollRestoration='manual';}window.scrollTo(0,0);}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLd) }}
        />
      </head>
      <body>
        <ScrollRestorationManager />
        <LanguageProvider>
          <CustomCursor />
          <Header
            customLogoUrl={branding.useDefaultVectorLogo ? null : branding.logoUrl}
            phone={business.phone1}
            whatsapp={business.whatsapp}
          />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer business={business} socialLinks={social} />
          <MobileBottomNav />
          <FloatingContact
            phone={business.phone1}
            whatsapp={business.whatsapp}
            email={business.email}
            address={business.address}
          />
        </LanguageProvider>
      </body>
    </html>
  );
}
