import { getSiteSettings } from "@/lib/data/settings";
import { getPillars } from "@/lib/data/pillars";
import { getActiveProducts } from "@/lib/data/products";
import type { Occasion } from "@/types/database";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export async function OccasionPage({ occasion }: { occasion: Occasion }) {
  const [settings, pillars, products] = await Promise.all([
    getSiteSettings(),
    getPillars(),
    getActiveProducts(),
  ]);

  const pillar = pillars.find((p) => p.slug === occasion.value);
  const title = pillar?.title ?? occasion.menuLabel;
  const description = pillar?.description ?? "";
  const heroPhoto = pillar?.photo_url ?? null;

  const items = products.filter((p) => p.categories.includes(occasion.value));

  const whatsapp = buildWhatsAppLink(
    settings.whatsapp_number,
    `Oi! Vim pelo site e quero saber mais sobre ${occasion.menuLabel.toLowerCase()}.`
  );

  return (
    <div className="flex flex-col gap-16 pb-16">
      <section className="relative isolate overflow-hidden flex items-center min-h-[46vh] md:min-h-[54vh]">
        {heroPhoto ? (
          <>
            <img
              src={heroPhoto}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/55 to-black/20 md:to-transparent"
            />
          </>
        ) : (
          <div className="absolute inset-0 -z-20 bg-accent-soft" />
        )}

        <div className="mx-auto max-w-5xl w-full px-6 py-16">
          <div className="flex flex-col gap-4 max-w-xl">
            <span
              className={`text-xs font-semibold tracking-[0.2em] uppercase ${
                heroPhoto ? "text-paper/80" : "text-accent-ink"
              }`}
            >
              Bubri · {occasion.menuLabel}
            </span>
            <h1
              className={`font-display text-4xl md:text-5xl leading-[1.1] text-balance ${
                heroPhoto ? "text-paper" : "text-ink"
              }`}
            >
              {title}
            </h1>
            {description && (
              <p className={`max-w-prose ${heroPhoto ? "text-paper/85" : "text-graphite"}`}>
                {description}
              </p>
            )}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start mt-2 bg-accent text-paper font-semibold px-8 py-4 rounded-full shadow-lg text-base hover:opacity-90 hover:-translate-y-0.5 transition-all"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-full h-10 md:h-16 text-paper"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64 C220,20 400,20 720,56 C1000,88 1200,92 1440,48 L1440,100 L0,100 Z"
          />
        </svg>
      </section>

      {items.length > 0 && (
        <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-6">
          <h2 className="font-display text-2xl md:text-3xl text-ink">O que a Bubri oferece</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                whatsappNumber={settings.whatsapp_number}
              />
            ))}
          </div>
        </Reveal>
      )}

      {/* Galeria de fotos da ocasião — entra no próximo passo */}
      <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-6">
        <h2 className="font-display text-2xl md:text-3xl text-ink">Um pouco do que a gente faz</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl border border-dashed border-line bg-paper-raised flex items-center justify-center text-xs text-graphite"
            >
              fotos em breve
            </div>
          ))}
        </div>
      </Reveal>

      {occasion.value === "corporativo" && (
        <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-6">
          <h2 className="font-display text-2xl md:text-3xl text-ink">Empresas que já fecharam com a Bubri</h2>
          <p className="text-sm text-graphite">Em breve os logos por aqui.</p>
        </Reveal>
      )}

      <Reveal className="mx-auto max-w-5xl px-6 w-full">
        <div className="bg-paper-raised rounded-2xl p-6 md:p-8 flex flex-col gap-4 items-start">
          <h2 className="font-display text-2xl md:text-3xl text-ink">Vamos montar o seu pedido?</h2>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-paper font-semibold px-8 py-4 rounded-full shadow-lg text-base hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            Falar no WhatsApp
          </a>
        </div>
      </Reveal>
    </div>
  );
}
