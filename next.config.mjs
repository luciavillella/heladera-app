/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '6mb',
    },
  },
};

export default nextConfig;
