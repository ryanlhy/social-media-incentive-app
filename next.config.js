/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for Next.js 15
  experimental: {
    // Enable React Server Components
    serverComponentsExternalPackages: ['@solana/web3.js'],
  },

  // Environment variables that should be available to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'EngageReward Platform',
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },

  // Image optimization settings
  images: {
    domains: [
      'localhost',
      'engagereward.vercel.app',
      // Add your production domain here
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Webpack configuration for Solana and crypto libraries
  webpack: (config, { isServer }) => {
    // Handle node modules that need special treatment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      };

      // Add buffer polyfill for browser
      config.plugins.push(
        new (require('webpack')).ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }

    return config;
  },

  // TypeScript configuration
  typescript: {
    // Enable strict mode
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Run ESLint during builds
    ignoreDuringBuilds: false,
    dirs: ['src'],
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output configuration for static export if needed
  output: 'standalone',

  // Enable SWC minification
  swcMinify: true,

  // Power by header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Generate build ID
  generateBuildId: async () => {
    return `engagereward-${Date.now()}`;
  },
};

module.exports = nextConfig;
