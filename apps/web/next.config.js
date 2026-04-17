/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: ['@surya/iv-engine', '@surya/scpi-client'],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma', 'pdfkit', 'exceljs'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // serialport is server-only; never bundle into the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        serialport: false,
        '@serialport/bindings-cpp': false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
