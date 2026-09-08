"use client";

import { useRef } from "react";
import type { CorporateClient } from "@/types/database";

/**
 * Faixa horizontal de logos de clientes. Arrasta/desliza para o lado (toque,
 * trackpad ou mouse) e tem setas ‹ › ao lado do título no desktop.
 */
export function ClientLogosCarousel({ clients }: { clients: CorporateClient[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startScroll: 0 });

  function scrollByStep(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 480), behavior: "smooth" });
  }

  // Arrastar com o mouse (no toque a rolagem já é nativa).
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startScroll: el.scrollLeft };
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX);
  }
  function endDrag() {
    drag.current.active = false;
  }

  const arrowClass =
    "h-9 w-9 flex items-center justify-center rounded-full border-2 border-ink text-ink text-lg leading-none hover:bg-ink hover:text-paper transition-colors";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl md:text-3xl text-ink">Alguns dos nossos clientes</h2>
        <div className="hidden sm:flex gap-2 shrink-0">
          <button type="button" onClick={() => scrollByStep(-1)} aria-label="Ver clientes anteriores" className={arrowClass}>
            ‹
          </button>
          <button type="button" onClick={() => scrollByStep(1)} aria-label="Ver mais clientes" className={arrowClass}>
            ›
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 select-none cursor-grab active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {clients.map((client) => (
          <div
            key={client.id}
            title={client.name}
            className="snap-start shrink-0 w-40 sm:w-48 h-28 bg-paper-raised rounded-2xl border border-line-soft flex items-center justify-center p-5"
          >
            {client.logo_url ? (
              <img
                src={client.logo_url}
                alt={client.name}
                loading="lazy"
                draggable={false}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="font-display text-sm text-graphite text-center">
                {client.name}
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="sm:hidden text-xs text-graphite">Arraste para o lado para ver todos →</p>
    </div>
  );
}
