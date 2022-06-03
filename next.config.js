/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.infura.io"],
  },
  future: {
    webpack5: true,
  },
};

module.exports = nextConfig;
