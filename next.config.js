const instanceURL = new URL(process.env.NEXT_PUBLIC_SALEOR_INSTANCE_URI)

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['default', 'en', 'th'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  trailingSlash: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.saleor.cloud',
      },
    ],
    domains: [instanceURL.hostname],
  },
}

module.exports = nextConfig
