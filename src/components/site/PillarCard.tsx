import type { Pillar } from "@/types/database";
import { PhotoOrPlaceholder } from "./PhotoOrPlaceholder";

export function PillarCard({ pillar }: { pillar: Pillar }) {
  return (
    <div className="group bg-paper-raised rounded-2xl flex flex-col gap-3 p-4 transition-transform hover:-translate-y-1 hover:shadow-md">
      <PhotoOrPlaceholder
        src={pillar.photo_url}
        alt={pillar.title}
        className="aspect-square w-full rounded-xl"
      />
      <p className="font-display text-lg">{pillar.title}</p>
      <p className="text-sm text-graphite leading-relaxed">{pillar.description}</p>
    </div>
  );
}
