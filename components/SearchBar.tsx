'use client'

import { useState, useRef } from 'react'
import { StockSearchResult } from '@/types'

interface SearchBarProps {
  onSearch: (symbol: string) => void
  onSearchSuggestions?: (query: string) => Promise<StockSearchResult[]>
  loading: boolean
}

export default function SearchBar({ onSearch, onSearchSuggestions, loading }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !loading) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-dark-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL, GOOGL, MSFT)..."
            disabled={loading}
            className="input-field w-full pl-12 pr-24 py-4 text-lg"
            autoComplete="off"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-20 flex items-center pr-2 text-dark-text-secondary hover:text-dark-text"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="absolute inset-y-0 right-0 flex items-center px-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed rounded-l-none"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              <span>Search</span>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-dark-text-secondary">
          Search for any publicly traded stock by symbol or company name
        </p>
      </div>
    </div>
  )
}