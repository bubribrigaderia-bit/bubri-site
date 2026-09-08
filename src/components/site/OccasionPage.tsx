import { getSiteSettings } from "@/lib/data/settings";
import { getPillars } from "@/lib/data/pillars";
import { getActiveProducts } from "@/lib/data/products";
import {
  getOccasionPhotos,
  getCorporateClients,
  getProductOccasionMeta,
} from "@/lib/data/occasions";
import type { Occasion, Product } from "@/types/database";
import { occasionNiches } from "@/types/database";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";

function ProductGrid({
  products,
  whatsappNumber,
}: {
  products: Product[];
  whatsappNumber: string;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
      ))}
    </div>
  );
}

export async function OccasionPage({ occasion }: { occasion: Occasion }) {
  const isCorporate = occasion.value === "corporativo";

  const [settings, pillars, products, gallery, clients, meta] = await Promise.all([
    getSiteSettings(),
    getPillars(),
    getActiveProducts(),
    getOccasionPhotos(occasion.value),
    isCorporate ? getCorporateClients() : Promise.resolve([]),
    getProductOccasionMeta(occasion.value),
  ]);

  const pillar = pillars.find((p) => p.slug === occasion.value);
  const title = pillar?.title ?? occasion.menuLabel;
  const description = pillar?.description ?? "";
  const intro = pillar?.intro ?? "";
  const heroPhoto = pillar?.photo_url ?? null;

  // Ordem por ocasião: quem tem `position` na tabela `product_occasion_meta`
  // manda; sem meta, cai no comportamento antigo (display_order global + nome).
  const metaByProduct = new Map(meta.map((m) => [m.product_id, m]));
  const positionOf = (p: Product) =>
    metaByProduct.get(p.id)?.position ?? Number.MAX_SAFE_INTEGER;

  const items = products
    .filter((p) => p.categories.includes(occasion.value))
    .sort(
      (a, b) =>
        positionOf(a) - positionOf(b) ||
        a.display_order - b.display_order ||
        a.name.localeCompare(b.name, "pt-BR")
    );

  // Nichos (sub-blocos com título) — hoje só "Casamentos & eventos".
  const niches = occasionNiches(occasion.value);
  const nicheValues = new Set(niches.map((n) => n.value));
  const nichedGroups = niches
    .map((niche) => ({
      niche,
      products: items.filter((p) => metaByProduct.get(p.id)?.event_niche === niche.value),
    }))
    .filter((g) => g.products.length > 0);
  const ungrouped = niches.length
    ? items.filter((p) => !nicheValues.has(metaByProduct.get(p.id)?.event_niche ?? ""))
    : items;

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
                heroPhoto ? "text-white/80" : "text-accent-ink"
              }`}
            >
              Bubri · {occasion.menuLabel}
            </span>
            <h1
              className={`font-display text-4xl md:text-5xl leading-[1.1] text-balance ${
                heroPhoto ? "text-white" : "text-ink"
              }`}
            >
              {title}
            </h1>
            {description && (
              <p className={`max-w-prose ${heroPhoto ? "text-white/90" : "text-graphite"}`}>
                {description}
              </p>
            )}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start mt-2 bg-accent text-white font-bold px-8 py-4 rounded-full shadow-lg text-base md:text-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
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

      {intro && (
        <Reveal className="mx-auto max-w-3xl px-6 w-full">
          <p className="text-lg leading-relaxed text-graphite text-balance">{intro}</p>
        </Reveal>
      )}

      {gallery.length > 0 && (
        <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-6">
          <h2 className="font-display text-2xl md:text-3xl text-ink">Um pouco do que a gente faz</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((photo, i) => (
              <Reveal key={photo.id} delayMs={i * 70}>
                <figure className="flex flex-col gap-1.5">
                  <img
                    src={photo.photo_url}
                    alt={photo.caption || title}
                    loading="lazy"
                    className="aspect-[4/5] w-full rounded-2xl object-cover"
                  />
                  {photo.caption && (
                    <figcaption className="text-xs text-graphite">{photo.caption}</figcaption>
                  )}
                </figure>
              </Reveal>
            ))}
          </div>
        </Reveal>
      )}

      {items.length > 0 && (
        <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-8">
          <h2 className="font-display text-2xl md:text-3xl text-ink">O que a Bubri oferece</h2>

          {nichedGroups.map(({ niche, products: group }) => (
            <div key={niche.value} className="flex flex-col gap-4">
              <h3 className="font-display text-xl md:text-2xl text-accent-ink">{niche.label}</h3>
              <ProductGrid products={group} whatsappNumber={settings.whatsapp_number} />
            </div>
          ))}

          {ungrouped.length > 0 && (
            <ProductGrid products={ungrouped} whatsappNumber={settings.whatsapp_number} />
          )}
        </Reveal>
      )}

      {isCorporate && clients.length > 0 && (
        <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-6">
          <h2 className="font-display text-2xl md:text-3xl text-ink">Alguns dos nossos clientes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-paper-raised rounded-2xl p-5 flex items-center justify-center aspect-[3/2]"
                title={client.name}
              >
                {client.logo_url ? (
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    loading="lazy"
                    className="max-h-16 max-w-full object-contain"
                  />
                ) : (
                  <span className="font-display text-sm text-graphite text-center">
                    {client.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {gallery.length === 0 && items.length === 0 && (
        <Reveal className="mx-auto max-w-5xl px-6 w-full">
          <div className="rounded-2xl border border-dashed border-line bg-paper-raised p-8 text-center text-sm text-graphite">
            Conteúdo dessa ocasião chega em breve. Fale com a gente no WhatsApp!
          </div>
        </Reveal>
      )}

      <Reveal className="mx-auto max-w-5xl px-6 w-full">
        <div className="bg-paper-raised rounded-2xl p-6 md:p-8 flex flex-col gap-4 items-start">
          <h2 className="font-display text-2xl md:text-3xl text-ink">Vamos montar o seu pedido?</h2>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-white font-bold px-8 py-4 rounded-full shadow-lg text-base md:text-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            Falar no WhatsApp
          </a>
        </div>
      </Reveal>
    </div>
  );
}
