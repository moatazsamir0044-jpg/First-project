const nextConfig = {
  // Type and lint errors fail the build — the codebase is kept clean so that
  // these guardrails stay enforced rather than suppressed.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000', 'birdnestlife.com'] },
  },
}

export default nextConfig
