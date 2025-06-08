/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'supabase.co',
      'github.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'figma.com',
      's3.amazonaws.com',
      'storage.googleapis.com'
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/:path*`,
      },
    ];
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle monaco-editor
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' },
    });

    // Handle canvas and fabric.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        jsdom: false,
        fs: false,
      };
    }

    // Handle fabric.js
    config.module.rules.push({
      test: /fabric\.js$/,
      use: 'exports-loader?fabric',
    });

    return config;
  },
  transpilePackages: [
    'fabric',
    'konva',
    'react-konva',
    'monaco-editor',
    '@monaco-editor/react'
  ],
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  poweredByHeader: false,
  reactStrictMode: true,
};

module.exports = nextConfig; 