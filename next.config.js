/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://fakedetector-api.onrender.com/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
