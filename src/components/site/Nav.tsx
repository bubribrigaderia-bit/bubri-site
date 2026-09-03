"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { OCCASIONS } from "@/types/database";

const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/nossa-historia", label: "Nossa História" },
  { href: "/contato", label: "Contato" },
];

const OCCASION_LINKS = [
  ...OCCASIONS.map((o) => ({ href: `/${o.path}`, label: o.menuLabel })),
  { href: "/cardapio", label: "Ver catálogo completo" },
];

export function Nav({ whatsappHref }: { whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `relative text-sm py-1 transition-colors ${
      pathname === href ? "text-ink font-semibold" : "text-graphite hover:text-ink"
    } after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-accent after:transition-all ${
      pathname === href ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  const occasionsActive = OCCASIONS.some((o) => pathname === `/${o.path}`);

  return (
    <header className="border-b border-line-soft bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-5xl px-6">
        {/* Linha 1: logo centralizada */}
        <div className="relative flex items-center justify-center py-3 md:py-4">
          <Link href="/" aria-label="Bubri Confeitaria — página inicial" className="shrink-0">
            <img
              src="/logo-bubri.png"
              alt="Bubri Confeitaria"
              width={1000}
              height={509}
              className="h-11 md:h-14 w-auto dark:[filter:brightness(0)_invert(0.92)]"
            />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden absolute right-0 text-sm border border-line-soft px-3 py-1.5 rounded-full"
            aria-expanded={open}
            aria-label="Abrir menu"
          >
            Menu
          </button>
        </div>

        {/* Linha 2: navegação centralizada (desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-8 pb-3">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          <div className="relative group">
            <button
              type="button"
              className={`text-sm py-1 transition-colors ${
                occasionsActive ? "text-ink font-semibold" : "text-graphite group-hover:text-ink"
              }`}
            >
              Ocasiões ▾
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity">
              <div className="bg-paper border border-line-soft rounded-2xl shadow-lg py-2 min-w-[200px] flex flex-col">
                {OCCASION_LINKS.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-sm text-graphite hover:text-ink hover:bg-paper-raised transition-colors ${
                      i === OCCASION_LINKS.length - 1 ? "border-t border-line-soft mt-1 pt-2.5 font-medium" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/nossa-historia" className={linkClass("/nossa-historia")}>
            Nossa História
          </Link>
          <Link href="/contato" className={linkClass("/contato")}>
            Contato
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm bg-accent text-paper px-5 py-2 rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            WhatsApp
          </a>
        </nav>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-4 border-t border-line-soft pt-3">
          <Link href="/" onClick={() => setOpen(false)} className="py-2 text-sm text-graphite">
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
              className="py-2 pl-3 text-sm text-graphite"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/nossa-historia"
            onClick={() => setOpen(false)}
            className="py-2 mt-1 text-sm text-graphite"
          >
            Nossa História
          </Link>
          <Link
            href="/contato"
            onClick={() => setOpen(false)}
            className="py-2 text-sm text-graphite"
          >
            Contato
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm bg-accent text-paper px-4 py-2 rounded-full text-center font-semibold"
          >
            WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
