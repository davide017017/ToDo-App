import type { Metadata } from 'next';
import './styles/globals.css';

// Dati di base per i metadati (URL del sito, descrizione comune, ecc.)
const siteBaseUrl = 'https://todo-app-davide-martinco.netlify.app'; // URL del sito online
const appDescription = 'Una semplice e intuitiva ToDo app creata con Next.js per organizzare le tue attività quotidiane.';

export const metadata: Metadata = {
  // Metadati generali
  metadataBase: new URL(siteBaseUrl),
  title: {
    default: 'ToDo App (NextJs15)',
    template: '%s | ToDo App',
  },
  description: appDescription, 
  keywords: ['todo', 'app', 'nextjs', 'javascript', 'organizzare', 'attività', 'lista', 'cose da fare'],

  // Metadati Open Graph (per la condivisione sui social media)
  openGraph: {
    title: 'ToDo App (NextJs15)',
    description: appDescription, 
    url: siteBaseUrl,
    images: [
      {
        url: '/ogimage.JPG',
        width: 1200,
        height: 630,
        alt: 'Anteprima della ToDo App',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },

  // Metadati per i Robots (motori di ricerca)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },

  // Icone
  icons: {
    icon: '/icon/icons8-lista-di-cose-da-fare-bubbles-96.ico',
    shortcut: '/icon/icons8-lista-di-cose-da-fare-bubbles-16.png',
    apple: '/icon/ToDo-180x180.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/icon/icons8-lista-di-cose-da-fare-bubbles-96.png',
      },
      {
        rel: 'icon',
        url: '/icon/ToDo-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: 'ToDo-900x512.png',
        sizes: '900x512',
        type: 'image/png',
      },
    ],
  },

  // Manifest per PWA
  manifest: '/site.webmanifest',
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
      </head>
      <body className="bg-gradient-to-br from-blue-900 to-black font-sans min-h-screen flex flex-col">
        <header className="bg-gradient-to-b from-blue-200 to-blue-400 text-blue-950 p-4 text-center border-b border-blue-500 shadow-lg">
          <h1 className="text-2xl font-bold tracking-wide text-blue-950">ToDo App</h1>
        </header>
        <main className="container mx-auto p-4 flex-grow">
          {children}
        </main>
        <footer className="bg-gradient-to-t from-blue-200 to-blue-400 text-blue-950 p-4 text-center border-t border-blue-500">
          <p className="text-sm">© {new Date().getFullYear()} Made by davide017017</p>
        </footer>
      </body>
    </html>
  );
}