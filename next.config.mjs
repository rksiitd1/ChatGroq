/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/ChatGroq',
  assetPrefix: '/ChatGroq/',
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://idgkgphyyujwkspaktcn.supabase.co/functions/v1/:path*',
      },
    ];
  },
};

export default nextConfig;