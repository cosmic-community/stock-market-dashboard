'use client'

import { useState } from 'react'
import { StockQuote, HistoricalDataPoint, TimePeriod } from '@/types'
import SearchBar from '@/components/SearchBar'
import StockInfo from '@/components/StockInfo'
import StockChart from '@/components/StockChart'
import DataTable from '@/components/DataTable'
import LoadingSpinner from '@/components/LoadingSpinner'
import ErrorMessage from '@/components/ErrorMessage'
import Footer from '@/components/Footer'
import { getStockQuote, getHistoricalData, convertPeriodToRange } from '@/lib/yahooFinance'

export default function HomePage() {
  const [stockData, setStockData] = useState<StockQuote | null>(null)
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1Y')

  const handleSearch = async (symbol: string) => {
    if (!symbol.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Fetch both quote and historical data
      const [quote, historical] = await Promise.all([
        getStockQuote(symbol.toUpperCase()),
        getHistoricalData(symbol.toUpperCase(), convertPeriodToRange(selectedPeriod))
      ])

      setStockData(quote)
      setHistoricalData(historical)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stock data'
      setError(errorMessage)
      setStockData(null)
      setHistoricalData([])
    } finally {
      setLoading(false)
    }
  }

  const handlePeriodChange = async (period: TimePeriod) => {
    if (!stockData || loading) return

    setSelectedPeriod(period)
    setLoading(true)
    setError(null)

    try {
      const historical = await getHistoricalData(
        stockData.symbol, 
        convertPeriodToRange(period)
      )
      setHistoricalData(historical)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch historical data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <div className="bg-dark-surface border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Stock Market Dashboard
            </h1>
            <p className="text-dark-text-secondary text-lg">
              Real-time financial data, interactive charts, and comprehensive analysis
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Loading State */}
        {loading && !stockData && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Stock Data Display */}
        {stockData && !loading && (
          <div className="space-y-8">
            {/* Stock Info Cards */}
            <StockInfo stock={stockData} />

            {/* Chart Section */}
            {historicalData.length > 0 && (
              <div className="card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-2xl font-bold text-dark-text mb-4 sm:mb-0">
                    Price Chart
                  </h2>
                  
                  {/* Period Selector */}
                  <div className="flex space-x-2">
                    {(['1D', '5D', '1M', '3M', '6M', '1Y', '2Y'] as TimePeriod[]).map((period) => (
                      <button
                        key={period}
                        onClick={() => handlePeriodChange(period)}
                        disabled={loading}
                        className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                          selectedPeriod === period
                            ? 'bg-purple-primary text-white'
                            : 'bg-dark-border text-dark-text-secondary hover:bg-dark-border hover:text-dark-text'
                        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <StockChart 
                  data={historicalData} 
                  symbol={stockData.symbol}
                  period={selectedPeriod}
                />
              </div>
            )}

            {/* Data Table */}
            {historicalData.length > 0 && (
              <DataTable 
                stock={stockData}
                historicalData={historicalData}
              />
            )}
          </div>
        )}

        {/* Welcome State */}
        {!stockData && !loading && !error && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <div className="mx-auto h-24 w-24 bg-purple-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-purple-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-dark-text mb-4">
                Get Started
              </h2>
              <p className="text-dark-text-secondary">
                Enter a stock symbol above to view comprehensive financial data, 
                interactive charts, and key metrics for any publicly traded company.
              </p>
              
              <div className="mt-6 text-sm text-dark-text-secondary">
                <p className="mb-2">Try popular symbols:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'].map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleSearch(symbol)}
                      className="px-3 py-1 bg-dark-surface border border-dark-border rounded-md hover:bg-dark-border transition-colors"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}