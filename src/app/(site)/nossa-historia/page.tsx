import type { Metadata } from "next";
import { getPageContent } from "@/lib/data/content";
import { getSiteSettings } from "@/lib/data/settings";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Nossa História" };

export default async function NossaHistoriaPage() {
  const [content, settings] = await Promise.all([
    getPageContent("sobre"),
    getSiteSettings(),
  ]);

  const values = [1, 2, 3].map((n) => ({
    title: content[`valor_${n}_titulo`],
    description: content[`valor_${n}_descricao`],
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-12">
      <section className="grid gap-8 md:grid-cols-[1fr_1.1fr] items-center">
        <PhotoOrPlaceholder
          src={content.foto_url || null}
          alt="Foto da Bi ou do ateliê"
          className="h-64 w-full rounded-[2rem]"
        />
        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl md:text-5xl italic">Nossa História</h1>
          <p className="text-graphite leading-relaxed">{content.paragrafo_1}</p>
          <p className="text-graphite leading-relaxed">{content.paragrafo_2}</p>
          <p className="text-graphite leading-relaxed">{content.paragrafo_3}</p>
        </div>
      </section>

      <Reveal className="flex flex-col gap-6">
        <h2 className="font-display text-2xl md:text-3xl text-ink">Nossos valores</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="bg-paper-raised rounded-2xl p-5 flex flex-col gap-1.5">
              <p className="font-display text-lg">{value.title}</p>
              <p className="text-sm text-graphite">{value.description}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <a
        href={buildWhatsAppLink(settings.whatsapp_number, "Oi! Quero conversar sobre o meu evento.")}
        target="_blank"
        rel="noopener noreferrer"
        className="self-center bg-accent text-paper font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
      >
        {content.cta_final}
      </a>
    </div>
  );
}
