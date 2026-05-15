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

};

module.exports = nextConfig;
