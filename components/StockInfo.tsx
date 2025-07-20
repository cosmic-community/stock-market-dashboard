'use client'

import { StockQuote } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/stockService'

interface StockInfoProps {
  stock: StockQuote
}

export default function StockInfo({ stock }: StockInfoProps) {
  const isPositive = stock.regularMarketChange >= 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Quote Card */}
      <div className="lg:col-span-2 card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-dark-text mb-1">
              {stock.shortName}
            </h2>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-lg font-medium text-purple-primary">
                {stock.symbol}
              </span>
              <span className="text-dark-text-secondary">•</span>
              <span className="text-dark-text-secondary">
                {stock.exchange}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Price Information */}
          <div>
            <div className="mb-4">
              <div className="text-4xl font-bold text-dark-text mb-1">
                {formatCurrency(stock.regularMarketPrice, stock.currency)}
              </div>
              <div className={`flex items-center space-x-2 text-lg ${isPositive ? 'text-green-profit' : 'text-red-loss'}`}>
                <span className={`flex items-center ${isPositive ? '' : 'rotate-180'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <span>
                  {isPositive ? '+' : ''}{formatCurrency(stock.regularMarketChange, stock.currency)}
                </span>
                <span>
                  ({isPositive ? '+' : ''}{stock.regularMarketChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-dark-text-secondary">Volume:</span>
              <span className="text-dark-text font-medium">
                {formatNumber(stock.regularMarketVolume)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-text-secondary">Market Cap:</span>
              <span className="text-dark-text font-medium">
                {formatCurrency(stock.marketCap, stock.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-text-secondary">52W Range:</span>
              <span className="text-dark-text font-medium">
                {formatCurrency(stock.fiftyTwoWeekLow, stock.currency)} - {formatCurrency(stock.fiftyTwoWeekHigh, stock.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Metrics Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text mb-4">
          Financial Metrics
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">P/E Ratio</span>
            <span className="text-dark-text font-medium">
              {stock.trailingPE ? stock.trailingPE.toFixed(2) : 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Forward P/E</span>
            <span className="text-dark-text font-medium">
              {stock.forwardPE ? stock.forwardPE.toFixed(2) : 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Beta</span>
            <span className="text-dark-text font-medium">
              {stock.beta ? stock.beta.toFixed(2) : 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Dividend Yield</span>
            <span className="text-dark-text font-medium">
              {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}
            </span>
          </div>
          
          {stock.sector && (
            <div className="flex justify-between items-center py-2 border-b border-dark-border">
              <span className="text-dark-text-secondary">Sector</span>
              <span className="text-dark-text font-medium text-right max-w-32 truncate">
                {stock.sector}
              </span>
            </div>
          )}
          
          {stock.industry && (
            <div className="flex justify-between items-center py-2">
              <span className="text-dark-text-secondary">Industry</span>
              <span className="text-dark-text font-medium text-right max-w-32 truncate">
                {stock.industry}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}