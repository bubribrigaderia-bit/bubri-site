"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { OCCASIONS } from "@/types/database";

const OCCASION_LINKS = [
  ...OCCASIONS.map((o) => ({ href: `/${o.path}`, label: o.menuLabel })),
  { href: "/cardapio", label: "Ver catálogo completo" },
];

export function Nav({ whatsappHref }: { whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    `font-display text-lg px-5 py-2 rounded-full border-2 border-ink transition-colors ${
      active ? "bg-ink text-paper" : "text-ink hover:bg-ink hover:text-paper"
    }`;

  const occasionsActive = OCCASIONS.some((o) => pathname === `/${o.path}`);

  return (
    <header className="border-b border-line-soft bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-6">
        {/* Linha 1: logo (onda dourada + wordmark) centralizada */}
        <div className="relative flex items-center justify-center py-2 md:py-3">
          <Link href="/" aria-label="Bubri Confeitaria — página inicial" className="shrink-0">
            <img
              src="/logo-bubri.png"
              alt="Bubri Confeitaria"
              width={880}
              height={681}
              className="h-16 md:h-24 w-auto"
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden absolute right-0 text-base font-medium border border-line-soft px-4 py-2 rounded-full"
            aria-expanded={open}
            aria-label="Abrir menu"
          >
            Menu
          </button>
        </div>

        {/* Linha 2: navegação centralizada (desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-3 pb-4">
          <Link href="/" className={linkClass(pathname === "/")}>
            Home
          </Link>

          <div className="relative group">
            <button type="button" className={linkClass(occasionsActive)}>
              Ocasiões ▾
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity">
              <div className="bg-paper border-2 border-ink rounded-2xl shadow-lg py-2 min-w-[210px] flex flex-col">
                {OCCASION_LINKS.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2.5 font-display text-base text-ink hover:bg-accent-soft hover:text-accent-ink hover:font-bold transition-colors ${
                      i === OCCASION_LINKS.length - 1 ? "border-t-2 border-ink/25 mt-1 pt-3" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/nossa-historia" className={linkClass(pathname === "/nossa-historia")}>
            Nossa História
          </Link>
          <Link href="/contato" className={linkClass(pathname === "/contato")}>
            Contato
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-lg bg-gold text-ink px-6 py-2 rounded-full border-2 border-gold shadow-sm hover:opacity-90 transition-opacity"
          >
            WhatsApp
          </a>
        </nav>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-4 border-t-2 border-ink/20 pt-3">
          <Link href="/" onClick={() => setOpen(false)} className="py-2.5 font-display text-lg text-ink">
            Home
          </Link>
          <p className="pt-2 text-xs font-semibold uppercase tracking-wider text-accent-ink">
            Ocasiões
          </p>
          {OCCASION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 pl-3 font-display text-base text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/nossa-historia"
            onClick={() => setOpen(false)}
            className="py-2.5 mt-1 font-display text-lg text-ink"
          >
            Nossa História
          </Link>
          <Link
            href="/contato"
            onClick={() => setOpen(false)}
            className="py-2.5 font-display text-lg text-ink"
          >
            Contato
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 font-display text-lg bg-gold text-ink px-5 py-3 rounded-full text-center"
          >
            WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
