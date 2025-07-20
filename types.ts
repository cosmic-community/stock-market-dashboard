export interface StockQuote {
  symbol: string;
  shortName: string;
  longName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap: number;
  trailingPE?: number;
  forwardPE?: number;
  dividendYield?: number;
  beta?: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  currency: string;
  exchange: string;
  sector?: string;
  industry?: string;
  website?: string;
  description?: string;
  employees?: number;
  city?: string;
  state?: string;
  country?: string;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  type: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface CSVExportData {
  symbol: string;
  quote: StockQuote;
  historicalData: HistoricalDataPoint[];
  exportDate: string;
}

export type TimePeriod = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '2Y';

export interface StockMetrics {
  priceChange: {
    value: number;
    percentage: number;
    isPositive: boolean;
  };
  volume: {
    current: number;
    average: number;
  };
  marketData: {
    marketCap: number;
    pe: number;
    beta: number;
    yield: number;
  };
  priceRange: {
    low52Week: number;
    high52Week: number;
    current: number;
    percentageFromHigh: number;
    percentageFromLow: number;
  };
}

export interface APIError {
  message: string;
  status: number;
  code?: string;
}

// Type guard functions
export function isStockQuote(data: any): data is StockQuote {
  return data && typeof data.symbol === 'string' && typeof data.regularMarketPrice === 'number';
}

export function isHistoricalDataPoint(data: any): data is HistoricalDataPoint {
  return data && 
    typeof data.date === 'string' && 
    typeof data.close === 'number' &&
    typeof data.volume === 'number';
}

export function isAPIError(error: unknown): error is APIError {
  return typeof error === 'object' && 
         error !== null && 
         'message' in error &&
         'status' in error;
}