import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/paginas", label: "Páginas" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-line-soft flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="font-bold">Painel Bubri</span>
          <nav className="flex gap-4">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-graphite hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <LogoutButton />
      </header>
      <main className="flex-1 px-6 py-8 max-w-4xl w-full mx-auto">{children}</main>
    </div>
  );
}
