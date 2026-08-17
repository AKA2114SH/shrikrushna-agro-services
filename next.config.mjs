/** @type {import('next').NextConfig} */

const isGithubPages =
  process.env.GITHUB_PAGES === 'true' ||
  process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,

  poweredByHeader: false,

  trailingSlash: isGithubPages,

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
};

export default nextConfig;
