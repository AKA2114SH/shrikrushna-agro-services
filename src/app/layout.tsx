import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import DemoBanner from '@/components/DemoBanner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppChatWidget from '@/components/WhatsAppChatWidget';

export const metadata: Metadata = {
  title: 'श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर | Shri Krishna Agro Services (Seeds, Fertilizers, Agrochemicals)',
  description:
    'सिन्नर तालुक्यातील विश्वासू कृषी सेवा केंद्र. बियाणे, रासायनिक व विद्राव्य खते (१९:१९:१९, ०:५२:३४), कीटकनाशके, बुरशीनाशके आणि B.Sc Agri तज्ञांचा थेट पीक सल्ला. शुभम गमाणे (8605620843) व जगदीश बोडके (8888474456).',
  keywords: [
    'Shri Krishna Agro Services',
    'Shri Krishna Agro Sinnar',
    'Agro services Sinnar',
    'Seeds shop Sinnar',
    'Fertilizer shop Sinnar',
    'Water soluble fertilizers Sinnar',
    'Agriculture shop Nashik',
    'Pesticides shop Sinnar',
    'Shubham Gamane',
    'Jagdish Bodke',
    'कांदा खते सिन्नर',
    'द्राक्ष औषधे नाशिक',
  ],
  authors: [{ name: 'Shri Krishna Agro Services' }, { name: 'Shubham Gamane' }, { name: 'Jagdish Bodke' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'श्री कृष्ण ॲग्रो सर्व्हिसेस, सिन्नर | Shri Krishna Agro Services',
    description: 'विश्वासू कृषी निविष्ठा, बियाणे, खते व आधुनिक पीक सल्ला केंद्र, सिन्नर, नाशिक.',
    locale: 'mr_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Shri Krishna Agro Services',
    alternateName: 'श्री कृष्ण ॲग्रो सर्व्हिसेस',
    description: 'Agricultural Input Retail, Seeds, Fertilizers, Crop Protection & Expert Advisory Center in Sinnar, Nashik.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Market',
      addressLocality: 'Sinnar',
      addressRegion: 'Maharashtra',
      postalCode: '422103',
      addressCountry: 'IN',
    },
    telephone: '+918605620843',
    openingHours: 'Mo-Su 08:00-20:30',
    priceRange: '₹₹',
  };

  return (
    <html lang="mr" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <WhatsAppChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
