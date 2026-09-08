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
    <div className="bg-paper-raised rounded-2xl flex h-full flex-col gap-3 p-5 transition-transform hover:-translate-y-1 hover:shadow-md">
      <PhotoOrPlaceholder
        src={product.photo_url}
        alt={product.name}
        className="aspect-square w-full rounded-xl"
      />
      <p className="font-display text-lg mt-1">{product.name}</p>
      {product.description && (
        <div className="flex flex-col gap-2 text-sm text-graphite leading-relaxed">
          {product.description
            .split(/\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((para, i) => (
              <p key={i}>{para}</p>
            ))}
        </div>
      )}
      <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-xs">
        <span className="text-graphite">{product.price_label}</span>
        <a
          href={buildWhatsAppLink(whatsappNumber, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-accent-ink font-semibold hover:underline"
        >
          WhatsApp →
        </a>
      </div>
    </div>
  );
}
