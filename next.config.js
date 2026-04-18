// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "res.cloudinary.com",
//       },
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//       },
//     ],
//   },
// };


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // ⭐ ADD THIS PART (Jitsi proxy)
  async rewrites() {
    return [
      {
        source: "/jitsi/:path*",
        destination: "http://localhost:8000/:path*",
        // destination: `${process.env.JITSI_PROXY_URL}/:path*`
      },
    ];
  },
};

module.exports = nextConfig;
