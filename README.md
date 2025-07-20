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
- ⚡ **Real-time Data** - Live stock market information via Yahoo Finance

## Clone this Bucket and Code Repository

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Bucket and Code Repository](https://img.shields.io/badge/Clone%20this%20Bucket-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](http://localhost:3040/projects/new?clone_bucket=687d2f3bace2d34c4e959833&clone_repository=687d584bdb967fff3dc88174)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> No content model prompt provided - app built from existing content structure

### Code Generation Prompt

> Make an app that lets me input a stock symbol and get a summary of financial data. Include a table and chart tracking the stock price and other key financial information. Use data from Yahoo Finance and let me download the table data as a CSV. Design it with a dark theme and interactive charts.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Chart.js](https://www.chartjs.org/) - Interactive chart library
- [Yahoo Finance API](https://rapidapi.com/apidojo/api/yahoo-finance1/) - Financial data source
- [React Chart.js 2](https://react-chartjs-2.js.org/) - React wrapper for Chart.js

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A RapidAPI account and Yahoo Finance API key

### Installation

1. Clone this repository or download the source code
2. Install dependencies:
   ```bash
   bun install
   ```

3. Create environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your API credentials to `.env.local`:
   ```env
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

5. Run the development server:
   ```bash
   bun run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Setup

1. Sign up for a [RapidAPI account](https://rapidapi.com/)
2. Subscribe to the [Yahoo Finance API](https://rapidapi.com/apidojo/api/yahoo-finance1/)
3. Get your API key from the RapidAPI dashboard
4. Add the key to your environment variables

## Stock Data Integration

### API Endpoints Used

- **Quote Lookup**: Get current stock price and basic information
- **Historical Data**: Retrieve price history for chart visualization  
- **Key Statistics**: Financial ratios and company metrics
- **Company Profile**: Business description and sector information

### Data Features

- Real-time stock quotes with price changes
- Historical price charts (1D, 1W, 1M, 3M, 6M, 1Y)
- Key financial metrics (P/E ratio, market cap, volume)
- Company information and sector details
- CSV export of all financial data

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
3. Add environment variables in the Vercel dashboard
4. Deploy!

### Deploy on Netlify

1. Build the application: `bun run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard
4. Set up continuous deployment with your Git repository

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:

```env
RAPIDAPI_KEY=your_rapidapi_key_here
```

<!-- README_END -->