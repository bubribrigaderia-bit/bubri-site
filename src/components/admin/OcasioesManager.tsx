"use client";

import { useState } from "react";
import { OCCASIONS } from "@/types/database";
import type { CorporateClient, OccasionPhoto, ProductCategory } from "@/types/database";
import { OccasionGalleryManager } from "./OccasionGalleryManager";
import { CorporateClientsManager } from "./CorporateClientsManager";

export function OcasioesManager({
  photos,
  corporateClients,
}: {
  photos: OccasionPhoto[];
  corporateClients: CorporateClient[];
}) {
  const [active, setActive] = useState<ProductCategory>(OCCASIONS[0].value);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {OCCASIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setActive(o.value)}
            className={`text-sm px-3 py-1.5 border ${
              active === o.value ? "border-ink font-semibold" : "border-line-soft text-graphite"
            }`}
          >
            {o.menuLabel}
          </button>
        ))}
      </div>

      <OccasionGalleryManager
        key={active}
        slug={active}
        photos={photos.filter((p) => p.occasion_slug === active)}
      />

      {active === "corporativo" && (
        <div className="border-t border-line-soft pt-6">
          <CorporateClientsManager initialItems={corporateClients} />
        </div>
      )}
    </div>
  );
}
