import type { Product } from "@/types/database";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PhotoOrPlaceholder } from "./PhotoOrPlaceholder";

export function ProductCard({
  product,
  whatsappNumber,
}: {
  product: Product;
  whatsappNumber: string;
}) {
  const message = `Oi! Vim pelo site e tenho interesse no "${product.name}".`;

  return (
    <div className="bg-paper-raised rounded-2xl flex flex-col gap-2 p-4 transition-transform hover:-translate-y-1 hover:shadow-md">
      <PhotoOrPlaceholder
        src={product.photo_url}
        alt={product.name}
        className="aspect-square w-full rounded-xl"
      />
      <p className="font-display text-base mt-1">{product.name}</p>
      <p className="text-xs text-graphite leading-relaxed">{product.description}</p>
      <div className="flex items-center justify-between text-xs mt-1">
        <span className="text-graphite">{product.price_label}</span>
        <a
          href={buildWhatsAppLink(whatsappNumber, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-ink font-semibold hover:underline"
        >
          WhatsApp →
        </a>
      </div>
    </div>
  );
}
