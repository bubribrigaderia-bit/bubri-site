import type { Metadata } from "next";
import { getPageContent } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Sobre" };

export default async function SobrePage() {
  const [content, settings] = await Promise.all([
    getPageContent("sobre"),
    getSiteSettings(),
  ]);

  const values = [1, 2, 3].map((n) => ({
    title: content[`valor_${n}_titulo`],
    description: content[`valor_${n}_descricao`],
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col gap-10">
      <section className="grid gap-6 md:grid-cols-[1fr_1.1fr] items-center">
        <PhotoOrPlaceholder
          src={content.foto_url || null}
          alt="Foto da Bi ou do ateliê"
          className="h-56 w-full"
        />
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">Sobre a Bubri</h1>
          <p className="text-sm text-graphite leading-relaxed">{content.paragrafo_1}</p>
          <p className="text-sm text-graphite leading-relaxed">{content.paragrafo_2}</p>
          <p className="text-sm text-graphite leading-relaxed">{content.paragrafo_3}</p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Nossos valores
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="border border-line-soft p-3 flex flex-col gap-1">
              <p className="font-bold text-sm">{value.title}</p>
              <p className="text-xs text-graphite">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <a
        href={buildWhatsAppLink(settings.whatsapp_number, "Oi! Quero conversar sobre o meu evento.")}
        target="_blank"
        rel="noopener noreferrer"
        className="self-center border border-accent text-accent-ink font-semibold px-4 py-2 hover:bg-accent-soft transition-colors text-sm"
      >
        {content.cta_final}
      </a>
    </div>
  );
}
