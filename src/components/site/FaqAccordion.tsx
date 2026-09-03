import type { FaqItem } from "@/types/database";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <details
          key={item.id}
          className="group rounded-xl border-2 border-transparent px-4 py-3 transition-colors hover:border-gold hover:bg-accent-soft open:border-gold open:bg-accent-soft"
        >
          <summary className="font-display text-lg cursor-pointer list-none flex items-center justify-between gap-3 transition-colors group-hover:text-accent-ink">
            {item.question}
            <span className="shrink-0 text-accent-ink text-2xl leading-none group-open:rotate-45 transition-transform">
              +
            </span>
          </summary>
          <p className="text-sm text-graphite mt-3 leading-relaxed">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
