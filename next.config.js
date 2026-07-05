/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/ai-tools",
        destination: "/tool",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/bajianli/:path*",
        destination: "http://122.51.220.35/api/bajianli/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
