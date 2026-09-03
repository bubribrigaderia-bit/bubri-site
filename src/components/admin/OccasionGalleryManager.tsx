"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { OccasionPhoto, ProductCategory } from "@/types/database";
import { upsertOccasionPhoto, deleteOccasionPhoto } from "@/app/admin/actions";
import { ImageUploadField } from "./ImageUploadField";
import { PhotoOrPlaceholder } from "@/components/site/PhotoOrPlaceholder";

export function OccasionGalleryManager({
  slug,
  photos,
}: {
  slug: ProductCategory;
  photos: OccasionPhoto[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addPhoto(url: string) {
    if (!url) return;
    setBusy(true);
    setError(null);
    const nextOrder = photos.length
      ? Math.max(...photos.map((p) => p.display_order)) + 1
      : 0;
    const result = await upsertOccasionPhoto({
      occasion_slug: slug,
      photo_url: url,
      display_order: nextOrder,
    });
    setBusy(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function move(photo: OccasionPhoto, dir: -1 | 1) {
    const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((p) => p.id === photo.id);
    const swapWith = sorted[idx + dir];
    if (!swapWith) return;
    setBusy(true);
    await Promise.all([
      upsertOccasionPhoto({
        id: photo.id,
        occasion_slug: slug,
        photo_url: photo.photo_url,
        caption: photo.caption,
        display_order: swapWith.display_order,
      }),
      upsertOccasionPhoto({
        id: swapWith.id,
        occasion_slug: slug,
        photo_url: swapWith.photo_url,
        caption: swapWith.caption,
        display_order: photo.display_order,
      }),
    ]);
    setBusy(false);
    router.refresh();
  }

  async function remove(id: string) {
    setBusy(true);
    await deleteOccasionPhoto(id);
    setBusy(false);
    router.refresh();
  }

  const sorted = [...photos].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold tracking-wider uppercase text-accent-ink">
          Galeria de fotos
        </p>
        <p className="text-xs text-graphite">
          Essas fotos aparecem na página dessa ocasião. Adicione quantas quiser.
        </p>
      </div>

      <div className="max-w-xs">
        <ImageUploadField
          label="Adicionar foto à galeria"
          value={null}
          onChange={addPhoto}
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {sorted.length === 0 ? (
        <p className="text-sm text-graphite">Nenhuma foto ainda.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {sorted.map((photo, i) => (
            <div key={photo.id} className="flex flex-col gap-1">
              <PhotoOrPlaceholder
                src={photo.photo_url}
                alt={photo.caption || "Foto da galeria"}
                className="aspect-square w-full rounded-lg"
              />
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={busy || i === 0}
                    onClick={() => move(photo, -1)}
                    className="px-1.5 border border-line-soft rounded disabled:opacity-30"
                    aria-label="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={busy || i === sorted.length - 1}
                    onClick={() => move(photo, 1)}
                    className="px-1.5 border border-line-soft rounded disabled:opacity-30"
                    aria-label="Mover para baixo"
                  >
                    ↓
                  </button>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => remove(photo.id)}
                  className="text-graphite hover:text-red-700 disabled:opacity-50"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
