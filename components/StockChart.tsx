'use client'

import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { HistoricalDataPoint, TimePeriod } from '@/types'
import { format, parseISO } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface StockChartProps {
  data: HistoricalDataPoint[]
  symbol: string
  period: TimePeriod
}

export default function StockChart({ data, symbol, period }: StockChartProps) {
  const chartRef = useRef<ChartJS<'line', number[], string>>(null)

  // Format date labels based on period
  const formatDate = (dateString: string): string => {
    const date = parseISO(dateString)
    
    switch (period) {
      case '1D':
      case '5D':
        return format(date, 'MMM dd')
      case '1M':
        return format(date, 'MMM dd')
      case '3M':
      case '6M':
        return format(date, 'MMM dd')
      case '1Y':
      case '2Y':
        return format(date, 'MMM yyyy')
      default:
        return format(date, 'MMM dd')
    }
  }

  // Sample data points based on period to avoid overcrowding
  const sampleData = (data: HistoricalDataPoint[]) => {
    if (data.length <= 50) return data
    
    const step = Math.ceil(data.length / 50)
    return data.filter((_, index) => index % step === 0)
  }

  const sampledData = sampleData(data)
  
  // Calculate price change for color
  const firstPrice = sampledData[0]?.close || 0
  const lastPrice = sampledData[sampledData.length - 1]?.close || 0
  const isPositive = lastPrice >= firstPrice

  const chartData = {
    labels: sampledData.map(point => formatDate(point.date)),
    datasets: [
      {
        label: `${symbol} Price`,
        data: sampledData.map(point => point.close),
        borderColor: isPositive ? '#10b981' : '#ef4444',
        backgroundColor: isPositive 
          ? 'rgba(16, 185, 129, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: isPositive ? '#10b981' : '#ef4444',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1a1a1a',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#2a2a2a',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            return `${symbol} - ${context[0].label}`
          },
          label: (context: any) => {
            const price = context.parsed.y
            return `Price: $${price.toFixed(2)}`
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: '#2a2a2a',
          drawBorder: false,
        },
        ticks: {
          color: '#a0a0a0',
          maxTicksLimit: 10,
        },
      },
      y: {
        display: true,
        position: 'right' as const,
        grid: {
          color: '#2a2a2a',
          drawBorder: false,
        },
        ticks: {
          color: '#a0a0a0',
          callback: (value: any) => {
            return `$${value.toFixed(2)}`
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
      },
    },
  }

  useEffect(() => {
    const chart = chartRef.current
    if (chart) {
      // Force chart update
      chart.update('none')
    }
  }, [data, period])

  if (!data.length) {
    return (
      <div className="chart-container h-96 flex items-center justify-center">
        <div className="text-center text-dark-text-secondary">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>No chart data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chart-container h-96">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  )
}