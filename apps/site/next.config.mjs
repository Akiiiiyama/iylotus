/** @type {import('next').NextConfig} */

// Endereço oficial do site. Os endereços antigos da Vercel levam até ele, mantendo o caminho (/pt continua /pt).
const SITE = 'https://isabelayukari.com';
const OLD_HOSTS = ['isabela-yukari.vercel.app', 'isabelayukari.vercel.app'];

const nextConfig = {
  async redirects() {
    return [
      ...OLD_HOSTS.map((host) => ({
        source: '/:path*',
        has: [{ type: 'host', value: host }],
        destination: `${SITE}/:path*`,
        permanent: true,
      })),
      // O site é bilíngue: /en (padrão) e /pt. A raiz manda para o inglês.
      { source: '/', destination: '/en', permanent: false },
    ];
  },
};

export default nextConfig;
