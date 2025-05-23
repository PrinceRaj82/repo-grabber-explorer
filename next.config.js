
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Use the existing output directory structure
  distDir: 'dist',
  // Configure Next.js to understand our imports with @/ prefix
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/src',
    };
    return config;
  },
  // Add typescript config path
  typescript: {
    tsconfigPath: 'tsconfig.next.json',
  },
};

module.exports = nextConfig;
