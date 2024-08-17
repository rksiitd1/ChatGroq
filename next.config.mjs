/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
      unoptimized: true,
    },
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  };
  
  // Only add basePath and assetPrefix for production builds
  if (process.env.NODE_ENV === 'production') {
    nextConfig.basePath = '/ChatGroq';
    nextConfig.assetPrefix = '/ChatGroq/';
  }
  
  export default nextConfig;