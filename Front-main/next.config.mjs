/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3003",
        pathname: "/images/**",
      },
    ],
    domains: [
      "www.pngplay.com",
      "encrypted-tbn0.gstatic.com",
      "images.pexels.com",
      "hips.hearstapps.com",
      "pngtree.com",
      "blog-media.but.fr",
      "cdn.mos.cms.futurecdn.net",
      "images.unsplash.com",
    ],
  },
};

export default nextConfig;
