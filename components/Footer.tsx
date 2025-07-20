export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-purple-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-text">Stock Market Dashboard</h3>
          </div>
          
          <p className="text-dark-text-secondary text-sm mb-4">
            Real-time financial data and comprehensive market analysis
          </p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-dark-text-secondary">
            <span>© {currentYear} Stock Market Dashboard</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Built with Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  )
}