export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-dark-border rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-purple-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-dark-text-secondary text-sm">Loading stock data...</p>
        <p className="text-dark-text-secondary text-xs mt-1">This may take a few seconds</p>
      </div>
    </div>
  )
}