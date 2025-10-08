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
    // Only enable this proxy in development to avoid interfering with production routing
    if (!apiBase || process.env.NODE_ENV !== 'development') return []

    // Ensure no trailing slash
    const base = apiBase.replace(/\/$/, '')

    // Proxy only specific API endpoints to the external backend to avoid CORS issues
    // These match the actual API endpoints from the backend documentation
    return [
      {
        source: '/auth/:path*',
        destination: `${base}/auth/:path*`,
      },
      {
        source: '/users/:path*',
        destination: `${base}/users/:path*`,
      },
      {
        source: '/catalog/:path*',
        destination: `${base}/catalog/:path*`,
      },
      {
        source: '/availability/:path*',
        destination: `${base}/availability/:path*`,
      },
      {
        source: '/content/:path*',
        destination: `${base}/content/:path*`,
      },
      {
        source: '/metrics/:path*',
        destination: `${base}/metrics/:path*`,
      },
      {
        source: '/audit/:path*',
        destination: `${base}/audit/:path*`,
      },
    ]
  },
}

export default nextConfig