/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  async headers() {
    return [
      {
        // Aplica CORS para todas as rotas de API
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXTAUTH_URL || "https://patobranco.tec.br",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PATCH, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/cursos",
        destination: "/patotech",
        permanent: true,
      },
      {
        source: "/patotec",
        destination: "/patotech",
        permanent: true,
      },
      {
        source: "/cursos/:curso",
        destination: "/patotech/:curso",
        permanent: true,
      },
      {
        source: "/patotec/:curso",
        destination: "/patotech/:curso",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

