import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { getCorporateClients } from "@/lib/data/occasions";
import {
  NATAL_DELIVERY_TEXT,
  NATAL_PAYMENT_TEXT,
  NATAL_PERSONALIZATION_DEADLINE,
  NATAL_PRODUCTION_TEXT,
  NATAL_REASONS,
  NATAL_STEPS,
  NATAL_YEAR,
} from "@/lib/data/natal";
import { NatalCatalog } from "@/components/site/NatalCatalog";
import { ClientLogosCarousel } from "@/components/site/ClientLogosCarousel";
import { Reveal } from "@/components/site/Reveal";
import { JsonLd } from "@/components/site/JsonLd";
import { buildWhatsAppLink, formatPhoneForDisplay } from "@/lib/whatsapp";
import { NATAL_DESCRIPTION, natalCatalogJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Kit de Natal Corporativo Personalizado em São Paulo ${NATAL_YEAR}`,
  description: NATAL_DESCRIPTION,
  alternates: { canonical: "/natal-corporativo" },
  openGraph: {
    title: `Natal Corporativo ${NATAL_YEAR} | Bubri Confeitaria`,
    description: NATAL_DESCRIPTION,
    images: ["/natal/capa.jpg"],
  },
};

const WAVE_PATH =
  "M0,64 C220,20 400,20 720,56 C1000,88 1200,92 1440,48 L1440,100 L0,100 Z";

export default async function NatalCorporativoPage() {
  const [settings, clients] = await Promise.all([getSiteSettings(), getCorporateClients()]);

  const whatsapp = buildWhatsAppLink(
    settings.whatsapp_number,
    `Oi! Vim pela página de Natal Corporativo ${NATAL_YEAR} e quero saber mais sobre os presentes para empresas.`
  );

  return (
    <div className="flex flex-col gap-16 pb-24">
      <JsonLd data={natalCatalogJsonLd()} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-wine text-white">
        <div className="mx-auto max-w-5xl px-6 pt-12 pb-20 md:pt-16 md:pb-28 grid gap-10 md:grid-cols-[1.15fr_1fr] items-center">
          <div className="flex flex-col gap-5">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#e2c892]">
              Bubri · Natal Corporativo {NATAL_YEAR}
            </span>
            <h1 className="font-display text-4xl md:text-5xl leading-[1.1] text-balance text-[#f3dfb4]">
              Cada detalhe com a sua marca. Cada presente com o nosso cuidado.
            </h1>
            <p className="text-white/90 max-w-prose">
              Kits e presentes de Natal corporativos personalizados com a logo da sua empresa, para
              equipes, clientes e parceiros. Chocotone, bombons e doces finos artesanais feitos em
              São Paulo com chocolate nobre Sicao, nota fiscal e entrega para todo o Brasil.
            </p>
            <div className="flex flex-wrap gap-3 mt-1">
              <a
                href="#colecao"
                className="bg-[#c9a86a] text-[#3c2815] font-bold px-7 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 hover:bg-[#d9ba7e] transition-all"
              >
                Ver a coleção e montar o pedido
              </a>
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#c9a86a] text-[#f3dfb4] font-bold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors"
              >
                Falar no WhatsApp
              </a>
            </div>
            <p className="inline-flex self-start items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-[#f3dfb4]">
              <span aria-hidden="true">✦</span>
              Prazo para pedidos personalizados: até {NATAL_PERSONALIZATION_DEADLINE}
            </p>
          </div>
          <img
            src="/natal/capa.jpg"
            alt="Kits de Natal da Bubri personalizados para empresas"
            fetchPriority="high"
            className="w-full max-w-sm md:max-w-none justify-self-center rounded-[2rem] shadow-2xl aspect-[5/6] object-cover border-4 border-[#c9a86a]/60"
          />
        </div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 w-full h-10 md:h-16 text-paper"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path fill="currentColor" d={WAVE_PATH} />
        </svg>
      </section>

      {/* Sobre */}
      <Reveal className="mx-auto max-w-5xl px-6 w-full">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] items-center">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-3xl md:text-4xl text-ink">
              Mais que um doce, uma experiência!
            </h2>
            <p className="text-graphite leading-relaxed">
              A Bubri Confeitaria é uma marca artesanal que transforma doces em experiências.
              Trabalhamos com chocolate nobre Sicao, do grupo Barry Callebaut, e ingredientes selecionados, tudo feito de
              forma artesanal e personalizado do doce à embalagem.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-gold bg-paper-raised p-5 text-center">
              <p className="font-display text-3xl text-accent-ink">+2 mil</p>
              <p className="text-sm text-graphite">kits entregues</p>
            </div>
            <div className="rounded-2xl border-2 border-gold bg-paper-raised p-5 text-center">
              <p className="font-display text-3xl text-accent-ink">+20</p>
              <p className="text-sm text-graphite">empresas presenteadas</p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Coleção + montador de pedido */}
      <NatalCatalog whatsappNumber={settings.whatsapp_number} />

      {/* Por que a Bubri */}
      <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-6">
        <h2 className="font-display text-3xl md:text-4xl text-ink">Por que escolher a Bubri</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NATAL_REASONS.map((reason) => (
            <div
              key={reason.title}
              className="bg-paper-raised rounded-2xl border-2 border-gold p-5 flex flex-col gap-1.5"
            >
              <p className="font-display text-lg text-ink">{reason.title}</p>
              <p className="text-sm text-graphite leading-relaxed">{reason.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Como pedir */}
      <Reveal className="mx-auto max-w-5xl px-6 w-full flex flex-col gap-6">
        <h2 className="font-display text-3xl md:text-4xl text-ink">Como pedir</h2>
        <ol className="grid gap-4 md:grid-cols-3">
          {NATAL_STEPS.map((step, i) => (
            <li key={i} className="bg-paper-raised rounded-2xl p-5 flex flex-col gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wine font-display text-lg text-[#f3dfb4]">
                {i + 1}
              </span>
              <p className="text-sm text-graphite leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line p-5 flex flex-col gap-3">
            <div>
              <p className="font-display text-lg text-ink">Prazos</p>
              <p className="text-sm text-graphite leading-relaxed">
                <strong className="text-ink">
                  Prazo para pedidos com personalização: até {NATAL_PERSONALIZATION_DEADLINE}.
                </strong>{" "}
                Produção: {NATAL_PRODUCTION_TEXT.charAt(0).toLowerCase() + NATAL_PRODUCTION_TEXT.slice(1)}
              </p>
            </div>
            <div>
              <p className="font-display text-lg text-ink">Pagamento</p>
              <p className="text-sm text-graphite">{NATAL_PAYMENT_TEXT}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-line p-5 flex flex-col gap-2">
            <p className="font-display text-lg text-ink">Entregas</p>
            {NATAL_DELIVERY_TEXT.map((t) => (
              <p key={t} className="text-sm text-graphite leading-relaxed">
                {t}
              </p>
            ))}
          </div>
        </div>
      </Reveal>

      {clients.length > 0 && (
        <Reveal className="mx-auto max-w-5xl px-6 w-full">
          <ClientLogosCarousel clients={clients} />
        </Reveal>
      )}

      {/* Contato */}
      <Reveal className="mx-auto max-w-5xl px-6 w-full">
        <div className="bg-paper-raised rounded-2xl p-6 md:p-8 flex flex-col gap-4 items-start">
          <h2 className="font-display text-2xl md:text-3xl text-ink">Prefere conversar antes?</h2>
          <p className="text-graphite">
            WhatsApp {formatPhoneForDisplay(settings.whatsapp_number)} · e-mail{" "}
            <a href="mailto:bianca@bubriconfeitaria.com" className="text-accent-ink font-semibold hover:underline">
              bianca@bubriconfeitaria.com
            </a>
          </p>
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
