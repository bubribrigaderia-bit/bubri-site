import type { FaqItem } from "@/types/database";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <details key={item.id} className="border-b border-line-soft py-3 group">
          <summary className="text-sm font-bold cursor-pointer list-none flex items-center justify-between">
            {item.question}
            <span className="text-graphite group-open:rotate-45 transition-transform">+</span>
          </summary>
          <p className="text-sm text-graphite mt-2 leading-relaxed">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
