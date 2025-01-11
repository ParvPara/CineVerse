import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CineVerse',
  description: 'Discover your next favorite movie',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} cinema-bg text-white min-h-screen`}>
        <nav className="glass-nav sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center p-4">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent hover:from-purple-400 hover:to-blue-400 transition-all">
              CineVerse
            </a>
            <div className="space-x-6">
              <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="/favorites" className="hover:text-blue-400 transition-colors">Favorites</a>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
