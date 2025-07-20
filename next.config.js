/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['logos.stockanalysis.com'],
  },
  env: {
    RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
  },
}

module.exports = nextConfig