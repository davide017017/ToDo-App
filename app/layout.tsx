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
    url: 'https://todo-app-davide-martinco.netlify.app/', 
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
    icon: '/icon/icons8-lista-di-cose-da-fare-bubbles-96.ico',
    shortcut: '/icon/icons8-lista-di-cose-da-fare-bubbles-16.png',
    apple: '/icon/ToDo-180x180.png', // Dimensioni tipiche per Apple touch icon
    other: [
        {
            rel: 'apple-touch-icon',
            url: '/icon/icons8-lista-di-cose-da-fare-bubbles-96.png',
        },
        {
            rel: 'icon', // Per le icone "normali" (non apple)
            url: '/icon/ToDo-192x192.png',
            sizes: '192x192',
            type: 'image/png'
        },
                {
            rel: 'icon',
            url: 'ToDo-900x512.png',
            sizes: '900x512',
            type: 'image/png'
        },

    ],
},
  manifest: '/site.webmanifest',
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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