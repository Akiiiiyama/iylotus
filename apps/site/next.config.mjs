/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // O endereço antigo leva ao novo, mantendo o caminho (ex.: /pt continua /pt).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'isabela-yukari.vercel.app' }],
        destination: 'https://isabelayukari.vercel.app/:path*',
        permanent: true,
      },
      // O site é bilíngue: /en (padrão) e /pt. A raiz manda para o inglês.
      { source: '/', destination: '/en', permanent: false },
    ];
  },
};

export default nextConfig;
