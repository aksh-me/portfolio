/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Self-hosted Sanity Studio: it's pre-built into /public/admin during the
  // build. Its assets are root-relative (/static, /vendor), so map those back
  // under /admin, and serve /admin (and client-side studio routes) from the
  // studio's index.html. Real files in /public/admin take precedence over the
  // catch-all, so assets are served directly.
  async rewrites() {
    return [
      { source: "/static/:path*", destination: "/admin/static/:path*" },
      { source: "/vendor/:path*", destination: "/admin/vendor/:path*" },
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/:path*", destination: "/admin/index.html" },
    ];
  },
};

export default nextConfig;
