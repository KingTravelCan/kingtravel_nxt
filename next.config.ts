import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: 'https://kingtravelcan.com/media/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "cf.bstatic.com",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "kingtravelcan.com",
      },
      {
        protocol: "https",
        hostname: "media.kingtravelcan.com",
      },
      {
        protocol: "https",
        hostname: "dks.com.pk",
      },
      {
        protocol: "https",
        hostname: "antiquewhite-stinkbug-399384.hostingersite.com",
      },
      {
        protocol: "https",
        hostname: "img.magnific.com",
      },
      {
        protocol: "https",
        hostname: "staging.kingtravelcan.com",
      },
    ],
  },
};

export default nextConfig;
