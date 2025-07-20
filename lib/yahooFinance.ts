import { StockQuote, HistoricalDataPoint, StockSearchResult } from '@/types';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const BASE_URL = 'https://yahoo-finance1.p.rapidapi.com';

const headers = {
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'yahoo-finance1.p.rapidapi.com',
};

// Helper function for API error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const response = await fetch(`${BASE_URL}/quoteSummary/${symbol}?modules=price,summaryDetail,defaultKeyStatistics,assetProfile`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.quoteSummary?.result?.[0]) {
      throw new Error('Stock not found');
    }

    const result = data.quoteSummary.result[0];
    const price = result.price;
    const summaryDetail = result.summaryDetail;
    const keyStats = result.defaultKeyStatistics;
    const profile = result.assetProfile;

    const quote: StockQuote = {
      symbol: price.symbol,
      shortName: price.shortName || 'N/A',
      longName: price.longName || price.shortName || 'N/A',
      regularMarketPrice: price.regularMarketPrice?.raw || 0,
      regularMarketChange: price.regularMarketChange?.raw || 0,
      regularMarketChangePercent: (price.regularMarketChangePercent?.raw || 0) * 100,
      regularMarketVolume: price.regularMarketVolume?.raw || 0,
      marketCap: price.marketCap?.raw || summaryDetail?.marketCap?.raw || 0,
      trailingPE: summaryDetail?.trailingPE?.raw,
      forwardPE: summaryDetail?.forwardPE?.raw,
      dividendYield: summaryDetail?.dividendYield?.raw ? summaryDetail.dividendYield.raw * 100 : undefined,
      beta: summaryDetail?.beta?.raw || keyStats?.beta?.raw,
      fiftyTwoWeekLow: summaryDetail?.fiftyTwoWeekLow?.raw || 0,
      fiftyTwoWeekHigh: summaryDetail?.fiftyTwoWeekHigh?.raw || 0,
      currency: price.currency || 'USD',
      exchange: price.exchangeName || 'N/A',
      sector: profile?.sector,
      industry: profile?.industry,
      website: profile?.website,
      description: profile?.longBusinessSummary,
      employees: profile?.fullTimeEmployees,
      city: profile?.city,
      state: profile?.state,
      country: profile?.country,
    };

    return quote;
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    if (hasStatus(error) && error.status === 404) {
      throw new Error('Stock symbol not found');
    }
    throw new Error('Failed to fetch stock data');
  }
}

export async function getHistoricalData(
  symbol: string, 
  period: string = '1y'
): Promise<HistoricalDataPoint[]> {
  try {
    const response = await fetch(`${BASE_URL}/chart/${symbol}?interval=1d&range=${period}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.chart?.result?.[0]) {
      throw new Error('Historical data not found');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const quotes = result.indicators?.quote?.[0];
    const adjClose = result.indicators?.adjclose?.[0]?.adjclose;

    if (!quotes || !timestamps.length) {
      return [];
    }

    const historicalData: HistoricalDataPoint[] = timestamps.map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      open: quotes.open?.[index] || 0,
      high: quotes.high?.[index] || 0,
      low: quotes.low?.[index] || 0,
      close: quotes.close?.[index] || 0,
      volume: quotes.volume?.[index] || 0,
      adjClose: adjClose?.[index] || quotes.close?.[index] || 0,
    })).filter((point: HistoricalDataPoint) => point.close > 0); // Filter out invalid data points

    return historicalData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch historical data');
  }
}

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  try {
    const response = await fetch(`${BASE_URL}/auto-complete?q=${encodeURIComponent(query)}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.quotes) {
      return [];
    }

    return data.quotes
      .filter((item: any) => item.isYahooFinance && item.symbol)
      .slice(0, 10) // Limit to 10 results
      .map((item: any): StockSearchResult => ({
        symbol: item.symbol,
        name: item.shortname || item.longname || item.symbol,
        exchange: item.exchange || 'N/A',
        type: item.quoteType || 'EQUITY',
      }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}

// Utility function to convert period strings
export function convertPeriodToRange(period: string): string {
  const periodMap: Record<string, string> = {
    '1D': '1d',
    '5D': '5d',
    '1M': '1mo',
    '3M': '3mo',
    '6M': '6mo',
    '1Y': '1y',
    '2Y': '2y',
  };
  return periodMap[period] || '1y';
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T';
  }
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}