"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  NATAL_COVER_ID,
  NATAL_COVER_PHOTO,
  NATAL_GROUPS,
  NATAL_PRODUCTS,
} from "@/lib/data/natal";
import { setNatalPhoto } from "@/app/admin/actions";
import { ImageUploadField } from "./ImageUploadField";

const PRODUCT_ASPECTS = [
  { label: "Vertical", value: 4 / 5 },
  { label: "Quadrada", value: 1 },
];
const COVER_ASPECTS = [{ label: "Vertical", value: 5 / 6 }];

type Status = { saving?: boolean; error?: string; saved?: boolean };

function PhotoSlot({
  id,
  label,
  original,
  current,
  aspectOptions,
}: {
  id: string;
  label: string;
  original: string;
  current: string | undefined;
  aspectOptions: { label: string; value: number }[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({});

  async function handleChange(url: string) {
    setStatus({ saving: true });
    const result = await setNatalPhoto({ product_id: id, photo_url: url });
    if (!result.success) {
      setStatus({ error: result.error });
      return;
    }
    setStatus({ saved: true });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1.5 border border-line-soft p-3">
      <ImageUploadField
        label={label}
        value={current ?? original}
        onChange={handleChange}
        aspectOptions={aspectOptions}
      />
      <span className="text-xs text-graphite">
        {current ? "Foto trocada no painel · “Remover” volta para a original" : "Foto original do catálogo"}
      </span>
      {status.saving && <span className="text-xs text-graphite">Salvando...</span>}
      {status.error && <span className="text-xs text-red-700">{status.error}</span>}
      {status.saved && <span className="text-xs text-accent-ink">Salvo — já está no site</span>}
    </div>
  );
}

export function NatalPhotosManager({ photos }: { photos: Record<string, string> }) {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Foto do topo</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <PhotoSlot
            id={NATAL_COVER_ID}
            label="Capa"
            original={NATAL_COVER_PHOTO}
            current={photos[NATAL_COVER_ID]}
            aspectOptions={COVER_ASPECTS}
          />
        </div>
      </section>

      {NATAL_GROUPS.map((group) => (
        <section key={group.value} className="flex flex-col gap-3">
          <h2 className="font-semibold">{group.title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NATAL_PRODUCTS.filter((p) => p.group === group.value).map((product) => (
              <PhotoSlot
                key={product.id}
                id={product.id}
                label={product.name}
                original={product.photo}
                current={photos[product.id]}
                aspectOptions={PRODUCT_ASPECTS}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
