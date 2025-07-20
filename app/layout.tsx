import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stock Market Dashboard',
  description: 'A comprehensive stock market dashboard with real-time data, interactive charts, and financial analysis tools.',
  keywords: 'stock market, financial data, charts, yahoo finance, trading, investment',
  authors: [{ name: 'Stock Dashboard Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#8b5cf6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-dark-bg text-dark-text">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}