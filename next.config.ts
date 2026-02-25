import type { NextConfig } from 'next';

const isLocal = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: isLocal,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      ...(isLocal
        ? [
            { protocol: 'http' as const, hostname: '127.0.0.1' },
            { protocol: 'http' as const, hostname: 'localhost' },
          ]
        : []),
    ],
  },
};

export default nextConfig;
