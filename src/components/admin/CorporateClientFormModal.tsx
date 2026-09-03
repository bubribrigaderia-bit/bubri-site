"use client";

import { useState, type FormEvent } from "react";
import type { CorporateClient } from "@/types/database";
import { upsertCorporateClient } from "@/app/admin/actions";
import { ImageUploadField } from "./ImageUploadField";

export function CorporateClientFormModal({
  initialItem,
  onClose,
  onSaved,
}: {
  initialItem: CorporateClient | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initialItem?.name ?? "");
  const [logoUrl, setLogoUrl] = useState<string | null>(initialItem?.logo_url ?? null);
  const [displayOrder, setDisplayOrder] = useState(initialItem?.display_order ?? 0);
  const [active, setActive] = useState(initialItem?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const result = await upsertCorporateClient({
      id: initialItem?.id,
      name,
      logo_url: logoUrl ?? "",
      display_order: Number(displayOrder) || 0,
      active,
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
          {initialItem ? "Editar empresa" : "Nova empresa"}
        </h2>

        <label className="flex flex-col gap-1 text-sm">
          Nome da empresa
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-line-soft px-3 py-2 bg-paper-raised"
          />
        </label>

        <ImageUploadField
          label="Logo (de preferência PNG com fundo transparente)"
          value={logoUrl}
          onChange={(url) => setLogoUrl(url || null)}
          aspectOptions={[
            { label: "Quadrada", value: 1 },
            { label: "Horizontal", value: 16 / 9 },
          ]}
        />

        <label className="flex flex-col gap-1 text-sm">
          Ordem (menor aparece primeiro)
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            className="border border-line-soft px-3 py-2 bg-paper-raised w-24"
          />
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
