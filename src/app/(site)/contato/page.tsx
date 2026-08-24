import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { getActiveFaqItems } from "@/lib/data/faq";
import { getPageContent } from "@/lib/data/content";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { buildWhatsAppLink, formatPhoneForDisplay } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Contato" };

export default async function ContatoPage() {
  const [settings, faqItems, content] = await Promise.all([
    getSiteSettings(),
    getActiveFaqItems(),
    getPageContent("contato"),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">Contato</h1>

      <a
        href={buildWhatsAppLink(settings.whatsapp_number, "Oi! Vim pelo site da Bubri.")}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-accent text-accent-ink font-bold text-center px-4 py-3 hover:bg-accent-soft transition-colors"
      >
        Chamar no WhatsApp — {formatPhoneForDisplay(settings.whatsapp_number)}
      </a>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-line-soft p-3 flex flex-col gap-1">
          <p className="font-bold text-sm">Atendimento</p>
          <p className="text-xs text-graphite">{settings.business_hours}</p>
        </div>
        <div className="border border-line-soft p-3 flex flex-col gap-1">
          <p className="font-bold text-sm">Entrega</p>
          <p className="text-xs text-graphite">{settings.delivery_text}</p>
        </div>
        <div className="border border-line-soft p-3 flex flex-col gap-1">
          <p className="font-bold text-sm">Encomendas</p>
          <p className="text-xs text-graphite">{content.prazo_pequenos}</p>
          <p className="text-xs text-graphite">{content.prazo_grandes}</p>
        </div>
      </div>

      <section className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Perguntas frequentes
        </p>
        <FaqAccordion items={faqItems} />
      </section>
    </div>
  );
}
