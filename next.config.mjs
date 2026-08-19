/** @type {import('next').NextConfig} */

const isGithubPages =
  process.env.GITHUB_PAGES === 'true' ||
  process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: isGithubPages ? true : false,
  output: isGithubPages ? 'export' : undefined,
  ...(isGithubPages && {
    basePath: '/shrikrushna-agro-services',
    assetPrefix: '/shrikrushna-agro-services/',
  }),
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  ...(!isGithubPages && {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
