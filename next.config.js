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
        source: '/:all*(jpg|jpeg|png|gif|webp|svg)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
      {
        source: '/:all*(mp4|webm|ogg)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
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
