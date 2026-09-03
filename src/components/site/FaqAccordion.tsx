import type { FaqItem } from "@/types/database";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <details key={item.id} className="border-b border-line-soft py-4 group">
          <summary className="font-display text-lg cursor-pointer list-none flex items-center justify-between hover:text-accent-ink transition-colors">
            {item.question}
            <span className="text-accent-ink text-xl leading-none group-open:rotate-45 transition-transform">
              +
            </span>
          </summary>
          <p className="text-sm text-graphite mt-3 leading-relaxed">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
