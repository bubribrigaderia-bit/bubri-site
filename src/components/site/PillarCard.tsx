import type { Pillar } from "@/types/database";
import { PhotoOrPlaceholder } from "./PhotoOrPlaceholder";

export function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <div className="border border-line-soft flex flex-col gap-3 p-3">
      <PhotoOrPlaceholder src={pillar.photo_url} alt={pillar.title} className="h-28 w-full" />
      <p className="font-bold text-sm">{pillar.title}</p>
      <p className="text-xs text-graphite leading-relaxed">{pillar.description}</p>
    </div>
  );
}
