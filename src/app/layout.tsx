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
import { getDatabase } from '@/lib/db';
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
  themeColor: '#0b1118',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'New Chintamani Printing Press | Trusted Printing Since 1999 | Dongaon',
  description:
    'New Chintamani Printing Press in Dongaon (Mehekar, Buldhana) - 25+ years of trusted offset, digital, and flex printing, wedding invitation cards, visiting cards, bill books, and creative designing.',
  keywords: [
    'Printing Press in Dongaon',
    'Printing Shop in Dongaon',
    'Visiting Card Printing Dongaon',
    'Wedding Card Printing Dongaon',
    'Flex Printing Dongaon',
    'Printing Press in Mehekar',
    'Printing Services in Buldhana',
    'New Chintamani Printing Press',
    'Prakash Devendra Jain',
  ],
  authors: [{ name: 'Mr. Prakash Devendra Jain' }],
  metadataBase: new URL('https://newchintamaniprinting.com'),
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = getDatabase();
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
