import Link from "next/link";
import { getSiteSettings } from "@/lib/data/settings";
import { getPillars } from "@/lib/data/pillars";
import { getPageContent } from "@/lib/data/content";
import { PillarCard } from "@/components/site/PillarCard";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";
import { OrganicBlob } from "@/components/site/OrganicBlob";
import { Reveal } from "@/components/site/Reveal";
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
    <div className="flex flex-col gap-20 pb-16">
      <section className="relative overflow-hidden">
        <OrganicBlob
          className="absolute inset-0 h-full w-full -z-10 text-accent-soft"
          color="var(--accent-soft)"
        />
        <div className="mx-auto max-w-5xl px-6 pt-14 pb-16 grid gap-8 md:grid-cols-[1.1fr_1fr] items-center">
          <div className="flex flex-col gap-4">
            <span
              className="animate-fade-up text-xs font-semibold tracking-[0.2em] uppercase text-accent-ink"
              style={{ animationDelay: "0ms" }}
            >
              {content.hero_eyebrow}
            </span>
            <h1
              className="animate-fade-up font-display text-4xl md:text-5xl leading-[1.1] text-balance"
              style={{ animationDelay: "80ms" }}
            >
              {content.hero_headline}
            </h1>
            <p
              className="animate-fade-up text-graphite max-w-prose"
              style={{ animationDelay: "160ms" }}
            >
              {content.hero_subheadline}
            </p>
            <a
              href={heroWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-fade-up self-start mt-2 bg-accent text-paper font-semibold px-6 py-3 rounded-full hover:opacity-90 hover:-translate-y-0.5 transition-all"
              style={{ animationDelay: "240ms" }}
            >
              {content.hero_cta}
            </a>
          </div>
          <div
            className="animate-fade-up rounded-[2rem] overflow-hidden"
            style={{ animationDelay: "160ms" }}
          >
            <PhotoOrPlaceholder
              src={content.foto_hero_url || null}
              alt="Foto de destaque da Bubri"
              className="h-64 md:h-80 w-full"
            />
          </div>
        </div>
      </section>

      <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-5">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-ink">
          Quatro jeitos de pedir Bubri
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.id} delayMs={index * 90}>
              <PillarCard pillar={pillar} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-5xl px-6 w-full">
        <div className="bg-paper-raised rounded-2xl p-6 md:p-8 flex flex-col gap-3 items-start">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-ink">
            Quem já experimentou
          </p>
          <p className="font-display text-xl italic text-ink">
            Veja o que dizem nossos clientes
          </p>
          <a
            href={settings.google_reviews_url}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-accent text-accent-ink font-semibold px-5 py-2.5 rounded-full hover:bg-accent hover:text-paper transition-colors text-sm"
          >
            {content.reviews_cta}
          </a>
        </div>
      </Reveal>

      <div className="flex justify-center">
        <Link
          href="/cardapio"
          className="text-sm font-semibold text-accent-ink border-b border-accent hover:opacity-80"
        >
          Ver o cardápio completo →
        </Link>
      </div>
    </div>
  );
}
