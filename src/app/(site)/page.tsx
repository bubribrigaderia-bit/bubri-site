import Link from "next/link";
import { getSiteSettings } from "@/lib/data/settings";
import { getPillars } from "@/lib/data/pillars";
import { getPageContent } from "@/lib/data/content";
import { getActiveTestimonials } from "@/lib/data/testimonials";
import { PillarCard } from "@/components/site/PillarCard";
import { OrganicBlob } from "@/components/site/OrganicBlob";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default async function HomePage() {
  const [settings, pillars, content, testimonials] = await Promise.all([
    getSiteSettings(),
    getPillars(),
    getPageContent("home"),
    getActiveTestimonials(),
  ]);

  const heroWhatsapp = buildWhatsAppLink(
    settings.whatsapp_number,
    "Oi! Vim pelo site e quero pedir a caixa degustação."
  );

  const heroPhoto = content.foto_hero_url || null;

  return (
    <div className="flex flex-col gap-20 pb-16">
      <section className="relative isolate overflow-hidden flex items-center min-h-[54vh] md:min-h-[62vh]">
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
          <>
            <div className="absolute inset-0 -z-20 bg-accent-soft" />
            <OrganicBlob
              className="absolute inset-0 -z-10 h-full w-full"
              color="var(--accent)"
            />
          </>
        )}

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 w-full h-8 md:h-12 text-paper -scale-y-100"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,64 C220,20 400,20 720,56 C1000,88 1200,92 1440,48 L1440,100 L0,100 Z"
          />
        </svg>

        <div className="mx-auto max-w-5xl w-full px-6 py-16 md:py-20">
          <div className="flex flex-col gap-4 max-w-xl">
            <span
              className={`animate-fade-up text-xs font-semibold tracking-[0.2em] uppercase ${
                heroPhoto ? "text-paper/80" : "text-accent-ink"
              }`}
              style={{ animationDelay: "0ms" }}
            >
              {content.hero_eyebrow}
            </span>
            <h1
              className={`animate-fade-up font-display text-5xl md:text-6xl leading-[1.05] text-balance ${
                heroPhoto ? "text-paper" : "text-ink"
              }`}
              style={{ animationDelay: "80ms" }}
            >
              {content.hero_headline}
            </h1>
            <p
              className={`animate-fade-up max-w-prose ${
                heroPhoto ? "text-paper/85" : "text-graphite"
              }`}
              style={{ animationDelay: "160ms" }}
            >
              {content.hero_subheadline}
            </p>
            <a
              href={heroWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-fade-up self-start mt-3 bg-accent text-paper font-bold text-lg md:text-xl px-10 py-5 rounded-full shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
              style={{ animationDelay: "240ms" }}
            >
              {content.hero_cta}
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

      <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-6">
        <h2 className="font-display text-3xl md:text-4xl text-ink text-balance">
          Escolha como quer viver a Bubri
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.id} delayMs={index * 90}>
              <PillarCard pillar={pillar} />
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal className="w-full flex flex-col gap-6">
        <h2 className="mx-auto max-w-5xl px-6 w-full font-display text-3xl md:text-4xl text-ink">
          Quem já experimentou
        </h2>

        {testimonials.length > 0 ? (
          <>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {testimonials.map((t) => (
                <figure
                  key={t.id}
                  className="snap-start shrink-0 w-[290px] md:w-[340px] bg-paper-raised rounded-2xl p-6 flex flex-col gap-3"
                >
                  <div
                    className="text-accent tracking-widest text-sm"
                    aria-label={`${t.rating} de 5 estrelas`}
                  >
                    {"★".repeat(t.rating)}
                    <span className="text-line-soft">{"★".repeat(5 - t.rating)}</span>
                  </div>
                  <blockquote className="text-sm text-ink leading-relaxed">
                    “{t.text}”
                  </blockquote>
                  <figcaption className="mt-auto text-xs font-semibold text-graphite">
                    — {t.author_name}
                  </figcaption>
                </figure>
              ))}
            </div>
            <div className="mx-auto max-w-5xl px-6 w-full">
              <a
                href={settings.google_reviews_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-accent text-accent-ink font-bold px-9 py-4 rounded-full hover:bg-accent hover:text-paper transition-colors text-lg"
              >
                Continuar vendo no Google
              </a>
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-5xl px-6 w-full">
            <div className="bg-paper-raised rounded-2xl p-6 md:p-8 flex flex-col gap-3 items-start">
              <p className="font-display text-2xl italic text-ink">
                Veja o que dizem nossos clientes
              </p>
              <a
                href={settings.google_reviews_url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-accent text-accent-ink font-bold px-9 py-4 rounded-full hover:bg-accent hover:text-paper transition-colors text-lg"
              >
                Continuar vendo no Google
              </a>
            </div>
          </div>
        )}
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
