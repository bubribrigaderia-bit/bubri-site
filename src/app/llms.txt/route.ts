import { OCCASIONS } from "@/types/database";
import { getActiveProducts } from "@/lib/data/products";
import { getActiveFaqItems } from "@/lib/data/faq";
import { getSiteSettings } from "@/lib/data/settings";
import { formatPhoneForDisplay } from "@/lib/whatsapp";
import { NATAL_DESCRIPTION, OCCASION_DESCRIPTIONS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import {
  NATAL_PERSONALIZATION_DEADLINE,
  NATAL_PRODUCTS,
  NATAL_SPECIAL_CONDITION_QTY,
  NATAL_YEAR,
  formatBRL,
} from "@/lib/data/natal";

// Resumo em texto puro da Bubri para assistentes de IA (padrão llms.txt).
// Gerado do banco, então acompanha o que a Bi edita no /admin.
export async function GET() {
  const [settings, products, faq] = await Promise.all([
    getSiteSettings(),
    getActiveProducts(),
    getActiveFaqItems(),
  ]);

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `- Site: ${SITE_URL}`,
    `- WhatsApp: ${formatPhoneForDisplay(settings.whatsapp_number)}`,
    `- Instagram: @${settings.instagram_handle.replace(/^@/, "")}`,
    `- Atendimento: ${settings.business_hours}`,
    `- Entrega: ${settings.delivery_text.replace(/\s*\n\s*/g, " ")}`,
    "",
    "## Ocasiões",
    "",
    ...OCCASIONS.map(
      (o) => `- [${o.menuLabel}](${SITE_URL}/${o.path}): ${OCCASION_DESCRIPTIONS[o.path] ?? ""}`
    ),
  ];

  for (const o of OCCASIONS) {
    const items = products.filter((p) => p.categories.includes(o.value));
    if (items.length === 0) continue;
    lines.push("", `## Produtos — ${o.menuLabel}`, "");
    for (const p of items) {
      const desc = p.description.replace(/\s+/g, " ").trim();
      lines.push(`- **${p.name}** (${p.price_label}): ${desc}`);
    }
  }

  lines.push(
    "",
    `## Natal Corporativo ${NATAL_YEAR}`,
    "",
    `> ${NATAL_DESCRIPTION}`,
    "",
    `- Página: ${SITE_URL}/natal-corporativo`,
    `- Prazo para pedidos personalizados: até ${NATAL_PERSONALIZATION_DEADLINE}/${NATAL_YEAR}`,
    `- Condição especial a partir de ${NATAL_SPECIAL_CONDITION_QTY} unidades`,
    ""
  );
  for (const p of NATAL_PRODUCTS) {
    const prices = p.variants.map((v) => `${v.label}: ${formatBRL(v.price)}`).join("; ");
    lines.push(`- **${p.name}** (${prices}): ${p.description}`);
  }

  if (faq.length > 0) {
    lines.push("", "## Perguntas frequentes", "");
    for (const item of faq) {
      lines.push(`### ${item.question}`, "", item.answer.trim(), "");
    }
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
