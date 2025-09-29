/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Environment variables configuration
  env: {
    // Custom variables if needed
  },
  // Production configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Configure according to your CORS requirements
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, x-access-token',
          },
        ],
      },
    ]
  },
  // Rewrites to proxy requests to external backend to avoid CORS in the browser
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || ''
    // Only enable this broad proxy in development to avoid interfering with production routing
    if (!apiBase || process.env.NODE_ENV !== 'development') return []

    // Ensure no trailing slash
    const base = apiBase.replace(/\/$/, '')

    // Proxy all paths to the external API base. Destination is always base/:path*
    return [
      {
        source: '/:path*',
        destination: `${base}/:path*`,
      },
    ]
  },
}

export default nextConfig
