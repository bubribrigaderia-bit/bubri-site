import Link from "next/link";
import { getSiteSettings } from "@/lib/data/settings";
import { getPillars } from "@/lib/data/pillars";
import { getPageContent } from "@/lib/data/content";
import { PillarCard } from "@/components/site/PillarCard";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default async function HomePage() {
  const [settings, pillars, content] = await Promise.all([
    getSiteSettings(),
    getPillars(),
    getPageContent("home"),
  ]);

  const heroWhatsapp = buildWhatsAppLink(
    settings.whatsapp_number,
    "Oi! Vim pelo site e quero pedir a caixa degustação."
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col gap-12">
      <section className="grid gap-6 md:grid-cols-[1.1fr_1fr] items-center">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
            {content.hero_eyebrow}
          </span>
          <h1 className="text-3xl font-bold leading-tight text-balance">
            {content.hero_headline}
          </h1>
          <p className="text-graphite">{content.hero_subheadline}</p>
          <a
            href={heroWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start mt-1 border border-accent text-accent-ink font-semibold px-4 py-2 hover:bg-accent-soft transition-colors"
          >
            {content.hero_cta}
          </a>
        </div>
        <PhotoOrPlaceholder
          src={content.foto_hero_url || null}
          alt="Foto de destaque da Bubri"
          className="h-56 w-full"
        />
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Quatro jeitos de pedir Bubri
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </div>
      </section>

      <section className="border border-dashed border-line-soft p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Quem já experimentou
        </p>
        <p className="text-sm text-graphite">Veja o que dizem nossos clientes.</p>
        <a
          href={settings.google_reviews_url}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start border border-accent text-accent-ink font-semibold px-4 py-2 hover:bg-accent-soft transition-colors text-sm"
        >
          {content.reviews_cta}
        </a>
      </section>

      <section className="flex justify-center">
        <Link
          href="/cardapio"
          className="text-sm font-semibold text-accent-ink border-b border-accent hover:opacity-80"
        >
          Ver o cardápio completo →
        </Link>
      </section>
    </div>
  );
}
