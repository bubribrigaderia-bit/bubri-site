"use client";

import { useState, type FormEvent } from "react";
import type { Product, ProductCategory } from "@/types/database";
import { PRODUCT_CATEGORIES } from "@/types/database";
import { upsertProduct } from "@/app/admin/actions";
import { ImageUploadField } from "./ImageUploadField";

export function ProductFormModal({
  initialProduct,
  onClose,
  onSaved,
}: {
  initialProduct: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [description, setDescription] = useState(initialProduct?.description ?? "");
  const [priceLabel, setPriceLabel] = useState(initialProduct?.price_label ?? "");
  const [category, setCategory] = useState<ProductCategory>(
    initialProduct?.category ?? "presentes"
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialProduct?.photo_url ?? null);
  const [active, setActive] = useState(initialProduct?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await upsertProduct({
      id: initialProduct?.id,
      name,
      description,
      price_label: priceLabel,
      category,
      photo_url: photoUrl,
      active,
      display_order: initialProduct?.display_order ?? 0,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-paper w-full max-w-md p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="font-bold text-lg">
          {initialProduct ? "Editar produto" : "Novo produto"}
        </h2>

        <ImageUploadField label="Foto" value={photoUrl} onChange={setPhotoUrl} />

        <label className="flex flex-col gap-1 text-sm">
          Nome
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Descrição
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Preço
          <input
            value={priceLabel}
            onChange={(e) => setPriceLabel(e.target.value)}
            placeholder='Ex: "R$75" ou "sob consulta"'
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Categoria
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          >
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Ativo (visível no site)
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <div className="flex gap-3 justify-end mt-2">
          <button type="button" onClick={onClose} className="text-sm text-graphite px-3 py-2">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="border border-accent text-accent-ink font-semibold px-4 py-2 text-sm hover:bg-accent-soft transition-colors disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
