/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://fakedetector-api-ve01.onrender.com/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
