import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // O upload de fotos do painel /admin passa por um Server Action.
    // O limite padrão do Next é 1MB; fotos de celular passam disso,
    // então subimos para acompanhar o limite de 5MB validado no código.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
