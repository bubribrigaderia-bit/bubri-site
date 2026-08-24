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
    <header className="border-b border-line-soft bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="font-bold tracking-wide text-lg">
          BUBRI
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm pb-1 border-b-2 ${
                pathname === link.href
                  ? "border-ink font-semibold"
                  : "border-transparent text-graphite hover:text-ink"
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
          className="hidden md:inline-block text-sm border border-accent text-accent-ink px-3 py-1.5 hover:bg-accent-soft transition-colors"
        >
          WhatsApp
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-sm border border-line-soft px-3 py-1.5"
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
            className="mt-2 text-sm border border-accent text-accent-ink px-3 py-2 text-center"
          >
            WhatsApp
          </a>
        </nav>
      )}
    </header>
  );
}
