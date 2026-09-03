import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/settings";
import { getActiveFaqItems } from "@/lib/data/faq";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "FAQ" };

export default async function ContatoPage() {
  const [settings, faqItems] = await Promise.all([
    getSiteSettings(),
    getActiveFaqItems(),
  ]);

  const whatsapp = buildWhatsAppLink(
    settings.whatsapp_number,
    "Oi! Vim pelo site da Bubri e ainda tenho uma dúvida."
  );

  const deliveryParagraphs = settings.delivery_text
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-10">
      <h1 className="font-display text-4xl md:text-5xl">FAQ</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-paper-raised rounded-2xl p-5 flex flex-col gap-1.5">
          <p className="font-display text-lg text-accent-ink">Atendimento</p>
          <p className="text-sm text-graphite">{settings.business_hours}</p>
        </div>
        <div className="bg-paper-raised rounded-2xl p-5 flex flex-col gap-1.5">
          <p className="font-display text-lg text-accent-ink">Entrega</p>
          {deliveryParagraphs.map((p, i) => (
            <p key={i} className="text-sm text-graphite">
              {p}
            </p>
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="font-display text-3xl md:text-4xl text-gold">Perguntas frequentes</h2>
        <FaqAccordion items={faqItems} />

        <div className="mt-2 bg-paper-raised rounded-2xl p-6 md:p-8 flex flex-col items-start gap-4">
          <p className="font-display text-xl md:text-2xl text-ink">Ainda tem dúvidas?</p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-white font-bold px-8 py-4 rounded-full shadow-lg text-base md:text-lg hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            Nos chame no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
