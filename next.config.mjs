/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
