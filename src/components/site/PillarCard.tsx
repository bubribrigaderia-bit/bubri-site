import Link from "next/link";
import type { Pillar } from "@/types/database";
import { occasionByValue } from "@/types/database";
import { PhotoOrPlaceholder } from "./PhotoOrPlaceholder";

export function PillarCard({ pillar }: { pillar: Pillar }) {
  const occasion = occasionByValue(pillar.slug);
  const href = occasion ? `/${occasion.path}` : null;

  const inner = (
    <>
      <PhotoOrPlaceholder
        src={pillar.photo_url}
        alt={pillar.title}
        className="aspect-square w-full rounded-xl"
      />
      <p className="font-display text-lg transition-colors group-hover:text-accent-ink">
        {pillar.title}
      </p>
      <p className="text-sm text-graphite leading-relaxed">{pillar.description}</p>
      {href && (
        <span className="mt-1 text-sm font-bold text-accent-ink group-hover:underline">
          Ver {occasion?.menuLabel.toLowerCase()} →
        </span>
      )}
    </>
  );

  const cardClass =
    "group bg-paper-raised rounded-2xl flex flex-col gap-3 p-4 border-2 border-transparent transition-all hover:-translate-y-1 hover:shadow-lg hover:border-gold hover:bg-accent-soft";

  if (href) {
    return (
      <Link href={href} className={cardClass}>
        {inner}
      </Link>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}
