/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "uploadthing.com",
      },
      {
        protocol: 'https',
        hostname: "robohash.org",
      }
    ],
  },
  webpack: (config) => {
    if (!config.externals) {
      config.externals = [];
    } else {
      config.externals = [...config.externals, 'bcrypt', 'prisma-client-lib', 'prisma-client', 'prisma'];
    }
    return config;
  },
}

module.exports = nextConfig
