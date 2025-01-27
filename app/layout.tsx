import type { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ToDo App (NextJs15)', 
    template: '%s | ToDo App',  
  },
  description: 'Una semplice e intuitiva ToDo app creata con Next.js per organizzare le tue attività quotidiane.',
  keywords: ['todo', 'app', 'nextjs', 'javascript', 'organizzare', 'attività', 'lista', 'cose da fare'], 
  openGraph: {
    title: 'ToDo App (NextJs15)',
    description: 'Una semplice e intuitiva ToDo app creata con Next.js per organizzare le tue attività quotidiane.',
    url: 'https://yourwebsite.com', // URL del tuo sito (IMPORTANTE!)///////////////////////////////////////////////////////////////TODO
    images: [
      {
        url: 'https://yourwebsite.com/og-image.png', // URL dell'immagine OG////////////////////////////////////////////////////////TODO
        width: 1200,
        height: 630,
        alt: 'Anteprima della ToDo App',
      },
    ],
    locale: 'it_IT',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1, // Evita anteprime video automatiche
      'max-snippet': -1, // Evita snippet troppo lunghi
      'max-image-preview': 'large', // Massima qualità anteprima immagini
    },
  },
  icons: {
    icon: '/icon/icons8-todo-list-cloud-32.png', // Favicon principale (32x32)
    shortcut: '/icon/icons8-todo-list-cloud-16.png', // Shortcut icon (16x16)
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/icon/icons8-todo-list-cloud-96.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
      </head>
      <body className="bg-blue-950 font-sans min-h-screen flex flex-col">
        <header className="bg-blue-100 text-black p-4 text-center">
          <h1 className="text-2xl font-bold">ToDo App</h1>
        </header>

        <main className="container mx-auto p-4 flex-grow">
          {children}
        </main>

        <footer className="bg-blue-300 text-black p-4 text-center shadow-inner">
          <p className="text-sm">© {new Date().getFullYear()} Made by davide017017</p>
        </footer>
      </body>
    </html>
  );
}