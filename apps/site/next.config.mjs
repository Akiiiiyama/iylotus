/** @type {import('next').NextConfig} */
const nextConfig = {
  // O site é bilíngue: /en (padrão) e /pt. A raiz manda para o inglês.
  async redirects() {
    return [{ source: '/', destination: '/en', permanent: false }];
  },
};

export default nextConfig;
