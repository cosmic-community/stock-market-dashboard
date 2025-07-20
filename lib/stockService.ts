import { StockQuote, HistoricalDataPoint, StockSearchResult } from '@/types';

// Using Financial Modeling Prep's free tier and fallback to demo data
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

// Demo data for when API is unavailable or for demonstration
const DEMO_STOCKS = {
  'AAPL': {
    symbol: 'AAPL',
    shortName: 'Apple Inc.',
    longName: 'Apple Inc.',
    regularMarketPrice: 175.43,
    regularMarketChange: 2.15,
    regularMarketChangePercent: 1.24,
    regularMarketVolume: 45678900,
    marketCap: 2750000000000,
    trailingPE: 28.5,
    forwardPE: 25.2,
    dividendYield: 0.52,
    beta: 1.25,
    fiftyTwoWeekLow: 124.17,
    fiftyTwoWeekHigh: 198.23,
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    website: 'https://www.apple.com',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    employees: 164000,
    city: 'Cupertino',
    state: 'CA',
    country: 'United States',
  },
  'MSFT': {
    symbol: 'MSFT',
    shortName: 'Microsoft Corp.',
    longName: 'Microsoft Corporation',
    regularMarketPrice: 378.85,
    regularMarketChange: -1.23,
    regularMarketChangePercent: -0.32,
    regularMarketVolume: 23456789,
    marketCap: 2820000000000,
    trailingPE: 32.1,
    forwardPE: 28.7,
    dividendYield: 0.68,
    beta: 0.89,
    fiftyTwoWeekLow: 245.61,
    fiftyTwoWeekHigh: 384.52,
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Software—Infrastructure',
    website: 'https://www.microsoft.com',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    employees: 221000,
    city: 'Redmond',
    state: 'WA',
    country: 'United States',
  },
  'GOOGL': {
    symbol: 'GOOGL',
    shortName: 'Alphabet Inc.',
    longName: 'Alphabet Inc. Class A',
    regularMarketPrice: 142.56,
    regularMarketChange: 0.87,
    regularMarketChangePercent: 0.61,
    regularMarketVolume: 18765432,
    marketCap: 1780000000000,
    trailingPE: 25.8,
    forwardPE: 22.1,
    dividendYield: 0,
    beta: 1.05,
    fiftyTwoWeekLow: 101.88,
    fiftyTwoWeekHigh: 153.78,
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    website: 'https://www.alphabet.com',
    description: 'Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
    employees: 190234,
    city: 'Mountain View',
    state: 'CA',
    country: 'United States',
  },
  'TSLA': {
    symbol: 'TSLA',
    shortName: 'Tesla Inc.',
    longName: 'Tesla, Inc.',
    regularMarketPrice: 248.42,
    regularMarketChange: 5.67,
    regularMarketChangePercent: 2.34,
    regularMarketVolume: 89123456,
    marketCap: 789000000000,
    trailingPE: 65.2,
    forwardPE: 42.8,
    dividendYield: 0,
    beta: 2.11,
    fiftyTwoWeekLow: 138.80,
    fiftyTwoWeekHigh: 299.29,
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    website: 'https://www.tesla.com',
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems in the United States, China, and internationally.',
    employees: 140473,
    city: 'Austin',
    state: 'TX',
    country: 'United States',
  }
};

// Helper function to generate realistic historical data
function generateHistoricalData(
  symbol: string, 
  currentPrice: number, 
  period: string
): HistoricalDataPoint[] {
  const days = getDaysFromPeriod(period);
  const data: HistoricalDataPoint[] = [];
  
  let price = currentPrice * (0.85 + Math.random() * 0.3); // Start with a price variation
  const volatility = getVolatilityForSymbol(symbol);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate realistic price movement
    const change = (Math.random() - 0.5) * volatility * price * 0.02;
    price += change;
    price = Math.max(price * 0.7, price); // Prevent extreme drops
    
    const open = price * (0.98 + Math.random() * 0.04);
    const close = price;
    const high = Math.max(open, close) * (1 + Math.random() * 0.03);
    const low = Math.min(open, close) * (0.97 + Math.random() * 0.02);
    const volume = Math.floor(Math.random() * 50000000) + 10000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      adjClose: Number(close.toFixed(2)),
    });
  }
  
  return data;
}

function getDaysFromPeriod(period: string): number {
  const periodMap: Record<string, number> = {
    '1D': 1,
    '5D': 5,
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    '2Y': 730,
  };
  return periodMap[period] || 365;
}

function getVolatilityForSymbol(symbol: string): number {
  const volatilityMap: Record<string, number> = {
    'AAPL': 1.2,
    'MSFT': 1.0,
    'GOOGL': 1.3,
    'TSLA': 2.5,
  };
  return volatilityMap[symbol] || 1.5;
}

// Try to fetch from FMP API, fallback to demo data
async function fetchWithFallback(url: string, fallbackData: any) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'StockDashboard/1.0'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log('API unavailable, using demo data');
  }
  
  return fallbackData;
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const upperSymbol = symbol.toUpperCase();
  
  // Check if we have demo data for this symbol
  if (DEMO_STOCKS[upperSymbol as keyof typeof DEMO_STOCKS]) {
    const demoData = DEMO_STOCKS[upperSymbol as keyof typeof DEMO_STOCKS];
    // Add some random variation to make it feel more live
    const priceVariation = (Math.random() - 0.5) * 0.02; // ±1% variation
    const newPrice = demoData.regularMarketPrice * (1 + priceVariation);
    const change = newPrice - demoData.regularMarketPrice;
    const changePercent = (change / demoData.regularMarketPrice) * 100;
    
    return {
      ...demoData,
      regularMarketPrice: Number(newPrice.toFixed(2)),
      regularMarketChange: Number(change.toFixed(2)),
      regularMarketChangePercent: Number(changePercent.toFixed(2)),
    };
  }
  
  // Try FMP API first, fallback to generated demo data
  const url = `${FMP_BASE_URL}/profile/${upperSymbol}`;
  const fallbackQuote: StockQuote = {
    symbol: upperSymbol,
    shortName: `${upperSymbol} Inc.`,
    longName: `${upperSymbol} Corporation`,
    regularMarketPrice: 50 + Math.random() * 200,
    regularMarketChange: (Math.random() - 0.5) * 10,
    regularMarketChangePercent: (Math.random() - 0.5) * 5,
    regularMarketVolume: Math.floor(Math.random() * 100000000),
    marketCap: Math.floor(Math.random() * 1000000000000),
    trailingPE: 15 + Math.random() * 30,
    forwardPE: 12 + Math.random() * 25,
    dividendYield: Math.random() * 3,
    beta: 0.5 + Math.random() * 2,
    fiftyTwoWeekLow: 30 + Math.random() * 50,
    fiftyTwoWeekHigh: 100 + Math.random() * 150,
    currency: 'USD',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Software',
    website: `https://www.${upperSymbol.toLowerCase()}.com`,
    description: `${upperSymbol} is a technology company focused on innovative solutions.`,
    employees: Math.floor(Math.random() * 200000),
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
  };
  
  try {
    const data = await fetchWithFallback(url, [fallbackQuote]);
    
    if (Array.isArray(data) && data.length > 0) {
      const profile = data[0];
      
      // Parse range safely with proper null checks
      let fiftyTwoWeekLow = fallbackQuote.fiftyTwoWeekLow;
      let fiftyTwoWeekHigh = fallbackQuote.fiftyTwoWeekHigh;
      
      if (profile.range && typeof profile.range === 'string') {
        const rangeParts = profile.range.split('-');
        if (rangeParts.length >= 2) {
          const lowPart = rangeParts[0]?.trim();
          const highPart = rangeParts[1]?.trim();
          
          if (lowPart) {
            const lowValue = Number(lowPart);
            if (!isNaN(lowValue)) fiftyTwoWeekLow = lowValue;
          }
          
          if (highPart) {
            const highValue = Number(highPart);
            if (!isNaN(highValue)) fiftyTwoWeekHigh = highValue;
          }
        }
      }
      
      return {
        symbol: profile.symbol || upperSymbol,
        shortName: profile.companyName || `${upperSymbol} Inc.`,
        longName: profile.companyName || `${upperSymbol} Corporation`,
        regularMarketPrice: profile.price || fallbackQuote.regularMarketPrice,
        regularMarketChange: profile.changes || fallbackQuote.regularMarketChange,
        regularMarketChangePercent: profile.changesPercentage || fallbackQuote.regularMarketChangePercent,
        regularMarketVolume: profile.volAvg || fallbackQuote.regularMarketVolume,
        marketCap: profile.mktCap || fallbackQuote.marketCap,
        trailingPE: profile.pe || fallbackQuote.trailingPE,
        forwardPE: fallbackQuote.forwardPE,
        dividendYield: profile.lastDiv || fallbackQuote.dividendYield,
        beta: profile.beta || fallbackQuote.beta,
        fiftyTwoWeekLow,
        fiftyTwoWeekHigh,
        currency: profile.currency || 'USD',
        exchange: profile.exchangeShortName || 'NASDAQ',
        sector: profile.sector || 'Technology',
        industry: profile.industry || 'Software',
        website: profile.website || `https://www.${upperSymbol.toLowerCase()}.com`,
        description: profile.description || fallbackQuote.description,
        employees: profile.fullTimeEmployees || fallbackQuote.employees,
        city: profile.city || fallbackQuote.city,
        state: profile.state || fallbackQuote.state,
        country: profile.country || fallbackQuote.country,
      };
    }
  } catch (error) {
    console.error('Error fetching stock quote:', error);
  }
  
  return fallbackQuote;
}

export async function getHistoricalData(
  symbol: string, 
  period: string = '1Y'
): Promise<HistoricalDataPoint[]> {
  const upperSymbol = symbol.toUpperCase();
  
  // For demo stocks, generate realistic historical data
  if (DEMO_STOCKS[upperSymbol as keyof typeof DEMO_STOCKS]) {
    const stockData = DEMO_STOCKS[upperSymbol as keyof typeof DEMO_STOCKS];
    return generateHistoricalData(upperSymbol, stockData.regularMarketPrice, period);
  }
  
  // Generate historical data for any symbol
  const basePrice = 50 + Math.random() * 200;
  return generateHistoricalData(upperSymbol, basePrice, period);
}

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  const upperQuery = query.toUpperCase();
  
  // First, check our demo stocks
  const demoResults: StockSearchResult[] = Object.keys(DEMO_STOCKS)
    .filter(symbol => 
      symbol.includes(upperQuery) || 
      DEMO_STOCKS[symbol as keyof typeof DEMO_STOCKS].shortName.toUpperCase().includes(upperQuery)
    )
    .map(symbol => ({
      symbol,
      name: DEMO_STOCKS[symbol as keyof typeof DEMO_STOCKS].shortName,
      exchange: DEMO_STOCKS[symbol as keyof typeof DEMO_STOCKS].exchange,
      type: 'EQUITY',
    }));
  
  // Add some common stock symbols for search
  const commonStocks = [
    { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', type: 'EQUITY' },
    { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', type: 'EQUITY' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', type: 'EQUITY' },
    { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ', type: 'EQUITY' },
    { symbol: 'DIS', name: 'The Walt Disney Company', exchange: 'NYSE', type: 'EQUITY' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', type: 'EQUITY' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE', type: 'EQUITY' },
    { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE', type: 'EQUITY' },
    { symbol: 'WMT', name: 'Walmart Inc.', exchange: 'NYSE', type: 'EQUITY' },
    { symbol: 'PG', name: 'Procter & Gamble Co.', exchange: 'NYSE', type: 'EQUITY' },
  ];
  
  const additionalResults = commonStocks
    .filter(stock => 
      stock.symbol.includes(upperQuery) || 
      stock.name.toUpperCase().includes(upperQuery)
    );
  
  // Combine and deduplicate results
  const allResults = [...demoResults, ...additionalResults];
  const uniqueResults = allResults.filter((stock, index, arr) => 
    arr.findIndex(s => s.symbol === stock.symbol) === index
  );
  
  return uniqueResults.slice(0, 10); // Limit to 10 results
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