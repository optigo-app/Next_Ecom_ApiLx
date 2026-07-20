/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '**' },
      { protocol: 'https', hostname: '**' },
    ],
  },

  async headers() {
    return [
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
        ],
      },
    ];
  },

  // webpack: (config) => {
  //   config.infrastructureLogging = { level: "error" }; // hides warnings
  //   return config;
  // },
  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
