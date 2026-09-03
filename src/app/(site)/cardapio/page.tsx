import type { Metadata } from "next";
import { getActiveProducts, groupProductsByCategory } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/settings";
import { CardapioTabs } from "@/components/site/CardapioTabs";

export const metadata: Metadata = { title: "Cardápio" };

export default async function CardapioPage() {
  const [products, settings] = await Promise.all([getActiveProducts(), getSiteSettings()]);
  const grouped = groupProductsByCategory(products);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl">Cardápio</h1>
        <p className="text-graphite max-w-prose">
          Cada linha da Bubri foi pensada para uma ocasião diferente. Escolha a categoria e fale
          com a gente para montar o kit ideal.
        </p>
      </div>

      <CardapioTabs groupedProducts={grouped} whatsappNumber={settings.whatsapp_number} />
    </div>
  );
}
