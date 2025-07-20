'use client'

import { useState } from 'react'
import { StockQuote, HistoricalDataPoint } from '@/types'
import { exportToCSV, exportQuoteCSV, exportHistoricalCSV } from '@/lib/csvExport'
import { formatCurrency } from '@/lib/yahooFinance'
import { format, parseISO } from 'date-fns'

interface DataTableProps {
  stock: StockQuote
  historicalData: HistoricalDataPoint[]
}

export default function DataTable({ stock, historicalData }: DataTableProps) {
  const [activeTab, setActiveTab] = useState<'historical' | 'financials'>('historical')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Pagination for historical data
  const totalPages = Math.ceil(historicalData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = historicalData.slice(startIndex, startIndex + itemsPerPage)

  const handleExportAll = () => {
    const today = new Date()
    const exportDate = today.toISOString().split('T')[0] || today.toLocaleDateString('en-CA')
    
    const csvData = {
      symbol: stock.symbol,
      quote: stock,
      historicalData,
      exportDate,
    }
    exportToCSV(csvData)
  }

  const handleExportQuote = () => {
    exportQuoteCSV(stock)
  }

  const handleExportHistorical = () => {
    exportHistoricalCSV(stock.symbol, historicalData)
  }

  const formatDate = (dateString: string): string => {
    return format(parseISO(dateString), 'MMM dd, yyyy')
  }

  const renderHistoricalTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-dark-border">
        <thead>
          <tr className="table-header">
            <th className="px-6 py-3 text-left">Date</th>
            <th className="px-6 py-3 text-right">Open</th>
            <th className="px-6 py-3 text-right">High</th>
            <th className="px-6 py-3 text-right">Low</th>
            <th className="px-6 py-3 text-right">Close</th>
            <th className="px-6 py-3 text-right">Adj Close</th>
            <th className="px-6 py-3 text-right">Volume</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {paginatedData.map((point, index) => (
            <tr key={point.date} className={index % 2 === 0 ? 'bg-dark-surface' : 'bg-dark-bg'}>
              <td className="px-6 py-4 whitespace-nowrap table-cell font-medium">
                {formatDate(point.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap table-cell text-right">
                {formatCurrency(point.open, stock.currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap table-cell text-right">
                {formatCurrency(point.high, stock.currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap table-cell text-right">
                {formatCurrency(point.low, stock.currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap table-cell text-right">
                {formatCurrency(point.close, stock.currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap table-cell text-right">
                {formatCurrency(point.adjClose, stock.currency)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap table-cell text-right">
                {point.volume.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-dark-text-secondary">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, historicalData.length)} of {historicalData.length} entries
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                if (pageNum > totalPages) return null
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === pageNum
                        ? 'bg-purple-primary text-white'
                        : 'bg-dark-surface text-dark-text hover:bg-dark-border'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderFinancialsTable = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Company Information */}
      <div>
        <h4 className="text-lg font-semibold text-dark-text mb-4">Company Information</h4>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Symbol:</span>
            <span className="text-dark-text font-medium">{stock.symbol}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Company Name:</span>
            <span className="text-dark-text font-medium text-right">{stock.longName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Exchange:</span>
            <span className="text-dark-text font-medium">{stock.exchange}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Currency:</span>
            <span className="text-dark-text font-medium">{stock.currency}</span>
          </div>
          {stock.sector && (
            <div className="flex justify-between py-2 border-b border-dark-border">
              <span className="text-dark-text-secondary">Sector:</span>
              <span className="text-dark-text font-medium text-right">{stock.sector}</span>
            </div>
          )}
          {stock.industry && (
            <div className="flex justify-between py-2 border-b border-dark-border">
              <span className="text-dark-text-secondary">Industry:</span>
              <span className="text-dark-text font-medium text-right">{stock.industry}</span>
            </div>
          )}
        </div>
      </div>

      {/* Financial Metrics */}
      <div>
        <h4 className="text-lg font-semibold text-dark-text mb-4">Financial Metrics</h4>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Current Price:</span>
            <span className="text-dark-text font-medium">
              {formatCurrency(stock.regularMarketPrice, stock.currency)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Market Cap:</span>
            <span className="text-dark-text font-medium">
              {formatCurrency(stock.marketCap, stock.currency)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">P/E Ratio:</span>
            <span className="text-dark-text font-medium">
              {stock.trailingPE ? stock.trailingPE.toFixed(2) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Forward P/E:</span>
            <span className="text-dark-text font-medium">
              {stock.forwardPE ? stock.forwardPE.toFixed(2) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Beta:</span>
            <span className="text-dark-text font-medium">
              {stock.beta ? stock.beta.toFixed(2) : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">Dividend Yield:</span>
            <span className="text-dark-text font-medium">
              {stock.dividendYield ? `${stock.dividendYield.toFixed(2)}%` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">52W Low:</span>
            <span className="text-dark-text font-medium">
              {formatCurrency(stock.fiftyTwoWeekLow, stock.currency)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-dark-text-secondary">52W High:</span>
            <span className="text-dark-text font-medium">
              {formatCurrency(stock.fiftyTwoWeekHigh, stock.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="card">
      {/* Header with tabs and export buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex space-x-1 mb-4 sm:mb-0">
          <button
            onClick={() => setActiveTab('historical')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'historical'
                ? 'bg-purple-primary text-white'
                : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-border'
            }`}
          >
            Historical Data
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'financials'
                ? 'bg-purple-primary text-white'
                : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-border'
            }`}
          >
            Financial Details
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportAll}
            className="btn-primary text-sm"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export All
          </button>
          
          {activeTab === 'historical' ? (
            <button
              onClick={handleExportHistorical}
              className="btn-secondary text-sm"
            >
              Export Historical
            </button>
          ) : (
            <button
              onClick={handleExportQuote}
              className="btn-secondary text-sm"
            >
              Export Quote
            </button>
          )}
        </div>
      </div>

      {/* Items per page selector for historical data */}
      {activeTab === 'historical' && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-dark-text-secondary">
              Show:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="input-field py-1 px-2 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-dark-text-secondary">entries</span>
          </div>
          
          <div className="text-sm text-dark-text-secondary">
            Total: {historicalData.length} records
          </div>
        </div>
      )}

      {/* Table Content */}
      {activeTab === 'historical' ? renderHistoricalTable() : renderFinancialsTable()}
    </div>
  )
}