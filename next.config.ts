import type { NextConfig } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const parsedUrl = supabaseUrl ? new URL(supabaseUrl) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol:
          (parsedUrl?.protocol.replace(':', '') as 'http' | 'https') || 'https',
        hostname: parsedUrl?.hostname || '*.supabase.co',
      },
    ],
  },
};

export default nextConfig;
