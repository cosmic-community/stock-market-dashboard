import { StockQuote, HistoricalDataPoint, CSVExportData } from '@/types';

export function exportToCSV(data: CSVExportData): void {
  const csvContent = generateCSVContent(data);
  downloadCSV(csvContent, `${data.symbol}_financial_data_${data.exportDate}.csv`);
}

function generateCSVContent(data: CSVExportData): string {
  const lines: string[] = [];

  // Header information
  lines.push('Stock Financial Data Export');
  lines.push(`Symbol: ${data.symbol}`);
  lines.push(`Company: ${data.quote.longName}`);
  lines.push(`Export Date: ${data.exportDate}`);
  lines.push('');

  // Current quote data
  lines.push('CURRENT QUOTE');
  lines.push('Metric,Value');
  lines.push(`Current Price,${data.quote.regularMarketPrice}`);
  lines.push(`Change,${data.quote.regularMarketChange}`);
  lines.push(`Change %,${data.quote.regularMarketChangePercent.toFixed(2)}%`);
  lines.push(`Volume,${data.quote.regularMarketVolume}`);
  lines.push(`Market Cap,${data.quote.marketCap}`);
  lines.push(`P/E Ratio,${data.quote.trailingPE || 'N/A'}`);
  lines.push(`Forward P/E,${data.quote.forwardPE || 'N/A'}`);
  lines.push(`Dividend Yield,${data.quote.dividendYield ? data.quote.dividendYield.toFixed(2) + '%' : 'N/A'}`);
  lines.push(`Beta,${data.quote.beta || 'N/A'}`);
  lines.push(`52 Week Low,${data.quote.fiftyTwoWeekLow}`);
  lines.push(`52 Week High,${data.quote.fiftyTwoWeekHigh}`);
  lines.push(`Exchange,${data.quote.exchange}`);
  lines.push(`Sector,${data.quote.sector || 'N/A'}`);
  lines.push(`Industry,${data.quote.industry || 'N/A'}`);
  lines.push('');

  // Historical data
  if (data.historicalData.length > 0) {
    lines.push('HISTORICAL DATA');
    lines.push('Date,Open,High,Low,Close,Adj Close,Volume');
    
    data.historicalData.forEach(point => {
      lines.push(
        `${point.date},${point.open},${point.high},${point.low},${point.close},${point.adjClose},${point.volume}`
      );
    });
  }

  return lines.join('\n');
}

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Export specific data sections
export function exportQuoteCSV(quote: StockQuote): void {
  const lines: string[] = [];
  lines.push('Stock Quote Data');
  lines.push('Metric,Value');
  lines.push(`Symbol,${quote.symbol}`);
  lines.push(`Company,${quote.longName}`);
  lines.push(`Current Price,${quote.regularMarketPrice}`);
  lines.push(`Change,${quote.regularMarketChange}`);
  lines.push(`Change %,${quote.regularMarketChangePercent.toFixed(2)}%`);
  lines.push(`Volume,${quote.regularMarketVolume}`);
  lines.push(`Market Cap,${quote.marketCap}`);
  
  const content = lines.join('\n');
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(content, `${quote.symbol}_quote_${timestamp}.csv`);
}

export function exportHistoricalCSV(symbol: string, historicalData: HistoricalDataPoint[]): void {
  const lines: string[] = [];
  lines.push(`Historical Data for ${symbol}`);
  lines.push('Date,Open,High,Low,Close,Adj Close,Volume');
  
  historicalData.forEach(point => {
    lines.push(
      `${point.date},${point.open},${point.high},${point.low},${point.close},${point.adjClose},${point.volume}`
    );
  });

  const content = lines.join('\n');
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(content, `${symbol}_historical_${timestamp}.csv`);
}