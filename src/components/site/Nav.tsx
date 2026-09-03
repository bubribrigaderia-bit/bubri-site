"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/cardapio", label: "Cardápio" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Nav({ whatsappHref }: { whatsappHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-line-soft bg-paper/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-display text-xl italic tracking-wide">
          bubri
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm py-1 transition-colors ${
                pathname === link.href ? "text-ink font-semibold" : "text-graphite hover:text-ink"
              } after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-accent after:transition-all ${
                pathname === link.href ? "after:w-full" : "after:w-0 hover:after:w-full"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-block text-sm bg-accent text-paper px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          WhatsApp
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-sm border border-line-soft px-3 py-1.5 rounded-full"
          aria-expanded={open}
          aria-label="Abrir menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-6 pb-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`py-2 text-sm ${
                pathname === link.href ? "font-semibold" : "text-graphite"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm bg-accent text-paper px-4 py-2 rounded-full text-center font-medium"
          >
            WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
