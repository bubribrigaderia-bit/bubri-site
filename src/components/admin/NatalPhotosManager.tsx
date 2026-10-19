"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  NATAL_COVER_ID,
  NATAL_COVER_PHOTO,
  NATAL_GROUPS,
  NATAL_PRODUCTS,
} from "@/lib/data/natal";
import {
  addNatalGalleryPhoto,
  deleteNatalGalleryPhoto,
  reorderNatalGallery,
  setNatalPhoto,
} from "@/app/admin/actions";
import type { NatalGalleryItem } from "@/lib/data/natalPhotos";
import { ImageUploadField } from "./ImageUploadField";

const PRODUCT_ASPECTS = [
  { label: "Vertical", value: 4 / 5 },
  { label: "Quadrada", value: 1 },
];
const COVER_ASPECTS = [{ label: "Vertical", value: 5 / 6 }];

type Status = { saving?: boolean; error?: string; saved?: boolean };

/** Fotos extras do carrossel de um produto: adicionar, remover e mudar a ordem. */
function GalleryEditor({ productId, items }: { productId: string; items: NatalGalleryItem[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>({});

  async function run(action: () => Promise<{ success: boolean; error?: string }>) {
    setStatus({ saving: true });
    const result = await action();
    if (!result.success) {
      setStatus({ error: result.error ?? "Não foi possível salvar" });
      return;
    }
    setStatus({ saved: true });
    router.refresh();
  }

  function move(index: number, delta: number) {
    const ids = items.map((item) => item.id);
    const target = index + delta;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run(() => reorderNatalGallery(ids));
  }

  return (
    <div className="flex flex-col gap-2 border-t border-line-soft pt-2">
      <span className="text-sm font-medium">
        Fotos extras <span className="text-xs text-graphite font-normal">(o cliente passa para o lado)</span>
      </span>

      {items.length > 0 && (
        <ul className="grid grid-cols-3 gap-2">
          {items.map((item, i) => (
            <li key={item.id} className="flex flex-col gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.photo_url} alt={`Foto extra ${i + 1}`} className="aspect-[4/5] w-full object-cover" />
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0 || status.saving}
                  aria-label="Mover para a esquerda"
                  className="px-1 disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => run(() => deleteNatalGalleryPhoto(item.id))}
                  disabled={status.saving}
                  className="text-graphite underline disabled:opacity-50"
                >
                  Remover
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1 || status.saving}
                  aria-label="Mover para a direita"
                  className="px-1 disabled:opacity-30"
                >
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ImageUploadField
        key={items.length}
        label="Adicionar foto extra"
        value={null}
        onChange={(url) => url && run(() => addNatalGalleryPhoto({ product_id: productId, photo_url: url }))}
        aspectOptions={PRODUCT_ASPECTS}
      />
      {status.saving && <span className="text-xs text-graphite">Salvando...</span>}
      {status.error && <span className="text-xs text-red-700">{status.error}</span>}
      {status.saved && <span className="text-xs text-accent-ink">Salvo — já está no site</span>}
    </div>
  );
}

function PhotoSlot({
  id,
  label,
  original,
  current,
  aspectOptions,
  gallery,
}: {
  id: string;
  label: string;
  original: string;
  current: string | undefined;
  aspectOptions: { label: string; value: number }[];
  /** Só produtos têm fotos extras; a capa não. */
  gallery?: NatalGalleryItem[];
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
      {gallery && <GalleryEditor productId={id} items={gallery} />}
    </div>
  );
}

export function NatalPhotosManager({
  photos,
  gallery,
}: {
  photos: Record<string, string>;
  gallery: Record<string, NatalGalleryItem[]>;
}) {
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
                gallery={gallery[product.id] ?? []}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
