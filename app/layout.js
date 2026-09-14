import './globals.css';

export const metadata = {
  title: 'ASC IMAGE',
  description: 'Mobile-first GPT Image 2.5 Flare / Sunburst studio',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'ASC IMAGE', statusBarStyle: 'black-translucent' }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b0b0b'
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
