'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import StockInfo from '@/components/StockInfo'
import StockChart from '@/components/StockChart'
import DataTable from '@/components/DataTable'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import { StockQuote, HistoricalDataPoint, TimePeriod } from '@/types'
import { getStockQuote, getHistoricalData, searchStocks } from '@/lib/stockService'

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '5D', label: '5D' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: '6M', label: '6M' },
  { value: '1Y', label: '1Y' },
  { value: '2Y', label: '2Y' },
]

export default function HomePage() {
  const [currentStock, setCurrentStock] = useState<StockQuote | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1Y')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load a default stock on initial load
  useEffect(() => {
    handleStockSearch('AAPL')
  }, [])

  const handleStockSearch = async (symbol: string) => {
    if (!symbol.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Fetch stock quote and historical data in parallel
      const [stockQuote, historical] = await Promise.all([
        getStockQuote(symbol),
        getHistoricalData(symbol, selectedPeriod)
      ])

      setCurrentStock(stockQuote)
      setHistoricalData(historical)
    } catch (err) {
      console.error('Error fetching stock data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data')
      setCurrentStock(null)
      setHistoricalData([])
    } finally {
      setLoading(false)
    }
  }

  const handlePeriodChange = async (period: TimePeriod) => {
    if (!currentStock) return

    setSelectedPeriod(period)
    setLoading(true)

    try {
      const historical = await getHistoricalData(currentStock.symbol, period)
      setHistoricalData(historical)
    } catch (err) {
      console.error('Error fetching historical data:', err)
      setError('Failed to fetch historical data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-4">
            Stock Market Dashboard
          </h1>
          <p className="text-lg text-dark-text-secondary max-w-2xl mx-auto">
            Search for any stock symbol to view comprehensive financial data, interactive charts, and key metrics. All data is provided for demonstration purposes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar 
            onSearch={handleStockSearch}
            onSearchSuggestions={searchStocks}
            loading={loading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mb-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Stock Data Display */}
        {currentStock && !loading && (
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stock Info Cards */}
            <StockInfo stock={currentStock} />

            {/* Chart Section */}
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-xl font-semibold text-dark-text mb-4 sm:mb-0">
                  Price Chart
                </h3>
                
                {/* Time Period Selector */}
                <div className="flex flex-wrap gap-2">
                  {TIME_PERIODS.map((period) => (
                    <button
                      key={period.value}
                      onClick={() => handlePeriodChange(period.value)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        selectedPeriod === period.value
                          ? 'bg-purple-primary text-white'
                          : 'bg-dark-card-bg text-dark-text-secondary hover:text-dark-text hover:bg-dark-border'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>

              <StockChart 
                data={historicalData}
                symbol={currentStock.symbol}
                period={selectedPeriod}
              />
            </div>

            {/* Data Table */}
            <DataTable 
              stock={currentStock}
              historicalData={historicalData}
            />

            {/* Demo Data Notice */}
            <div className="card border-l-4 border-blue-500 bg-blue-50/5">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-400 mb-1">Demo Data Notice</h4>
                  <p className="text-sm text-dark-text-secondary">
                    This dashboard uses demo data and free APIs for demonstration purposes. 
                    Popular stocks like AAPL, MSFT, GOOGL, and TSLA include realistic sample data. 
                    Other symbols will generate placeholder data for testing the interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        {!currentStock && !loading && !error && (
          <div className="max-w-4xl mx-auto text-center">
            <div className="card">
              <div className="py-16">
                <div className="w-16 h-16 bg-purple-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-purple-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-dark-text mb-4">
                  Welcome to Stock Market Dashboard
                </h3>
                <p className="text-dark-text-secondary text-lg mb-6">
                  Enter a stock symbol above to view comprehensive financial data, interactive charts, and key metrics.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {['AAPL', 'MSFT', 'GOOGL', 'TSLA'].map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleStockSearch(symbol)}
                      className="px-4 py-2 bg-purple-primary hover:bg-purple-primary/90 text-white font-medium rounded-md transition-colors"
                    >
                      Try {symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}