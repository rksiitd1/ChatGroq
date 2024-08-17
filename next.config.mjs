/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/ChatGroq',
  assetPrefix: '/ChatGroq/',
};

export default nextConfig;