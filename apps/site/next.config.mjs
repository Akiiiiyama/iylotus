/** @type {import('next').NextConfig} */

// Endereço oficial do site. Os endereços antigos da Vercel levam até ele, mantendo o caminho (/pt continua /pt).
const SITE = 'https://isabelayukari.com';
const OLD_HOSTS = ['isabela-yukari.vercel.app', 'isabelayukari.vercel.app'];

const nextConfig = {
  // Vídeo, poster e CV não mudam de nome quando são trocados, então o cache é de 1 dia (e não de 1 ano como os
  // arquivos do Next, que mudam de nome a cada versão). Quem volta ao site em menos de um dia carrega da memória;
  // depois disso, o navegador ainda usa a cópia que tem por até 7 dias enquanto confere se há versão nova.
  async headers() {
    const cache = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }];
    return [
      { source: '/work/:path*', headers: cache },
      { source: '/cv/:path*', headers: cache },
    ];
  },
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
