import type { CSSProperties } from "react";
import type { CorporateClient } from "@/types/database";

/**
 * Faixa de logos de clientes que rola sozinha para o lado (marquee).
 * Sem bloco de fundo — só as imagens. Pausa quando o mouse passa por cima;
 * com "reduzir movimento" ligado no sistema, vira uma faixa de rolagem manual.
 */
export function ClientLogosCarousel({ clients }: { clients: CorporateClient[] }) {
  if (clients.length === 0) return null;

  // Velocidade ~constante independente de quantos logos existem.
  const duration = Math.max(18, clients.length * 5);
  const loop = [...clients, ...clients];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl md:text-3xl text-ink">Alguns dos nossos clientes</h2>

      <div
        className="marquee-viewport relative overflow-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)",
        }}
      >
        <ul
          className="marquee-track flex w-max items-center"
          style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
        >
          {loop.map((client, i) => (
            <li
              key={`${client.id}-${i}`}
              aria-hidden={i >= clients.length}
              title={client.name}
              className="shrink-0 pr-12 sm:pr-16"
            >
              {client.logo_url ? (
                <img
                  src={client.logo_url}
                  alt={client.name}
                  loading="lazy"
                  draggable={false}
                  className="h-12 sm:h-16 w-auto object-contain"
                />
              ) : (
                <span className="font-display text-base text-graphite whitespace-nowrap">
                  {client.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
