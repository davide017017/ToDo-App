import type { Metadata } from 'next'
import './styles/globals.css' 

export const metadata: Metadata = {
  title: 'ToDo App (NextJs15)',
  description: 'Una semplice ToDo app creata con Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="bg-blue-950 font-sans min-h-screen flex flex-col"> {/* Stili di base per il body */}
        <header className="bg-blue-100 text-black p-4 text-center">
          <h1 className="text-2xl font-bold">ToDo App</h1>
        </header>

        <main className="container mx-auto p-4 flex-grow"> {/* Il main occupa lo spazio disponibile */}
          {children}
        </main>

        <footer className="bg-blue-300 text-black p-4 text-center shadow-inner">
          <p className="text-sm">© {new Date().getFullYear()} Made by davide017017</p>
        </footer>
      </body>
    </html>
  );
}