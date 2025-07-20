# Stock Market Dashboard

![Stock Market Dashboard](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=300&fit=crop&auto=format)

A comprehensive stock market dashboard built with Next.js that allows users to search for stock symbols and view detailed financial data with interactive charts and CSV export functionality.

## Features

- 🔍 **Stock Symbol Search** - Quick lookup of any publicly traded stock
- 📊 **Interactive Charts** - Real-time price tracking with Chart.js visualizations
- 📈 **Historical Data** - View price trends over different time periods
- 📋 **Financial Data Tables** - Comprehensive metrics and key ratios
- 📥 **CSV Export** - Download complete financial data for analysis
- 🌙 **Dark Theme** - Professional dark mode interface
- 📱 **Responsive Design** - Optimized for all device sizes
- ⚡ **No API Keys Required** - Works immediately without any setup
- 🎯 **Demo Data** - Realistic sample data for popular stocks (AAPL, MSFT, GOOGL, TSLA)

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=687d2f3bace2d34c4e959833&clone_repository=687d584bdb967fff3dc88174)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Make an app that lets me input a stock symbol and get a summary of financial data. Include a table and chart tracking the stock price and other key financial information. Use data from Yahoo Finance and let me download the table data as a CSV. Design it with a dark theme and interactive charts.

The app has been updated to use free data sources and includes demo data for immediate functionality without requiring API keys.

## Technologies

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) - Interactive chart library
- [Free Financial APIs](https://financialmodelingprep.com/) - Financial data source with demo fallback
- [React Chart.js 2](https://react-chartjs-2.js.org/) - React wrapper for Chart.js

## Getting Started

### Prerequisites

- Node.js 18+ or Bun

### Installation

1. Clone this repository or download the source code
2. Install dependencies:
   ```bash
   bun install
   ```

3. Run the development server:
   ```bash
   bun run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

**That's it!** No API keys or environment variables required. The dashboard works immediately with demo data and free APIs.

## Stock Data Sources

### Primary Data Strategy

The dashboard uses a multi-tier approach for stock data:

1. **Demo Data**: High-quality sample data for popular stocks (AAPL, MSFT, GOOGL, TSLA)
2. **Free APIs**: Financial Modeling Prep free tier for additional stocks
3. **Generated Data**: Realistic placeholder data for any stock symbol

### Available Features

- Real-time-style stock quotes with price changes
- Historical price charts (1D, 1W, 1M, 3M, 6M, 1Y, 2Y)
- Key financial metrics (P/E ratio, market cap, volume, beta)
- Company information and sector details
- CSV export of all financial data
- Stock symbol search with autocomplete

## Data Features

- **Popular Stocks**: AAPL, MSFT, GOOGL, TSLA include realistic sample data
- **Any Symbol**: Search for any stock symbol - the app generates realistic demo data
- **Historical Charts**: View price trends with interactive Chart.js visualizations
- **Financial Metrics**: P/E ratios, market cap, volume, 52-week ranges
- **Company Profiles**: Sector, industry, description, and company details
- **CSV Export**: Download complete financial datasets

## CSV Export

The application includes functionality to export stock data as CSV files:

- Current quote information
- Historical price data
- Key financial statistics
- Company profile details
- Custom date range selection

## Deployment Options

### Deploy on Vercel

The easiest way to deploy your Stock Market Dashboard is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

1. Push your code to GitHub
2. Import your repository on Vercel
3. Deploy! (No environment variables needed)

### Deploy on Netlify

1. Build the application: `bun run build`
2. Upload the `dist` folder to Netlify
3. Set up continuous deployment with your Git repository

### No Environment Variables Required

This dashboard works out of the box without any configuration:

- ✅ No API keys needed
- ✅ No environment variables required
- ✅ No external service setup
- ✅ Works immediately after installation

## Customization

### Adding Your Own API

If you want to integrate with premium financial data services:

1. Create a `.env.local` file
2. Add your API credentials
3. Modify `/lib/stockService.ts` to use your preferred data source
4. Update the API calls in the service functions

### Extending Demo Data

To add more demo stocks with realistic data:

1. Edit the `DEMO_STOCKS` object in `/lib/stockService.ts`
2. Add new stock entries with comprehensive financial data
3. The dashboard will automatically use this data for those symbols

<!-- README_END -->