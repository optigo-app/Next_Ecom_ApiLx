/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['better-sqlite3'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: '**' },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With, Content-Type, Authorization, RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Url, Next-Action' },
          { key: 'Vary', value: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch' },
        ],
      },
      {
        // Local static images — 30 days, immutable (browser skips revalidation)
        source: '/:all*(jpg|jpeg|png|gif|webp|svg|avif|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400, immutable' },
        ],
      },
      {
        // Video files — 7 days (larger files, reuse across sessions)
        source: '/:all*(mp4|webm|ogg)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
      {
        // Fonts — fully immutable (never change)
        source: '/:all*(woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Home page HTML caching — 60s max-age, stale-while-revalidate for 1 day
        source: '/',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400' },
          { key: 'Vary', value: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch' },
        ],
      },
      {
        // Static assets (CSS, JS) with content hashes — 1 year, immutable
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Enable Gzip compression in Next.js
  compress: true,

  webpack: (config, { dev, isServer }) => {
    // In production client build, consolidate CSS/SCSS into a single styles bundle
    // to eliminate dozens of render-blocking HTTP requests
    if (!dev && !isServer) {
      config.optimization = config.optimization || {};
      config.optimization.splitChunks = config.optimization.splitChunks || {};
      config.optimization.splitChunks.cacheGroups = {
        ...(config.optimization.splitChunks.cacheGroups || {}),
        styles: {
          name: 'styles',
          test: /\.(css|scss|sass)$/,
          chunks: 'all',
          enforce: true,
          priority: 50,
        },
      };
    }
    return config;
  },

  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'lucide-react',
      'lodash',
      'date-fns',
    ],
    viewTransition: true,
    serverActions: {
      allowedOrigins: ['*.optigoapps.com', 'optigoapps.com', 'localhost:5009', 'localhost:3000', '*'],
    },
  },
};

export default nextConfig;
