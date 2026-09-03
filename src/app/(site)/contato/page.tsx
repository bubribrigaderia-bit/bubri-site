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
    <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-10">
      <h1 className="font-display text-4xl md:text-5xl">Contato</h1>

      <a
        href={buildWhatsAppLink(settings.whatsapp_number, "Oi! Vim pelo site da Bubri.")}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent text-paper font-bold text-center text-lg px-6 py-5 rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
      >
        Chamar no WhatsApp — {formatPhoneForDisplay(settings.whatsapp_number)}
      </a>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-paper-raised rounded-2xl p-4 flex flex-col gap-1">
          <p className="font-display text-base">Atendimento</p>
          <p className="text-sm text-graphite">{settings.business_hours}</p>
        </div>
        <div className="bg-paper-raised rounded-2xl p-4 flex flex-col gap-1">
          <p className="font-display text-base">Entrega</p>
          <p className="text-sm text-graphite">{settings.delivery_text}</p>
        </div>
        <div className="bg-paper-raised rounded-2xl p-4 flex flex-col gap-1">
          <p className="font-display text-base">Encomendas</p>
          <p className="text-sm text-graphite">{content.prazo_pequenos}</p>
          <p className="text-sm text-graphite">{content.prazo_grandes}</p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-2xl md:text-3xl text-ink">Perguntas frequentes</h2>
        <FaqAccordion items={faqItems} />
      </section>
    </div>
  );
}
